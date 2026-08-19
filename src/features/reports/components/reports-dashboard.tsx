"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Download } from "lucide-react";
import { useReports } from "../hooks/use-reports";
import { AttendanceOverviewChart } from "./attendance-overview-chart";
import { MonthlyGrowthTable } from "./monthly-growth-table";
import { ResourceEventBreakdownCard } from "./resource-event-breakdown";
import { Button } from "@/components/ui/button";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";

export function ReportsDashboard() {
  const {
    selectedYear,
    setSelectedYear,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    attendanceChartData,
    monthlyGrowth,
    resourceBreakdown,
    handleExportPDF,
  } = useReports();

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

  const isDateFilterActive = Boolean(startDate || endDate);

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Export Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Registration growth trends, check-in conversion, and event resource utilization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="w-36">
            <SelectDropdown
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              className="h-10 bg-white border-gray-200"
              options={[
                { label: "Year: 2026", value: "2026" },
                { label: "Year: 2025", value: "2025" },
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
                    Select Report Period
                  </span>
                  {isDateFilterActive && (
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
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

          {/* Export Report Action Button */}
          <Button
            type="button"
            onClick={handleExportPDF}
            className="h-10 px-5 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* 1. Attendance Overview Area Chart (Matching Image Screenshot) */}
      <AttendanceOverviewChart data={attendanceChartData} />

      {/* 2. Resources / Event Utilization Breakdown */}
      <ResourceEventBreakdownCard data={resourceBreakdown} />

      {/* 3. Monthly Registration Growth Table */}
      <MonthlyGrowthTable data={monthlyGrowth} />
    </div>
  );
}
