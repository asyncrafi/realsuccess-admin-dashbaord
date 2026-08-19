import { apiClient } from "@/lib/api-client";
import { MOCK_TICKETS } from "../mock-data/tickets.data";
import { TicketFilterOptions, TicketItem } from "../types/tickets.types";

export const ticketsService = {
  /**
   * Fetch all tickets with filtering and pagination
   * In future, replace mock response with: apiClient.get<TicketItem[]>('/tickets', { params: options })
   */
  async getTickets(options?: TicketFilterOptions): Promise<{
    data: TicketItem[];
    total: number;
  }> {
    // Simulating API network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 50));

    let results = [...MOCK_TICKETS];

    if (options?.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(
        (tkt) =>
          tkt.ticketId.toLowerCase().includes(term) ||
          tkt.attendeeName.toLowerCase().includes(term) ||
          tkt.attendeeEmail.toLowerCase().includes(term) ||
          tkt.eventName.toLowerCase().includes(term)
      );
    }

    if (options?.status && options.status !== "All") {
      results = results.filter(
        (tkt) => tkt.status.toLowerCase() === options.status?.toLowerCase()
      );
    }

    return {
      data: results,
      total: results.length,
    };
  },

  /**
   * Fetch a single ticket details by ID
   */
  async getTicketById(id: string): Promise<TicketItem | undefined> {
    return MOCK_TICKETS.find((tkt) => tkt.id === id);
  },
};
