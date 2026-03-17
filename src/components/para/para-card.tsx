"use client";

import { cn } from "@/lib/utils";
import * as PhosphorIcons from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      className="group"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative overflow-hidden rounded-md bg-card border border-border h-full",
          "p-5 flex flex-col gap-4 transition-all duration-300",
          "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
          className
        )}
      >
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              "border transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-lg",
              config.bg,
              config.color,
              "border-current border-opacity-20"
            )}>
              <Icon weight="duotone" size={24} />
            </div>
            
            <div className="text-right flex-shrink-0">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-md transition-colors",
                "bg-primary/10 text-primary"
              )}>
                {config.label}
              </span>
            </div>
          </div>

          {/* Title and description */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description || `A ${config.label.toLowerCase()} in your system`}
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex gap-6 mb-4 py-3 border-t border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
                  <PhosphorIcons.CheckCircle size={14} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">{stats.tasks}</span>
                  <span className="text-[10px] text-muted-foreground">tasks</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
                  <PhosphorIcons.Note size={14} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">{stats.notes}</span>
                  <span className="text-[10px] text-muted-foreground">notes</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success/60" />
              <span className="text-xs text-muted-foreground font-medium">Active</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Decorative accent */}
        {color && (
          <div 
            className="absolute top-0 right-0 w-1 h-full" 
            style={{ backgroundColor: color, opacity: 0.3 }} 
          />
        )}
      </motion.div>
    </Link>
  );
}
