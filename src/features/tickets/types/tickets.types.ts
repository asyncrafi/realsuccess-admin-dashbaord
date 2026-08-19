export type TicketStatus = "Confirmed" | "Pending" | "Cancelled";
export type CheckInStatus = "Checked In" | "Not Checked In";
export type TicketTier = "VIP" | "General" | "Executive";

export interface TicketItem {
  id: string;
  ticketId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeAvatar: string;
  eventName: string;
  ticketType: TicketTier;
  checkInStatus: CheckInStatus;
  issueDate: string;
  status: TicketStatus;
  price?: string;
  seatNo?: string;
}

export interface TicketFilterOptions {
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
