import { DEFAULT_LOCALE, type Locale } from "./config";
import en from "./messages/en.json";
import th from "./messages/th.json";

type TranslationValue = string | TranslationDictionary;
type TranslationDictionary = {
  [key: string]: TranslationValue;
};

type TranslationParams = Record<string, string | number>;

const dictionaries: Record<Locale, TranslationDictionary> = {
  en,
  th,
};

function getTranslationValue(
  dictionary: TranslationDictionary,
  key: string
): TranslationValue | undefined {
  return key.split(".").reduce<TranslationValue | undefined>((current, part) => {
    if (!current || typeof current === "string") {
      return undefined;
    }

    return current[part];
  }, dictionary);
}

function interpolate(
  template: string,
  params?: TranslationParams
): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams
): string {
  const value =
    getTranslationValue(dictionaries[locale], key) ??
    getTranslationValue(dictionaries[DEFAULT_LOCALE], key);

  if (typeof value !== "string") {
    return key;
  }

  return interpolate(value, params);
}

export type TranslateFn = (
  key: string,
  params?: TranslationParams
) => string;

export function createTranslator(locale: Locale): TranslateFn {
  return (key, params) => translate(locale, key, params);
}
