"use client";

import { LOCALES, type Locale } from "../config";
import { useI18n } from "../i18n-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-2 py-2 shadow-lg shadow-zinc-900/5 backdrop-blur">
      <span className="pl-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {t("languageSwitcher.label")}
      </span>

      <div className="inline-flex rounded-full bg-zinc-100 p-1">
        {LOCALES.map((option) => {
          const isActive = option === locale;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => setLocale(option as Locale)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {t(`languageSwitcher.${option}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
