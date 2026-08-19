import { Metadata } from "next";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { ResourceEventBreakdownCard } from "@/features/reports/components/resource-event-breakdown";
import { MOCK_RESOURCE_EVENT_BREAKDOWN } from "@/features/reports/mock-data/reports.data";

export const metadata: Metadata = {
  title: "Dashboard Overview | Real Success Admin",
  description: "Real Success Enterprise Admin Dashboard Overview",
};

export default function DashboardOverviewPage() {
  return (
    <div className="w-full space-y-6">
      {/* Top Welcome Banner */}
      <WelcomeBanner />

      {/* Metric Stat Cards */}
      <StatsCards />

      {/* Attendance Growth Overview Chart (Matching Reference Image) */}
      <AttendanceChart />

      {/* Minimal Resource & Event Utilization */}
      <ResourceEventBreakdownCard data={MOCK_RESOURCE_EVENT_BREAKDOWN} />
    </div>
  );
}
