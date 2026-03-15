"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TaskDialog } from "@/components/task/task-dialog";
import { TaskListView } from "@/components/task/task-list-view";
import { TaskKanbanView } from "@/components/task/task-kanban-view";
import { TaskCalendarView } from "@/components/task/task-calendar-view";

type ViewType = "list" | "kanban" | "calendar";

export default function TasksPage() {
  const [view, setView] = useState<ViewType>("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data: tasks, isLoading, refetch } = trpc.task.getAll.useQuery({});

  const handleCreate = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        label="Tasks" 
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/30 p-0.5 rounded-lg border border-border">
              <button 
                onClick={() => setView("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="List View"
              >
                <PhosphorIcons.List size={16} weight={view === "list" ? "bold" : "regular"} />
              </button>
              <button 
                onClick={() => setView("kanban")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  view === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="Kanban Board"
              >
                <PhosphorIcons.Kanban size={16} weight={view === "kanban" ? "bold" : "regular"} />
              </button>
              <button 
                onClick={() => setView("calendar")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  view === "calendar" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="Calendar View"
              >
                <PhosphorIcons.Calendar size={16} weight={view === "calendar" ? "bold" : "regular"} />
              </button>
            </div>

            <button 
              onClick={handleCreate}
              className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors"
            >
              <PhosphorIcons.Plus size={14} weight="bold" />
              New Task
            </button>
          </div>
        }
      />

      <div className="min-h-[400px]">
        {view === "list" && (
          <TaskListView tasks={tasks || []} onEdit={handleEdit} isLoading={isLoading} />
        )}
        {view === "kanban" && (
          <TaskKanbanView tasks={tasks || []} onEdit={handleEdit} isLoading={isLoading} />
        )}
        {view === "calendar" && (
          <TaskCalendarView tasks={tasks || []} onEdit={handleEdit} isLoading={isLoading} />
        )}
      </div>

      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        task={editingTask}
        onSuccess={() => {
          refetch();
          setEditingTask(null);
        }}
      />
    </div>
  );
}