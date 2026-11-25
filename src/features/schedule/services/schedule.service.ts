import { apiClient } from "@/lib/api-client";
import { MOCK_SCHEDULE } from "../mock-data/schedule.data";
import { ScheduleFilterOptions, ScheduleItem } from "../types/schedule.types";

export const scheduleService = {
  /**
   * Fetch all schedule sessions with filtering and pagination
   */
  async getSchedule(options?: ScheduleFilterOptions): Promise<{
    data: ScheduleItem[];
    total: number;
  }> {
    try {
      const res: any = await apiClient("/schedule/sessions/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items) && items.length > 0) {
        return {
          data: items,
          total: items.length,
        };
      }
    } catch (e) {
      console.warn("Using local schedule fallback", e);
    }

    let results = [...MOCK_SCHEDULE];

    if (options?.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(
        (sch) =>
          sch.sessionTitle.toLowerCase().includes(term) ||
          sch.speakerName.toLowerCase().includes(term) ||
          sch.venue.toLowerCase().includes(term) ||
          sch.type.toLowerCase().includes(term)
      );
    }

    if (options?.status && options.status !== "All") {
      results = results.filter(
        (sch) => sch.status.toLowerCase() === options.status?.toLowerCase()
      );
    }

    return {
      data: results,
      total: results.length,
    };
  },

  /**
   * Fetch single session details by ID
   */
  async getScheduleById(id: string): Promise<ScheduleItem | undefined> {
    try {
      const res: any = await apiClient(`/schedule/sessions/${id}/`);
      if (res?.data) return res.data;
    } catch {}
    return MOCK_SCHEDULE.find((sch) => sch.id === id);
  },

  /**
   * Create a new schedule session
   */
  async createSession(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const newSession: ScheduleItem = {
      id: `sch-${Date.now()}`,
      sessionTitle: data.sessionTitle || "New Session",
      speakerName: data.speakerName || "Speaker",
      speakerRole: data.speakerRole || "Keynote Speaker",
      time: data.time || "09:00 AM – 10:30 AM",
      date: data.date || new Date().toISOString().split("T")[0],
      venue: data.venue || "Main Auditorium",
      type: data.type || "Keynote",
      status: data.status || "Published",
      description: data.description || "",
    };

    try {
      const res: any = await apiClient("/schedule/sessions/", {
        method: "POST",
        data: {
          event: data.eventId ? Number(data.eventId) : undefined,
          sessionTitle: data.sessionTitle,
          speakerName: data.speakerName,
          speakerRole: data.speakerRole,
          time: data.time || "09:00 AM – 10:30 AM",
          start_time: data.startTime || undefined,
          end_time: data.endTime || undefined,
          date: data.date,
          venue: data.venue || "Main Auditorium",
          type: data.type || "Keynote",
          status: data.status || "Published",
          description: data.description || "",
        },
      });
      if (res?.data) {
        const item = res.data;
        newSession.id = String(item.id);
      }
    } catch (err) {
      console.warn("Backend schedule session creation failed, saved to local state", err);
    }

    MOCK_SCHEDULE.unshift(newSession);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("scheduleUpdated"));
    }
    return newSession;
  },

  async updateSession(id: string, data: Partial<ScheduleItem>): Promise<void> {
    await apiClient(`/schedule/sessions/${id}/`, {
      method: "PUT",
      data: {
        event: data.eventId ? Number(data.eventId) : undefined,
        sessionTitle: data.sessionTitle,
        speakerName: data.speakerName,
        speakerRole: data.speakerRole,
        time: data.time || "09:00 AM – 10:30 AM",
        start_time: data.startTime || undefined,
        end_time: data.endTime || undefined,
        date: data.date,
        venue: data.venue || "Main Auditorium",
        type: data.type || "Keynote",
        status: data.status || "Published",
        description: data.description || "",
      },
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("scheduleUpdated"));
    }
  },
};
