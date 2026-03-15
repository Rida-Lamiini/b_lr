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
    <div className="mb-4">
      <button
        onClick={toggle}
        className="flex items-center gap-2 w-full px-6 py-1.5 text-left group transition-colors"
      >
        <CaretDown 
          size={10} 
          weight="bold"
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            !open && "-rotate-90"
          )}
        />
        <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  );
}
