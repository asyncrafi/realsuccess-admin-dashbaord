"use client";

import { Users, UserCheck, CalendarDays, FileText, ArrowUpRight, TrendingUp } from "lucide-react";
import { ReportsSummaryMetrics } from "../types/reports.types";

interface RegistrationReportMetricsProps {
  metrics: ReportsSummaryMetrics;
}

export function RegistrationReportMetrics({ metrics }: RegistrationReportMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Registrations */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total Registrations
          </span>
          <div className="p-2.5 rounded-2xl bg-blue-50 text-[oklch(0.48_0.1394_252.75)]">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {metrics.totalRegistrations.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{metrics.registrationGrowth}% vs last month</span>
          </p>
        </div>
      </div>

      {/* Metric 2: Checked-In Attendees */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Checked-In Attendees
          </span>
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {metrics.totalCheckedIn.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{metrics.checkInRate}% Conversion Rate</span>
          </p>
        </div>
      </div>

      {/* Metric 3: Total Active Events */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Active Events
          </span>
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {metrics.totalEvents}
          </h3>
          <p className="text-xs text-gray-500 font-semibold">
            All events active in 2026
          </p>
        </div>
      </div>

      {/* Metric 4: Resources per Event */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Resources / Event
          </span>
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
            <FileText className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {metrics.resourcesPerEvent}
          </h3>
          <p className="text-xs text-purple-600 font-semibold">
            Average downloads per event
          </p>
        </div>
      </div>
    </div>
  );
}
