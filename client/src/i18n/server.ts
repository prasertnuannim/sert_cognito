import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "./config";
import { createTranslator } from "./translations";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export async function getServerTranslator() {
  const locale = await getServerLocale();

  return {
    locale,
    t: createTranslator(locale),
  };
}
