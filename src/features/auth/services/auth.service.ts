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
const USE_MOCK_API = true;

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
    return apiClient<LoginResponse>("/auth/login", { data: payload });
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
    if (USE_MOCK_API) {
      await delay(1000);
      return {
        message: "Verification OTP code sent to your email address.",
        email: payload.email,
      };
    }
    return apiClient<ForgotPasswordResponse>("/auth/forgot-password", { data: payload });
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    if (USE_MOCK_API) {
      await delay(1000);
      if (payload.otp.length < 6) {
        throw new Error("Invalid 6-digit verification OTP code");
      }
      return {
        message: "OTP code verified successfully",
        resetToken: "mock-reset-token-456",
      };
    }
    return apiClient<VerifyOtpResponse>("/auth/verify-otp", { data: payload });
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(800);
      return { message: `A new OTP code has been sent to ${email}` };
    }
    return apiClient<{ message: string }>("/auth/resend-otp", { data: { email } });
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
    if (USE_MOCK_API) {
      await delay(1200);
      return {
        message: "Password changed successfully! Please log in with your new password.",
        success: true,
      };
    }
    return apiClient<ResetPasswordResponse>("/auth/reset-password", { data: payload });
  },
};
