"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  X,
  Calendar,
  Ticket,
  Users,
  Key,
  CheckCircle,
  Tag,
  Info,
  Pencil,
  Copy,
  Building,
  Download,
  DollarSign,
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const qrValue = event
    ? event.qrRegistrationToken || event.accessCode || `EVT-${event.id}`
    : "";

  useEffect(() => {
    if (!event || !qrValue) return;
    QRCode.toDataURL(qrValue, {
      width: 512,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR generation failed:", err));
  }, [event, qrValue]);

  if (!event) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(event.accessCode || "RS-AUG-2026-001");
    toast.success("Access code copied to clipboard!");
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const downloadLink = document.createElement("a");
    downloadLink.download = `${event.name.replace(/\s+/g, "_")}_Registration_QR.png`;
    downloadLink.href = qrDataUrl;
    downloadLink.click();
    toast.success("Event QR Code downloaded!");
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
            <span
              className={cn(
                "inline-flex items-center gap-1 font-bold text-xs px-3 py-1 rounded-full",
                event.isFree
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                  : "text-blue-700 bg-blue-50 border border-blue-200"
              )}
            >
              <DollarSign className="h-3 w-3" />
              {event.priceDisplay || (event.isFree ? "Free" : `$${event.price}`)}
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
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[oklch(0.48_0.1394_252.75)] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                <Tag className="h-3 w-3" /> RealSuccess Event
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
              <span>Event Overview</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {event.description || "Leadership & professional growth event organized by RealSuccess."}
            </p>
          </div>

          {/* Event Registration QR Code Section */}
          <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/30 flex flex-col sm:flex-row items-center gap-5">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs flex-shrink-0">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Event Registration QR Code"
                  className="w-32 h-32 rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-xs text-gray-400">
                  Loading QR...
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-bold text-gray-900">
                Event Registration QR Code
              </h4>
              <p className="text-xs text-gray-600">
                Attendees scan this QR code using the mobile app to open this event, view its price, and register for a ticket.
              </p>
              <p className="text-[11px] font-mono text-gray-500 break-all">
                Token: {qrValue}
              </p>
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={!qrDataUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[oklch(0.48_0.1394_252.75)] hover:bg-[oklch(0.40_0.1394_252.75)] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download QR Code
              </button>
            </div>
          </div>

          {/* Schedule & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[oklch(0.48_0.1394_252.75)]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="text-gray-400 font-bold uppercase text-[10px]">Event Date</p>
                <p className="font-bold text-gray-900 text-sm">{event.date}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200/80 bg-white shadow-xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[oklch(0.48_0.1394_252.75)]">
                <Building className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="text-gray-400 font-bold uppercase text-[10px]">Venue</p>
                <p className="font-bold text-gray-900 text-sm">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Attendees & Ticket Capacity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)]" />
                <span>Checked In</span>
              </div>
              <p className="text-xl font-extrabold text-gray-900">
                {event.attendees ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Ticket className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)]" />
                <span>Total Tickets</span>
              </div>
              <p className="text-xl font-extrabold text-gray-900">{event.tickets}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Ticket Price</span>
              </div>
              <p className="text-xl font-extrabold text-gray-900">
                {event.priceDisplay || (event.isFree ? "Free" : `$${event.price}`)}
              </p>
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
                  {event.accessCode || "RS-AUG-2026-001"}
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
          <button
            onClick={handleEdit}
            className="px-5 py-2.5 rounded-full bg-blue-50 text-[oklch(0.48_0.1394_252.75)] hover:bg-blue-100 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            Edit Event
          </button>

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
