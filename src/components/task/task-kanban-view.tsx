"use client";

import React from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { format } from "date-fns";

interface TaskKanbanViewProps {
  tasks: any[];
  onEdit: (task: any) => void;
  isLoading: boolean;
}

export function TaskKanbanView({ tasks, onEdit, isLoading }: TaskKanbanViewProps) {
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

  const columns = [
    { title: "Todo", tasks: tasks.filter(t => !t.completed) },
    { title: "Done", tasks: tasks.filter(t => t.completed) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {columns.map((column) => (
        <div key={column.title} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[14px] font-semibold flex items-center gap-2">
              {column.title === "Todo" ? (
                <PhosphorIcons.Circle className="text-blue-500" size={16} weight="bold" />
              ) : (
                <PhosphorIcons.CheckCircle className="text-[#238636]" size={16} weight="bold" />
              )}
              {column.title}
              <span className="text-[12px] text-muted-foreground font-normal">
                ({column.tasks.length})
              </span>
            </h3>
          </div>

          <div className="space-y-3">
            {column.tasks.map((task) => (
              <div 
                key={task.id} 
                className="gh-box p-4 space-y-3 group hover:border-primary/30 transition-colors cursor-default"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "text-[14px] font-medium leading-tight mb-1",
                      task.completed && "text-muted-foreground line-through"
                    )}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-[12px] text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
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
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
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
                    {task.dueDate && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <PhosphorIcons.Hourglass size={12} />
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <PhosphorIcons.PencilSimple size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure?")) deleteMutation.mutate({ id: task.id });
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <PhosphorIcons.Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {column.tasks.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-8 flex items-center justify-center text-muted-foreground text-[12px]">
                No tasks in this column
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
