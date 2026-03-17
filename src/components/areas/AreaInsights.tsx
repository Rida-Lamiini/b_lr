"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";

interface AreaInsightsProps {
  totalTasks: number;
  completedTasks: number;
  projectCount: number;
  notes: any[];
  createdAt: Date;
}

export function AreaInsights({
  totalTasks,
  completedTasks,
  projectCount,
  notes,
  createdAt,
}: AreaInsightsProps) {
  const daysSinceCreation = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const velocity = daysSinceCreation > 0 ? (completedTasks / daysSinceCreation).toFixed(1) : "0";
  const documentationScore = notes.length > 0 ? Math.min(100, notes.length * 10) : 0;

  const insights = [
    {
      icon: PhosphorIcons.RocketLaunch,
      label: "Velocity",
      value: velocity,
      unit: "tasks/day",
      color: "text-success",
    },
    {
      icon: PhosphorIcons.BookmarkSimple,
      label: "Documentation",
      value: Math.round(documentationScore),
      unit: "%",
      color: "text-info",
    },
  ];

  const recommendations = [];
  
  if (totalTasks > 0 && (completedTasks / totalTasks) < 0.5) {
    recommendations.push({
      icon: PhosphorIcons.Warning,
      text: "Consider breaking down larger tasks for better progress visibility",
      color: "text-warning",
    });
  }
  
  if (projectCount === 0) {
    recommendations.push({
      icon: PhosphorIcons.LightbulbFilament,
      text: "No projects yet. Create one to organize work in this area",
      color: "text-info",
    });
  }

  if (notes.length < 2) {
    recommendations.push({
      icon: PhosphorIcons.BookOpen,
      text: "Add more documentation to capture knowledge and decisions",
      color: "text-primary",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-md bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.ChartBar size={20} className="text-primary" />
        Insights
      </h3>

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="rounded-md bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={insight.color} />
                  <span className="text-xs text-muted-foreground font-medium">{insight.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{insight.value}</span>
                  <span className="text-xs text-muted-foreground">{insight.unit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2 border-t border-border/40 pt-4">
            <p className="text-xs font-semibold text-foreground mb-3">Recommendations</p>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + idx * 0.05 }}
                    className="flex items-start gap-2 p-2 rounded bg-muted/20"
                  >
                    <Icon size={14} className={cn("flex-shrink-0 mt-0.5", rec.color)} />
                    <p className="text-xs text-muted-foreground leading-relaxed">{rec.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
