"use client";

import { useState } from "react";
import {
  MOCK_ATTENDANCE_OVERVIEW_DATA,
  MOCK_MONTHLY_GROWTH_DATA,
  MOCK_REPORTS_SUMMARY,
  MOCK_RESOURCE_EVENT_BREAKDOWN,
} from "../mock-data/reports.data";

export function useReports() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const summary = MOCK_REPORTS_SUMMARY;
  const attendanceChartData = MOCK_ATTENDANCE_OVERVIEW_DATA;
  const monthlyGrowth = MOCK_MONTHLY_GROWTH_DATA;
  const resourceBreakdown = MOCK_RESOURCE_EVENT_BREAKDOWN;

  const handleExportPDF = () => {
    window.print();
  };

  return {
    selectedYear,
    setSelectedYear,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    summary,
    attendanceChartData,
    monthlyGrowth,
    resourceBreakdown,
    handleExportPDF,
  };
}
