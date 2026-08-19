import { apiClient } from "@/lib/api-client";
import {
  MOCK_ATTENDANCE_OVERVIEW_DATA,
  MOCK_MONTHLY_GROWTH_DATA,
  MOCK_REPORTS_SUMMARY,
  MOCK_RESOURCE_EVENT_BREAKDOWN,
} from "../mock-data/reports.data";
import {
  AttendanceChartPoint,
  MonthlyGrowthItem,
  ReportsSummaryMetrics,
  ResourceEventBreakdown,
} from "../types/reports.types";

export const reportsService = {
  /**
   * Fetch attendance overview chart dataset
   * In future: apiClient.get<AttendanceChartPoint[]>('/reports/attendance-overview')
   */
  async getAttendanceOverview(): Promise<AttendanceChartPoint[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_ATTENDANCE_OVERVIEW_DATA;
  },

  /**
   * Fetch summary registration metrics
   */
  async getSummaryMetrics(): Promise<ReportsSummaryMetrics> {
    return MOCK_REPORTS_SUMMARY;
  },

  /**
   * Fetch monthly growth dataset
   */
  async getMonthlyGrowth(): Promise<MonthlyGrowthItem[]> {
    return MOCK_MONTHLY_GROWTH_DATA;
  },

  /**
   * Fetch resource per event breakdown dataset
   */
  async getResourceEventBreakdown(): Promise<ResourceEventBreakdown[]> {
    return MOCK_RESOURCE_EVENT_BREAKDOWN;
  },
};
