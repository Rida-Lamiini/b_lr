"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCommandPalette, type Command } from "@/hooks/useCommandPalette";
import { Kbd } from "@/components/ui/kbd-hint";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import * as PhosphorIcons from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const GROUP_ORDER = ["search", "navigate", "create", "actions", "recent"] as const;

const GROUP_LABELS: Record<string, string> = {
  search:   "search results",
  navigate: "go to",
  create:   "create",
  actions:  "actions",
  recent:   "recent",
};

export function CommandPalette() {
  const {
    open, query, selectedIndex, filteredCommands,
    setOpen, setQuery, setSelectedIndex, executeSelected,
  } = useCommandPalette();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  // FTS5 Search Query
  const { data: searchResults, isLoading: isSearching } = trpc.search.query.useQuery(
    { text: query },
    { enabled: open && query.length >= 2, staleTime: 0 }
  );

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

  // Combine static commands and dynamic search results
  const searchCommands: Command[] = (searchResults || []).map((res) => ({
    id: `search-${res.id}`,
    label: res.title,
    icon: res.type === 'note' ? '≡' : res.type === 'task' ? '✓' : res.type === 'journal' ? '◉' : '◈',
    group: "search",
    data: res, // custom data for rendering
    action: () => {
      switch (res.type) {
        case 'note': router.push(`/notes?id=${res.id}`); break;
        case 'task': router.push(`/execution?taskId=${res.id}`); break;
        case 'journal': router.push(`/journey?id=${res.id}`); break;
        case 'milestone': router.push(`/journey?id=${res.id}`); break;
      }
    }
  }));

  const allFiltered = [...searchCommands, ...filteredCommands];

  // Arrow key + Enter navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, allFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = allFiltered[selectedIndex];
        if (cmd) {
          cmd.action();
          setOpen(false);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selectedIndex, allFiltered, setSelectedIndex, setOpen]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  // Grouped display
  const grouped = GROUP_ORDER.reduce<Record<string, Command[]>>((acc, group) => {
    const items = allFiltered.filter((c) => c.group === group);
    if (items.length > 0) acc[group] = items;
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-[640px] bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Search bar */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 bg-white/[0.02]">
            <PhosphorIcons.MagnifyingGlass size={20} className="text-muted-foreground mr-1" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything or run a command... (Ctrl+K)"
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            )}
            <Kbd keys={["esc"]} />
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto custom-scrollbar px-2 py-2">
            {allFiltered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-mono text-xs text-muted-foreground">no results for "{query}"</p>
              </div>
            ) : (
              Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-4 last:mb-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 font-bold">
                      {GROUP_LABELS[group]}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  {items.map((cmd) => {
                    const idx = flatIndex++;
                    const isSelected = idx === selectedIndex;
                    const searchData = (cmd as any).data;

                    return (
                      <div
                        key={cmd.id}
                        data-index={idx}
                        onClick={() => { cmd.action(); setOpen(false); }}
                        onMouseMove={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150",
                          isSelected
                            ? "bg-white/[0.08] shadow-inner"
                            : "hover:bg-white/[0.04] text-muted-foreground"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 bg-white/5 font-mono text-sm transition-colors",
                          isSelected && "bg-primary/20 border-primary/20 text-primary"
                        )}>
                          {cmd.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-mono text-sm truncate",
                              isSelected ? "text-foreground font-medium" : "text-foreground/70"
                            )}>
                              {cmd.label}
                            </span>
                            {cmd.shortcut && (
                              <div className="flex gap-1 opacity-40">
                                {cmd.shortcut.map(key => <Kbd key={key} keys={[key]} />)}
                              </div>
                            )}
                          </div>
                          {searchData?.snippet && (
                            <div 
                              className="text-[11px] font-mono text-muted-foreground/60 mt-0.5 line-clamp-1"
                              dangerouslySetInnerHTML={{ __html: searchData.snippet }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-t border-white/5">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑↓</span> navigate
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">Enter</span> select
              </span>
            </div>
            <div className="font-mono text-[10px] text-primary/40 font-bold uppercase tracking-tighter">
              B.R.A.I.N Search v1.0
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
