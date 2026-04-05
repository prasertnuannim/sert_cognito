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
  createConfirmAccountSchema,
  type ConfirmAccountFormValues,
} from "../../domain/schemas/confirm-account.schema";
import { mapAuthErrorMessage } from "../../domain/errors/auth-error.mapper";

type Props = {
  initialEmail?: string;
};

export function ConfirmAccountForm({ initialEmail = "" }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [formError, setFormError] = useState("");

  async function handleSubmit(values: ConfirmAccountFormValues) {
    setFormError("");

    const res = await fetch("/api/cognito/confirm-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(mapAuthErrorMessage(t, data.errorCode, data.message));
      return;
    }

    router.push(`/login?confirmed=1&email=${encodeURIComponent(values.email)}`);
  }

  return (
    <AuthFormShell
      badge={t("confirmAccount.badge")}
      title={t("confirmAccount.title")}
      description={t("confirmAccount.description")}
      panelTag={t("confirmAccount.panelTag")}
      panelTitle={t("confirmAccount.panelTitle")}
      panelDescription={t("confirmAccount.panelDescription")}
      highlights={[
        {
          title: t("confirmAccount.highlights.step1Title"),
          description: t("confirmAccount.highlights.step1Description"),
        },
        {
          title: t("confirmAccount.highlights.step2Title"),
          description: t("confirmAccount.highlights.step2Description"),
        },
        {
          title: t("confirmAccount.highlights.step3Title"),
          description: t("confirmAccount.highlights.step3Description"),
        },
      ]}
      footer={
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-600">
          <Link
            href="/register"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.backToRegister")}
          </Link>
          <span className="text-zinc-300">{t("common.labels.orSeparator")}</span>
          <Link
            href="/login"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.goToLogin")}
          </Link>
        </div>
      }
    >
      <Formik<ConfirmAccountFormValues>
        initialValues={{ email: initialEmail, code: "" }}
        enableReinitialize
        validate={toFormikValidate(createConfirmAccountSchema(t))}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className={authMutedCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {t("confirmAccount.notesTitle")}
              </p>
              <div className="mt-3 grid gap-3 text-sm text-zinc-600">
                {initialEmail ? (
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    {t("confirmAccount.notes.prefilled", {
                      email: initialEmail,
                    })}
                  </div>
                ) : null}
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  {t("confirmAccount.notes.checkInbox")}
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
                {t("common.fields.confirmationCode")}
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
                ? t("common.status.confirming")
                : t("common.actions.confirmAccount")}
            </button>
          </Form>
        )}
      </Formik>
    </AuthFormShell>
  );
}
