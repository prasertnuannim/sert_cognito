"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidate } from "zod-formik-adapter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import {
  AuthFormShell,
  authErrorClassName,
  authInputClassName,
  authLabelClassName,
  authMutedCardClassName,
  authNoticeClassName,
  authPrimaryButtonClassName,
} from "./auth-form-shell";
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../domain/schemas/forgot-password.schema";
import { mapAuthErrorMessage } from "../../domain/errors/auth-error.mapper";

type Props = {
  initialEmail?: string;
};

export function ResetPasswordForm({ initialEmail = "" }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(values: ResetPasswordFormValues) {
    setFormError("");

    const res = await fetch("/api/cognito/confirm-forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(mapAuthErrorMessage(t, data.errorCode, data.message));
      return;
    }

    router.push("/login?reset=1");
  }

  return (
    <AuthFormShell
      badge={t("resetPassword.badge")}
      title={t("resetPassword.title")}
      description={t("resetPassword.description")}
      panelTag={t("resetPassword.panelTag")}
      panelTitle={t("resetPassword.panelTitle")}
      panelDescription={t("resetPassword.panelDescription")}
      highlights={[
        {
          title: t("resetPassword.highlights.step1Title"),
          description: t("resetPassword.highlights.step1Description"),
        },
        {
          title: t("resetPassword.highlights.step2Title"),
          description: t("resetPassword.highlights.step2Description"),
        },
        {
          title: t("resetPassword.highlights.step3Title"),
          description: t("resetPassword.highlights.step3Description"),
        },
      ]}
      footer={
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-600">
          <Link
            href="/forgot-password"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.requestAnotherCode")}
          </Link>
          <span className="text-zinc-300">{t("common.labels.orSeparator")}</span>
          <Link
            href="/login"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.backToLogin")}
          </Link>
        </div>
      }
    >
      <Formik<ResetPasswordFormValues>
        initialValues={{ email: initialEmail, code: "", newPassword: "" }}
        enableReinitialize
        validate={toFormikValidate(createResetPasswordSchema(t))}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className={authMutedCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {t("resetPassword.notesTitle")}
              </p>
              <div className="mt-3 grid gap-3 text-sm text-zinc-600">
                {initialEmail ? (
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    {t("resetPassword.notes.prefilled", {
                      email: initialEmail,
                    })}
                  </div>
                ) : null}
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  {t("resetPassword.notes.instruction")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className={authLabelClassName}>
                {t("common.fields.email")}
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("common.placeholders.email")}
                className={authInputClassName}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={authErrorClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className={authLabelClassName}>
                {t("common.fields.resetCode")}
              </label>
              <Field
                id="code"
                name="code"
                type="text"
                autoComplete="one-time-code"
                placeholder={t("common.placeholders.emailCode")}
                className={authInputClassName}
              />
              <ErrorMessage
                name="code"
                component="div"
                className={authErrorClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className={authLabelClassName}>
                {t("common.fields.newPassword")}
              </label>
              <div className="relative">
                <Field
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("common.placeholders.newPassword")}
                  className={`${authInputClassName} pr-24`}
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
              <p className="text-sm text-zinc-500">
                {t("common.labels.minimum8")}
              </p>
              <ErrorMessage
                name="newPassword"
                component="div"
                className={authErrorClassName}
              />
            </div>

            {formError ? (
              <div
                aria-live="polite"
                className={`${authNoticeClassName} border-rose-200 bg-rose-50 text-rose-700`}
              >
                {formError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={authPrimaryButtonClassName}
            >
              {isSubmitting
                ? t("common.status.saving")
                : t("common.actions.resetPassword")}
            </button>
          </Form>
        )}
      </Formik>
    </AuthFormShell>
  );
}
