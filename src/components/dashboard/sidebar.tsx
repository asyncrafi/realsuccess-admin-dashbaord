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
  X,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    onClose?.();
    router.push("/login");
  };

  const navContent = (
    <div className="space-y-6">
      {/* Top Logo Container */}
      <div className="flex items-center justify-between px-2 py-2">
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

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="space-y-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname
            ? pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            : false;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => onClose?.()}
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

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-all cursor-pointer"
        >
          <LogOut className="h-5 w-5 text-gray-500 stroke-[2.2]" />
          <span>log out</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 min-h-screen bg-[#F4F5F8] p-5 flex-col justify-start border-r border-gray-200/60 select-none">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full overflow-y-auto bg-[#F4F5F8] p-5 flex flex-col justify-start border-r border-gray-200/60 shadow-2xl select-none animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
