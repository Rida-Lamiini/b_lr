"use client";

import React from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { format } from "date-fns";

interface TaskListViewProps {
  tasks: any[];
  onEdit: (task: any) => void;
  isLoading: boolean;
}

export function TaskListView({ tasks, onEdit, isLoading }: TaskListViewProps) {
  const utils = trpc.useUtils();
  
  const toggleMutation = trpc.task.toggle.useMutation({
    onSuccess: () => utils.task.getAll.invalidate(),
  });

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.getAll.invalidate(),
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <PhosphorIcons.CircleNotch className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
          <PhosphorIcons.CheckCircle size={24} weight="duotone" />
        </div>
        <div className="space-y-1">
          <h3 className="text-[16px] font-semibold">Workspace is clear</h3>
          <p className="text-[14px] text-muted-foreground max-w-xs">
            No active tasks found. Capture something new or take a moment to reflect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gh-box overflow-hidden divide-y divide-border">
      {tasks.map((task) => (
        <div key={task.id} className="group p-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
          <button 
            onClick={() => toggleMutation.mutate({ id: task.id, completed: !task.completed })}
            className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
              task.completed 
                ? "bg-[#238636] border-[#238636] text-white" 
                : "border-border hover:border-muted-foreground text-transparent"
            )}
          >
            <PhosphorIcons.Check size={12} weight="bold" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-[14px] transition-all truncate",
                task.completed ? "text-muted-foreground line-through" : "text-foreground"
              )}>
                {task.title}
              </p>
              {task.priority && task.priority > 1 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                  task.priority === 5 ? "bg-red-500/10 text-red-500" :
                  task.priority === 4 ? "bg-orange-500/10 text-orange-500" :
                  "bg-yellow-500/10 text-yellow-500"
                )}>
                  P{task.priority}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              {task.dueDate && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <PhosphorIcons.Calendar size={12} />
                  {format(new Date(task.dueDate), "MMM d")}
                </span>
              )}
              {task.containerId && (
                <span className="text-[11px] text-primary hover:underline cursor-pointer flex items-center gap-1">
                  <PhosphorIcons.Tag size={12} />
                  {task.containerId}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <PhosphorIcons.PencilSimple size={14} />
            </button>
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to delete this task?")) {
                  deleteMutation.mutate({ id: task.id });
                }
              }}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
            >
              <PhosphorIcons.Trash size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
