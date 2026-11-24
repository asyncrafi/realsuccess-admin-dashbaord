"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_TICKETS } from "../mock-data/tickets.data";
import { TicketItem } from "../types/tickets.types";
import { apiClient } from "@/lib/api-client";

function parseIssueDate(dateStr: string): Date {
  const parts = dateStr.split(".");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

export function useTickets() {
  const [tickets, setTickets] = useState<TicketItem[]>(MOCK_TICKETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  const fetchTickets = async () => {
    try {
      const res: any = await apiClient("/tickets/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items)) {
        const mapped: TicketItem[] = items.map((t: any) => ({
          id: String(t.id),
          ticketId: t.ticketId || t.ticket_id || `TKT-${t.id}`,
          attendeeName: t.attendeeName || t.attendee_name || "",
          attendeeEmail: t.attendeeEmail || t.attendee_email || "",
          attendeeAvatar: t.attendee_avatar || "/fallback_avatar.png",
          eventName: t.eventName || "RealSuccess Event",
          ticketType: t.ticketType || t.ticket_type || "General",
          checkInStatus: t.checkInStatus || t.check_in_status || "Not Checked In",
          issueDate: t.issueDate || t.issue_date || "",
          status: t.status || t.registration_status || "Confirmed",
        }));
        setTickets(mapped);
      }
    } catch {
      setTickets([...MOCK_TICKETS]);
    }
  };

  useEffect(() => {
    fetchTickets();
    const handleUpdated = () => fetchTickets();
    window.addEventListener("ticketsUpdated", handleUpdated);
    return () => window.removeEventListener("ticketsUpdated", handleUpdated);
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((tkt) => {
      // Search match
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        tkt.ticketId.toLowerCase().includes(term) ||
        tkt.attendeeName.toLowerCase().includes(term) ||
        tkt.attendeeEmail.toLowerCase().includes(term) ||
        tkt.eventName.toLowerCase().includes(term);

      // Status match
      const matchesStatus =
        statusFilter === "All" ||
        tkt.status.toLowerCase() === statusFilter.toLowerCase();

      // Date range match
      let matchesDate = true;
      const tktDate = parseIssueDate(tkt.issueDate);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (tktDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (tktDate > end) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [tickets, searchTerm, statusFilter, startDate, endDate]);

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
    selectedTicket,
    setSelectedTicket,
    filteredTickets,
    clearDateFilter,
    isDateFilterActive: Boolean(startDate || endDate),
  };
}
