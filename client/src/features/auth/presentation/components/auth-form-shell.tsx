"use client";

import { useI18n } from "@/i18n/i18n-provider";

type AuthHighlight = {
  title: string;
  description: string;
};

type AuthFormShellProps = {
  badge: string;
  title: string;
  description: string;
  panelTag: string;
  panelTitle: string;
  panelDescription: string;
  highlights: AuthHighlight[];
  children: React.ReactNode;
  footer: React.ReactNode;
};

export const authInputClassName =
  "h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-amber-100";

export const authLabelClassName = "text-sm font-medium text-zinc-800";
export const authErrorClassName = "text-sm text-rose-600";
export const authNoticeClassName =
  "rounded-2xl border px-4 py-3 text-sm";
export const authMutedCardClassName =
  "rounded-3xl border border-zinc-200 bg-zinc-50/80 p-4";
export const authPrimaryButtonClassName =
  "flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400";

export function AuthFormShell({
  badge,
  title,
  description,
  panelTag,
  panelTitle,
  panelDescription,
  highlights,
  children,
  footer,
}: AuthFormShellProps) {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_30%),linear-gradient(135deg,_#fffaf0_0%,_#ffffff_45%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/3 -translate-y-1/4 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-zinc-900/10 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_40px_120px_-48px_rgba(15,23,42,0.45)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-zinc-950 p-10 text-white xl:flex xl:flex-col xl:justify-between">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              {panelTag}
            </span>

            <div className="space-y-4">
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">
                {panelTitle}
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/70">
                {panelDescription}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-white/75">
                {t("authShell.flowGuideTitle")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {t("authShell.flowGuideDescription")}
              </p>
            </div>

            <div className="grid gap-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-sm font-medium text-white">
                    {highlight.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/70">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-3">
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                {badge}
              </span>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  {title}
                </h2>
                <p className="text-sm leading-6 text-zinc-600">{description}</p>
              </div>
            </div>

            {children}

            <div className="mt-6">{footer}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
