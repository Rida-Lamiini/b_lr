"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { useBrainCommands } from "@/components/command-palette/useBrainCommands";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useBrainCommands();
  const pathname = usePathname();

  return (
    <div className="flex flex-row h-screen w-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar — fixed left column */}
      <Sidebar />

      {/* Main content — takes remaining width */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Header bar */}
        <header className="flex items-center px-6 h-12 flex-shrink-0 bg-background/50 backdrop-blur-md border-b border-border font-mono text-[11px] text-muted-foreground z-10">
          <span className="opacity-50">brain /</span>
          <span className="text-foreground ml-1.5 font-medium">
            {pathname.split("/").pop() || "page"}
          </span>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-8 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global command palette */}
      <CommandPalette />
    </div>
  );
}
