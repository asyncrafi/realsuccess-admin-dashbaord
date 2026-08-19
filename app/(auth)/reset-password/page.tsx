import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Real Success Admin Dashboard",
  description: "Set a new password for your Real Success account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-sm font-medium text-gray-500">Loading reset password form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
