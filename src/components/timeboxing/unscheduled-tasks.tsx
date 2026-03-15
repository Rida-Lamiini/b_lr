"use client";

import React from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";

interface UnscheduledTasksProps {
  onDragStart: (e: React.DragEvent, task: any) => void;
}

export function UnscheduledTasks({ onDragStart }: UnscheduledTasksProps) {
  const { data: tasks, isLoading } = trpc.task.getAll.useQuery({});
  
  // Filter tasks that are not completed and don't have a timeblock already
  // For simplicity in this v1, we'll just show all active tasks and let users drag them.
  // In a more advanced version, we'd filter by those not scheduled for "today".
  const unscheduledTasks = tasks?.filter(t => !t.completed) || [];

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <PhosphorIcons.CircleNotch className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-secondary/5 border-r border-border">
      <div className="p-4 border-b border-border bg-background">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <PhosphorIcons.ClipboardText size={18} className="text-primary" />
          Pending Tasks
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1">
          Drag to schedule
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {unscheduledTasks.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-border rounded-lg">
            <p className="text-[11px] text-muted-foreground">No pending tasks</p>
          </div>
        ) : (
          unscheduledTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task)}
              className="p-3 bg-background border border-border rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium truncate group-hover:text-primary transition-colors">
                  {task.title}
                </span>
                <PhosphorIcons.DotsSixVertical size={14} className="text-muted-foreground" weight="bold" />
              </div>
              {task.priority && task.priority > 1 && (
                <div className="mt-2 text-[10px] inline-flex px-1.5 py-0.5 rounded-full bg-primary/5 text-primary font-medium">
                  Priority {task.priority}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
