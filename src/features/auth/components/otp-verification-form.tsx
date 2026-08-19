"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, RefreshCw } from "lucide-react";
import gsap from "gsap";
import { verifyOtpSchema, VerifyOtpFormData } from "../schemas/auth.schema";
import { useVerifyOtp } from "../hooks/use-verify-otp";
import { AuthHeader } from "./auth-header";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpVerificationForm() {
  const {
    handleVerifyOtp,
    handleResendOtp,
    isLoading,
    isResending,
    countdown,
    email,
  } = useVerifyOtp();
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: VerifyOtpFormData) => {
    handleVerifyOtp(data);
  };

  return (
    <div ref={formRef} className="w-full max-w-md mx-auto px-4 py-2">
      <div className="gsap-animate-item">
        <AuthHeader
          title="Verify OTP Code"
          subtitle={
            email
              ? `We sent a 6-digit verification code to ${email}`
              : "We sent a 6-digit verification code to your email address"
          }
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OTP Input Slots */}
        <div className="space-y-3 flex flex-col items-center justify-center gsap-animate-item">
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-xs font-medium text-red-500 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Resend Timer & Action */}
        <div className="flex items-center justify-between text-xs font-medium text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 gsap-animate-item">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={countdown > 0 || isResending}
            className="font-bold text-[oklch(0.48_0.1394_252.75)] hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
          >
            {isResending && <RefreshCw className="h-3 w-3 animate-spin" />}
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </button>
        </div>

        {/* Submit Button */}
        <div className="gsap-animate-item">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-12 rounded-full font-semibold text-base"
          >
            Verify Code
          </Button>
        </div>

        {/* Back link */}
        <div className="text-center pt-1 gsap-animate-item">
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
