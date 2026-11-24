"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Header() {
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
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200 shadow-xs bg-gray-100">
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
