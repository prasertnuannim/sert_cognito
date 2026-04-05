import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type {
  GetAccessControlUserResult,
  UpdateAccessControlRolesResult,
} from "../../domain/entities/access-control.entity";
import type { LoginInput, LoginResult } from "../../domain/entities/login.entity";
import type {
  RegisterInput,
  RegisterResult,
} from "../../domain/entities/register.entity";
import type {
  ConfirmAccountInput,
  ConfirmAccountResult,
} from "../../domain/entities/confirm-account.entity";
import type {
  ForgotPasswordInput,
  ForgotPasswordResult,
  ResetPasswordInput,
  ResetPasswordResult,
} from "../../domain/entities/forgot-password.entity";
import {
  cognitoGetUserAccessProfile,
  cognitoLogin,
  cognitoRegister,
  cognitoConfirmAccount,
  cognitoForgotPassword,
  cognitoResetPassword,
  cognitoUpdateUserRoles,
} from "../services/cognito.service";

export class CognitoAuthRepository implements AuthRepository {
  async login(input: LoginInput): Promise<LoginResult> {
    try {
      const result = await cognitoLogin(input.email, input.password);

      if ("user" in result) {
        return { ok: true, user: result.user, tokens: result.tokens };
      }

      if (result.challengeName) {
        if (result.challengeName === "NEW_PASSWORD_REQUIRED") {
          return {
            ok: false,
            code: "NEW_PASSWORD_REQUIRED",
            message: "New password required",
            session: result.session,
          };
        }

        if (
          result.challengeName === "SMS_MFA" ||
          result.challengeName === "SOFTWARE_TOKEN_MFA"
        ) {
          return {
            ok: false,
            code: "MFA_REQUIRED",
            message: "MFA required",
            session: result.session,
          };
        }
      }

      return {
        ok: false,
        code: "AUTHENTICATION_FAILED",
        message: result.message,
      };
    } catch (error) {
      if (!(error instanceof Error)) {
        return { ok: false, code: "UNKNOWN_ERROR", message: "Authentication failed" };
      }

      if (error.name === "UserNotFoundException") {
        return { ok: false, code: "INVALID_CREDENTIALS", message: "Invalid credentials" };
      }

      if (error.name === "NotAuthorizedException") {
        return { ok: false, code: "INVALID_CREDENTIALS", message: "Invalid credentials" };
      }

      if (error.name === "UserNotConfirmedException") {
        return { ok: false, code: "USER_NOT_CONFIRMED", message: "User not confirmed" };
      }

      return { ok: false, code: error.name, message: error.message };
    }
  }

  async getUserAccessProfile(email: string): Promise<GetAccessControlUserResult> {
    try {
      const user = await cognitoGetUserAccessProfile(email);
      return { ok: true, user };
    } catch (error) {
      if (!(error instanceof Error)) {
        return {
          ok: false,
          code: "UNKNOWN_ERROR",
          message: "Failed to load user access profile",
        };
      }

      if (error.name === "UserNotFoundException") {
        return {
          ok: false,
          code: "USER_NOT_FOUND",
          message: "User not found in this Cognito user pool",
        };
      }

      return {
        ok: false,
        code: error.name,
        message: error.message,
      };
    }
  }

  async updateUserRoles(
    email: string,
    roles: string[]
  ): Promise<UpdateAccessControlRolesResult> {
    try {
      const user = await cognitoUpdateUserRoles(email, roles);

      return {
        ok: true,
        user,
        message: "User roles updated successfully",
      };
    } catch (error) {
      if (!(error instanceof Error)) {
        return {
          ok: false,
          code: "UNKNOWN_ERROR",
          message: "Failed to update user roles",
        };
      }

      if (error.name === "UserNotFoundException") {
        return {
          ok: false,
          code: "USER_NOT_FOUND",
          message: "User not found in this Cognito user pool",
        };
      }

      return {
        ok: false,
        code: error.name,
        message: error.message,
      };
    }
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    try {
      const result = await cognitoRegister(input.email, input.password, input.name);

      return {
        ok: true,
        email: input.email,
        userConfirmed: result.UserConfirmed,
      };
    } catch (error) {
      if (!(error instanceof Error)) {
        return { ok: false, code: "UNKNOWN_ERROR", message: "Signup failed" };
      }

      if (error.name === "UsernameExistsException") {
        return { ok: false, code: "ACCOUNT_ALREADY_EXISTS", message: "Account already exists" };
      }

      if (error.name === "InvalidPasswordException") {
        return { ok: false, code: "INVALID_PASSWORD", message: error.message };
      }

      return { ok: false, code: error.name, message: error.message };
    }
  }

  async confirmAccount(input: ConfirmAccountInput): Promise<ConfirmAccountResult> {
    try {
      await cognitoConfirmAccount(input.email, input.code);
      return { ok: true, message: "Account confirmed successfully" };
    } catch (error) {
      if (!(error instanceof Error)) {
        return { ok: false, code: "UNKNOWN_ERROR", message: "Confirm account failed" };
      }

      if (error.name === "CodeMismatchException") {
        return { ok: false, code: "CODE_MISMATCH", message: "Invalid confirmation code" };
      }

      if (error.name === "ExpiredCodeException") {
        return { ok: false, code: "EXPIRED_CODE", message: "Expired confirmation code" };
      }

      return { ok: false, code: error.name, message: error.message };
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResult> {
    try {
      await cognitoForgotPassword(input.email);
      return { ok: true, message: "Reset password code sent" };
    } catch (error) {
      if (!(error instanceof Error)) {
        return { ok: false, code: "UNKNOWN_ERROR", message: "Forgot password failed" };
      }

      return { ok: false, code: error.name, message: error.message };
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResult> {
    try {
      await cognitoResetPassword(input.email, input.code, input.newPassword);
      return { ok: true, message: "Password reset successfully" };
    } catch (error) {
      if (!(error instanceof Error)) {
        return { ok: false, code: "UNKNOWN_ERROR", message: "Reset password failed" };
      }

      if (error.name === "CodeMismatchException") {
        return { ok: false, code: "CODE_MISMATCH", message: "Invalid confirmation code" };
      }

      if (error.name === "ExpiredCodeException") {
        return { ok: false, code: "EXPIRED_CODE", message: "Expired confirmation code" };
      }

      return { ok: false, code: error.name, message: error.message };
    }
  }
}
