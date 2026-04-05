import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/features/auth/domain/schemas/login.schema";
import { normalizeRoles } from "@/features/auth/domain/auth-access-control";
import { CognitoAuthRepository } from "@/features/auth/infrastructure/repositories/cognito-auth.repository";
import { LoginUseCase } from "@/features/auth/application/use-cases/login.use-case";

type JwtPayload = Record<string, unknown>;

function decodeJwtPayload(token: string | undefined): JwtPayload | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "="
    );

    return JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf8")) as JwtPayload;
  } catch {
    return null;
  }
}

function readRolesFromClaim(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

function extractRolesFromTokens(idToken?: string, accessToken?: string): string[] {
  const payloads = [decodeJwtPayload(idToken), decodeJwtPayload(accessToken)];

  const discoveredRoles = payloads.flatMap((payload) => {
    if (!payload) {
      return [];
    }

    return [
      ...readRolesFromClaim(payload["cognito:groups"]),
      ...readRolesFromClaim(payload.roles),
      ...readRolesFromClaim(payload.role),
      ...readRolesFromClaim(payload["custom:role"]),
    ];
  });

  return normalizeRoles(discoveredRoles);
}

export const authOptions = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const repo = new CognitoAuthRepository();
        const useCase = new LoginUseCase(repo);
        const result = await useCase.execute(parsed.data);

        if (!result.ok) {
          if (result.code === "INVALID_CREDENTIALS") return null;
          throw new Error(result.code);
        }

        const roles = extractRolesFromTokens(
          result.tokens.idToken,
          result.tokens.accessToken
        );

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          roles,
          accessToken: result.tokens.accessToken,
          idToken: result.tokens.idToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: result.tokens.expiresIn,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.idToken = user.idToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        id: token.userId as string,
        email: token.email as string,
        name: token.name as string,
        roles: token.roles,
      };

      session.accessToken = token.accessToken as string | undefined;
      session.idToken = token.idToken as string | undefined;
      session.expiresIn = token.expiresIn as number | undefined;

      return session;
    },
  },
} satisfies NextAuthOptions & { trustHost?: boolean };

export function auth() {
  return getServerSession(authOptions);
}
