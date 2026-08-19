import { apiClient } from "@/lib/api-client";
import { MOCK_RESOURCES } from "../mock-data/resources.data";
import { ResourceFilterOptions, ResourceItem } from "../types/resources.types";

export const resourcesService = {
  /**
   * Fetch all resources with filtering and pagination
   * In future: apiClient.get<ResourceItem[]>('/resources', { params: options })
   */
  async getResources(options?: ResourceFilterOptions): Promise<{
    data: ResourceItem[];
    total: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 50));

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
      date: "Jul 23, 2026 • 10:45 AM",
      status: data.status || "Published",
      fileSize: data.fileSize || "2.5 MB",
      fileUrl: data.fileUrl || "/downloads/sample.pdf",
      description: data.description || "",
    };

    MOCK_RESOURCES.unshift(newResource);
    return newResource;
  },
};
