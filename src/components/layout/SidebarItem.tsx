"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  count?: number;
  dot?: boolean;
}

export function SidebarItem({ href, icon, label, count, dot }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 mx-2 rounded-xl transition-all duration-200 group no-underline",
        isActive
          ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_12px_rgba(124,58,237,0.05)] border-l-2 border-primary rounded-l-none"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      <span className={cn(
        "flex-shrink-0 transition-colors duration-200",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {icon}
      </span>
      <span className="flex-1 truncate font-mono text-xs tracking-tight">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="font-mono text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">
          {count}
        </span>
      )}
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_hsla(142,70%,50%,0.4)] flex-shrink-0" />
      )}
    </Link>
  );
}
