export type ResourceFileType = "PDF" | "Video" | "Image" | "Document";
export type ResourceStatus = "Published" | "Draft";

export interface ResourceItem {
  id: string;
  title: string;
  eventName: string;
  type: ResourceFileType;
  category: string;
  date: string;
  status: ResourceStatus;
  fileSize?: string;
  fileUrl?: string;
  description?: string;
}

export interface ResourceFilterOptions {
  searchTerm?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
