import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP code must be exactly 6 digits" }),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
