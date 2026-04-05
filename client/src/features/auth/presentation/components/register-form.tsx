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
  authNoticeClassName,
  authPrimaryButtonClassName,
} from "./auth-form-shell";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "../../domain/schemas/register.schema";
import { mapAuthErrorMessage } from "../../domain/errors/auth-error.mapper";

export function RegisterForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(values: RegisterFormValues) {
    setFormError("");

    const res = await fetch("/api/cognito/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(mapAuthErrorMessage(t, data.errorCode, data.message));
      return;
    }

    router.push(`/confirm-account?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <AuthFormShell
      badge={t("register.badge")}
      title={t("register.title")}
      description={t("register.description")}
      panelTag={t("register.panelTag")}
      panelTitle={t("register.panelTitle")}
      panelDescription={t("register.panelDescription")}
      highlights={[
        {
          title: t("register.highlights.step1Title"),
          description: t("register.highlights.step1Description"),
        },
        {
          title: t("register.highlights.step2Title"),
          description: t("register.highlights.step2Description"),
        },
        {
          title: t("register.highlights.step3Title"),
          description: t("register.highlights.step3Description"),
        },
      ]}
      footer={
        <p className="text-center text-sm text-zinc-600">
          {t("register.footerPrompt")}{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-950 transition hover:text-amber-600"
          >
            {t("common.actions.signIn")}
          </Link>
        </p>
      }
    >
      <Formik<RegisterFormValues>
        initialValues={{ name: "", email: "", password: "" }}
        validate={toFormikValidate(createRegisterSchema(t))}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className={authLabelClassName}>
                {t("common.fields.fullName")}{" "}
                <span className="text-zinc-400">
                  ({t("common.labels.optional")})
                </span>
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t("common.placeholders.fullName")}
                className={authInputClassName}
              />
              <ErrorMessage
                name="name"
                component="div"
                className={authErrorClassName}
              />
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
              <label htmlFor="password" className={authLabelClassName}>
                {t("common.fields.password")}
              </label>
              <div className="relative">
                <Field
                  id="password"
                  name="password"
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
                name="password"
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
                ? t("common.status.creating")
                : t("common.actions.createAccount")}
            </button>
          </Form>
        )}
      </Formik>
    </AuthFormShell>
  );
}
