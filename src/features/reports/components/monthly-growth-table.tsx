"use client";

import { MonthlyGrowthItem } from "../types/reports.types";
import { cn } from "@/lib/utils";

interface MonthlyGrowthTableProps {
  data: MonthlyGrowthItem[];
}

export function MonthlyGrowthTable({ data }: MonthlyGrowthTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Monthly Registration Growth Report
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Registration volume, check-in conversion, and resource asset ratios
          </p>
        </div>
        <span className="text-xs font-bold text-[oklch(0.48_0.1394_252.75)] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          2026 Monthly Breakdown
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[oklch(0.48_0.1394_252.75)] text-white text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">Month</th>
              <th className="py-3.5 px-6">Registrations</th>
              <th className="py-3.5 px-6">Checked-In</th>
              <th className="py-3.5 px-6 text-center">Growth Rate</th>
              <th className="py-3.5 px-6 text-center">Conversion Rate</th>
              <th className="py-3.5 px-6 text-center">Resources / Event</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-900">{item.month}</td>
                <td className="py-4 px-6 font-semibold text-gray-800">
                  {item.registrations.toLocaleString()}
                </td>
                <td className="py-4 px-6 font-semibold text-gray-800">
                  {item.checkedIn.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center whitespace-nowrap">
                  <span
                    className={cn(
                      "font-bold text-xs px-2.5 py-1 rounded-full",
                      item.growthRate > 0
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    )}
                  >
                    {item.growthRate > 0 ? `+${item.growthRate}%` : `${item.growthRate}%`}
                  </span>
                </td>
                <td className="py-4 px-6 text-center font-bold text-xs text-blue-600">
                  {item.conversionRate}%
                </td>
                <td className="py-4 px-6 text-center font-semibold text-gray-600">
                  {item.resourcesPerEvent} assets
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
