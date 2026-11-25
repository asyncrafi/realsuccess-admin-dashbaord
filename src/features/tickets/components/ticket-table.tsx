"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  QrCode,
} from "lucide-react";
import { useTickets } from "../hooks/use-tickets";
import { TicketDetailsModal } from "./ticket-details-modal";
import { ScanTicketModal } from "./scan-ticket-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";

export function TicketTable() {
  const {
    searchTerm,
    setSearchTerm,
    paymentFilter,
    setPaymentFilter,
    usageFilter,
    setUsageFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    selectedTicket,
    setSelectedTicket,
    filteredTickets,
    clearDateFilter,
    isDateFilterActive,
    updatePaymentStatus,
    updatingId,
  } = useTickets();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Tickets
        </h2>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="w-full sm:w-56 md:w-64">
            <Input
              placeholder="Search user, event, ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              rightIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="h-10 text-sm bg-white border-gray-200"
            />
          </div>

          {/* Payment Status Filter */}
          <div className="w-[calc(50%-5px)] sm:w-48">
            <SelectDropdown
              value={paymentFilter}
              onChange={(val) => setPaymentFilter(val)}
              className="h-10 bg-white border-gray-200"
              options={[
                { label: "Payment : All", value: "All" },
                { label: "Pending Payment", value: "Pending Payment" },
                { label: "Paid", value: "Paid" },
                { label: "Payment Rejected", value: "Payment Rejected" },
              ]}
            />
          </div>

          {/* Ticket Usage Filter */}
          <div className="w-[calc(50%-5px)] sm:w-40">
            <SelectDropdown
              value={usageFilter}
              onChange={(val) => setUsageFilter(val)}
              className="h-10 bg-white border-gray-200"
              options={[
                { label: "Usage : All", value: "All" },
                { label: "Unused", value: "Unused" },
                { label: "Used", value: "Used" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />
          </div>

          {/* Date Range Filter Button & Popover */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={cn(
                "h-10 px-4 rounded-full border border-gray-200 bg-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer",
                isDateFilterActive
                  ? "border-[oklch(0.48_0.1394_252.75)] text-[oklch(0.48_0.1394_252.75)] bg-blue-50/50"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span>
                {isDateFilterActive
                  ? `${startDate || "Start"} to ${endDate || "End"}`
                  : "Filter by date range"}
              </span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Select Issue Date Range
                  </span>
                  {isDateFilterActive && (
                    <button
                      onClick={clearDateFilter}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="w-full h-9 text-xs rounded-full bg-[oklch(0.48_0.1394_252.75)] text-white font-semibold hover:bg-[oklch(0.40_0.1394_252.75)] transition-colors cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {isDateFilterActive && (
            <button
              onClick={clearDateFilter}
              className="h-8 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Clear Date</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Scan Ticket Entrance Button */}
          <Button
            type="button"
            onClick={() => setShowScanModal(true)}
            className="w-full sm:w-auto h-10 px-5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <QrCode className="h-4 w-4" />
            Scan Ticket
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[oklch(0.48_0.1394_252.75)] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Ticket ID</th>
                <th className="py-3.5 px-6">Attendee</th>
                <th className="py-3.5 px-6">Event</th>
                <th className="py-3.5 px-6 text-center">Price</th>
                <th className="py-3.5 px-6 text-center">Payment Status</th>
                <th className="py-3.5 px-6 text-center">Ticket Status</th>
                <th className="py-3.5 px-6 text-center">Issue Date</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 font-medium">
                    No tickets found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((tkt) => (
                  <tr
                    key={tkt.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Ticket ID */}
                    <td className="py-4 px-6 font-mono text-gray-700 text-sm whitespace-nowrap">
                      {tkt.ticketId}
                    </td>

                    {/* Attendee Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={tkt.attendeeAvatar || "/fallback_avatar.png"}
                            alt={tkt.attendeeName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm leading-tight">
                            {tkt.attendeeName}
                          </span>
                          <span className="text-xs text-gray-400 font-normal">
                            {tkt.attendeeEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Event Name */}
                    <td className="py-4 px-6 font-semibold text-gray-900 max-w-xs">
                      {tkt.eventName}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-center font-semibold text-gray-800 whitespace-nowrap">
                      {tkt.price || "Free"}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-block font-semibold text-xs px-3 py-1 rounded-full",
                          tkt.paymentStatus === "Paid" && "text-emerald-700 bg-emerald-50",
                          tkt.paymentStatus === "Pending Payment" && "text-amber-700 bg-amber-50",
                          tkt.paymentStatus === "Payment Rejected" && "text-red-700 bg-red-50"
                        )}
                      >
                        {tkt.paymentStatus}
                      </span>
                    </td>

                    {/* Ticket Usage Status */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-block font-semibold text-xs px-3 py-1 rounded-full",
                          tkt.ticketStatus === "Used" && "text-emerald-700 bg-emerald-50",
                          tkt.ticketStatus === "Unused" && "text-blue-700 bg-blue-50",
                          tkt.ticketStatus === "Cancelled" && "text-red-700 bg-red-50"
                        )}
                      >
                        {tkt.ticketStatus}
                      </span>
                    </td>

                    {/* Issue Date */}
                    <td className="py-4 px-6 text-center font-medium text-gray-600 text-sm whitespace-nowrap">
                      {tkt.issueDate}
                    </td>

                    {/* Action View & Quick Mark Paid */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(tkt)}
                          className="p-1.5 text-amber-500/90 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Ticket Details & Payment Controls"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {tkt.paymentStatus !== "Paid" && (
                          <button
                            type="button"
                            disabled={updatingId === tkt.id}
                            onClick={() => updatePaymentStatus(tkt.id, "Paid")}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center disabled:opacity-40"
                            title="Verify & Mark Payment as Paid"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
              currentPage === page
                ? "bg-[oklch(0.48_0.1394_252.75)] text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        ))}
        <span className="text-gray-400 px-1">...</span>
        <button
          onClick={() => setCurrentPage(30)}
          className={cn(
            "h-9 w-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
            currentPage === 30
              ? "bg-[oklch(0.48_0.1394_252.75)] text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          30
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.min(30, p + 1))}
          className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdatePaymentStatus={updatePaymentStatus}
        updating={updatingId === selectedTicket?.id}
      />

      {/* Entrance Ticket QR Scanner Modal */}
      <ScanTicketModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
      />
    </div>
  );
}
