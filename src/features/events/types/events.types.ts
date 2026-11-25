export type EventStatus = "Active" | "Upcoming" | "Completed";

export interface EventItem {
  id: string;
  name: string;
  description?: string;
  date: string;
  venue: string;
  attendees: number | null;
  tickets: number;
  price: number;
  isFree: boolean;
  priceDisplay: string;
  status: EventStatus;
  accessCode?: string;
  qrRegistrationToken?: string;
  qrCodeUrl?: string;
}
