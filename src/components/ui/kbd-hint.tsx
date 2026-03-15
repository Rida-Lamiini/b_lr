"use client";

import { cn } from "@/lib/utils";

interface KbdProps {
  /** Array of keys e.g. ["⌘", "K"] or ["Ctrl", "K"] */
  keys: string[];
  className?: string;
}

/**
 * Renders keyboard shortcut chips.
 * Usage: <Kbd keys={["⌘", "K"]} />
 */
export function Kbd({ keys, className }: KbdProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((k) => (
        <kbd
          key={k}
          className="kbd"
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

interface KbdHintProps {
  /** The element to wrap */
  children: React.ReactNode;
  /** Shortcut keys to show in tooltip */
  keys: string[];
  /** Optional label shown next to keys e.g. "New task" */
  label?: string;
}

/**
 * Wraps any element and shows a keyboard shortcut tooltip on hover.
 * Uses CSS title attribute for simplicity — no JS needed.
 */
export function KbdHint({ children, keys, label }: KbdHintProps) {
  const title = label
    ? `${label} (${keys.join("+")})`
    : keys.join("+");

  return (
    <span title={title} className="inline-flex">
      {children}
    </span>
  );
}