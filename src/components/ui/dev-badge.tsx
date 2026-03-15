"use client";

import { cn } from "@/lib/utils";

/** Variant → surface, text, border color mapping */
type BadgeVariant = "purple" | "green" | "amber" | "red" | "blue" | "gray";

const variants: Record<BadgeVariant, string> = {
  purple: "bg-purple-bg text-purple-default border-purple-border",
  green:  "bg-green-bg  text-green-default  border-green-border",
  amber:  "bg-amber-bg  text-amber-default  border-amber-border",
  red:    "bg-red-bg    text-red-default    border-red-border",
  blue:   "bg-blue-bg   text-blue-default   border-blue-border",
  gray:   "bg-bg-3      text-text-2         border-border-default",
};

interface DevBadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;           // show colored dot before label
  children: React.ReactNode;
  className?: string;
}

/**
 * Monospace status chip used for task status, priority,
 * project tags, and any categorical data label.
 */
export function DevBadge({
  variant = "gray",
  dot = false,
  children,
  className,
}: DevBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5",
        "font-mono text-2xs font-medium",
        "border rounded-sm",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      )}
      {children}
    </span>
  );
}