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
        "flex items-center gap-2 px-3 py-2",
        "bg-card/50 border border-border rounded-md",
        "text-xs text-muted-foreground",
        "hover:bg-card hover:border-muted hover:text-foreground",
        "transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      <span className="flex-shrink-0 text-xs">⌕</span>
      <span className="text-muted-foreground text-xs truncate flex-1">Search or run command...</span>
      <Kbd keys={["⌘K"]} />
    </button>
  );
}
