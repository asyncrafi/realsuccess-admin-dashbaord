"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_SCHEDULE } from "../mock-data/schedule.data";
import { ScheduleItem } from "../types/schedule.types";
import { apiClient } from "@/lib/api-client";

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function useSchedule() {
  const [sessions, setSessions] = useState<ScheduleItem[]>(MOCK_SCHEDULE);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<ScheduleItem | null>(null);

  const fetchSchedule = async () => {
    try {
      const res: any = await apiClient("/schedule/sessions/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items)) {
        const mapped: ScheduleItem[] = items.map((s: any) => ({
          id: String(s.id),
          sessionTitle: s.sessionTitle || s.session_title,
          speakerName: s.speakerName || "",
          speakerRole: s.speakerRole || "",
          time: s.time || "09:00 AM",
          date: s.date || "",
          venue: s.venue || "Main Auditorium",
          type: s.type || "Keynote",
          status: s.status || "Published",
          description: s.description || "",
        }));
        setSessions(mapped);
      }
    } catch {
      setSessions([...MOCK_SCHEDULE]);
    }
  };

  useEffect(() => {
    fetchSchedule();
    const handleUpdated = () => fetchSchedule();
    window.addEventListener("scheduleUpdated", handleUpdated);
    return () => window.removeEventListener("scheduleUpdated", handleUpdated);
  }, []);

  const filteredSchedule = useMemo(() => {
    return sessions.filter((sch) => {
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
  }, [sessions, searchTerm, statusFilter, startDate, endDate]);

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
