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
      "fixed inset-y-0 left-0 z-50 flex flex-col w-64 min-w-[256px] h-screen bg-card/50 backdrop-blur-xl border-r border-border overflow-hidden transition-transform duration-300 lg:relative lg:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-12 border-b border-border flex-shrink-0">
        <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Icons.Cube size={14} weight="duotone" />
        </div>
        <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
          brain <span className="text-primary">/</span> locus
        </span>
        <span className="font-mono text-[10px] text-muted-foreground ml-auto opacity-50">
          v0.1.0
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <SidebarSection id="organize" label="Organize">
          <SidebarItem href="/" icon={<Icons.SquaresFour weight="duotone" />} label="Dashboard" />
          <SidebarItem href="/projects" icon={<Icons.Kanban weight="duotone" />} label="Projects" />
          <SidebarItem href="/areas" icon={<Icons.CircleHalfTilt weight="duotone" />} label="Areas" />
          <SidebarItem href="/resources" icon={<Icons.Archive weight="duotone" />} label="Resources" />
          <SidebarItem href="/archives" icon={<Icons.FolderSimpleUser weight="duotone" />} label="Archives" />
        </SidebarSection>

        <SidebarSection id="work" label="Work">
          <SidebarItem href="/tasks" icon={<Icons.CheckCircle weight="duotone" />} label="Tasks" />
          <SidebarItem href="/notes" icon={<Icons.Note weight="duotone" />} label="Notes" />
          <SidebarItem href="/files" icon={<Icons.Files weight="duotone" />} label="Files" />
          <SidebarItem href="/calendar" icon={<Icons.Calendar weight="duotone" />} label="Calendar" />
        </SidebarSection>

        <SidebarSection id="journey" label="Journey">
          <SidebarItem href="/journey/daily" icon={<Icons.ListChecks weight="duotone" />} label="Daily Log" />
          <SidebarItem href="/journey/journal" icon={<Icons.BookOpen weight="duotone" />} label="Journal" />
          <SidebarItem href="/journey/milestones" icon={<Icons.Star weight="duotone" />} label="Milestones" />
          <SidebarItem href="/journey/review" icon={<Icons.ArrowClockwise weight="duotone" />} label="Weekly Review" />
        </SidebarSection>

        <SidebarSection id="focus" label="Focus">
          <SidebarItem href="/focus" icon={<Icons.Timer weight="duotone" />} label="Pomodoro" />
          <SidebarItem href="/focus/tips" icon={<Icons.Lightbulb weight="duotone" />} label="Science Tips" />
        </SidebarSection>
      </nav>

      {/* User Footer */}
      <div className="flex items-center gap-3 px-6 h-16 border-t border-border flex-shrink-0 bg-background/30 transition-colors hover:bg-background/50 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary group-hover:scale-105 transition-transform">
          R
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="font-mono text-sm text-foreground truncate font-medium">
            rida
          </span>
          <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            online
          </span>
        </div>
        <Icons.DotsThreeVertical className="text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </aside>
  );
}
