import { Metadata } from "next";
import { Suspense } from "react";
import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";

export const metadata: Metadata = {
  title: "Verify OTP | Real Success Admin Dashboard",
  description: "Verify OTP code to reset password",
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-sm font-medium text-gray-500">Loading verification form...</div>}>
      <OtpVerificationForm />
    </Suspense>
  );
}
