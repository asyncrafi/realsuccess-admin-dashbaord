import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login | Real Success Admin Dashboard",
  description: "Sign in to access your Real Success admin account",
};

export default function LoginPage() {
  return <LoginForm />;
}
