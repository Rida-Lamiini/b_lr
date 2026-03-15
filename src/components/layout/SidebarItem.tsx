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
        "flex items-center gap-3 px-3 py-1.5 mx-2 rounded-md transition-all duration-200 group no-underline relative",
        isActive
          ? "bg-secondary text-foreground font-medium"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary rounded-full" />
      )}
      <span className={cn(
        "flex-shrink-0 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {icon}
      </span>
      <span className="flex-1 truncate text-xs font-medium">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full border border-border">
          {count}
        </span>
      )}
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
      )}
    </Link>
  );
}
