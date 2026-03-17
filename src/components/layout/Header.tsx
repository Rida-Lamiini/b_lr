"use client";

import { usePathname } from "next/navigation";
import { CommandTrigger } from "@/components/command-palette/CommandTrigger";
import { Kbd } from "@/components/ui/kbd-hint";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import * as Icons from "@phosphor-icons/react";

/**
 * Derives a human-readable breadcrumb from the current pathname.
 * e.g. /journey/daily → ["journey", "daily log"]
 */
function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labels: Record<string, string> = {
    projects:   "projects",
    areas:      "areas",
    resources:  "resources",
    archives:   "archives",
    tasks:      "tasks",
    notes:      "notes",
    files:      "files",
    calendar:   "calendar",
    journey:    "journey",
    daily:      "daily log",
    journal:    "journal",
    milestones: "milestones",
    review:     "weekly review",
    focus:      "focus",
  };

  return segments.map((s) => labels[s] ?? s);
}

interface HeaderProps {
  onMenuClick?: () => void;
}

/**
 * Top header bar with breadcrumb navigation,
 * command palette trigger, and current date.
 */
export function Header({ onMenuClick }: HeaderProps) {
  const breadcrumb = useBreadcrumb();
  const today = format(new Date(), "EEE, MMM d");

  return (
    <header className={cn(
      "flex items-center gap-4 px-5 h-12 flex-shrink-0",
      "bg-card/60 backdrop-blur-sm border-b border-border/60"
    )}>

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md transition-colors"
        title="Toggle menu"
      >
        <Icons.List size={18} weight="bold" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
        <span className="text-muted-foreground/70">brain</span>
        {breadcrumb.map((segment, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50">/</span>
            <span className={i === breadcrumb.length - 1 ? "text-foreground font-semibold capitalize" : "text-muted-foreground/70 capitalize"}>
              {segment}
            </span>
          </span>
        ))}
      </div>

      {/* Command trigger — centered */}
      <div className="flex-1 flex justify-center">
        <CommandTrigger className="w-72" />
      </div>

      {/* Right: date */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-muted-foreground hidden sm:block font-medium">
          {today}
        </span>
        <Kbd keys={["⌘K"]} />
      </div>

    </header>
  );
}
