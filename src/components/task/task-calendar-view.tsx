"use client";

import React, { useState } from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";

interface TaskCalendarViewProps {
  tasks: any[];
  onEdit: (task: any) => void;
  isLoading: boolean;
}

export function TaskCalendarView({ tasks, onEdit, isLoading }: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <PhosphorIcons.CircleNotch className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="gh-box overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/10">
        <h3 className="text-[14px] font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={prevMonth}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <PhosphorIcons.CaretLeft size={16} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-2 py-1 text-[12px] hover:bg-muted rounded-md transition-colors"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <PhosphorIcons.CaretRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-[10px] font-bold text-muted-foreground uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 min-h-[500px]">
        {calendarDays.map((day, idx) => {
          const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toString()} 
              className={cn(
                "min-h-[100px] border-r border-b border-border p-1 hover:bg-muted/10 transition-colors relative",
                !isSelectedMonth && "bg-muted/5",
                idx % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex items-center justify-between p-1">
                <span className={cn(
                  "text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-full shrink-0",
                  isToday ? "bg-primary text-primary-foreground" : 
                  isSelectedMonth ? "text-foreground" : "text-muted-foreground"
                )}>
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[9px] text-muted-foreground">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayTasks.map((task) => (
                  <button 
                    key={task.id}
                    onClick={() => onEdit(task)}
                    className={cn(
                      "w-full text-left px-1.5 py-0.5 text-[10px] rounded truncate border transition-all",
                      task.completed 
                        ? "bg-muted text-muted-foreground border-transparent line-through" 
                        : "bg-primary/5 border-primary/20 text-primary hover:border-primary/50"
                    )}
                  >
                    {task.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
