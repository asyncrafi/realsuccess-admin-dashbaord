"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [adminName, setAdminName] = useState("Real Success Admin");
  const [avatar, setAvatar] = useState("/fallback_avatar.png");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setAdminName(u.name);
      }
    } catch {}

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null;

    if (token) {
      fetch("https://api.ourrealsuccess.com/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.name) setAdminName(data.data.name);
          if (data?.data?.profile_picture) setAvatar(data.data.profile_picture);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <header className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-white border-b border-gray-100/80">
      {/* Left: Hamburger + Greeting Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
          <span className="sm:hidden">RealSuccess Dashboard</span>
          <span className="hidden sm:inline">Welcome to real success dashboard</span>
        </h1>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden border border-gray-200 shadow-xs bg-gray-100">
            <Image
              src={avatar}
              alt={adminName}
              fill
              className="object-cover"
              onError={() => setAvatar("/fallback_avatar.png")}
            />
          </div>
          <span className="text-base font-bold text-gray-900 hidden sm:inline-block">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
}
