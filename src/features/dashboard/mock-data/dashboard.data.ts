export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "info";
}

export interface AttendanceChartData {
  month: string;
  ticketGrowth: number;
  checkedInGrowth: number;
}

export const DASHBOARD_STATS: StatCardData[] = [
  {
    id: "events",
    title: "Total Events",
    value: "0",
    change: "+0 this month",
    changeType: "positive",
  },
  {
    id: "tickets",
    title: "Total Tickets",
    value: "0",
    change: "+0.0%",
    changeType: "positive",
  },
  {
    id: "attendees",
    title: "Registered Attendees",
    value: "0",
    change: "+0.0%",
    changeType: "positive",
  },
  {
    id: "checked_in",
    title: "Checked In",
    value: "0",
    change: "0% attendance",
    changeType: "info",
  },
];

export const ATTENDANCE_CHART_DATA: AttendanceChartData[] = [
  { month: "Jan", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Feb", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Mar", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Apr", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "May", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Jun", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Jul", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Aug", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Sep", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Oct", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Nov", ticketGrowth: 0, checkedInGrowth: 0 },
  { month: "Dec", ticketGrowth: 0, checkedInGrowth: 0 },
];
