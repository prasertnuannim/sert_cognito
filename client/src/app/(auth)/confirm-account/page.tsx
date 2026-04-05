import { ConfirmAccountForm } from "@/features/auth/presentation/components/confirm-account-form";

export default async function ConfirmAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return <ConfirmAccountForm initialEmail={params.email ?? ""} />;
}