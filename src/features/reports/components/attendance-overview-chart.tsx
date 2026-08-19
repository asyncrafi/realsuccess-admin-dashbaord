"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AttendanceChartPoint } from "../types/reports.types";

interface AttendanceOverviewChartProps {
  data: AttendanceChartPoint[];
}

export function AttendanceOverviewChart({ data }: AttendanceOverviewChartProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-xs space-y-6 text-left">
      {/* Top Header & Legend matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Attendance Overview
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Visualizing registered users & community activity metrics
          </p>
        </div>

        {/* Legend Controls */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#1E293B] shadow-2xs" />
            <span>Ticket Amount Growth</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#EA580C] shadow-2xs" />
            <span>Checked-In Amount Growth</span>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="h-80 md:h-96 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Dark Navy / Ticket Growth Gradient */}
              <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E293B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1E293B" stopOpacity={0.0} />
              </linearGradient>

              {/* Orange / Checked-In Growth Gradient */}
              <linearGradient id="checkInGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EA580C" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#EA580C" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              domain={[0, 12000]}
              ticks={[0, 3000, 6000, 9000, 12000]}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1E293B] text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
                      <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                        {label} 2026 Metrics
                      </p>
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-300">Ticket Growth:</span>
                        <span className="text-white font-bold">{payload[0]?.value?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-amber-400">Checked-In:</span>
                        <span className="text-amber-400 font-bold">{payload[1]?.value?.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Ticket Amount Growth Area (Navy) */}
            <Area
              type="monotone"
              dataKey="ticketAmountGrowth"
              stroke="#1E293B"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#ticketGradient)"
            />

            {/* Checked-In Amount Growth Area (Orange) */}
            <Area
              type="monotone"
              dataKey="checkedInAmountGrowth"
              stroke="#EA580C"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#checkInGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
