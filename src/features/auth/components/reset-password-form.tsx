"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { resetPasswordSchema, ResetPasswordFormData } from "../schemas/auth.schema";
import { useResetPassword } from "../hooks/use-reset-password";
import { AuthHeader } from "./auth-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleResetPassword, isLoading } = useResetPassword();
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
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    handleResetPassword(data);
  };

  return (
    <div ref={formRef} className="w-full max-w-md mx-auto px-4 py-2">
      <div className="gsap-animate-item">
        <AuthHeader
          title="Set New Password"
          subtitle="Your new password must be different from previously used passwords."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password Field */}
        <div className="space-y-2 gsap-animate-item">
          <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-800">
            New Password
          </Label>
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            error={!!errors.newPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="focus:outline-none p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-xs font-medium text-red-500 pl-2">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2 gsap-animate-item">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            error={!!errors.confirmPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-500 pl-2">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="gsap-animate-item">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-12 rounded-full font-semibold text-base mt-2"
          >
            Change Password
          </Button>
        </div>

        {/* Back link */}
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
