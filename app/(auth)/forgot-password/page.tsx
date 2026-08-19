import { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Real Success Admin Dashboard",
  description: "Request password reset OTP code for your account",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
