"use client";

import { cn } from "@/lib/utils";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  differenceInCalendarWeeks,
  getDay,
  format,
  isBefore,
  isAfter,
  isSameDay,
} from "date-fns";
import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type HeatmapDatum = { date: string; value: number };
export type HeatmapData = HeatmapDatum[];

export interface HeatmapProps {
  data: HeatmapData;
  startDate: Date;
  endDate: Date;
  /** "interpolate" → linear scale · "threshold" → quartile buckets */
  colorMode?: "interpolate" | "threshold";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */

// GitHub-style green contribution palette on a dark background
const LEVELS = [
  "var(--hm-0, #161b22)", // empty / zero
  "var(--hm-1, #0e4429)",
  "var(--hm-2, #006d32)",
  "var(--hm-3, #26a641)",
  "var(--hm-4, #39d353)",
] as const;

function colorForValue(
  value: number,
  maxValue: number,
  mode: "interpolate" | "threshold"
): string {
  if (value <= 0) return LEVELS[0];
  if (maxValue <= 0) return LEVELS[0];

  if (mode === "interpolate") {
    const ratio = Math.min(value / maxValue, 1);
    const idx = Math.ceil(ratio * 4); // 1‑4
    return LEVELS[idx];
  }

  // threshold (quartile buckets)
  const pct = value / maxValue;
  if (pct <= 0.25) return LEVELS[1];
  if (pct <= 0.5) return LEVELS[2];
  if (pct <= 0.75) return LEVELS[3];
  return LEVELS[4];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Heatmap({
  data,
  startDate,
  endDate,
  colorMode = "interpolate",
  className,
}: HeatmapProps) {
  const { grid, months, maxValue, totalWeeks } = useMemo(() => {
    // Build a lookup map: "YYYY-MM-DD" → value
    const lookup = new Map<string, number>();
    let max = 0;
    for (const d of data) {
      lookup.set(d.date, d.value);
      if (d.value > max) max = d.value;
    }

    // Expand range to full weeks (Sun–Sat)
    const gridStart = startOfWeek(startDate, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(endDate, { weekStartsOn: 0 });
    const weeks =
      differenceInCalendarWeeks(gridEnd, gridStart, { weekStartsOn: 0 }) + 1;

    // Build grid: [weekIndex][dayOfWeek]
    const cells: (HeatmapDatum | null)[][] = [];
    let cursor = new Date(gridStart);

    for (let w = 0; w < weeks; w++) {
      const week: (HeatmapDatum | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const key = format(cursor, "yyyy-MM-dd");
        const inRange =
          !isBefore(cursor, startDate) && !isAfter(cursor, endDate);

        if (inRange) {
          week.push({ date: key, value: lookup.get(key) ?? 0 });
        } else {
          week.push(null); // outside requested range
        }
        cursor = addDays(cursor, 1);
      }
      cells.push(week);
    }

    // Month labels: find the first occurrence of each month at column level
    const monthLabels: { label: string; weekIdx: number }[] = [];
    let prevMonth = -1;
    let monthCursor = new Date(gridStart);
    for (let w = 0; w < weeks; w++) {
      // Use the Sunday of each week to decide the month label
      const m = monthCursor.getMonth();
      if (m !== prevMonth) {
        monthLabels.push({
          label: format(monthCursor, "MMM"),
          weekIdx: w,
        });
        prevMonth = m;
      }
      monthCursor = addDays(monthCursor, 7);
    }

    return { grid: cells, months: monthLabels, maxValue: max, totalWeeks: weeks };
  }, [data, startDate, endDate]);

  const CELL = 12; // px
  const GAP = 3; // px
  const DAY_LABEL_W = 28; // px reserved for day-of-week labels
  const MONTH_LABEL_H = 18; // px reserved for month labels

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className={cn("inline-flex flex-col gap-2", className)}>
      {/* ── Heatmap grid ── */}
      <div className="relative" style={{ paddingLeft: DAY_LABEL_W, paddingTop: MONTH_LABEL_H }}>
        {/* Month labels */}
        <div
          className="absolute top-0 flex text-[10px] text-muted-foreground"
          style={{ left: DAY_LABEL_W }}
        >
          {months.map((m, i) => (
            <span
              key={`${m.label}-${i}`}
              className="select-none"
              style={{
                position: "absolute",
                left: m.weekIdx * (CELL + GAP),
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Day-of-week labels */}
        <div
          className="absolute left-0 flex flex-col text-[10px] text-muted-foreground"
          style={{ top: MONTH_LABEL_H, gap: GAP }}
        >
          {dayLabels.map((label, i) => (
            <span
              key={i}
              className="flex items-center justify-end select-none pr-1"
              style={{ height: CELL, width: DAY_LABEL_W }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Cells */}
        <div className="flex" style={{ gap: GAP }}>
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {week.map((cell, di) => {
                if (!cell) {
                  return (
                    <div
                      key={di}
                      style={{ width: CELL, height: CELL }}
                    />
                  );
                }

                const bg = colorForValue(cell.value, maxValue, colorMode);
                return (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.value}`}
                    className="rounded-[2px] transition-colors duration-150"
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor: bg,
                      outline: "1px solid rgba(255,255,255,0.04)",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center gap-1.5 self-end text-[10px] text-muted-foreground"
        style={{ paddingRight: 2 }}
      >
        <span className="select-none">Less</span>
        {LEVELS.map((color, i) => (
          <div
            key={i}
            className="rounded-[2px]"
            style={{
              width: CELL,
              height: CELL,
              backgroundColor: color,
              outline: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}
        <span className="select-none">More</span>
      </div>
    </div>
  );
}
