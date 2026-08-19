"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import gsap from "gsap";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-login";
import { AuthHeader } from "./auth-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading } = useLogin();
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data);
  };

  return (
    <div ref={formRef} className="w-full max-w-md mx-auto px-4 py-2">
      <div className="gsap-animate-item">
        <AuthHeader title="Welcome Real Success" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        {/* Password Field */}
        <div className="space-y-2 gsap-animate-item">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-800">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Type Your password"
            error={!!errors.password}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500 pl-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forget Password */}
        <div className="flex items-center justify-between pt-1 pb-2 gsap-animate-item">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked: boolean) => setValue("rememberMe", checked)}
            label={<span className="text-xs font-medium text-gray-700">Remember me</span>}
          />
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-[oklch(0.48_0.1394_252.75)] hover:underline transition-all"
          >
            Forget Password
          </Link>
        </div>

        {/* Submit Button */}
        <div className="gsap-animate-item">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-12 rounded-full font-semibold text-base"
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
