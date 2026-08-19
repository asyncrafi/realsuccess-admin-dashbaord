"use client";

import { X, FileText, Video as VideoIcon, Download, Sparkles, Calendar, Tag, HardDrive } from "lucide-react";
import { ResourceItem } from "../types/resources.types";
import { cn } from "@/lib/utils";

interface ResourceDetailsModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export function ResourceDetailsModal({
  resource,
  onClose,
}: ResourceDetailsModalProps) {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Resource Overview</h3>
            <span
              className={cn(
                "inline-block font-semibold text-xs px-2.5 py-0.5 rounded-full",
                resource.status === "Published"
                  ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                  : "text-amber-500 bg-amber-50 border border-amber-200"
              )}
            >
              {resource.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 text-left overflow-y-auto">
          {/* Top Resource Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[oklch(0.48_0.1394_252.75)] to-blue-600 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100 bg-white/20 px-2.5 py-0.5 rounded-full">
                {resource.category}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-white text-blue-900 px-2.5 py-0.5 rounded-full">
                {resource.type}
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">{resource.title}</h2>
          </div>

          {/* Quick Meta Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Target Event</span>
              <p className="font-bold text-gray-900">{resource.eventName}</p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Published Date</span>
              <p className="font-semibold text-gray-800">{resource.date}</p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">File Size</span>
              <p className="font-bold text-gray-900">{resource.fileSize || "N/A"}</p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Resource Type</span>
              <p className="font-bold text-gray-900">{resource.type}</p>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="space-y-1.5 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Resource Description
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                {resource.description}
              </p>
            </div>
          )}

          {/* Download / View Button */}
          <div className="pt-2">
            <button className="w-full h-12 rounded-full bg-[oklch(0.48_0.1394_252.75)] hover:bg-[oklch(0.40_0.1394_252.75)] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer">
              <Download className="h-4 w-4" />
              <span>Download Attachment Asset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
