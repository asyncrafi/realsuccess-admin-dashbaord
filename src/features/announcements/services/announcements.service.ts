import { apiClient } from "@/lib/api-client";
import { MOCK_ANNOUNCEMENTS } from "../mock-data/announcements.data";
import { AnnouncementFilterOptions, AnnouncementItem } from "../types/announcements.types";

export const announcementsService = {
  /**
   * Fetch all announcements with filtering and pagination
   */
  async getAnnouncements(options?: AnnouncementFilterOptions): Promise<{
    data: AnnouncementItem[];
    total: number;
  }> {
    try {
      const res: any = await apiClient("/announcements/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items) && items.length > 0) {
        return {
          data: items,
          total: items.length,
        };
      }
    } catch (e) {
      console.warn("Using local announcements fallback", e);
    }

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
    try {
      const res: any = await apiClient(`/announcements/${id}/`);
      if (res?.data) return res.data;
    } catch {}
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
      publishedBy: data.publishedBy || "Admin",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      priority: data.priority || "Normal",
      status: data.status || "Published",
      category: data.category || "General",
      content: data.content || "",
      takeawayTime: data.takeawayTime,
      takeawayVenue: data.takeawayVenue,
    };

    try {
      const res: any = await apiClient("/announcements/", {
        method: "POST",
        data: {
          title: data.title,
          content: data.content || "",
          category: data.category || "General",
          priority: data.priority || "Normal",
          status: data.status || "Published",
          takeaway_time: data.takeawayTime || "",
          takeaway_venue: data.takeawayVenue || "",
          published_by: data.publishedBy || "Admin",
        },
      });
      if (res?.data) {
        const item = res.data;
        newAnnouncement.id = String(item.id);
        if (item.date) newAnnouncement.date = item.date;
      }
    } catch (err) {
      console.warn("Backend announcement creation failed, saved to local state", err);
    }

    MOCK_ANNOUNCEMENTS.unshift(newAnnouncement);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("announcementsUpdated"));
    }
    return newAnnouncement;
  },
};
