import { z } from "zod";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { createTranslator } from "@/i18n/translations";

const defaultT = createTranslator(DEFAULT_LOCALE);

export function createForgotPasswordSchema(t = defaultT) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
  });
}

export function createResetPasswordSchema(t = defaultT) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    code: z.string().trim().min(1, t("validation.codeRequired")),
    newPassword: z.string().min(8, t("validation.newPasswordMin")),
  });
}

export const forgotPasswordSchema = createForgotPasswordSchema();
export const resetPasswordSchema = createResetPasswordSchema();

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
