"use client";

import { useState, useMemo } from "react";
import { MOCK_ATTENDEES } from "../mock-data/attendees.data";
import { AttendeeItem } from "../types/attendees.types";

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function useAttendees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeItem | null>(null);

  const filteredAttendees = useMemo(() => {
    return MOCK_ATTENDEES.filter((att) => {
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
  }, [searchTerm, statusFilter, startDate, endDate]);

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
