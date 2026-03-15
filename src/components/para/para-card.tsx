"use client";

import { cn } from "@/lib/utils";
import * as PhosphorIcons from "@phosphor-icons/react";
import Link from "next/link";

interface PARACardProps {
  id: string;
  name: string;
  description?: string | null;
  type: "PROJECT" | "AREA" | "RESOURCE" | "ARCHIVE";
  updatedAt: Date | string;
  stats?: {
    tasks: number;
    notes: number;
  };
  color?: string;
  className?: string;
}

const typeConfig = {
  PROJECT: {
    icon: PhosphorIcons.Kanban,
    label: "Project",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  AREA: {
    icon: PhosphorIcons.Briefcase,
    label: "Area",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  RESOURCE: {
    icon: PhosphorIcons.BookBookmark,
    label: "Resource",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  ARCHIVE: {
    icon: PhosphorIcons.Archive,
    label: "Archive",
    color: "text-gray-500",
    bg: "bg-gray-500/10",
  },
};

export function PARACard({ 
  id, 
  name, 
  description, 
  type, 
  updatedAt, 
  stats, 
  color,
  className 
}: PARACardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Link 
      href={`/${type.toLowerCase()}s/${id}`}
      className={cn(
        "interactive-card p-4 flex flex-col gap-3 group h-full",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center border border-border transition-colors group-hover:border-primary/30",
            config.bg,
            config.color
          )}>
            <Icon weight="duotone" size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {name}
            </h3>
            <p className="text-[12px] text-muted-foreground line-clamp-1">
              {description || `A PARA ${config.label.toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {stats && (
            <>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <PhosphorIcons.CheckCircle size={14} />
                {stats.tasks}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <PhosphorIcons.Note size={14} />
                {stats.notes}
              </div>
            </>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {new Date(updatedAt).toLocaleDateString()}
        </div>
      </div>
      
      {color && (
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full" 
          style={{ backgroundColor: color }} 
        />
      )}
    </Link>
  );
}
