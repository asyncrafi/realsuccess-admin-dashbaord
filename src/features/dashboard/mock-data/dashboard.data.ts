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
    value: "12",
    change: "+2 this month",
    changeType: "positive",
  },
  {
    id: "tickets",
    title: "Total Tickets",
    value: "1,248",
    change: "+12.5%",
    changeType: "positive",
  },
  {
    id: "attendees",
    title: "Registered Attendees",
    value: "986",
    change: "+8.4%",
    changeType: "positive",
  },
  {
    id: "checked_in",
    title: "Checked In",
    value: "12,250",
    change: "75.3% attendance",
    changeType: "info",
  },
];

export const ATTENDANCE_CHART_DATA: AttendanceChartData[] = [
  { month: "Jan", ticketGrowth: 1500, checkedInGrowth: 1100 },
  { month: "Feb", ticketGrowth: 2200, checkedInGrowth: 1700 },
  { month: "Mar", ticketGrowth: 3400, checkedInGrowth: 2800 },
  { month: "Apr", ticketGrowth: 4900, checkedInGrowth: 4200 },
  { month: "May", ticketGrowth: 6300, checkedInGrowth: 5400 },
  { month: "Jun", ticketGrowth: 7200, checkedInGrowth: 6300 },
  { month: "Jul", ticketGrowth: 7500, checkedInGrowth: 6700 },
  { month: "Aug", ticketGrowth: 7300, checkedInGrowth: 6500 },
  { month: "Sep", ticketGrowth: 7800, checkedInGrowth: 6900 },
  { month: "Oct", ticketGrowth: 8500, checkedInGrowth: 7700 },
  { month: "Nov", ticketGrowth: 9300, checkedInGrowth: 8400 },
  { month: "Dec", ticketGrowth: 10500, checkedInGrowth: 9600 },
];
