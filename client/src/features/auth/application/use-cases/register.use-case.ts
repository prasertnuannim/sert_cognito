import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { RegisterInput } from "../../domain/entities/register.entity";

export class RegisterUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(input: RegisterInput) {
    return this.repo.register(input);
  }
}