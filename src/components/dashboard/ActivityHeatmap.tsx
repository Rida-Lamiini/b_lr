"use client";

import { trpc } from "@/lib/trpc-client";
import Heatmap, { type HeatmapData } from "@/components/blocks/heatmap";
import { useMemo } from "react";
import { subMonths, startOfDay, format } from "date-fns";

export function ActivityHeatmap() {
  const { data, isLoading } = trpc.dashboard.getActivityHeatmap.useQuery();

  const today = useMemo(() => startOfDay(new Date()), []);
  const sixMonthsAgo = useMemo(() => subMonths(today, 6), [today]);

  const heatmapData: HeatmapData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  if (isLoading) {
    return (
      <div className="gh-box p-5 animate-pulse">
        <div className="h-[140px] bg-white/5 rounded" />
      </div>
    );
  }

  return (
    <div className="gh-box p-5 overflow-x-auto">
      <Heatmap
        data={heatmapData}
        startDate={sixMonthsAgo}
        endDate={today}
        colorMode="interpolate"
      />
    </div>
  );
}
