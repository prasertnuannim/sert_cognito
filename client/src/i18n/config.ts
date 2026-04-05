export const LOCALES = ["en", "th"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "th";
}
