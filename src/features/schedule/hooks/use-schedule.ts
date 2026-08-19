"use client";

import { useState, useMemo } from "react";
import { MOCK_SCHEDULE } from "../mock-data/schedule.data";
import { ScheduleItem } from "../types/schedule.types";

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function useSchedule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<ScheduleItem | null>(null);

  const filteredSchedule = useMemo(() => {
    return MOCK_SCHEDULE.filter((sch) => {
      // Search match
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        sch.sessionTitle.toLowerCase().includes(term) ||
        sch.speakerName.toLowerCase().includes(term) ||
        sch.venue.toLowerCase().includes(term) ||
        sch.type.toLowerCase().includes(term);

      // Status match
      const matchesStatus =
        statusFilter === "All" ||
        sch.status.toLowerCase() === statusFilter.toLowerCase();

      // Date range match
      let matchesDate = true;
      const schDate = parseDate(sch.date);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (schDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (schDate > end) matchesDate = false;
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
    selectedSession,
    setSelectedSession,
    filteredSchedule,
    clearDateFilter,
    isDateFilterActive: Boolean(startDate || endDate),
  };
}
