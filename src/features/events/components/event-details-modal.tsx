"use client";

import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  Ticket,
  Users,
  Key,
  CheckCircle,
  Clock,
  Tag,
  Info,
  Pencil,
  Copy,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { EventItem } from "../types/events.types";
import { cn } from "@/lib/utils";

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const router = useRouter();

  if (!event) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText("RS-AUG-2026-001");
    toast.success("Access code copied to clipboard!");
  };

  const handleEdit = () => {
    onClose();
    router.push(`/events?action=edit&id=${event.id}`, { scroll: false });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-6 max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">Event Full Details</h3>
            <span
              className={cn(
                "inline-block font-semibold text-xs px-3 py-1 rounded-full",
                event.status === "Active" && "text-emerald-600 bg-emerald-50 border border-emerald-200",
                event.status === "Upcoming" && "text-sky-500 bg-sky-50 border border-sky-200",
                event.status === "Completed" && "text-teal-600 bg-teal-50 border border-teal-200"
              )}
            >
              {event.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 space-y-6 text-left overflow-y-auto">
          {/* Main Title & Quick Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[oklch(0.48_0.1394_252.75)] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Workshop / Leadership
              </span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                Registration: Open
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {event.name}
            </h2>
          </div>

          {/* Event Description */}
          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Info className="h-3.5 w-3.5 text-gray-500" />
              <span>Event Overview & Agenda</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              RealSuccess Leadership Weekend is designed for executive leaders, managers, and entrepreneurs to accelerate strategic decision-making, master organizational growth, and build high-impact leadership networks.
            </p>
          </div>

          {/* Schedule & Time Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Event Schedule
            </h4>
            <div className="p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)]" />
                  <span>Day 1 Schedule: {event.date}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>09:00 AM - 05:00 PM</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)]" />
                  <span>Day 2 Schedule: 13 July 2026</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>10:00 AM - 04:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Venue & Location Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Venue & Location
            </h4>
            <div className="p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[oklch(0.48_0.1394_252.75)]">
                <Building className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-gray-900 text-sm">{event.venue}</p>
                <p className="text-gray-600">Avenue 4, RealSuccess Complex, Suite 302</p>
                <p className="text-gray-500 font-medium">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Attendees & Ticket Capacity Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Attendees & Capacity Analytics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Registered Attendees */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Users className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)]" />
                  <span>Registered</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">
                  {event.status === "Upcoming" || event.attendees === null ? "-" : event.attendees}
                </p>
              </div>

              {/* Total Tickets */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Ticket className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)]" />
                  <span>Total Tickets</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">{event.tickets}</p>
              </div>

              {/* Max Capacity */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Max Capacity</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">500</p>
              </div>
            </div>
          </div>

          {/* Event Access Code */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-[#F6F7F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-gray-200">
                <Key className="h-4 w-4 text-gray-700" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Mobile App Access Code
                </span>
                <p className="text-sm font-extrabold text-gray-900 font-mono">
                  RS-AUG-2026-001
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Copy className="h-3.5 w-3.5 text-gray-500" />
              Copy Code
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
          {event.status === "Upcoming" ? (
            <button
              onClick={handleEdit}
              className="px-5 py-2.5 rounded-full bg-blue-50 text-[oklch(0.48_0.1394_252.75)] hover:bg-blue-100 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              Edit Event
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
