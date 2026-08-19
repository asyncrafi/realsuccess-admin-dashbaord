import { apiClient } from "@/lib/api-client";
import { MOCK_ATTENDEES } from "../mock-data/attendees.data";
import { AttendeeFilterOptions, AttendeeItem } from "../types/attendees.types";

export const attendeesService = {
  /**
   * Fetch all attendees with filtering and pagination
   * In future, replace mock response with: apiClient.get<AttendeeItem[]>('/attendees', { params: options })
   */
  async getAttendees(options?: AttendeeFilterOptions): Promise<{
    data: AttendeeItem[];
    total: number;
  }> {
    // Simulating API network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 50));

    let results = [...MOCK_ATTENDEES];

    if (options?.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(
        (att) =>
          att.name.toLowerCase().includes(term) ||
          att.email.toLowerCase().includes(term) ||
          att.eventName.toLowerCase().includes(term) ||
          att.accessCode.toLowerCase().includes(term)
      );
    }

    if (options?.status && options.status !== "All") {
      results = results.filter(
        (att) => att.status.toLowerCase() === options.status?.toLowerCase()
      );
    }

    return {
      data: results,
      total: results.length,
    };
  },

  /**
   * Fetch a single attendee details by ID
   */
  async getAttendeeById(id: string): Promise<AttendeeItem | undefined> {
    return MOCK_ATTENDEES.find((att) => att.id === id);
  },
};
