export type AnnouncementPriority = "Important" | "Normal";
export type AnnouncementStatus = "Published" | "Draft";

export interface AnnouncementAttachment {
  name: string;
  size: string;
  type: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  eventName: string;
  publishedBy: string;
  date: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  category?: string;
  content?: string;
  takeawayTime?: string;
  takeawayVenue?: string;
  attachments?: AnnouncementAttachment[];
}

export interface AnnouncementFilterOptions {
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
