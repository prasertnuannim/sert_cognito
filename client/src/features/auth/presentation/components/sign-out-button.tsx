"use client";

import { signOut } from "next-auth/react";
import { useI18n } from "@/i18n/i18n-provider";

type Props = {
  callbackUrl?: string;
};

export function SignOutButton({ callbackUrl = "/login" }: Props) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-100"
    >
      {t("common.actions.signOut")}
    </button>
  );
}
