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

import { motion } from "framer-motion";

export function SidebarItem({ href, icon, label, count, dot }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 mx-2.5 rounded-md transition-all duration-200 group no-underline relative overflow-hidden",
        isActive
          ? "text-primary bg-primary/8 border border-primary/20"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
      )}
    >
      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute inset-0 bg-primary/5 rounded-md z-[-1]"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <span className={cn(
        "flex-shrink-0 transition-all duration-200",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {icon}
      </span>
      
      <span className={cn(
        "flex-1 truncate text-[11px] font-semibold uppercase tracking-wider transition-all duration-200",
        isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
      )}>
        {label}
      </span>
      
      {count !== undefined && count > 0 && (
        <span className="text-[8px] font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded-sm border border-primary/25">
          {count}
        </span>
      )}
      
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-success/80 flex-shrink-0 animate-pulse shadow-sm" />
      )}
    </Link>
  );
}
