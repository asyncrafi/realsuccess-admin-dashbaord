export type SessionStatus = "Published" | "Draft" | "Cancelled";
export type SessionType = "Keynote" | "Panel" | "Workshop" | "Networking" | "Breakout";

export interface ScheduleItem {
  id: string;
  time: string;
  sessionTitle: string;
  speakerName: string;
  speakerRole?: string;
  venue: string;
  type: SessionType;
  status: SessionStatus;
  date: string;
  description?: string;
}

export interface ScheduleFilterOptions {
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
