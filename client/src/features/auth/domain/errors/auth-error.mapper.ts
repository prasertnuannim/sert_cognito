import type { TranslateFn } from "@/i18n/translations";

export function mapAuthErrorMessage(
  t: TranslateFn,
  code?: string,
  detail?: string
) {
  switch (code) {
    case "INVALID_CREDENTIALS":
    case "CredentialsSignin":
    case "AUTHENTICATION_FAILED":
      return t("errors.invalidCredentials");
    case "USER_NOT_CONFIRMED":
      return t("errors.userNotConfirmed");
    case "ACCOUNT_ALREADY_EXISTS":
      return t("errors.accountAlreadyExists");
    case "INVALID_PASSWORD":
      return t("errors.invalidPassword");
    case "SIGNUP_DISABLED":
      return t("errors.signupDisabled");
    case "CODE_MISMATCH":
      return t("errors.codeMismatch");
    case "EXPIRED_CODE":
      return t("errors.expiredCode");
    case "MFA_REQUIRED":
      return t("errors.mfaRequired");
    case "NEW_PASSWORD_REQUIRED":
      return t("errors.newPasswordRequired");
    case "VALIDATION_ERROR":
      return t("errors.validationError");
    case "UNAUTHORIZED":
      return t("errors.unauthorized");
    case "FORBIDDEN":
      return t("errors.forbidden");
    case "USER_NOT_FOUND":
      return t("errors.userNotFound");
    default:
      return detail && code === undefined ? detail : t("errors.generic");
  }
}
