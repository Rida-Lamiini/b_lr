"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface AreaAdvancedViewsProps {
  areaId: string;
  totalTasks: number;
  completedTasks: number;
  projectCount: number;
}

export function AreaAdvancedViews({
  areaId,
  totalTasks,
  completedTasks,
  projectCount,
}: AreaAdvancedViewsProps) {
  const [activeView, setActiveView] = useState("overview");

  const views = [
    {
      id: "overview",
      label: "Overview",
      icon: PhosphorIcons.Eye,
      description: "Area summary and stats",
    },
    {
      id: "roadmap",
      label: "Roadmap",
      icon: PhosphorIcons.MapPin,
      description: "Project timeline and milestones",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: PhosphorIcons.ChartBar,
      description: "Progress and performance metrics",
    },
    {
      id: "export",
      label: "Export",
      icon: PhosphorIcons.Download,
      description: "Download reports (PDF/CSV)",
    },
  ];

  const completionPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-md bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.Presentation size={20} className="text-primary" />
        Advanced Views
      </h3>

      <div className="space-y-4">
        {/* View selector */}
        <div className="grid grid-cols-2 gap-2">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;

            return (
              <motion.button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-md transition-all text-left ${
                  isActive
                    ? "bg-primary/20 border border-primary/40"
                    : "bg-muted/20 border border-border/40 hover:bg-muted/30"
                }`}
              >
                <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                <p className={`text-xs font-medium mt-1 ${isActive ? "text-primary" : "text-foreground"}`}>
                  {view.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {view.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* View content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-md bg-muted/10 space-y-3"
        >
          {activeView === "overview" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Area Summary</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Projects:</span>
                  <p className="font-bold text-foreground">{projectCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tasks:</span>
                  <p className="font-bold text-foreground">{totalTasks}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Completion:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-foreground">{Math.round(completionPercent)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "roadmap" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Project Roadmap</p>
              <p className="text-xs text-muted-foreground">
                {projectCount > 0
                  ? `Manage ${projectCount} project timeline${projectCount !== 1 ? 's' : ''}`
                  : "No projects to display. Create one to see roadmap."}
              </p>
            </div>
          )}

          {activeView === "analytics" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Performance Metrics</p>
              <p className="text-xs text-muted-foreground">
                Track velocity, completion trends, and productivity insights
              </p>
            </div>
          )}

          {activeView === "export" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Export Report</p>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" className="justify-start gap-2">
                  <PhosphorIcons.FilePdf size={14} />
                  Export as PDF
                </Button>
                <Button size="sm" variant="outline" className="justify-start gap-2">
                  <PhosphorIcons.FileText size={14} />
                  Export as CSV
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
