"use client";

import Image from "next/image";
import { X, Mail, Ticket, Calendar, CheckCircle, ShieldCheck, MapPin, DollarSign } from "lucide-react";
import { TicketItem } from "../types/tickets.types";
import { cn } from "@/lib/utils";

interface TicketDetailsModalProps {
  ticket: TicketItem | null;
  onClose: () => void;
}

export function TicketDetailsModal({ ticket, onClose }: TicketDetailsModalProps) {
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
        <div className="p-6 space-y-6 text-left overflow-y-auto max-h-[75vh]">
          {/* Attendee Profile Card Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-xs">
              <Image
                src={ticket.attendeeAvatar}
                alt={ticket.attendeeName}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-gray-900">{ticket.attendeeName}</h4>
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                    ticket.status === "Confirmed"
                      ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                      : "text-amber-500 bg-amber-50 border border-amber-200"
                  )}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{ticket.attendeeEmail}</span>
              </div>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Event Name */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Event Name</span>
              <p className="font-bold text-gray-900 text-sm">{ticket.eventName}</p>
            </div>

            {/* Ticket Tier */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ticket Tier</span>
              <p
                className={cn(
                  "font-extrabold text-sm",
                  ticket.ticketType === "VIP" ? "text-blue-600" : "text-gray-700"
                )}
              >
                {ticket.ticketType} Pass
              </p>
            </div>

            {/* Price */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ticket Price</span>
              <p className="font-extrabold text-gray-900 text-sm">{ticket.price || "$250.00"}</p>
            </div>

            {/* Check-In Status */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Check-In Status</span>
              <p
                className={cn(
                  "font-bold text-sm",
                  ticket.checkInStatus === "Checked In"
                    ? "text-emerald-600"
                    : "text-gray-400"
                )}
              >
                {ticket.checkInStatus}
              </p>
            </div>

            {/* Issue Date */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Issue Date</span>
              <p className="font-semibold text-gray-800">{ticket.issueDate}</p>
            </div>
          </div>

          {/* Digital Ticket Pass Stub */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-[oklch(0.48_0.1394_252.75)]/40 bg-blue-50/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Seat</span>
              <p className="text-base font-extrabold text-gray-900 font-mono">{ticket.seatNo || "A-12"}</p>
            </div>

            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="h-4 w-4" /> Verified Ticket
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
