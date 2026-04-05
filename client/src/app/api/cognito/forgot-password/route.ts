import { NextResponse } from "next/server";
import { CognitoAuthRepository } from "@/features/auth/infrastructure/repositories/cognito-auth.repository";
import { ForgotPasswordUseCase } from "@/features/auth/application/use-cases/forgot-password.use-case";
import { forgotPasswordSchema } from "@/features/auth/domain/schemas/forgot-password.schema";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errorCode: "VALIDATION_ERROR", message: "Invalid request body" },
      { status: 400 }
    );
  }

  const repo = new CognitoAuthRepository();
  const useCase = new ForgotPasswordUseCase(repo);
  const result = await useCase.execute(parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      { errorCode: result.code, message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json(result);
}