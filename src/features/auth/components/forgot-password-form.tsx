"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../schemas/auth.schema";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { AuthHeader } from "./auth-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const { handleForgotPassword, isLoading } = useForgotPassword();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-animate-item",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.25,
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    handleForgotPassword(data);
  };

  return (
    <div ref={formRef} className="w-full max-w-md mx-auto px-4 py-2">
      <div className="gsap-animate-item">
        <AuthHeader
          title="Forgot Password?"
          subtitle="Enter your email address below and we'll send you an OTP code to reset your password."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2 gsap-animate-item">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 pl-2">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="gsap-animate-item">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-12 rounded-full font-semibold text-base"
          >
            Send OTP Code
          </Button>
        </div>

        {/* Back to Login */}
        <div className="text-center pt-2 gsap-animate-item">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[oklch(0.48_0.1394_252.75)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
