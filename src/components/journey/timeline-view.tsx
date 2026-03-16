"use client";

import React from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { format } from "date-fns";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

export function TimelineView() {
  const { data: timeline, isLoading } = trpc.journey.getTimeline.useQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Synchronizing journey...</div>;
  }

  return (
    <div className="relative">
      {/* Central Line */}
      <div className="absolute left-[21px] md:left-1/2 top-4 bottom-4 w-px bg-border/60 -translate-x-1/2 z-0" />

      <div className="space-y-12 relative z-10">
        {timeline?.map((item, index) => {
          const isLeft = index % 2 === 0;
          const configMap = {
            journal: {
              icon: PhosphorIcons.Notebook,
              color: "text-primary",
              bg: "bg-primary/10",
              border: "border-primary/20",
              label: "Journal Record"
            },
            milestone: {
              icon: PhosphorIcons.Flag,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
              border: "border-amber-500/20",
              label: "Milestone Reached"
            },
            task: {
              icon: PhosphorIcons.CheckCircle,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              border: "border-emerald-500/20",
              label: "Task Accomplished"
            },
            dailyLog: {
              icon: PhosphorIcons.Pulse,
              color: "text-rose-400",
              bg: "bg-rose-400/10",
              border: "border-rose-400/20",
              label: "Status Sync"
            }
          };
          
          const config = configMap[item.type as keyof typeof configMap];
          const Icon = config.icon;

          return (
            <div key={`${item.type}-${item.id}`} className={cn(
              "flex flex-col md:flex-row items-start md:items-center gap-6",
              isLeft ? "md:flex-row-reverse" : ""
            )}>
              {/* Content Card */}
              <div className="flex-1 w-full md:w-auto">
                <div className={cn(
                  "gh-card p-4 hover:shadow-xl transition-all hover:scale-[1.01]",
                  isLeft ? "md:text-right" : "md:text-left"
                )}>
                  <div className={cn(
                    "flex flex-col",
                    isLeft ? "md:items-end" : "md:items-start"
                  )}>
                    <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em] mb-1 px-2 py-0.5 rounded-full inline-block", config.bg, config.color)}>
                      {config.label}
                    </span>
                    <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                    <p className="text-[10px] font-mono text-muted-foreground mb-3">
                      {format(new Date(item.date), "MMMM d, yyyy")}
                    </p>
                    {item.content && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Central Marker */}
              <div className="absolute left-[21px] md:static md:left-auto flex items-center justify-center shrink-0 z-20">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 border-background ring-4 ring-background shadow-lg",
                  config.bg,
                  config.border
                )}>
                  <Icon size={18} className={config.color} weight="bold" />
                </div>
              </div>

              {/* Buffer for alternate side layout */}
              <div className="hidden md:block flex-1" />
            </div>
          );
        })}

        {timeline?.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-secondary/20 items-center justify-center mb-4">
              <PhosphorIcons.Wind size={32} className="text-muted-foreground/30" />
            </div>
            <h3 className="text-sm font-bold">A Clean Slate</h3>
            <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px] mx-auto">
              Your Journey is just beginning. Every action here writes the path forward.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
