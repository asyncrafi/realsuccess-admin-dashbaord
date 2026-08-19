"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAttendees } from "../hooks/use-attendees";
import { AttendeeDetailsModal } from "./attendee-details-modal";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";

export function AttendeeTable() {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    selectedAttendee,
    setSelectedAttendee,
    filteredAttendees,
    clearDateFilter,
    isDateFilterActive,
  } = useAttendees();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close Date Picker when clicking outside
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
          Attendees Management
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="w-56 md:w-64">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              rightIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="h-10 text-sm bg-white border-gray-200"
            />
          </div>

          {/* Status Filter */}
          <div className="w-44">
            <SelectDropdown
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="h-10 bg-white border-gray-200"
              options={[
                { label: "Status : All", value: "All" },
                { label: "Checked In", value: "Checked In" },
                { label: "Not Checked In", value: "Not Checked In" },
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

            {/* Date Range Popover Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Select Registration Date
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

          {/* Active Filter Clear Badge */}
          {isDateFilterActive && (
            <button
              onClick={clearDateFilter}
              className="h-8 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Clear Date</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[oklch(0.48_0.1394_252.75)] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Attendee</th>
                <th className="py-3.5 px-6">Event</th>
                <th className="py-3.5 px-6 text-center">Ticket</th>
                <th className="py-3.5 px-6 text-center">Registration</th>
                <th className="py-3.5 px-6 text-center">Access Code</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No attendees found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((att) => (
                  <tr
                    key={att.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Attendee Info (Avatar + Name + Email) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={att.avatar}
                            alt={att.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm leading-tight">
                            {att.name}
                          </span>
                          <span className="text-xs text-gray-400 font-normal">
                            {att.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Event Name */}
                    <td className="py-4 px-6 font-semibold text-gray-900 max-w-xs">
                      {att.eventName}
                    </td>

                    {/* Ticket Type */}
                    <td className="py-4 px-6 text-center font-bold">
                      <span
                        className={cn(
                          att.ticketType === "VIP"
                            ? "text-[oklch(0.48_0.1394_252.75)]"
                            : "text-gray-700 font-medium"
                        )}
                      >
                        {att.ticketType}
                      </span>
                    </td>

                    {/* Registration Status */}
                    <td className="py-4 px-6 text-center font-semibold whitespace-nowrap">
                      <span
                        className={cn(
                          att.registrationStatus === "Confirmed"
                            ? "text-emerald-500 font-semibold"
                            : "text-amber-500 font-semibold"
                        )}
                      >
                        {att.registrationStatus}
                      </span>
                    </td>

                    {/* Access Code */}
                    <td className="py-4 px-6 text-center font-medium font-mono text-gray-800">
                      {att.accessCode}
                    </td>

                    {/* Attendance Status */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "font-semibold text-xs",
                          att.status === "Checked In"
                            ? "text-emerald-500"
                            : "text-gray-400 font-medium"
                        )}
                      >
                        {att.status}
                      </span>
                    </td>

                    {/* Action Eye Details & Edit Button */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* View Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedAttendee(att)}
                          className="p-1.5 text-amber-500/90 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Attendee Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit & Confirm Status Button */}
                        <button
                          type="button"
                          onClick={() => {
                            att.registrationStatus = att.registrationStatus === "Confirmed" ? "Pending" : "Confirmed";
                            att.status = att.registrationStatus === "Confirmed" ? "Checked In" : "Not Checked In";
                            setSelectedAttendee({ ...att });
                          }}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Edit Attendee & Confirm Status"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
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

      {/* Attendee Details Modal */}
      <AttendeeDetailsModal
        attendee={selectedAttendee}
        onClose={() => setSelectedAttendee(null)}
      />
    </div>
  );
}
