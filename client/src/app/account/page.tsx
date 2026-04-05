import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ROLE_ROUTE_RULES,
  canAccessPath,
  normalizeRoles,
} from "@/features/auth/domain/auth-access-control";
import { getManagedRoleGroups } from "@/features/auth/infrastructure/cognito-role-groups";
import { AccessControlManager } from "@/features/auth/presentation/components/access-control-manager";
import { SignOutButton } from "@/features/auth/presentation/components/sign-out-button";
import { getServerTranslator } from "@/i18n/server";
import { auth } from "@/lib/auth";

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
      {role}
    </span>
  );
}

export default async function AccountPage() {
  const { t } = await getServerTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const roles = normalizeRoles(session.user.roles);
  const availableRoles = getManagedRoleGroups();
  const canManageAccessControl = canAccessPath("/settings/access-control", roles);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#ffffff_42%,_#f5f5f4_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-zinc-950 text-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.55)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                {t("account.badge")}
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {t("account.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                  {t("account.description")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <SignOutButton />
                {canManageAccessControl ? (
                  <a
                    href="#role-management"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    {t("common.actions.jumpToRoleManagement")}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                {t("account.currentSession")}
              </p>
              <dl className="mt-4 grid gap-4">
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {t("common.fields.name")}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {session.user.name ?? t("common.status.unknownUser")}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {t("common.fields.email")}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {session.user.email ?? t("common.status.noEmailInSession")}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {t("common.fields.roles")}
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {roles.length ? (
                      roles.map((role) => <RoleBadge key={role} role={role} />)
                    ) : (
                      <span className="text-sm text-white/70">
                        {t("common.status.noExplicitRole")}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[28px] border border-zinc-200 bg-white/90 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t("account.overview.title")}
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {t("account.overview.authenticatedLandingTitle")}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  {t("account.overview.authenticatedLandingDescription")}{" "}
                  <code>/account</code>
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {t("account.overview.managedRoleGroupsTitle")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white/90 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t("account.accessBehavior.title")}
            </p>
            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {t("account.accessBehavior.tokenRoleSourcesTitle")}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  {t("account.accessBehavior.tokenRoleSourcesDescription")}{" "}
                  <code>cognito:groups</code>, <code>roles</code>, <code>role</code>,{" "}
                  <code>custom:role</code>
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {t("account.accessBehavior.protectedRoutesTitle")}
                </p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
                  {ROLE_ROUTE_RULES.map((rule) => (
                    <div key={rule.path}>
                      <span className="font-semibold text-zinc-900">{rule.path}</span>
                      {" "}{t("account.accessBehavior.requires")}{" "}
                      {rule.allowedRoles.join(", ")}
                    </div>
                  ))}
                </div>
              </div>
              {canManageAccessControl ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
                  {t("account.accessBehavior.canManage")}
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-6 text-zinc-600">
                  {t("account.accessBehavior.cannotManagePrefix")} <code>admin</code>{" "}
                  {t("account.accessBehavior.cannotManageSuffix")}
                </div>
              )}
            </div>
          </article>
        </section>

        {canManageAccessControl ? (
          <section id="role-management" className="scroll-mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  {t("account.roleManagement.label")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {t("account.roleManagement.title")}
                </h2>
              </div>
              <Link
                href="/settings/access-control"
                className="text-sm font-semibold text-zinc-700 transition hover:text-amber-600"
              >
                {t("common.actions.openLegacyAccessControlPage")}
              </Link>
            </div>

            <AccessControlManager availableRoles={availableRoles} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
