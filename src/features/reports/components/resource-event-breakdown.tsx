"use client";

import { FileText, Download, Sparkles } from "lucide-react";
import { ResourceEventBreakdown } from "../types/reports.types";

interface ResourceEventBreakdownProps {
  data: ResourceEventBreakdown[];
}

export function ResourceEventBreakdownCard({ data }: ResourceEventBreakdownProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Resources / Event Utilization
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Resource distribution, attendee engagement, and top downloaded assets per event
          </p>
        </div>
        <div className="p-2 rounded-2xl bg-purple-50 text-purple-600">
          <FileText className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-gray-200/90 bg-gray-50/50 hover:bg-gray-50 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-gray-900">{item.eventName}</h4>
                <p className="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3 w-3" />
                  Top Asset: {item.mostPopularAsset}
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                {item.avgEngagementScore}% Engagement
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-gray-200/70">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Resources</span>
                <p className="text-sm font-bold text-gray-900">{item.totalResources} Assets</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200/70">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Downloads</span>
                <p className="text-sm font-bold text-blue-600">{item.totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
