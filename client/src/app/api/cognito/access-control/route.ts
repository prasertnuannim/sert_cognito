import { NextResponse } from "next/server";
import {
  GetUserAccessProfileUseCase,
  UpdateUserRolesUseCase,
} from "@/features/auth/application/use-cases/access-control.use-case";
import { canAccessPath, normalizeRoles } from "@/features/auth/domain/auth-access-control";
import {
  accessControlEmailSchema,
  updateAccessControlRolesSchema,
} from "@/features/auth/domain/schemas/access-control.schema";
import { CognitoAuthRepository } from "@/features/auth/infrastructure/repositories/cognito-auth.repository";
import { getManagedRoleGroups } from "@/features/auth/infrastructure/cognito-role-groups";
import { auth } from "@/lib/auth";

async function ensureAdminAccess() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { errorCode: "UNAUTHORIZED", message: "Authentication required" },
      { status: 401 }
    );
  }

  const roles = normalizeRoles(session.user.roles);
  if (!canAccessPath("/settings/access-control", roles)) {
    return NextResponse.json(
      { errorCode: "FORBIDDEN", message: "Admin role required" },
      { status: 403 }
    );
  }

  return null;
}

export async function GET(request: Request) {
  const authError = await ensureAdminAccess();
  if (authError) {
    return authError;
  }

  const { searchParams } = new URL(request.url);
  const parsed = accessControlEmailSchema.safeParse({
    email: searchParams.get("email"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { errorCode: "VALIDATION_ERROR", message: "Invalid email" },
      { status: 400 }
    );
  }

  const repo = new CognitoAuthRepository();
  const useCase = new GetUserAccessProfileUseCase(repo);
  const result = await useCase.execute(parsed.data.email);

  if (!result.ok) {
    return NextResponse.json(
      { errorCode: result.code, message: result.message },
      { status: result.code === "USER_NOT_FOUND" ? 404 : 400 }
    );
  }

  return NextResponse.json({
    availableRoles: getManagedRoleGroups(),
    user: result.user,
  });
}

export async function POST(request: Request) {
  const authError = await ensureAdminAccess();
  if (authError) {
    return authError;
  }

  const body = await request.json();
  const parsed = updateAccessControlRolesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errorCode: "VALIDATION_ERROR", message: "Invalid request body" },
      { status: 400 }
    );
  }

  const repo = new CognitoAuthRepository();
  const useCase = new UpdateUserRolesUseCase(repo);
  const result = await useCase.execute(parsed.data.email, parsed.data.roles);

  if (!result.ok) {
    return NextResponse.json(
      { errorCode: result.code, message: result.message },
      { status: result.code === "USER_NOT_FOUND" ? 404 : 400 }
    );
  }

  return NextResponse.json({
    availableRoles: getManagedRoleGroups(),
    message: result.message,
    user: result.user,
  });
}
