"use client";

import { cn } from "@/lib/utils";

export type LogLevel = "ok" | "warn" | "error" | "info" | "dim";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

const levelStyles: Record<LogLevel, string> = {
  ok:    "text-green-default",
  warn:  "text-amber-default",
  error: "text-red-default",
  info:  "text-blue-default",
  dim:   "text-text-3",
};

const levelSymbol: Record<LogLevel, string> = {
  ok:    "✓",
  warn:  "⚠",
  error: "✗",
  info:  "→",
  dim:   "·",
};

interface TerminalPanelProps {
  title?: string;
  logs: LogEntry[];
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  maxHeight?: string;
  className?: string;
}

/**
 * Terminal-style log panel with tabbed output.
 * Used for activity logs, focus session output, and debug info.
 */
export function TerminalPanel({
  title = "output",
  logs,
  tabs = ["output"],
  activeTab,
  onTabChange,
  maxHeight = "200px",
  className,
}: TerminalPanelProps) {
  const currentTab = activeTab ?? tabs[0];

  return (
    <div className={cn("bg-bg-0 border border-border-subtle rounded-md overflow-hidden", className)}>
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-bg-2 border-b border-border-subtle">
        <span className="font-mono text-2xs text-text-3 mr-2">{title}</span>
        <div className="flex gap-1 ml-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={cn(
                "font-mono text-2xs px-2 py-0.5 rounded-sm transition-colors duration-fast",
                tab === currentTab
                  ? "bg-bg-3 text-text-2"
                  : "text-text-3 hover:text-text-2"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Log lines */}
      <div
        className="overflow-y-auto p-3 space-y-0.5"
        style={{ maxHeight }}
      >
        {logs.length === 0 ? (
          <p className="font-mono text-2xs text-text-3">no output yet.</p>
        ) : (
          logs.map((entry) => (
            <div key={entry.id} className="flex gap-3 font-mono text-2xs leading-relaxed">
              <span className="text-text-3 flex-shrink-0 select-none">
                {entry.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={cn("flex-shrink-0 select-none w-3 text-center", levelStyles[entry.level])}>
                {levelSymbol[entry.level]}
              </span>
              <span className="text-text-2 break-all">{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}