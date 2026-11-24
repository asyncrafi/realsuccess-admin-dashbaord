import {
  AttendanceChartPoint,
  MonthlyGrowthItem,
  ReportsSummaryMetrics,
  ResourceEventBreakdown,
} from "../types/reports.types";

export const MOCK_ATTENDANCE_OVERVIEW_DATA: AttendanceChartPoint[] = [
  { month: "Jan", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Feb", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Mar", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Apr", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "May", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Jun", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Jul", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Aug", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Sep", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Oct", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Nov", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
  { month: "Dec", ticketAmountGrowth: 0, checkedInAmountGrowth: 0 },
];

export const MOCK_REPORTS_SUMMARY: ReportsSummaryMetrics = {
  totalRegistrations: 0,
  registrationGrowth: 0,
  totalCheckedIn: 0,
  checkInRate: 0,
  totalEvents: 0,
  resourcesPerEvent: 0,
};

export const MOCK_MONTHLY_GROWTH_DATA: MonthlyGrowthItem[] = [];

export const MOCK_RESOURCE_EVENT_BREAKDOWN: ResourceEventBreakdown[] = [];
