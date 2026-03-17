"use client";

import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import * as Icons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col w-64 min-w-[256px] h-screen bg-background/95 backdrop-blur-sm border-r border-border overflow-hidden transition-transform duration-300 lg:relative lg:translate-x-0 group/sidebar",
      !isOpen && "-translate-x-full"
    )}>
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-border/60 flex-shrink-0 relative z-10">
        <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
          <Icons.Cube size={16} weight="bold" />
        </div>
        <span className="text-xs font-bold tracking-wide text-foreground font-mono">
          BRAIN<span className="text-primary/70 mx-1">/</span>LOCUS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar pt-6 pb-4 relative z-10">
        <SidebarSection id="organize" label="Synthesis">
          <SidebarItem href="/" icon={<Icons.SquaresFour weight="duotone" />} label="Locus Overview" />
          <SidebarItem href="/projects" icon={<Icons.Kanban weight="duotone" />} label="Active Projects" />
          <SidebarItem href="/areas" icon={<Icons.CircleHalfTilt weight="duotone" />} label="Areas of Life" />
          <SidebarItem href="/resources" icon={<Icons.Archive weight="duotone" />} label="Knowledge Base" />
        </SidebarSection>

        <SidebarSection id="work" label="Execution">
          <SidebarItem href="/tasks" icon={<Icons.CheckCircle weight="duotone" />} label="Task Engine" />
          <SidebarItem href="/notes" icon={<Icons.Note weight="duotone" />} label="Neural Notes" />
          <SidebarItem href="/files" icon={<Icons.Files weight="duotone" />} label="Vault Files" />
          <SidebarItem href="/calendar" icon={<Icons.Calendar weight="duotone" />} label="Temporal Map" />
        </SidebarSection>

        <SidebarSection id="journey" label="Ascension">
          <SidebarItem href="/journey" icon={<Icons.Path weight="duotone" />} label="Venture Journey" />
          <SidebarItem href="/journey/daily" icon={<Icons.Pulse weight="duotone" />} label="Daily Sync" />
          <SidebarItem href="/journey/review" icon={<Icons.ArrowClockwise weight="duotone" />} label="Weekly Delta" />
        </SidebarSection>

        <SidebarSection id="focus" label="Deep Work">
          <SidebarItem href="/focus" icon={<Icons.Timer weight="duotone" />} label="Flow State" />
        </SidebarSection>
      </nav>

      {/* User Footer */}
      <div className="flex items-center gap-3 px-5 h-16 border-t border-border/60 flex-shrink-0 hover:bg-muted/50 cursor-pointer transition-all duration-200 relative z-10 group/user">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-[11px] font-bold text-primary shadow-sm group-hover/user:shadow-md transition-shadow">
          R
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-xs text-foreground truncate font-semibold uppercase tracking-wide">
            rida
          </span>
          <span className="text-[8px] text-muted-foreground flex items-center gap-1 uppercase font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-success/80 shadow-sm animate-pulse" />
            Active
          </span>
        </div>
        <Icons.DotsThreeVertical size={16} className="text-muted-foreground group-hover/user:text-foreground transition-colors flex-shrink-0" />
      </div>
    </aside>
  );
}
