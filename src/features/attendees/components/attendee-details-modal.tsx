"use client";

import Image from "next/image";
import { X, Mail, Phone, Calendar, Ticket, Key, CheckCircle, Clock, ShieldCheck } from "lucide-react";
import { AttendeeItem } from "../types/attendees.types";
import { cn } from "@/lib/utils";

interface AttendeeDetailsModalProps {
  attendee: AttendeeItem | null;
  onClose: () => void;
}

export function AttendeeDetailsModal({ attendee, onClose }: AttendeeDetailsModalProps) {
  if (!attendee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <h3 className="text-lg font-bold text-gray-900">Attendee Information</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-left overflow-y-auto max-h-[75vh]">
          {/* Profile Card Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-xs">
              <Image
                src={attendee.avatar}
                alt={attendee.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-gray-900">{attendee.name}</h4>
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                    attendee.status === "Checked In"
                      ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                      : "text-gray-500 bg-gray-100 border border-gray-200"
                  )}
                >
                  {attendee.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{attendee.email}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Event Name */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Registered Event</span>
              <p className="font-bold text-gray-900 text-sm">{attendee.eventName}</p>
            </div>

            {/* Ticket Type */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ticket Tier</span>
              <p
                className={cn(
                  "font-extrabold text-sm",
                  attendee.ticketType === "VIP" ? "text-blue-600" : "text-gray-700"
                )}
              >
                {attendee.ticketType} Pass
              </p>
            </div>

            {/* Registration Status */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Registration</span>
              <p
                className={cn(
                  "font-bold text-sm",
                  attendee.registrationStatus === "Confirmed"
                    ? "text-emerald-600"
                    : "text-amber-500"
                )}
              >
                {attendee.registrationStatus}
              </p>
            </div>

            {/* Registered Date */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Registered Date</span>
              <p className="font-semibold text-gray-800">{attendee.registeredAt}</p>
            </div>

            {/* Phone Number */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
              <p className="font-semibold text-gray-800">{attendee.phone || "+880 1712-345678"}</p>
            </div>
          </div>

          {/* Access Code Box */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-[#F6F7F9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Access Code</span>
                <p className="text-sm font-extrabold text-gray-900 font-mono">{attendee.accessCode}</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Valid Badge
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex justify-end">
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
