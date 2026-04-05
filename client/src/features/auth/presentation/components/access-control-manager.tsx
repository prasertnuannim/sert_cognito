"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { mapAuthErrorMessage } from "../../domain/errors/auth-error.mapper";

type AccessControlUser = {
  username: string;
  email: string;
  name?: string;
  status?: string;
  roles: string[];
  managedRoles: string[];
};

type Props = {
  availableRoles: string[];
};

export function AccessControlManager({ availableRoles }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loadedUser, setLoadedUser] = useState<AccessControlUser | null>(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function toggleRole(role: string) {
    setSelectedRoles((currentRoles) =>
      currentRoles.includes(role)
        ? currentRoles.filter((item) => item !== role)
        : [...currentRoles, role]
    );
  }

  async function loadUser(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setFormError("");
    setSuccessMessage("");
    setLoadedUser(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/cognito/access-control?email=${encodeURIComponent(email.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        setSelectedRoles([]);
        setFormError(mapAuthErrorMessage(t, data.errorCode, data.message));
        return;
      }

      setLoadedUser(data.user);
      setSelectedRoles(data.user.managedRoles);
    } catch {
      setFormError(t("errors.accessControlUnavailable"));
    } finally {
      setIsLoading(false);
    }
  }

  async function saveRoles() {
    setFormError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/cognito/access-control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          roles: selectedRoles,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setFormError(mapAuthErrorMessage(t, data.errorCode, data.message));
        return;
      }

      setLoadedUser(data.user);
      setSelectedRoles(data.user.managedRoles);
      setSuccessMessage(t("accessControl.successMessage"));
    } catch {
      setFormError(t("errors.accessControlUnavailable"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t("accessControl.formTitle")}
        </p>

        <form onSubmit={loadUser} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="access-control-email"
              className="text-sm font-medium text-zinc-900"
            >
              {t("common.fields.userEmail")}
            </label>
            <input
              id="access-control-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              placeholder={t("common.placeholders.userEmail")}
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isLoading
              ? t("common.status.loading")
              : t("common.actions.loadUserAccess")}
          </button>
        </form>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t("accessControl.assignableRoles")}
          </p>
          <div className="mt-4 grid gap-3">
            {availableRoles.map((role) => {
              const isChecked = selectedRoles.includes(role);

              return (
                <label
                  key={role}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                    isChecked
                      ? "border-zinc-900 bg-white text-zinc-950"
                      : "border-zinc-200 bg-white text-zinc-600"
                  }`}
                >
                  <span className="font-medium uppercase tracking-[0.18em]">
                    {role}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleRole(role)}
                    disabled={!loadedUser || isSaving}
                    className="h-4 w-4 accent-zinc-950"
                  />
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={saveRoles}
            disabled={!loadedUser || isSaving}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
          >
            {isSaving
              ? t("common.status.saving")
              : t("common.actions.saveRoles")}
          </button>
        </div>

        {formError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}
      </article>

      <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t("accessControl.loadedProfile")}
        </p>

        {loadedUser ? (
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {t("common.fields.username")}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {loadedUser.username}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {t("common.fields.status")}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {loadedUser.status ?? t("common.status.unknown")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                {t("common.fields.email")}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {loadedUser.email}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                {t("common.fields.name")}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {loadedUser.name ?? t("common.status.noDisplayName")}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                {t("accessControl.currentGroups")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {loadedUser.roles.length ? (
                  loadedUser.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-zinc-500">
                    {t("accessControl.noGroups")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-7 text-zinc-600">
            {t("accessControl.emptyState")}
          </div>
        )}
      </article>
    </section>
  );
}
