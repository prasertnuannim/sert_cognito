import { ResetPasswordForm } from "@/features/auth/presentation/components/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return <ResetPasswordForm initialEmail={params.email ?? ""} />;
}