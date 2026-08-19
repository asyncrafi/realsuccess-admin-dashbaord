export type EventStatus = "Active" | "Upcoming" | "Completed";

export interface EventItem {
  id: string;
  name: string;
  date: string;
  venue: string;
  attendees: number | null;
  tickets: number;
  status: EventStatus;
  qrCodeUrl?: string;
}
