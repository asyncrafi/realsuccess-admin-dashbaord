import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { ForgotPasswordFormData } from "../schemas/auth.schema";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_email", data.email);
      }
      toast.success(response.message || "Verification code sent!");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleForgotPassword, isLoading };
}
