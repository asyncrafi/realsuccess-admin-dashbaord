"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full text-left">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-full border border-gray-200 bg-[#F6F7F9] px-5 text-sm font-medium text-gray-800 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          isOpen && "border-[oklch(0.48_0.1394_252.75)] ring-2 ring-[oklch(0.48_0.1394_252.75)]/20 bg-white",
          className
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180 text-[oklch(0.48_0.1394_252.75)]"
          )}
        />
      </button>

      {/* Floating Rounded Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-full min-w-[160px] rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-200/60 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-150 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer my-0.5",
                  isSelected
                    ? "bg-blue-50/80 text-[oklch(0.48_0.1394_252.75)] font-semibold"
                    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)] stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
