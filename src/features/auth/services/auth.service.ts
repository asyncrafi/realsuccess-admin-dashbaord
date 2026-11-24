import { apiClient } from "@/lib/api-client";
import {
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/auth.types";

/**
 * Enterprise Auth API Service.
 * To connect to real backend API endpoints, set `USE_MOCK_API = false` or configure NEXT_PUBLIC_API_URL.
 */
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    if (USE_MOCK_API) {
      await delay(1000);
      return {
        user: {
          id: "user-123",
          email: payload.email,
          name: "Real Success Admin",
          role: "super_admin",
        },
        token: "mock-jwt-token-xyz-789",
      };
    }
    const res: any = await apiClient("/auth/login/", { data: payload });
    if (res?.data?.access) {
      return {
        user: {
          id: String(res.data.user?.id || ""),
          email: res.data.user?.email || payload.email,
          name: res.data.user?.name || "Admin",
          role: res.data.user?.role || "admin",
        },
        token: res.data.access,
      };
    }
    return res;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
    if (USE_MOCK_API) {
      await delay(1000);
      return {
        message: "Verification OTP code sent to your email address.",
        email: payload.email,
      };
    }
    const res: any = await apiClient("/auth/password/reset-request/", { data: payload });
    return {
      message: res?.message || "Verification OTP code sent to your email address.",
      email: payload.email,
    };
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    if (USE_MOCK_API) {
      await delay(1000);
      if (payload.otp.length < 4) {
        throw new Error("Invalid verification OTP code");
      }
      return {
        message: "OTP code verified successfully",
        resetToken: "mock-reset-token-456",
      };
    }
    const res: any = await apiClient("/auth/password/reset-verify-otp/", {
      data: { email: payload.email, otp: payload.otp },
    });
    return {
      message: res?.message || "OTP code verified successfully",
      resetToken: payload.otp,
    };
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(800);
      return { message: `A new OTP code has been sent to ${email}` };
    }
    const res: any = await apiClient("/auth/password/reset-request/", { data: { email } });
    return { message: res?.message || `A new OTP code has been sent to ${email}` };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
    if (USE_MOCK_API) {
      await delay(1200);
      return {
        message: "Password changed successfully! Please log in with your new password.",
        success: true,
      };
    }
    const res: any = await apiClient("/auth/password/reset-confirm/", {
      data: {
        email: payload.email,
        otp: payload.resetToken,
        new_password: payload.newPassword,
        new_password2: payload.confirmPassword,
      },
    });
    return {
      message: res?.message || "Password changed successfully! Please log in with your new password.",
      success: true,
    };
  },
};
