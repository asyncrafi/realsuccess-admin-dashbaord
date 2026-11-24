"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_RESOURCES } from "../mock-data/resources.data";
import { ResourceItem } from "../types/resources.types";
import { apiClient } from "@/lib/api-client";

export function useResources() {
  const [resources, setResources] = useState<ResourceItem[]>(MOCK_RESOURCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  const fetchResources = async () => {
    try {
      const res: any = await apiClient("/resources/");
      const items = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(items)) {
        const mapped: ResourceItem[] = items.map((r: any) => ({
          id: String(r.id),
          title: r.title,
          eventName: r.eventName || "RealSuccess Main Event",
          type: r.type || "PDF",
          category: r.category || "Workshop Materials",
          date: r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString() : "Just now"),
          status: r.status || "Published",
          fileSize: r.fileSize || "2.4 MB",
          fileUrl: r.fileUrl || "/downloads/sample.pdf",
          description: r.description || "",
        }));
        setResources(mapped);
      }
    } catch {
      setResources([...MOCK_RESOURCES]);
    }
  };

  useEffect(() => {
    fetchResources();
    const handleUpdated = () => fetchResources();
    window.addEventListener("resourcesUpdated", handleUpdated);
    return () => window.removeEventListener("resourcesUpdated", handleUpdated);
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Search match
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        res.title.toLowerCase().includes(term) ||
        res.eventName.toLowerCase().includes(term) ||
        res.category.toLowerCase().includes(term) ||
        res.type.toLowerCase().includes(term);

      // Status match
      const matchesStatus =
        statusFilter === "All" ||
        res.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [resources, searchTerm, statusFilter]);

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    selectedResource,
    setSelectedResource,
    filteredResources,
    clearDateFilter,
    isDateFilterActive: Boolean(startDate || endDate),
  };
}
