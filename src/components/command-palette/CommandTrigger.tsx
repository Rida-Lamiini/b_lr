"use client";

import { useCommandPalette } from "@/hooks/useCommandPalette";
import { Kbd } from "@/components/ui/kbd-hint";
import { cn } from "@/lib/utils";

/**
 * Clickable search button in the header that opens the command palette.
 * Also shows Cmd+K shortcut hint.
 */
export function CommandTrigger({ className }: { className?: string }) {
  const setOpen = useCommandPalette((s) => s.setOpen);

  return (
    <button
      onClick={() => setOpen(true)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5",
        "bg-bg-2 border border-border-default rounded-md",
        "font-mono text-xs text-text-3",
        "hover:border-border-emphasis hover:text-text-2",
        "transition-colors duration-fast",
        className
      )}
    >
      <span className="text-text-3">⌕</span>
      <span>Search or run command...</span>
      <Kbd keys={["⌘K"]} />
    </button>
  );
}