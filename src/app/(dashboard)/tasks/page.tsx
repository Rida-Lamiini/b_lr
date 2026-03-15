"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function TasksPage() {
  const { data: tasks, isLoading, refetch } = trpc.task.getAll.useQuery({});
  const toggleMutation = trpc.task.toggle.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <SectionHeader 
        label="Tasks" 
        action={
          <button className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1 rounded-md text-[12px] font-semibold transition-colors">
            <PhosphorIcons.Plus size={14} weight="bold" />
            New Task
          </button>
        }
      />

      <div className="gh-box overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <PhosphorIcons.CircleNotch className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : tasks?.length === 0 ? (
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
        ) : (
          <div className="divide-y divide-border">
            {tasks?.map((task) => (
              <div key={task.id} className="group p-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
                <button 
                  onClick={() => toggleMutation.mutate({ id: task.id, completed: !task.completed })}
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    task.completed 
                      ? "bg-[#238636] border-[#238636] text-white" 
                      : "border-border hover:border-muted-foreground text-transparent"
                  )}
                >
                  <PhosphorIcons.Check size={12} weight="bold" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-[14px] transition-all",
                    task.completed ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {task.title}
                  </p>
                  {task.containerId && (
                    <span className="text-[10px] text-primary hover:underline cursor-pointer">
                      #{task.containerId}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <PhosphorIcons.PencilSimple size={14} />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <PhosphorIcons.Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}