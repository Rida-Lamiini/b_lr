"use client";

import { usePathname } from "next/navigation";
import { CommandTrigger } from "@/components/command-palette/CommandTrigger";
import { Kbd } from "@/components/ui/kbd-hint";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
      "flex items-center gap-3 px-5 h-10 flex-shrink-0",
      "bg-bg-1 border-b border-border-subtle"
    )}>

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-text-3 hover:text-text-2 font-mono text-sm"
        title="Toggle menu"
      >
        ☰
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-mono text-xs text-text-3">
        <span className="text-text-3">brain</span>
        {breadcrumb.map((segment, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-text-3">/</span>
            <span className={i === breadcrumb.length - 1 ? "text-text-1" : "text-text-3"}>
              {segment}
            </span>
          </span>
        ))}
      </div>

      {/* Command trigger — centered */}
      <div className="flex-1 flex justify-center">
        <CommandTrigger className="w-64" />
      </div>

      {/* Right: date */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-2xs text-text-3 hidden sm:block">
          {today}
        </span>
        <Kbd keys={["⌘K"]} />
      </div>

    </header>
  );
}
