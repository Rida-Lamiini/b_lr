"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCommandPalette, type Command } from "@/hooks/useCommandPalette";
import { Kbd } from "@/components/ui/kbd-hint";
import { cn } from "@/lib/utils";

/** Groups in display order */
const GROUP_ORDER = ["navigate", "create", "actions", "recent"] as const;

const GROUP_LABELS: Record<string, string> = {
  navigate: "go to",
  create:   "create",
  actions:  "actions",
  recent:   "recent",
};

/**
 * Global command palette overlay.
 * Mount once in the dashboard layout — works across all pages.
 */
export function CommandPalette() {
  const {
    open, query, selectedIndex, filteredCommands,
    setOpen, setQuery, setSelectedIndex, executeSelected,
  } = useCommandPalette();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Global Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  // Arrow key + Enter navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeSelected();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selectedIndex, filteredCommands, setSelectedIndex, executeSelected, setOpen]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  // Group filtered commands
  const grouped = GROUP_ORDER.reduce<Record<string, Command[]>>((acc, group) => {
    const items = filteredCommands.filter((c) => c.group === group);
    if (items.length > 0) acc[group] = items;
    return acc;
  }, {});

  // Flat index map for keyboard navigation
  let flatIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg-0/70 z-50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette box */}
      <div className="fixed left-1/2 top-24 -translate-x-1/2 z-50 w-[520px] max-w-[calc(100vw-2rem)]">
        <div className="bg-bg-2 border border-border-default rounded-lg overflow-hidden shadow-2xl">

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
            <span className="text-text-3 font-mono text-sm select-none">⌕</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or run a command..."
              className={cn(
                "flex-1 bg-transparent outline-none",
                "font-mono text-sm text-text-1 placeholder:text-text-3"
              )}
            />
            <Kbd keys={["esc"]} />
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-80 overflow-y-auto py-1.5">
            {filteredCommands.length === 0 ? (
              <p className="font-mono text-xs text-text-3 text-center py-8">
                no results for &quot;{query}&quot;
              </p>
            ) : (
              Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <p className="font-mono text-2xs text-text-3 uppercase tracking-widest px-4 py-1.5">
                    {GROUP_LABELS[group]}
                  </p>
                  {items.map((cmd) => {
                    const idx = flatIndex++;
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={cmd.id}
                        data-index={idx}
                        onClick={() => { cmd.action(); setOpen(false); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 cursor-pointer",
                          "transition-colors duration-fast",
                          isSelected
                            ? "bg-purple-bg text-text-1"
                            : "text-text-2 hover:bg-bg-3"
                        )}
                      >
                        <span className={cn(
                          "font-mono text-sm w-4 text-center flex-shrink-0",
                          isSelected ? "text-purple-default" : "text-text-3"
                        )}>
                          {cmd.icon}
                        </span>
                        <span className="font-mono text-xs flex-1">{cmd.label}</span>
                        {cmd.shortcut && (
                          <Kbd keys={cmd.shortcut} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-border-subtle bg-bg-1">
            <span className="font-mono text-2xs text-text-3 flex items-center gap-1.5">
              <Kbd keys={["↑↓"]} /> navigate
            </span>
            <span className="font-mono text-2xs text-text-3 flex items-center gap-1.5">
              <Kbd keys={["↵"]} /> select
            </span>
            <span className="font-mono text-2xs text-text-3 flex items-center gap-1.5">
              <Kbd keys={["esc"]} /> close
            </span>
          </div>

        </div>
      </div>
    </>
  );
}