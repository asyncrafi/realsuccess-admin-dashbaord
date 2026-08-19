"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DASHBOARD_STATS } from "@/features/dashboard/mock-data/dashboard.data";
import { cn } from "@/lib/utils";

// Helper to parse numeric values from string (e.g. "1,248" -> 1248)
function parseNumber(val: string | number): number {
  if (typeof val === "number") return val;
  const cleaned = val.replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function StatsCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for animated display values
  const [displayValues, setDisplayValues] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    DASHBOARD_STATS.forEach((stat) => {
      initial[stat.id] = "0";
    });
    return initial;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance stagger animation for cards
      gsap.fromTo(
        ".stat-card-item",
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.1,
        }
      );

      // 2. Count-up animation for numeric values
      DASHBOARD_STATS.forEach((stat) => {
        const targetNum = parseNumber(stat.value);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetNum,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.2,
          onUpdate: () => {
            const formatted = Math.floor(obj.val).toLocaleString("en-US");
            setDisplayValues((prev) => ({ ...prev, [stat.id]: formatted }));
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {DASHBOARD_STATS.map((stat) => (
        <div
          key={stat.id}
          className="stat-card-item opacity-0 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg hover:border-[oklch(0.48_0.1394_252.75)]/30 transition-all duration-300 group cursor-default"
        >
          <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
            {stat.title}
          </span>
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {displayValues[stat.id] || "0"}
            </h3>
            <p
              className={cn(
                "text-xs md:text-sm font-semibold pt-1 transition-colors",
                stat.changeType === "positive"
                  ? "text-emerald-600"
                  : stat.changeType === "info"
                  ? "text-[oklch(0.48_0.1394_252.75)]"
                  : "text-gray-500"
              )}
            >
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
