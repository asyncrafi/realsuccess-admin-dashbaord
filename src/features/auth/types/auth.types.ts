export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  resetToken: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}
