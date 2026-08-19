import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-full border bg-[#F6F7F9] px-5 py-2 text-base text-gray-800 placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.48_0.1394_252.75)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 border-gray-300",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
