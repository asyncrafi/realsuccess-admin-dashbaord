"use client";

import { X, Clock, Calendar, MapPin, User, Tag, Info, CheckCircle } from "lucide-react";
import { ScheduleItem } from "../types/schedule.types";
import { cn } from "@/lib/utils";

interface ScheduleDetailsModalProps {
  session: ScheduleItem | null;
  onClose: () => void;
}

export function ScheduleDetailsModal({ session, onClose }: ScheduleDetailsModalProps) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Session Details</h3>
            <span
              className={cn(
                "inline-block font-semibold text-xs px-2.5 py-0.5 rounded-full",
                session.status === "Published"
                  ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                  : "text-amber-500 bg-amber-50 border border-amber-200"
              )}
            >
              {session.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-left overflow-y-auto max-h-[75vh]">
          {/* Session Title & Category */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[oklch(0.48_0.1394_252.75)] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                <Tag className="h-3 w-3" /> {session.type}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              {session.sessionTitle}
            </h2>
          </div>

          {/* Description */}
          {session.description && (
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                <Info className="h-3.5 w-3.5 text-gray-400" />
                <span>Session Overview</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {session.description}
              </p>
            </div>
          )}

          {/* Grid Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Time */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)] mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Start Time</span>
                <p className="font-bold text-gray-900 text-sm">{session.time}</p>
              </div>
            </div>

            {/* Date */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)] mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Scheduled Date</span>
                <p className="font-bold text-gray-900 text-sm">{session.date}</p>
              </div>
            </div>

            {/* Speaker */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
              <User className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)] mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Featured Speaker</span>
                <p className="font-bold text-gray-900 text-sm">{session.speakerName}</p>
                {session.speakerRole && (
                  <p className="text-[11px] text-gray-500">{session.speakerRole}</p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)] mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Location / Venue</span>
                <p className="font-bold text-gray-900 text-sm">{session.venue}</p>
              </div>
            </div>
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
