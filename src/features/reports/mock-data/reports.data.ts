import {
  AttendanceChartPoint,
  MonthlyGrowthItem,
  ReportsSummaryMetrics,
  ResourceEventBreakdown,
} from "../types/reports.types";

export const MOCK_ATTENDANCE_OVERVIEW_DATA: AttendanceChartPoint[] = [
  { month: "Jan", ticketAmountGrowth: 1500, checkedInAmountGrowth: 1100 },
  { month: "Feb", ticketAmountGrowth: 2200, checkedInAmountGrowth: 1700 },
  { month: "Mar", ticketAmountGrowth: 3500, checkedInAmountGrowth: 2900 },
  { month: "Apr", ticketAmountGrowth: 4900, checkedInAmountGrowth: 4200 },
  { month: "May", ticketAmountGrowth: 6200, checkedInAmountGrowth: 5400 },
  { month: "Jun", ticketAmountGrowth: 7100, checkedInAmountGrowth: 6200 },
  { month: "Jul", ticketAmountGrowth: 7400, checkedInAmountGrowth: 6600 },
  { month: "Aug", ticketAmountGrowth: 7200, checkedInAmountGrowth: 6400 },
  { month: "Sep", ticketAmountGrowth: 7700, checkedInAmountGrowth: 6800 },
  { month: "Oct", ticketAmountGrowth: 8400, checkedInAmountGrowth: 7600 },
  { month: "Nov", ticketAmountGrowth: 9100, checkedInAmountGrowth: 8200 },
  { month: "Dec", ticketAmountGrowth: 10480, checkedInAmountGrowth: 9620 },
];

export const MOCK_REPORTS_SUMMARY: ReportsSummaryMetrics = {
  totalRegistrations: 10480,
  registrationGrowth: 14.2,
  totalCheckedIn: 9620,
  checkInRate: 91.8,
  totalEvents: 24,
  resourcesPerEvent: 18.5,
};

export const MOCK_MONTHLY_GROWTH_DATA: MonthlyGrowthItem[] = [
  { month: "December 2026", registrations: 10480, checkedIn: 9620, growthRate: 15.2, conversionRate: 91.8, resourcesPerEvent: 22.4 },
  { month: "November 2026", registrations: 9100, checkedIn: 8200, growthRate: 8.3, conversionRate: 90.1, resourcesPerEvent: 19.8 },
  { month: "October 2026", registrations: 8400, checkedIn: 7600, growthRate: 9.1, conversionRate: 90.5, resourcesPerEvent: 18.2 },
  { month: "September 2026", registrations: 7700, checkedIn: 6800, growthRate: 6.9, conversionRate: 88.3, resourcesPerEvent: 17.5 },
  { month: "August 2026", registrations: 7200, checkedIn: 6400, growthRate: -2.7, conversionRate: 88.9, resourcesPerEvent: 16.0 },
  { month: "July 2026", registrations: 7400, checkedIn: 6600, growthRate: 4.2, conversionRate: 89.2, resourcesPerEvent: 16.8 },
];

export const MOCK_RESOURCE_EVENT_BREAKDOWN: ResourceEventBreakdown[] = [
  { eventName: "RealSuccess Leadership Weekend", totalResources: 34, totalDownloads: 3420, mostPopularAsset: "Workshop Schedule.pdf", avgEngagementScore: 94.6 },
  { eventName: "RealSuccess 3-Day Workshop", totalResources: 28, totalDownloads: 2890, mostPopularAsset: "Keynote Slides.pptx", avgEngagementScore: 91.2 },
  { eventName: "Executive Strategy Summit", totalResources: 19, totalDownloads: 1940, mostPopularAsset: "Executive Guide.pdf", avgEngagementScore: 89.5 },
  { eventName: "Networking Gala & Dinner", totalResources: 12, totalDownloads: 1210, mostPopularAsset: "VIP Lounge Map.png", avgEngagementScore: 88.0 },
];
