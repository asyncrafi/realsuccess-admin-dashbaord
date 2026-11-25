export type PaymentStatus = "Pending Payment" | "Paid" | "Payment Rejected";
export type TicketUsageStatus = "Unused" | "Used" | "Cancelled";
export type TicketStatus = "Confirmed" | "Pending" | "Cancelled";
export type CheckInStatus = "Checked In" | "Not Checked In";
export type TicketTier = "VIP" | "General" | "Executive";

export interface TicketItem {
  id: string;
  ticketId: string;
  eventId?: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeAvatar: string;
  eventName: string;
  ticketType: TicketTier;
  paymentStatus: PaymentStatus;
  ticketStatus: TicketUsageStatus;
  checkInStatus: CheckInStatus;
  checkedInAt?: string | null;
  checkedInBy?: string | null;
  issueDate: string;
  status: TicketStatus;
  price?: string;
  isFree?: boolean;
  qrValidationToken?: string;
}

export interface TicketFilterOptions {
  searchTerm?: string;
  status?: string;
  paymentStatus?: string;
  ticketStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
