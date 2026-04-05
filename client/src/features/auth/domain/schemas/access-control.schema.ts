import { z } from "zod";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { createTranslator } from "@/i18n/translations";

const defaultT = createTranslator(DEFAULT_LOCALE);

export function createAccessControlEmailSchema(t = defaultT) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
  });
}

export function createUpdateAccessControlRolesSchema(t = defaultT) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    roles: z.array(z.string().trim().min(1)).default([]),
  });
}

export const accessControlEmailSchema = createAccessControlEmailSchema();
export const updateAccessControlRolesSchema = createUpdateAccessControlRolesSchema();

export type AccessControlEmailInput = z.infer<typeof accessControlEmailSchema>;
export type UpdateAccessControlRolesInput = z.infer<
  typeof updateAccessControlRolesSchema
>;
