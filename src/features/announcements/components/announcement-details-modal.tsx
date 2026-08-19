"use client";

import { X, Calendar, Clock, MapPin, Tag, User, FileText, Download, Sparkles, CheckCircle } from "lucide-react";
import { AnnouncementItem } from "../types/announcements.types";
import { cn } from "@/lib/utils";

interface AnnouncementDetailsModalProps {
  announcement: AnnouncementItem | null;
  onClose: () => void;
}

export function AnnouncementDetailsModal({
  announcement,
  onClose,
}: AnnouncementDetailsModalProps) {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col my-6 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Announcement Preview</h3>
            <span
              className={cn(
                "inline-block font-semibold text-xs px-2.5 py-0.5 rounded-full",
                announcement.status === "Published"
                  ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                  : "text-amber-500 bg-amber-50 border border-amber-200"
              )}
            >
              {announcement.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content (Styled like Mobile App View) */}
        <div className="p-6 md:p-8 space-y-6 text-left overflow-y-auto">
          {/* Top Banner Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[oklch(0.48_0.1394_252.75)] to-blue-600 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100 bg-white/20 px-2.5 py-0.5 rounded-full">
                {announcement.category || "Announcement"}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full",
                  announcement.priority === "Important"
                    ? "bg-red-500 text-white"
                    : "bg-white/20 text-white"
                )}
              >
                {announcement.priority}
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">{announcement.title}</h2>
          </div>

          {/* Quick Meta Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Target Event</span>
              <p className="font-bold text-gray-900">{announcement.eventName}</p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Published By</span>
              <p className="font-bold text-gray-900">{announcement.publishedBy}</p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Published Date</span>
              <p className="font-semibold text-gray-800">{announcement.date}</p>
            </div>
          </div>

          {/* Announcement Message Body */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Announcement Message Details
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed font-normal bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
              {announcement.content || "No message content specified for this announcement."}
            </p>
          </div>

          {/* Quick Key Takeaways */}
          {(announcement.takeawayTime || announcement.takeawayVenue) && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[oklch(0.48_0.1394_252.75)] uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Quick Key Takeaways</span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {announcement.takeawayTime && (
                  <span className="px-3 py-1 rounded-full bg-white text-gray-800 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    Time: {announcement.takeawayTime}
                  </span>
                )}
                {announcement.takeawayVenue && (
                  <span className="px-3 py-1 rounded-full bg-white text-gray-800 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    Venue: {announcement.takeawayVenue}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Event Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Event Attachments ({announcement.attachments.length})
              </h4>
              <div className="space-y-2">
                {announcement.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-red-50 text-red-500">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <p className="font-bold text-gray-900">{att.name}</p>
                        <p className="text-gray-400">{att.type} • {att.size}</p>
                      </div>
                    </div>

                    <button className="px-3 py-1 rounded-full bg-blue-50 text-[oklch(0.48_0.1394_252.75)] hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
