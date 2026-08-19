"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { MOCK_EVENTS } from "../mock-data/events.data";
import { EventItem } from "../types/events.types";
import { CreateEventModal } from "./create-event-modal";
import { EventDetailsModal } from "./event-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";

// Helper to parse date string like "12 July 2026" to JS Date object
function parseEventDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function EventTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedDetailsEvent, setSelectedDetailsEvent] = useState<EventItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Date Range Filter States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
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

  // Filter events based on search, status & date range
  const filteredEvents = MOCK_EVENTS.filter((evt) => {
    const matchesSearch =
      evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      evt.status.toLowerCase() === statusFilter.toLowerCase();

    let matchesDateRange = true;
    const eventDate = parseEventDate(evt.date);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (eventDate < start) matchesDateRange = false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (eventDate > end) matchesDateRange = false;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const isDateFilterActive = Boolean(startDate || endDate);

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Event Management
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
                { label: "Active", value: "Active" },
                { label: "Upcoming", value: "Upcoming" },
                { label: "Completed", value: "Completed" },
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
                    Select Date Range
                  </span>
                  {isDateFilterActive && (
                    <button
                      onClick={handleClearDateFilter}
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
                  <Button
                    onClick={() => setShowDatePicker(false)}
                    className="w-full h-9 text-xs rounded-full"
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Active Filter Clear Badge */}
          {isDateFilterActive && (
            <button
              onClick={handleClearDateFilter}
              className="h-8 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Clear Date</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Create Event Action Button */}
          <Button
            type="button"
            onClick={() => router.push("/events?action=create", { scroll: false })}
            className="h-10 px-5 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[oklch(0.48_0.1394_252.75)] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Event</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Venue</th>
                <th className="py-3.5 px-6 text-center">Attendees</th>
                <th className="py-3.5 px-6 text-center">Tickets</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No events found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Event Name */}
                    <td className="py-4 px-6 font-semibold text-gray-900 max-w-xs">
                      {evt.name}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {evt.date}
                    </td>

                    {/* Venue */}
                    <td className="py-4 px-6 text-gray-600">
                      {evt.venue}
                    </td>

                    {/* Attendees (Blank "-" if Upcoming or null) */}
                    <td className="py-4 px-6 text-center font-medium">
                      {evt.status === "Upcoming" || evt.attendees === null
                        ? "-"
                        : evt.attendees}
                    </td>

                    {/* Tickets */}
                    <td className="py-4 px-6 text-center font-medium">
                      {evt.tickets}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-block font-semibold text-xs px-3 py-1 rounded-full",
                          evt.status === "Active" && "text-emerald-600 bg-emerald-50",
                          evt.status === "Upcoming" && "text-sky-500 bg-sky-50",
                          evt.status === "Completed" && "text-emerald-500 bg-emerald-50/60"
                        )}
                      >
                        {evt.status}
                      </span>
                    </td>

                    {/* Action Column (Eye View & Edit for Upcoming) */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Eye Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedDetailsEvent(evt)}
                          className="p-1.5 text-amber-500/90 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Event Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit Button (Only for Upcoming events) */}
                        {evt.status === "Upcoming" && (
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/events?action=edit&id=${evt.id}`, { scroll: false })
                            }
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Edit Event"
                          >
                            <Pencil className="h-3.5 w-3.5" />
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

      {/* Event Details View Modal Popup */}
      <EventDetailsModal
        event={selectedDetailsEvent}
        onClose={() => setSelectedDetailsEvent(null)}
      />

      {/* URL-Based Create / Edit Event Modal Popup */}
      <Suspense fallback={null}>
        <CreateEventModal />
      </Suspense>
    </div>
  );
}
