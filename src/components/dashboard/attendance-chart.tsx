"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ATTENDANCE_CHART_DATA } from "@/features/dashboard/mock-data/dashboard.data";

export function AttendanceChart() {
  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
      {/* Chart Header & Custom Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Attendance Overview
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Visualizing registered users & community activity metrics
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center gap-6 text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#1E293B]" />
            <span>Ticket Amount Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#D97706]" />
            <span>Checked-in Amount Growth</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 md:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={ATTENDANCE_CHART_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTicket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E293B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1E293B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorChecked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                borderColor: "#E2E8F0",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
            <Area
              type="monotone"
              dataKey="ticketGrowth"
              name="Ticket Amount Growth"
              stroke="#1E293B"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTicket)"
            />
            <Area
              type="monotone"
              dataKey="checkedInGrowth"
              name="Checked-in Amount Growth"
              stroke="#D97706"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorChecked)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
