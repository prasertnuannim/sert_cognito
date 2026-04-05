import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../../domain/entities/forgot-password.entity";

export class ForgotPasswordUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(input: ForgotPasswordInput) {
    return this.repo.forgotPassword(input);
  }
}

export class ResetPasswordUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(input: ResetPasswordInput) {
    return this.repo.resetPassword(input);
  }
}