"use client";

import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const [formattedDate, setFormattedDate] = useState<string>("August 19, 2026");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    setFormattedDate(formatted);
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-[oklch(0.48_0.1394_252.75)] px-6 py-4 text-white shadow-md shadow-[oklch(0.48_0.1394_252.75)]/15 flex flex-row items-center justify-between gap-4 overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

      {/* Left Greeting */}
      <div className="z-10 flex items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight">
            Welcome back, <span className="font-medium text-white/85 text-base md:text-lg">Leadership Weekend</span>
          </h2>
        </div>
      </div>

      {/* Right Date & Status Badge */}
      <div className="z-10 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-4 text-xs font-medium">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold tracking-wider text-white/70 uppercase">
            System Date
          </span>
          <span className="text-sm font-bold text-white leading-tight">
            {formattedDate}
          </span>
        </div>
        <div className="h-6 w-px bg-white/20 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-200">
            Synced
          </span>
        </div>
      </div>
    </div>
  );
}
