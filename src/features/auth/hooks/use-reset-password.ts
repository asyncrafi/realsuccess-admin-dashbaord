import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { ResetPasswordFormData } from "../schemas/auth.schema";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || (typeof window !== "undefined" ? sessionStorage.getItem("reset_token") : "") || "";
  const email = typeof window !== "undefined" ? sessionStorage.getItem("reset_email") || "" : "";

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        resetToken: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(response.message || "Password changed successfully!");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("reset_token");
        sessionStorage.removeItem("reset_email");
      }
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleResetPassword, isLoading };
}
