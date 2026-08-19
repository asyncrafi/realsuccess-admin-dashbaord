"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100/80">
      {/* Greeting Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Welcome to real success dashboard
        </h1>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200 shadow-xs">
            <Image
              src="/fallback_avatar.png"
              alt="Aminul Arnob"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-base font-bold text-gray-900 hidden sm:inline-block">
            Aminul Arnob
          </span>
        </div>
      </div>
    </header>
  );
}
