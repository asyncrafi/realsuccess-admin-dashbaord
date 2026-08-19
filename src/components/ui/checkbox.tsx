import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, label, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-center space-x-2 select-none cursor-pointer">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            onClick={() => !disabled && onCheckedChange?.(!checked)}
            className={cn(
              "h-5 w-5 rounded-full border border-gray-300 bg-white transition-all flex items-center justify-center cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-[oklch(0.48_0.1394_252.75)] peer-checked:bg-[oklch(0.48_0.1394_252.75)] peer-checked:border-[oklch(0.48_0.1394_252.75)]",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {checked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
