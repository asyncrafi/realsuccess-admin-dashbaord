"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { X, Mail, ShieldCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PaymentStatus, TicketItem } from "../types/tickets.types";
import { cn } from "@/lib/utils";

interface TicketDetailsModalProps {
  ticket: TicketItem | null;
  onClose: () => void;
  onUpdatePaymentStatus?: (ticketId: string, status: PaymentStatus) => Promise<void>;
  updating?: boolean;
}

export function TicketDetailsModal({
  ticket,
  onClose,
  onUpdatePaymentStatus,
  updating = false,
}: TicketDetailsModalProps) {
  const [ticketQrUrl, setTicketQrUrl] = useState<string>("");

  const qrValue = ticket ? ticket.qrValidationToken || ticket.ticketId : "";

  useEffect(() => {
    if (!ticket || !qrValue) return;
    QRCode.toDataURL(qrValue, {
      width: 300,
      margin: 2,
      color: { dark: "#111827", light: "#FFFFFF" },
    })
      .then((url) => setTicketQrUrl(url))
      .catch(() => {});
  }, [ticket, qrValue]);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Ticket Details</h3>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[oklch(0.48_0.1394_252.75)]">
              {ticket.ticketId}
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
        <div className="p-6 space-y-5 text-left overflow-y-auto max-h-[75vh]">
          {/* Attendee Profile Card Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-xs flex-shrink-0">
              <Image
                src={ticket.attendeeAvatar || "/fallback_avatar.png"}
                alt={ticket.attendeeName}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-bold text-gray-900 truncate">{ticket.attendeeName}</h4>
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap",
                    ticket.paymentStatus === "Paid"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : ticket.paymentStatus === "Payment Rejected"
                      ? "text-red-700 bg-red-50 border border-red-200"
                      : "text-amber-700 bg-amber-50 border border-amber-200"
                  )}
                >
                  {ticket.paymentStatus}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{ticket.attendeeEmail}</span>
              </div>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Event Name</span>
              <p className="font-bold text-gray-900 text-sm">{ticket.eventName}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Payment Status</span>
              <p
                className={cn(
                  "font-extrabold text-sm",
                  ticket.paymentStatus === "Paid"
                    ? "text-emerald-600"
                    : ticket.paymentStatus === "Payment Rejected"
                    ? "text-red-600"
                    : "text-amber-600"
                )}
              >
                {ticket.paymentStatus}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ticket Usage Status</span>
              <p
                className={cn(
                  "font-extrabold text-sm",
                  ticket.ticketStatus === "Used"
                    ? "text-emerald-600"
                    : ticket.ticketStatus === "Cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
                )}
              >
                {ticket.ticketStatus}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ticket Price</span>
              <p className="font-extrabold text-gray-900 text-sm">{ticket.price || "Free"}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Issue Date</span>
              <p className="font-semibold text-gray-800">{ticket.issueDate}</p>
            </div>

            {ticket.checkedInAt && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Check-In Details</span>
                <p className="font-semibold text-emerald-900">
                  Checked in on {new Date(ticket.checkedInAt).toLocaleString()}
                  {ticket.checkedInBy ? ` by ${ticket.checkedInBy}` : ""}
                </p>
              </div>
            )}
          </div>

          {/* Individual Ticket Entry QR */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-[oklch(0.48_0.1394_252.75)]/30 bg-blue-50/20 flex items-center gap-4">
            {ticketQrUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ticketQrUrl}
                alt="Ticket QR"
                className="w-20 h-20 rounded-xl border border-gray-200 bg-white p-1 flex-shrink-0"
              />
            )}
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.48_0.1394_252.75)]" />
                Individual Entry QR Token
              </span>
              <p className="text-xs font-mono font-bold text-gray-900 break-all">{qrValue}</p>
              <p className="text-[11px] text-gray-500">Open seating — no seat assignment required.</p>
            </div>
          </div>

          {/* Manual Payment Verification Controls */}
          {onUpdatePaymentStatus && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Manual Payment Verification
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={updating || ticket.paymentStatus === "Paid"}
                  onClick={() => onUpdatePaymentStatus(ticket.id, "Paid")}
                  className="px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark as Paid
                </button>
                <button
                  type="button"
                  disabled={updating || ticket.paymentStatus === "Pending Payment"}
                  onClick={() => onUpdatePaymentStatus(ticket.id, "Pending Payment")}
                  className="px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Set Pending
                </button>
                <button
                  type="button"
                  disabled={updating || ticket.paymentStatus === "Payment Rejected"}
                  onClick={() => onUpdatePaymentStatus(ticket.id, "Payment Rejected")}
                  className="px-3.5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Payment
                </button>
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
