"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Ticket,
  Clock,
  Megaphone,
  MessageSquare,
  Folder,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Attendees", href: "/attendees", icon: Users },
  { label: "Tickets", href: "/tickets", icon: Ticket },
  { label: "Schedule", href: "/schedule", icon: Clock },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Message Team", href: "/message-team", icon: MessageSquare },
  { label: "Resources", href: "/resources", icon: Folder },
  { label: "Setting", href: "/setting", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  return (
    <aside className="w-64 md:w-72 flex-shrink-0 min-h-screen bg-[#F4F5F8] p-5 flex flex-col justify-start border-r border-gray-200/60 select-none">
      <div className="space-y-6">
        {/* Top Logo Container */}
        <div className="flex justify-start px-2 py-2">
          <div className="p-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs inline-flex items-center justify-center min-w-[120px]">
            <Image
              src="/logo.png"
              alt="Real Success Logo"
              width={110}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[oklch(0.48_0.1394_252.75)] text-white shadow-md shadow-[oklch(0.48_0.1394_252.75)]/25"
                    : "bg-white text-gray-700 hover:bg-gray-100/90 hover:text-gray-900 border border-gray-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 stroke-[2.2]",
                    isActive ? "text-white" : "text-gray-500"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Logout Button right below Setting */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-all cursor-pointer"
          >
            <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-600 stroke-[2.2]" />
            <span>log out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
