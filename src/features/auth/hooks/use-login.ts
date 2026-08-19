import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { LoginFormData } from "../schemas/auth.schema";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
