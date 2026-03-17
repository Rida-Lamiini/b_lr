"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "milestone" | "task" | "note" | "update";
  title: string;
  description?: string;
  date: Date;
  icon: React.ReactNode;
  color: string;
}

interface ProjectTimelineProps {
  tasks: any[];
  notes: any[];
  createdAt: Date;
}

export function ProjectTimeline({ tasks, notes, createdAt }: ProjectTimelineProps) {
  // Build timeline events
  const events: TimelineEvent[] = [
    {
      id: "created",
      type: "milestone",
      title: "Project Created",
      date: createdAt,
      icon: <PhosphorIcons.Kanban size={16} />,
      color: "text-primary",
    },
    ...tasks.slice(0, 3).map((task) => ({
      id: task.id,
      type: "task" as const,
      title: task.title,
      description: task.completed ? "Completed" : "In Progress",
      date: task.createdAt,
      icon: <PhosphorIcons.CheckCircle size={16} />,
      color: task.completed ? "text-success" : "text-blue-500",
    })),
    ...notes.slice(0, 2).map((note) => ({
      id: note.id,
      type: "note" as const,
      title: note.title,
      date: note.createdAt,
      icon: <PhosphorIcons.Note size={16} />,
      color: "text-orange-500",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
      className="rounded-lg bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.Clock size={20} className="text-primary" />
        Project Timeline
      </h3>

      {events.length === 0 ? (
        <div className="py-8 text-center">
          <PhosphorIcons.CalendarBlank size={28} className="text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No timeline events yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 to-transparent" />

          {/* Timeline events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex gap-6 pl-8"
              >
                {/* Dot */}
                <div className="absolute left-2 w-9 h-9 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center -translate-x-1">
                  <div className={cn("text-sm", event.color)}>{event.icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{event.title}</h4>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: new Date(event.date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
