import type { AuthRepository } from "../../domain/repositories/auth.repository";

export class GetUserAccessProfileUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string) {
    return this.authRepository.getUserAccessProfile(email);
  }
}

export class UpdateUserRolesUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, roles: string[]) {
    return this.authRepository.updateUserRoles(email, roles);
  }
}
