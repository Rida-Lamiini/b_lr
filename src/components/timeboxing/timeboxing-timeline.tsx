"use client";

import React from "react";
import { format, addHours, startOfDay, addMinutes } from "date-fns";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  date: Date;
  timeblocks: any[];
  onDrop: (e: React.DragEvent, hour: number) => void;
  onDeleteItem: (id: string) => void;
}

export function TimeboxingTimeline({ date, timeblocks, onDrop, onDeleteItem }: TimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background custom-scrollbar relative">
      <div className="absolute left-[60px] top-0 bottom-0 w-px bg-border z-0" />
      
      <div className="relative z-10">
        {hours.map((hour) => {
          const hourBlocks = timeblocks.filter(block => {
            const blockDate = new Date(block.start);
            return blockDate.getHours() === hour;
          });

          return (
            <div 
              key={hour}
              onDragOver={handleDragOver}
              onDrop={(e) => onDrop(e, hour)}
              className="group flex border-b border-border/50 min-h-[60px] hover:bg-primary/5 transition-colors"
            >
              <div className="w-[60px] py-2 px-3 text-right">
                <span className="text-[10px] font-medium text-muted-foreground sticky top-0">
                  {format(addHours(startOfDay(date), hour), "HH:mm")}
                </span>
              </div>
              
              <div className="flex-1 p-1 flex flex-col gap-1 relative">
                {hourBlocks.map((block) => (
                  <div 
                    key={block.id}
                    className="p-2 bg-primary/10 border border-primary/20 rounded-md shadow-sm group/block transition-all hover:bg-primary/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <PhosphorIcons.Clock size={12} className="text-primary" />
                        <span className="text-[12px] font-semibold truncate text-foreground">
                          {block.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => onDeleteItem(block.id)}
                        className="opacity-0 group-block/hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <PhosphorIcons.Trash size={12} />
                      </button>
                    </div>
                    {block.task && (
                      <div className="mt-1 flex items-center gap-1.5 opacity-70">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span className="text-[10px] text-muted-foreground truncate">
                          Linked to: {block.task.title}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                
                {hourBlocks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <span className="text-[10px] text-primary/40 font-medium">Drop here to schedule</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
