import { apiClient } from "@/lib/api-client";
import { PaymentStatus, TicketItem } from "../types/tickets.types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.ourrealsuccess.com/api").replace(/\/+$/, "");

export interface ScanValidationResult {
  success: boolean;
  valid: boolean;
  scan_status: "APPROVED" | "PAYMENT_NOT_CONFIRMED" | "ALREADY_USED" | "CANCELLED" | "INVALID_TICKET" | "ERROR";
  message: string;
  checked_in_at?: string | null;
  ticket?: any;
}

export const ticketsService = {
  async updatePaymentStatus(ticketId: string, paymentStatus: PaymentStatus): Promise<TicketItem | null> {
    const res: any = await apiClient(`/tickets/${ticketId}/payment-status/`, {
      method: "PATCH",
      data: { payment_status: paymentStatus },
    });
    return res?.data || null;
  },

  async scanTicket(qrToken: string, eventId?: string): Promise<ScanValidationResult> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/tickets/scan/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        qr_token: qrToken.trim(),
        ...(eventId ? { event_id: Number(eventId) } : {}),
      }),
    });

    const json = await response.json().catch(() => ({}));
    return {
      success: Boolean(json.success),
      valid: Boolean(json.valid),
      scan_status: json.scan_status || (response.ok ? "APPROVED" : "INVALID_TICKET"),
      message: json.message || (response.ok ? "Approved / Entry Allowed" : "Invalid Ticket"),
      checked_in_at: json.checked_in_at || null,
      ticket: json.ticket || null,
    };
  },
};
