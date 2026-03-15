"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useSidebar } from "./sidebar-provider";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { useBrainCommands } from "@/components/command-palette/useBrainCommands";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isOpen, setIsOpen } = useSidebar();

  useBrainCommands(); // registers all commands

  console.log('[DashboardShell] Rendering with children:', !!children, 'isOpen:', isOpen);

  // only hide sidebar on mobile; desktop experience keeps it open
  const handleClose = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isOpen} onClose={handleClose} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
      {/* Always mounted, toggled via Cmd+K */}
      <CommandPalette />
    </div>
  );
}
