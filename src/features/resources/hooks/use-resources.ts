"use client";

import { useState, useMemo } from "react";
import { MOCK_RESOURCES } from "../mock-data/resources.data";
import { ResourceItem } from "../types/resources.types";

export function useResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter((res) => {
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
  }, [searchTerm, statusFilter]);

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
