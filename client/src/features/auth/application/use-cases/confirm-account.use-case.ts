import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { ConfirmAccountInput } from "../../domain/entities/confirm-account.entity";

export class ConfirmAccountUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(input: ConfirmAccountInput) {
    return this.repo.confirmAccount(input);
  }
}