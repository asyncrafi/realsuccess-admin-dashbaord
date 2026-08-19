"use client";

import { useState, useMemo } from "react";
import { MOCK_ANNOUNCEMENTS } from "../mock-data/announcements.data";
import { AnnouncementItem } from "../types/announcements.types";

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function useAnnouncements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const filteredAnnouncements = useMemo(() => {
    return MOCK_ANNOUNCEMENTS.filter((anc) => {
      // Search match
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        anc.title.toLowerCase().includes(term) ||
        anc.eventName.toLowerCase().includes(term) ||
        anc.publishedBy.toLowerCase().includes(term) ||
        (anc.category && anc.category.toLowerCase().includes(term));

      // Status match
      const matchesStatus =
        statusFilter === "All" ||
        anc.status.toLowerCase() === statusFilter.toLowerCase();

      // Date range match
      let matchesDate = true;
      const ancDate = parseDate(anc.date);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (ancDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (ancDate > end) matchesDate = false;
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
    selectedAnnouncement,
    setSelectedAnnouncement,
    filteredAnnouncements,
    clearDateFilter,
    isDateFilterActive: Boolean(startDate || endDate),
  };
}
