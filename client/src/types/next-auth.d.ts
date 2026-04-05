import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      roles?: string[];
    };
    accessToken?: string;
    idToken?: string;
    expiresIn?: number;
  }

  interface User {
    id: string;
    roles?: string[];
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    roles?: string[];
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}
