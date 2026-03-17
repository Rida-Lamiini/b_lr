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
      <div className="rounded-md bg-card border border-border p-5 animate-pulse">
        <div className="h-32 bg-muted/30 rounded-md" />
      </div>
    );
  }

  return (
    <div className="rounded-md bg-card border border-border p-5 overflow-x-auto hover:border-border/80 transition-colors duration-200">
      <Heatmap
        data={heatmapData}
        startDate={sixMonthsAgo}
        endDate={today}
        colorMode="interpolate"
      />
    </div>
  );
}
