import { z } from "zod";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { createTranslator } from "@/i18n/translations";

const defaultT = createTranslator(DEFAULT_LOCALE);

export function createRegisterSchema(t = defaultT) {
  return z.object({
    name: z
      .string()
      .trim()
      .max(100, t("validation.nameTooLong"))
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    password: z.string().min(8, t("validation.passwordMin")),
  });
}

export const registerSchema = createRegisterSchema();

export type RegisterFormValues = z.infer<typeof registerSchema>;
