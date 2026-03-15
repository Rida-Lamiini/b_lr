"use client";

import React, { useState } from "react";
import { format, startOfDay, addHours } from "date-fns";
import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import { UnscheduledTasks } from "@/components/timeboxing/unscheduled-tasks";
import { TimeboxingTimeline } from "@/components/timeboxing/timeboxing-timeline";
import * as PhosphorIcons from "@phosphor-icons/react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const utils = trpc.useUtils();

  const { data: timeblocks, isLoading } = trpc.timeblock.getAll.useQuery({ 
    date: selectedDate 
  });

  const upsertMutation = trpc.timeblock.upsert.useMutation({
    onSuccess: () => utils.timeblock.getAll.invalidate(),
  });

  const deleteMutation = trpc.timeblock.delete.useMutation({
    onSuccess: () => utils.timeblock.getAll.invalidate(),
  });

  const handleDragStart = (e: React.DragEvent, task: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(task));
  };

  const handleDrop = async (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData("application/json");
    if (!taskData) return;

    const task = JSON.parse(taskData);
    
    const startTime = startOfDay(selectedDate);
    startTime.setHours(hour);
    
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1);

    upsertMutation.mutate({
      title: task.title,
      start: startTime,
      end: endTime,
      taskId: task.id,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      <SectionHeader 
        label="Timeboxing & Schedule" 
        action={
          <div className="flex items-center gap-2 bg-secondary/10 p-1 rounded-md border border-border">
            <button className="p-1 px-2 text-[12px] font-medium hover:bg-background rounded-sm transition-all text-muted-foreground cursor-not-allowed">
              Day
            </button>
            <button className="p-1 px-2 text-[12px] font-medium bg-background shadow-sm rounded-sm transition-all text-foreground">
              Timeline
            </button>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden gh-box">
        <div className="w-72 shrink-0">
          <UnscheduledTasks onDragStart={handleDragStart} />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-border bg-secondary/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-[16px] font-bold text-foreground">
                Today's Timeline
              </h2>
              <span className="text-[12px] text-muted-foreground">
                {format(selectedDate, "EEEE, MMMM do")}
              </span>
            </div>
          </div>
          
          <TimeboxingTimeline 
            date={selectedDate} 
            timeblocks={timeblocks || []} 
            onDrop={handleDrop}
            onDeleteItem={(id) => deleteMutation.mutate({ id })}
          />
        </div>
      </div>
    </div>
  );
}