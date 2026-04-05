import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ROLE_HOME_PATHS,
  ROLE_ROUTE_RULES,
  canAccessPath,
  normalizeRoles,
} from "@/features/auth/domain/auth-access-control";
import { getManagedRoleGroups } from "@/features/auth/infrastructure/cognito-role-groups";
import { AccessControlManager } from "@/features/auth/presentation/components/access-control-manager";
import { SignOutButton } from "@/features/auth/presentation/components/sign-out-button";
import { getServerTranslator } from "@/i18n/server";
import { auth } from "@/lib/auth";

export default async function AccessControlPage() {
  const { t } = await getServerTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const roles = normalizeRoles(session.user.roles);
  const availableRoles = getManagedRoleGroups();

  if (!canAccessPath("/settings/access-control", roles)) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fafaf9_0%,_#ffffff_35%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                {t("settingsAccessControl.badge")}
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  {t("settingsAccessControl.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600">
                  {t("settingsAccessControl.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/account"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-100"
              >
                {t("common.actions.backToAccount")}
              </Link>
              <SignOutButton />
            </div>
          </div>
        </section>

        <AccessControlManager availableRoles={availableRoles} />

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[28px] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-[0_36px_90px_-56px_rgba(15,23,42,0.55)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              {t("settingsAccessControl.currentAdminSession")}
            </p>
            <dl className="mt-4 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.18em] text-white/45">
                  {t("common.fields.email")}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {session.user.email ?? t("common.status.noEmailInSession")}
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.18em] text-white/45">
                  {t("common.fields.roles")}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                    >
                      {role}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t("settingsAccessControl.permissionsGuide.title")}
            </p>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-zinc-600">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                {t("settingsAccessControl.permissionsGuide.step1")}
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                {t("settingsAccessControl.permissionsGuide.step2")}
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                {t("settingsAccessControl.permissionsGuide.step3")}
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                {t("settingsAccessControl.permissionsGuide.step4")}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t("settingsAccessControl.roleHomePaths.title")}
            </p>
            <div className="mt-4 space-y-3">
              {ROLE_HOME_PATHS.length ? (
                ROLE_HOME_PATHS.map((item) => (
                  <div
                    key={`${item.role}:${item.path}`}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-zinc-900">
                      {item.role}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">{item.path}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
                  {t("settingsAccessControl.roleHomePaths.empty")}
                </div>
              )}
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t("settingsAccessControl.protectedRoutes.title")}
            </p>
            <div className="mt-4 space-y-3">
              {ROLE_ROUTE_RULES.map((rule) => (
                <div
                  key={rule.path}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4"
                >
                  <p className="text-sm font-semibold text-zinc-900">
                    {rule.path}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {t("settingsAccessControl.protectedRoutes.allowedRoles", {
                      roles: rule.allowedRoles.join(", "),
                    })}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.35)] lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t("settingsAccessControl.managedRoleGroups.title")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {availableRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700"
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              {t("settingsAccessControl.managedRoleGroups.description")}
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
