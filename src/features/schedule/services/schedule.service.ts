import { apiClient } from "@/lib/api-client";
import { MOCK_SCHEDULE } from "../mock-data/schedule.data";
import { ScheduleFilterOptions, ScheduleItem } from "../types/schedule.types";

export const scheduleService = {
  /**
   * Fetch all schedule sessions with filtering and pagination
   * In future, replace mock response with: apiClient.get<ScheduleItem[]>('/schedule', { params: options })
   */
  async getSchedule(options?: ScheduleFilterOptions): Promise<{
    data: ScheduleItem[];
    total: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 50));

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
    return MOCK_SCHEDULE.find((sch) => sch.id === id);
  },
};
