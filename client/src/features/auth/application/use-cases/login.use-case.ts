import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { LoginInput } from "../../domain/entities/login.entity";

export class LoginUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(input: LoginInput) {
    return this.repo.login(input);
  }
}