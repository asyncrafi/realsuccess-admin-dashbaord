export interface AttendanceChartPoint {
  month: string;
  ticketAmountGrowth: number;
  checkedInAmountGrowth: number;
}

export interface MonthlyGrowthItem {
  month: string;
  registrations: number;
  checkedIn: number;
  growthRate: number; // percentage
  conversionRate: number; // percentage
  resourcesPerEvent: number;
}

export interface ResourceEventBreakdown {
  eventName: string;
  totalResources: number;
  totalDownloads: number;
  mostPopularAsset: string;
  avgEngagementScore: number;
}

export interface ReportsSummaryMetrics {
  totalRegistrations: number;
  registrationGrowth: number; // %
  totalCheckedIn: number;
  checkInRate: number; // %
  totalEvents: number;
  resourcesPerEvent: number;
}
