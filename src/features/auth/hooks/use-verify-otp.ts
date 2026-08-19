import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { VerifyOtpFormData } from "../schemas/auth.schema";

export function useVerifyOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get("email") || (typeof window !== "undefined" ? sessionStorage.getItem("reset_email") : "") || "";

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({ email, otp: data.otp });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_token", response.resetToken);
      }
      toast.success("OTP verified successfully!");
      router.push(`/reset-password?token=${encodeURIComponent(response.resetToken)}`);
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const res = await authService.resendOtp(email);
      toast.success(res.message);
      setCountdown(60);
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend OTP code.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    handleVerifyOtp,
    handleResendOtp,
    isLoading,
    isResending,
    countdown,
    email,
  };
}
