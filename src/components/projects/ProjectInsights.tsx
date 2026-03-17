"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ProjectInsightsProps {
  totalTasks: number;
  completedTasks: number;
  notes: any[];
  createdAt: Date;
}

export function ProjectInsights({ totalTasks, completedTasks, notes, createdAt }: ProjectInsightsProps) {
  const daysActive = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const tasksPerDay = daysActive > 0 ? (totalTasks / daysActive).toFixed(1) : 0;
  const documentationScore = notes.length > 0 ? Math.min(100, notes.length * 20) : 0;

  const insights = [
    {
      icon: PhosphorIcons.TrendingUp,
      label: "Velocity",
      value: `${tasksPerDay} tasks/day`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: "positive",
      description: "Average task creation rate",
    },
    {
      icon: PhosphorIcons.CheckCircle,
      label: "Completion Rate",
      value: `${Math.round(completionRate)}%`,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: completionRate > 50 ? "positive" : "neutral",
      description: "Tasks completed out of total",
    },
    {
      icon: PhosphorIcons.Book,
      label: "Documentation",
      value: `${notes.length} notes`,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: notes.length > 5 ? "positive" : "neutral",
      description: `${documentationScore}% documentation score`,
    },
    {
      icon: PhosphorIcons.Calendar,
      label: "Project Age",
      value: `${daysActive} days`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      trend: daysActive > 30 ? "positive" : "neutral",
      description: "Time since project creation",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="rounded-lg bg-card border border-border/60 p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
          <PhosphorIcons.Gauge size={20} className="text-primary" />
          Project Insights
        </h3>
        <p className="text-xs text-muted-foreground">Key metrics and performance indicators</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2.5 rounded-lg", insight.bgColor)}>
                  <Icon size={18} className={insight.color} />
                </div>
                {insight.trend === "positive" && (
                  <div className="flex items-center gap-1 text-xs font-medium text-success">
                    <PhosphorIcons.TrendingUp size={12} />
                    Good
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{insight.label}</p>
              <p className="text-lg font-bold text-foreground">{insight.value}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2">{insight.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* AI-Powered Recommendations */}
      <div className="pt-4 border-t border-border/40">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <PhosphorIcons.Lightbulb size={16} className="text-warning" />
          Smart Recommendations
        </h4>
        <div className="space-y-2">
          {completionRate < 30 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20"
            >
              <PhosphorIcons.Warning size={16} className="text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">Consider breaking down larger tasks to boost completion rate</p>
            </motion.div>
          )}
          {notes.length < 3 && totalTasks > 5 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-info/5 border border-info/20"
            >
              <PhosphorIcons.Info size={16} className="text-info flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">Add notes or documentation to track decisions and progress</p>
            </motion.div>
          )}
          {daysActive > 60 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20"
            >
              <PhosphorIcons.CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">Consider archiving completed long-term projects</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
