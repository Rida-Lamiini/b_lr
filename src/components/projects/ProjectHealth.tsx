"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ProjectHealthProps {
  totalTasks: number;
  completedTasks: number;
  overdueTasks?: number;
  lastActivityDate: Date;
}

export function ProjectHealth({ totalTasks, completedTasks, overdueTasks = 0, lastActivityDate }: ProjectHealthProps) {
  // Calculate health score (0-100)
  const completionScore = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 0;
  const activityScore = calculateActivityScore(lastActivityDate);
  const riskScore = Math.min(40, (overdueTasks || 0) * 10);
  const healthScore = Math.round(completionScore + activityScore - riskScore);

  // Determine health status
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-success", bgColor: "bg-success/10", icon: "CheckCircle" };
    if (score >= 60) return { label: "Good", color: "text-blue-500", bgColor: "bg-blue-500/10", icon: "ThumbsUp" };
    if (score >= 40) return { label: "Fair", color: "text-warning", bgColor: "bg-warning/10", icon: "Warning" };
    return { label: "At Risk", color: "text-destructive", bgColor: "bg-destructive/10", icon: "WarningCircle" };
  };

  const status = getHealthStatus(healthScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35 }}
      className="rounded-lg bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border border-primary/20 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.Heart size={20} className="text-destructive" />
        Project Health
      </h3>

      {/* Health Score Circle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="relative w-32 h-32 mx-auto">
            {/* Animated background circle */}
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
                className="opacity-20"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${(healthScore / 100) * 345.575} 345.575`}
                stroke={status.color.includes("success") ? "rgb(74, 222, 128)" : 
                        status.color.includes("blue") ? "rgb(59, 130, 246)" :
                        status.color.includes("warning") ? "rgb(251, 146, 60)" :
                        "rgb(239, 68, 68)"}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 345.575" }}
                animate={{ strokeDasharray: `${(healthScore / 100) * 345.575} 345.575` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-foreground"
                >
                  {healthScore}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className={cn("rounded-lg p-4 text-center", status.bgColor)}>
          <div className={cn("text-2xl mb-2 flex justify-center", status.color)}>
            {status.icon === "CheckCircle" && <PhosphorIcons.CheckCircle size={24} weight="fill" />}
            {status.icon === "ThumbsUp" && <PhosphorIcons.ThumbsUp size={24} weight="fill" />}
            {status.icon === "Warning" && <PhosphorIcons.Warning size={24} weight="fill" />}
            {status.icon === "WarningCircle" && <PhosphorIcons.WarningCircle size={24} weight="fill" />}
          </div>
          <p className={cn("text-sm font-semibold", status.color)}>{status.label}</p>
          <p className="text-xs text-muted-foreground mt-1">Project Status</p>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="space-y-3 border-t border-border/40 pt-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Completion</span>
            <span className="text-xs font-semibold text-foreground">{Math.round(completionScore)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionScore}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-success rounded-full"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Activity</span>
            <span className="text-xs font-semibold text-foreground">{Math.round(activityScore)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activityScore}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>

        {overdueTasks > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Risk Level</span>
              <span className="text-xs font-semibold text-destructive">{Math.round(riskScore)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskScore}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-destructive rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function calculateActivityScore(lastActivityDate: Date): number {
  const daysSinceActivity = Math.floor((new Date().getTime() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceActivity === 0) return 60;
  if (daysSinceActivity <= 3) return 50;
  if (daysSinceActivity <= 7) return 40;
  if (daysSinceActivity <= 14) return 30;
  return Math.max(0, 20 - daysSinceActivity);
}
