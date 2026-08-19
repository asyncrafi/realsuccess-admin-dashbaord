import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.99] duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-[oklch(0.48_0.1394_252.75)] text-white hover:bg-[oklch(0.40_0.1394_252.75)] shadow-md shadow-[oklch(0.48_0.1394_252.75)]/20",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 shadow-none",
        link: "text-[oklch(0.48_0.1394_252.75)] underline-offset-4 hover:underline shadow-none p-0 h-auto font-medium",
      },
      size: {
        default: "h-12 px-6 py-3 text-base font-semibold",
        sm: "h-9 px-4 text-xs font-semibold",
        lg: "h-14 px-8 text-lg font-bold",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
