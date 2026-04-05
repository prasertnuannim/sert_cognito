import { z } from "zod";
import { createTranslator } from "@/i18n/translations";
import { DEFAULT_LOCALE } from "@/i18n/config";

const defaultT = createTranslator(DEFAULT_LOCALE);

export function createLoginSchema(t = defaultT) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
}

export const loginSchema = createLoginSchema();

export type LoginFormValues = z.infer<typeof loginSchema>;
