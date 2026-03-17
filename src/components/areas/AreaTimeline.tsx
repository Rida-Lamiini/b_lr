"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";

interface AreaTimelineProps {
  projects: any[];
  tasks: any[];
  notes: any[];
  createdAt: Date;
}

export function AreaTimeline({
  projects,
  tasks,
  notes,
  createdAt,
}: AreaTimelineProps) {
  // Combine and sort events by date
  const events = [
    { type: "area_created", date: createdAt, label: "Area created" },
    ...projects.map(p => ({ type: "project", date: p.createdAt, label: `Project: ${p.name}` })),
    ...tasks.map(t => ({ type: "task", date: t.createdAt, label: `Task: ${t.title}` })),
    ...notes.map(n => ({ type: "note", date: n.createdAt, label: `Note added` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "area_created":
        return PhosphorIcons.FolderPlus;
      case "project":
        return PhosphorIcons.FolderOpen;
      case "task":
        return PhosphorIcons.CheckCircle;
      case "note":
        return PhosphorIcons.NotebookPencil;
      default:
        return PhosphorIcons.Circle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-md bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.Clock size={20} className="text-primary" />
        Timeline
      </h3>

      <div className="space-y-0 relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        {events.map((event, idx) => {
          const Icon = getEventIcon(event.type);
          const date = new Date(event.date);
          const relativeDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              className="flex gap-4 pb-6 relative"
            >
              {/* Timeline dot */}
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center flex-shrink-0 relative z-10">
                  <Icon size={14} className="text-primary" />
                </div>
              </div>

              {/* Event content */}
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-foreground">{event.label}</p>
                <p className="text-xs text-muted-foreground">
                  {relativeDays === 0 ? "Today" : `${relativeDays}d ago`}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
