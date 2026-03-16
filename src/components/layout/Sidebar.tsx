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
      "fixed inset-y-0 left-0 z-50 flex flex-col w-64 min-w-[256px] h-screen bg-background/60 backdrop-blur-xl border-r border-border/40 overflow-hidden transition-transform duration-300 lg:relative lg:translate-x-0 group/sidebar",
      !isOpen && "-translate-x-full"
    )}>
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-1000" />
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-14 border-b border-border/40 flex-shrink-0 relative z-10">
        <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Icons.Cube size={14} weight="bold" />
        </div>
        <span className="text-sm font-bold tracking-tight text-foreground font-mono">
          BRAIN <span className="text-primary font-light opacity-50">/</span> LOCUS
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
      <div className="flex items-center gap-3 px-5 h-16 border-t border-border/40 flex-shrink-0 hover:bg-primary/5 cursor-pointer transition-all duration-300 relative z-10 group/user">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shadow-inner">
          R
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-xs text-foreground truncate font-bold uppercase tracking-wider font-mono">
            rida
          </span>
          <span className="text-[9px] text-muted-foreground flex items-center gap-1.5 uppercase font-medium tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            Core System Active
          </span>
        </div>
        <Icons.DotsThreeVertical className="text-muted-foreground group-hover/user:text-foreground transition-colors" />
      </div>
    </aside>
  );
}
