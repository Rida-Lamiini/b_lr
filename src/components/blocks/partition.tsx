"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type PartitionDatum = {
  id: string;
  label: string;
  value: number;
  /** Optional group / category for coloring */
  group?: string;
  /** Optional sub-label */
  sub?: string;
};

export type PartitionData = PartitionDatum[];

export interface PartitionProps {
  data: PartitionData;
  /** Height in px */
  height?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Color palette — GitHub-esque category colors                       */
/* ------------------------------------------------------------------ */

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PROJECT:  { bg: "#1f6feb1a", text: "#58a6ff", border: "#1f6feb44" },
  AREA:     { bg: "#238636",   text: "#ffffff", border: "#23863688" },
  RESOURCE: { bg: "#ab7df81a", text: "#d2a8ff", border: "#ab7df844" },
  ARCHIVE:  { bg: "#484f581a", text: "#8b949e", border: "#484f5844" },
};

const FALLBACK_COLORS = [
  { bg: "#1f6feb1a", text: "#58a6ff", border: "#1f6feb44" },
  { bg: "#2386361a", text: "#3fb950", border: "#23863644" },
  { bg: "#ab7df81a", text: "#d2a8ff", border: "#ab7df844" },
  { bg: "#f0883e1a", text: "#f0883e", border: "#f0883e44" },
  { bg: "#f778ba1a", text: "#f778ba", border: "#f778ba44" },
  { bg: "#79c0ff1a", text: "#79c0ff", border: "#79c0ff44" },
];

function getColor(group: string | undefined, idx: number) {
  if (group && GROUP_COLORS[group]) return GROUP_COLORS[group];
  return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

/* ------------------------------------------------------------------ */
/*  Layout: squarified treemap algorithm (simplified)                  */
/* ------------------------------------------------------------------ */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  datum: PartitionDatum;
}

function layoutPartition(
  data: PartitionData,
  width: number,
  height: number
): Rect[] {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0 || data.length === 0) return [];

  // Sort descending by value for better treemap layout
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const rects: Rect[] = [];

  let x = 0,
    y = 0,
    remainingW = width,
    remainingH = height,
    remainingTotal = total;

  // Slice-and-dice: alternate horizontal/vertical splits
  for (let i = 0; i < sorted.length; i++) {
    const d = sorted[i];
    const ratio = d.value / remainingTotal;
    const isHorizontal = remainingW >= remainingH;

    if (i === sorted.length - 1) {
      // Last item takes all remaining space
      rects.push({ x, y, w: remainingW, h: remainingH, datum: d });
    } else if (isHorizontal) {
      const w = remainingW * ratio;
      rects.push({ x, y, w, h: remainingH, datum: d });
      x += w;
      remainingW -= w;
    } else {
      const h = remainingH * ratio;
      rects.push({ x, y, w: remainingW, h, datum: d });
      y += h;
      remainingH -= h;
    }

    remainingTotal -= d.value;
  }

  return rects;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const MIN_LABEL_W = 60;
const MIN_LABEL_H = 36;
const MIN_SUB_H = 52;

export default function Partition({
  data,
  height = 180,
  className,
}: PartitionProps) {
  // Use a fixed reference width for layout; actual rendering is responsive
  const WIDTH = 800;

  const rects = useMemo(
    () => layoutPartition(data.filter((d) => d.value > 0), WIDTH, height),
    [data, height]
  );

  const total = data.reduce((s, d) => s + d.value, 0);

  if (rects.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground text-xs font-mono",
          className
        )}
        style={{ height }}
      >
        No data
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height }}
      >
        {rects.map((r, i) => {
          const color = getColor(r.datum.group, i);
          const pct = total > 0 ? ((r.datum.value / total) * 100).toFixed(0) : "0";
          const showLabel = r.w >= MIN_LABEL_W && r.h >= MIN_LABEL_H;
          const showSub = r.w >= MIN_LABEL_W && r.h >= MIN_SUB_H;

          return (
            <g key={r.datum.id}>
              <rect
                x={r.x + 1.5}
                y={r.y + 1.5}
                width={Math.max(0, r.w - 3)}
                height={Math.max(0, r.h - 3)}
                rx={4}
                fill={color.bg}
                stroke={color.border}
                strokeWidth={1}
              >
                <title>
                  {r.datum.label}: {r.datum.value}{r.datum.sub ? ` ${r.datum.sub}` : ""} ({pct}%)
                </title>
              </rect>

              {showLabel && (
                <>
                  <text
                    x={r.x + 10}
                    y={r.y + 20}
                    fill={color.text}
                    fontSize={12}
                    fontWeight={600}
                    fontFamily="var(--font-sans)"
                    style={{ pointerEvents: "none" }}
                  >
                    {r.datum.label.length > Math.floor(r.w / 8)
                      ? r.datum.label.slice(0, Math.floor(r.w / 8) - 1) + "…"
                      : r.datum.label}
                  </text>

                  {showSub && r.datum.sub && (
                    <text
                      x={r.x + 10}
                      y={r.y + 36}
                      fill={color.text}
                      fontSize={10}
                      opacity={0.7}
                      fontFamily="var(--font-mono)"
                      style={{ pointerEvents: "none" }}
                    >
                      {r.datum.sub}
                    </text>
                  )}

                  <text
                    x={r.x + r.w - 12}
                    y={r.y + 20}
                    fill={color.text}
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    textAnchor="end"
                    opacity={0.6}
                    style={{ pointerEvents: "none" }}
                  >
                    {pct}%
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
