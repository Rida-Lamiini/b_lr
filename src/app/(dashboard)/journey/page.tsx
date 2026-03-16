"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import * as PhosphorIcons from "@phosphor-icons/react";
import { JournalView } from "@/components/journey/journal-view";
import { MilestoneView } from "@/components/journey/milestone-view";
import { TimelineView } from "@/components/journey/timeline-view";

import DailyLogPage from "./daily/page";

type Tab = "timeline" | "journal" | "milestones" | "daily";

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "timeline", label: "Timeline", icon: PhosphorIcons.Path },
    { id: "journal", label: "Journal", icon: PhosphorIcons.Notebook },
    { id: "milestones", label: "Milestones", icon: PhosphorIcons.Flag },
    { id: "daily", label: "Daily Status", icon: PhosphorIcons.Pulse },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <SectionHeader 
        label="Venture Journey" 
        action={
          <div className="flex items-center gap-1 bg-secondary/10 p-1 rounded-lg border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
                    isActive 
                      ? "bg-background shadow-sm text-primary border border-border" 
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                >
                  <Icon size={14} weight={isActive ? "bold" : "regular"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar pr-1">
        <div className="max-w-4xl mx-auto">
          {activeTab === "timeline" && <TimelineView />}
          {activeTab === "journal" && <JournalView />}
          {activeTab === "milestones" && <MilestoneView />}
          {activeTab === "daily" && <DailyLogPage />}
        </div>
      </div>
    </div>
  );
}