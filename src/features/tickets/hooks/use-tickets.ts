"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PaymentStatus, TicketItem } from "../types/tickets.types";
import { ticketsService } from "../services/tickets.service";
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

function mapApiTicket(t: any): TicketItem {
  return {
    id: String(t.id),
    ticketId: t.ticketId || t.ticket_id || `TKT-${t.id}`,
    eventId: t.event ? String(t.event) : undefined,
    attendeeName: t.attendeeName || t.attendee_name || "",
    attendeeEmail: t.attendeeEmail || t.attendee_email || "",
    attendeeAvatar: t.attendee_avatar || "/fallback_avatar.png",
    eventName: t.eventName || "RealSuccess Event",
    ticketType: t.ticketType || t.ticket_type || "General",
    paymentStatus: t.paymentStatus || t.payment_status || "Pending Payment",
    ticketStatus: t.ticketStatus || t.ticket_status || "Unused",
    checkInStatus: t.checkInStatus || t.check_in_status || "Not Checked In",
    checkedInAt: t.checked_in_at || null,
    checkedInBy: t.checkedInBy || null,
    issueDate: t.issueDate || t.issue_date || "",
    status: t.status || t.registration_status || "Pending",
    price: t.price || (t.isFree ? "Free" : "$0.00"),
    isFree: Boolean(t.isFree),
    qrValidationToken: t.qrValidationToken || t.qr_validation_token || t.qr_code_data || "",
  };
}

export function useTickets() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [usageFilter, setUsageFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const res: any = await apiClient("/tickets/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items)) {
        const mapped = items.map(mapApiTicket);
        setTickets(mapped);
        setSelectedTicket((prev) => {
          if (!prev) return null;
          return mapped.find((m) => m.id === prev.id) || prev;
        });
      }
    } catch {
      // keep existing state on transient error
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    const handleUpdated = () => fetchTickets();
    window.addEventListener("ticketsUpdated", handleUpdated);
    return () => window.removeEventListener("ticketsUpdated", handleUpdated);
  }, [fetchTickets]);

  const updatePaymentStatus = async (ticketId: string, newStatus: PaymentStatus) => {
    setUpdatingId(ticketId);
    try {
      const updated = await ticketsService.updatePaymentStatus(ticketId, newStatus);
      if (updated) {
        const mapped = mapApiTicket(updated);
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? mapped : t)));
        setSelectedTicket((prev) => (prev && prev.id === ticketId ? mapped : prev));
        toast.success(`Payment status updated to ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((tkt) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        tkt.ticketId.toLowerCase().includes(term) ||
        tkt.attendeeName.toLowerCase().includes(term) ||
        tkt.attendeeEmail.toLowerCase().includes(term) ||
        tkt.eventName.toLowerCase().includes(term);

      const matchesPayment =
        paymentFilter === "All" ||
        tkt.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

      const matchesUsage =
        usageFilter === "All" ||
        tkt.ticketStatus.toLowerCase() === usageFilter.toLowerCase();

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

      return matchesSearch && matchesPayment && matchesUsage && matchesDate;
    });
  }, [tickets, searchTerm, paymentFilter, usageFilter, startDate, endDate]);

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return {
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
    isDateFilterActive: Boolean(startDate || endDate),
    updatePaymentStatus,
    updatingId,
    refreshTickets: fetchTickets,
  };
}
