"use client";

import { useState, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  id: string;
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function SidebarSection({
  id,
  label,
  defaultOpen = true,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`brain-sidebar-${id}`);
    if (stored !== null) {
      setOpen(stored === "true");
    }
  }, [id]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (mounted) localStorage.setItem(`brain-sidebar-${id}`, String(next));
  };

  return (
    <div className="mb-6 last:mb-0">
      <button
        onClick={toggle}
        className="flex items-center gap-3 w-full px-7 py-2 text-left group transition-all"
      >
        <span className="text-[9px] font-black font-mono text-muted-foreground/60 uppercase tracking-[0.25em] group-hover:text-primary transition-colors flex-1">
          {label}
        </span>
        <CaretDown 
          size={10} 
          weight="bold"
          className={cn(
            "text-muted-foreground/40 transition-transform duration-300 group-hover:text-primary",
            !open && "-rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  );
}
