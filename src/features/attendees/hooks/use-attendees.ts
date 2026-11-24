"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_ATTENDEES } from "../mock-data/attendees.data";
import { AttendeeItem } from "../types/attendees.types";
import { apiClient } from "@/lib/api-client";

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function useAttendees() {
  const [attendees, setAttendees] = useState<AttendeeItem[]>(MOCK_ATTENDEES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeItem | null>(null);

  const fetchAttendees = async () => {
    try {
      const res: any = await apiClient("/tickets/attendees/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items)) {
        const mapped: AttendeeItem[] = items.map((a: any) => ({
          id: String(a.id),
          name: a.name || a.attendee_name || "",
          email: a.email || a.attendee_email || "",
          phone: a.phone || a.attendee_phone || "",
          avatar: a.avatar || "/fallback_avatar.png",
          eventName: a.eventName || "RealSuccess Event",
          ticketType: a.ticketType || a.ticket_type || "General",
          registrationStatus: a.registrationStatus || a.registration_status || "Confirmed",
          accessCode: a.accessCode || a.access_code || "",
          status: a.status || a.check_in_status || "Not Checked In",
          registeredAt: a.registeredAt || (a.created_at ? new Date(a.created_at).toLocaleDateString() : ""),
        }));
        setAttendees(mapped);
      }
    } catch {
      setAttendees([...MOCK_ATTENDEES]);
    }
  };

  useEffect(() => {
    fetchAttendees();
    const handleUpdated = () => fetchAttendees();
    window.addEventListener("attendeesUpdated", handleUpdated);
    return () => window.removeEventListener("attendeesUpdated", handleUpdated);
  }, []);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((att) => {
      // Search match
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        att.name.toLowerCase().includes(term) ||
        att.email.toLowerCase().includes(term) ||
        att.eventName.toLowerCase().includes(term) ||
        att.accessCode.toLowerCase().includes(term);

      // Status match
      const matchesStatus =
        statusFilter === "All" ||
        att.status.toLowerCase() === statusFilter.toLowerCase();

      // Date range match
      let matchesDate = true;
      const attDate = parseDate(att.registeredAt);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (attDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (attDate > end) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendees, searchTerm, statusFilter, startDate, endDate]);

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return {
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
    isDateFilterActive: Boolean(startDate || endDate),
  };
}
