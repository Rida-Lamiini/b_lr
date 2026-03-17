"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AreaHealthProps {
  totalTasks: number;
  completedTasks: number;
  projectCount: number;
  lastActivityDate: Date;
}

export function AreaHealth({
  totalTasks,
  completedTasks,
  projectCount,
  lastActivityDate,
}: AreaHealthProps) {
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const activityScore = projectCount > 0 ? Math.min(100, projectCount * 20) : 0;
  
  // Health calculation: 0-100 score
  const healthScore = Math.round((completionRate * 0.4 + activityScore * 0.6));
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-success", bg: "bg-success/10", icon: "🚀" };
    if (score >= 60) return { label: "Good", color: "text-info", bg: "bg-info/10", icon: "✨" };
    if (score >= 40) return { label: "Fair", color: "text-warning", bg: "bg-warning/10", icon: "⚡" };
    return { label: "Needs Attention", color: "text-destructive", bg: "bg-destructive/10", icon: "⚠️" };
  };

  const status = getHealthStatus(healthScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-md bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.Heart size={20} className="text-destructive" />
        Area Health
      </h3>

      <div className="space-y-6">
        {/* Circular progress */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-border/40"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={status.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-foreground">{healthScore}</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </motion.div>
            </div>
          </div>

          <div className={cn(
            "px-3 py-1.5 rounded-full text-sm font-semibold",
            status.bg,
            status.color
          )}>
            {status.icon} {status.label}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3 border-t border-border/40 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Task Completion</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full bg-success"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
              </div>
              <span className="text-xs font-semibold text-foreground">{Math.round(completionRate)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Project Activity</span>
            <span className="text-xs font-semibold text-foreground">{projectCount} projects</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last Activity</span>
            <span className="text-xs font-semibold text-foreground">
              {new Date(lastActivityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
