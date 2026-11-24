import { apiClient } from "@/lib/api-client";
import { MOCK_RESOURCES } from "../mock-data/resources.data";
import { ResourceFilterOptions, ResourceItem } from "../types/resources.types";

export const resourcesService = {
  /**
   * Fetch all resources with filtering and pagination
   */
  async getResources(options?: ResourceFilterOptions): Promise<{
    data: ResourceItem[];
    total: number;
  }> {
    try {
      const res: any = await apiClient("/resources/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items) && items.length > 0) {
        return {
          data: items,
          total: items.length,
        };
      }
    } catch (e) {
      console.warn("Using local resources fallback", e);
    }

    let results = [...MOCK_RESOURCES];

    if (options?.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(
        (res) =>
          res.title.toLowerCase().includes(term) ||
          res.eventName.toLowerCase().includes(term) ||
          res.category.toLowerCase().includes(term) ||
          res.type.toLowerCase().includes(term)
      );
    }

    if (options?.status && options.status !== "All") {
      results = results.filter(
        (res) => res.status.toLowerCase() === options.status?.toLowerCase()
      );
    }

    return {
      data: results,
      total: results.length,
    };
  },

  /**
   * Create a new resource
   */
  async createResource(data: Partial<ResourceItem>): Promise<ResourceItem> {
    const newResource: ResourceItem = {
      id: `res-${Date.now()}`,
      title: data.title || "New Resource",
      eventName: data.eventName || "Leadership Weekend",
      type: data.type || "PDF",
      category: data.category || "Workshop Materials",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: data.status || "Published",
      fileSize: data.fileSize || "2.5 MB",
      fileUrl: data.fileUrl || "/downloads/sample.pdf",
      description: data.description || "",
    };

    try {
      const res: any = await apiClient("/resources/", {
        method: "POST",
        data: {
          title: data.title,
          description: data.description || "",
          category: data.category || "Workshop Materials",
          type: data.type || "PDF",
          status: data.status || "Published",
        },
      });
      if (res?.data) {
        const item = res.data;
        newResource.id = String(item.id);
        if (item.date) newResource.date = item.date;
      }
    } catch (err) {
      console.warn("Backend resource creation failed, saved to local state", err);
    }

    MOCK_RESOURCES.unshift(newResource);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("resourcesUpdated"));
    }
    return newResource;
  },
};
