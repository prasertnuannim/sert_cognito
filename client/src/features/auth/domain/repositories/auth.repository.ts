import type { LoginInput, LoginResult } from "../entities/login.entity";
import type {
  GetAccessControlUserResult,
  UpdateAccessControlRolesResult,
} from "../entities/access-control.entity";
import type { RegisterInput, RegisterResult } from "../entities/register.entity";
import type {
  ConfirmAccountInput,
  ConfirmAccountResult,
} from "../entities/confirm-account.entity";
import type {
  ForgotPasswordInput,
  ForgotPasswordResult,
  ResetPasswordInput,
  ResetPasswordResult,
} from "../entities/forgot-password.entity";

export interface AuthRepository {
  login(input: LoginInput): Promise<LoginResult>;
  getUserAccessProfile(email: string): Promise<GetAccessControlUserResult>;
  updateUserRoles(
    email: string,
    roles: string[]
  ): Promise<UpdateAccessControlRolesResult>;
  register(input: RegisterInput): Promise<RegisterResult>;
  confirmAccount(input: ConfirmAccountInput): Promise<ConfirmAccountResult>;
  forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResult>;
  resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResult>;
}
