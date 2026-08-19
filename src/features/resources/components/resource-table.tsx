"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { useResources } from "../hooks/use-resources";
import { ResourceDetailsModal } from "./resource-details-modal";
import { CreateResourceModal } from "./create-resource-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";

export function ResourceTable() {
  const router = useRouter();
  const {
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
    isDateFilterActive,
  } = useResources();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close Date Picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Resources
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="w-56 md:w-64">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              rightIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="h-10 text-sm bg-white border-gray-200"
            />
          </div>

          {/* Status Filter */}
          <div className="w-44">
            <SelectDropdown
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="h-10 bg-white border-gray-200"
              options={[
                { label: "Status : All", value: "All" },
                { label: "Published", value: "Published" },
                { label: "Draft", value: "Draft" },
              ]}
            />
          </div>

          {/* Date Range Filter Button & Popover */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={cn(
                "h-10 px-4 rounded-full border border-gray-200 bg-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer",
                isDateFilterActive
                  ? "border-[oklch(0.48_0.1394_252.75)] text-[oklch(0.48_0.1394_252.75)] bg-blue-50/50"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span>
                {isDateFilterActive
                  ? `${startDate || "Start"} to ${endDate || "End"}`
                  : "Filter by date range"}
              </span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </button>

            {/* Date Range Popover Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Select Upload Date
                  </span>
                  {isDateFilterActive && (
                    <button
                      onClick={clearDateFilter}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="w-full h-9 text-xs rounded-full bg-[oklch(0.48_0.1394_252.75)] text-white font-semibold hover:bg-[oklch(0.40_0.1394_252.75)] transition-colors cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Resource Action Button */}
          <Button
            type="button"
            onClick={() =>
              router.push("/resources?action=create", { scroll: false })
            }
            className="h-10 px-5 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[oklch(0.48_0.1394_252.75)] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Resource</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                    No resources found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Resource Title */}
                    <td className="py-4 px-6 font-bold text-gray-900 max-w-xs">
                      {res.title}
                    </td>

                    {/* Resource Type */}
                    <td className="py-4 px-6 font-bold text-xs whitespace-nowrap">
                      <span
                        className={cn(
                          res.type === "PDF"
                            ? "text-sky-500 font-semibold"
                            : res.type === "Video"
                            ? "text-purple-600 font-semibold"
                            : "text-emerald-600 font-semibold"
                        )}
                      >
                        {res.type}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {res.category}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {res.date}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center whitespace-nowrap font-semibold text-xs">
                      <span
                        className={cn(
                          res.status === "Published"
                            ? "text-emerald-500 font-semibold"
                            : "text-amber-500 font-semibold"
                        )}
                      >
                        {res.status}
                      </span>
                    </td>

                    {/* Action Eye Details & Edit Button */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Eye Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedResource(res)}
                          className="p-1.5 text-amber-500/90 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Resource Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/resources?action=edit&id=${res.id}`, { scroll: false })
                          }
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Edit Resource & Publish Status"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
              currentPage === page
                ? "bg-[oklch(0.48_0.1394_252.75)] text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        ))}
        <span className="text-gray-400 px-1">...</span>
        <button
          onClick={() => setCurrentPage(30)}
          className={cn(
            "h-9 w-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
            currentPage === 30
              ? "bg-[oklch(0.48_0.1394_252.75)] text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          30
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.min(30, p + 1))}
          className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Resource Details Modal */}
      <ResourceDetailsModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* Add / Edit Resource Modal */}
      <Suspense fallback={null}>
        <CreateResourceModal />
      </Suspense>
    </div>
  );
}
