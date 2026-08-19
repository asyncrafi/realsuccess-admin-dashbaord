export type RegistrationStatus = "Confirmed" | "Pending" | "Cancelled";
export type AttendanceStatus = "Checked In" | "Not Checked In";
export type TicketType = "VIP" | "General" | "Executive";

export interface AttendeeItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  eventName: string;
  ticketType: TicketType;
  registrationStatus: RegistrationStatus;
  accessCode: string;
  status: AttendanceStatus;
  registeredAt: string;
  phone?: string;
}

export interface AttendeeFilterOptions {
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
