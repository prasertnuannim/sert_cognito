"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidate } from "zod-formik-adapter";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import {
  canAccessPath,
  getDefaultPathForRoles,
  getSafeAppPath,
  normalizeRoles,
} from "../../domain/auth-access-control";
import {
  createLoginSchema,
  type LoginFormValues,
} from "../../domain/schemas/login.schema";
import { mapAuthErrorMessage } from "../../domain/errors/auth-error.mapper";

const DEFAULT_CREDENTIALS: LoginFormValues = {
  email: "sertnayongkub@gmail.com",
  password: "Password123!",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-amber-100";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(values: LoginFormValues) {
    setFormError("");

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result) {
      setFormError(t("errors.loginUnavailable"));
      return;
    }

    if (result.error) {
      if (result.error === "USER_NOT_CONFIRMED") {
        router.push(`/confirm-account?email=${encodeURIComponent(values.email)}`);
        return;
      }

      if (result.error === "MFA_REQUIRED") {
        setFormError(mapAuthErrorMessage(t, result.error));
        return;
      }

      if (result.error === "NEW_PASSWORD_REQUIRED") {
        setFormError(mapAuthErrorMessage(t, result.error));
        return;
      }

      setFormError(mapAuthErrorMessage(t, result.error));
      return;
    }

    const session = await getSession();
    const roles = normalizeRoles(session?.user?.roles);
    const defaultAuthenticatedPath = getDefaultPathForRoles(roles);
    const safeCallbackPath = getSafeAppPath(
      callbackUrl,
      window.location.origin
    );

    if (safeCallbackPath) {
      const targetPathname = new URL(safeCallbackPath, window.location.origin)
        .pathname;

      if (canAccessPath(targetPathname, roles)) {
        router.push(safeCallbackPath);
        return;
      }
    }

    router.push(defaultAuthenticatedPath);
  }

  const externalError = rawError ? mapAuthErrorMessage(t, rawError) : "";
  const displayError = formError || externalError;
  const loginSchema = createLoginSchema(t);

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
              {t("login.panelTag")}
            </span>

            <div className="space-y-4">
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">
                {t("login.panelTitle")}
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/70">
                {t("login.panelDescription")}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-white/75">
                {t("login.scopeTitle")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {t("login.scopeDescription")}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {t("login.highlights.registerAndConfirm")}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {t("login.highlights.credentialsSignIn")}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {t("login.highlights.protectedRoutes")}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-3">
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                {t("login.badge")}
              </span>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  {t("login.title")}
                </h2>
                <p className="text-sm leading-6 text-zinc-600">
                  {t("login.description")}
                </p>
              </div>
            </div>

            <Formik<LoginFormValues>
              initialValues={DEFAULT_CREDENTIALS}
              validate={toFormikValidate(loginSchema)}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
   

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-zinc-800"
                    >
                      {t("common.fields.email")}
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t("common.placeholders.email")}
                      className={inputClassName}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-rose-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-zinc-800"
                      >
                        {t("common.fields.password")}
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                      >
                        {t("login.forgotPassword")}
                      </Link>
                    </div>

                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={t("common.placeholders.password")}
                        className={`${inputClassName} pr-24`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        {showPassword
                          ? t("common.actions.hide")
                          : t("common.actions.show")}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-rose-600"
                    />
                  </div>

                  {displayError ? (
                    <div
                      aria-live="polite"
                      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                    >
                      {displayError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  >
                    {isSubmitting
                      ? t("common.status.signingIn")
                      : t("common.actions.login")}
                  </button>

                  <p className="text-center text-sm text-zinc-600">
                    {t("login.footerPrompt")}{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-zinc-950 transition hover:text-amber-600"
                    >
                      {t("common.actions.createAccount")}
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
