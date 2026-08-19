import { apiClient } from "@/lib/api-client";
import { MOCK_ANNOUNCEMENTS } from "../mock-data/announcements.data";
import { AnnouncementFilterOptions, AnnouncementItem } from "../types/announcements.types";

export const announcementsService = {
  /**
   * Fetch all announcements with filtering and pagination
   * In future, replace mock response with: apiClient.get<AnnouncementItem[]>('/announcements', { params: options })
   */
  async getAnnouncements(options?: AnnouncementFilterOptions): Promise<{
    data: AnnouncementItem[];
    total: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    let results = [...MOCK_ANNOUNCEMENTS];

    if (options?.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(
        (anc) =>
          anc.title.toLowerCase().includes(term) ||
          anc.eventName.toLowerCase().includes(term) ||
          anc.publishedBy.toLowerCase().includes(term) ||
          (anc.category && anc.category.toLowerCase().includes(term))
      );
    }

    if (options?.status && options.status !== "All") {
      results = results.filter(
        (anc) => anc.status.toLowerCase() === options.status?.toLowerCase()
      );
    }

    return {
      data: results,
      total: results.length,
    };
  },

  /**
   * Fetch single announcement by ID
   */
  async getAnnouncementById(id: string): Promise<AnnouncementItem | undefined> {
    return MOCK_ANNOUNCEMENTS.find((anc) => anc.id === id);
  },

  /**
   * Create a new announcement
   */
  async createAnnouncement(data: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    const newAnnouncement: AnnouncementItem = {
      id: `anc-${Date.now()}`,
      title: data.title || "New Announcement",
      eventName: data.eventName || "Leadership Weekend",
      publishedBy: data.publishedBy || "Aminul Arnob",
      date: "Aug 7, 9:30 AM",
      priority: data.priority || "Normal",
      status: data.status || "Published",
      category: data.category || "General",
      content: data.content || "",
      takeawayTime: data.takeawayTime,
      takeawayVenue: data.takeawayVenue,
    };

    MOCK_ANNOUNCEMENTS.unshift(newAnnouncement);
    return newAnnouncement;
  },
};
