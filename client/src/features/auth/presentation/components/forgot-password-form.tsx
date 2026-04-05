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
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../domain/schemas/forgot-password.schema";
import { mapAuthErrorMessage } from "../../domain/errors/auth-error.mapper";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [formError, setFormError] = useState("");

  async function handleSubmit(values: ForgotPasswordFormValues) {
    setFormError("");

    const res = await fetch("/api/cognito/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(mapAuthErrorMessage(t, data.errorCode, data.message));
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <AuthFormShell
      badge={t("forgotPassword.badge")}
      title={t("forgotPassword.title")}
      description={t("forgotPassword.description")}
      panelTag={t("forgotPassword.panelTag")}
      panelTitle={t("forgotPassword.panelTitle")}
      panelDescription={t("forgotPassword.panelDescription")}
      highlights={[
        {
          title: t("forgotPassword.highlights.step1Title"),
          description: t("forgotPassword.highlights.step1Description"),
        },
        {
          title: t("forgotPassword.highlights.step2Title"),
          description: t("forgotPassword.highlights.step2Description"),
        },
        {
          title: t("forgotPassword.highlights.step3Title"),
          description: t("forgotPassword.highlights.step3Description"),
        },
      ]}
      footer={
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-600">
          <Link
            href="/login"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.backToLogin")}
          </Link>
          <span className="text-zinc-300">{t("common.labels.orSeparator")}</span>
          <Link
            href="/register"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.createAccount")}
          </Link>
        </div>
      }
    >
      <Formik<ForgotPasswordFormValues>
        initialValues={{ email: "" }}
        validate={toFormikValidate(createForgotPasswordSchema(t))}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className={authMutedCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {t("forgotPassword.notesTitle")}
              </p>
              <div className="mt-3 grid gap-3 text-sm text-zinc-600">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  {t("forgotPassword.notes.step1")}
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  {t("forgotPassword.notes.step2")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className={authLabelClassName}>
                {t("common.fields.accountEmail")}
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
                ? t("common.status.sending")
                : t("common.actions.sendResetCode")}
            </button>
          </Form>
        )}
      </Formik>
    </AuthFormShell>
  );
}
