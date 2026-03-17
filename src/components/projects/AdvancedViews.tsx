"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdvancedViewsProps {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
}

type ViewType = "kanban" | "timeline" | "report" | "analytics";

const views: Array<{ id: ViewType; label: string; icon: React.ReactNode; description: string }> = [
  {
    id: "kanban",
    label: "Kanban Board",
    icon: <PhosphorIcons.SquaresFour size={18} />,
    description: "Visualize tasks by status",
  },
  {
    id: "timeline",
    label: "Timeline View",
    icon: <PhosphorIcons.CalendarBlank size={18} />,
    description: "See project schedule",
  },
  {
    id: "report",
    label: "Generate Report",
    icon: <PhosphorIcons.FileText size={18} />,
    description: "Export project summary",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <PhosphorIcons.ChartLine size={18} />,
    description: "Deep dive analytics",
  },
];

export function AdvancedViews({ projectId, totalTasks, completedTasks }: AdvancedViewsProps) {
  const [selectedView, setSelectedView] = useState<ViewType | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-lg bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.FolderOpen size={20} className="text-primary" />
        Advanced Views
      </h3>

      {selectedView ? (
        <div className="space-y-4">
          {/* Back button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedView(null)}
            className="gap-2"
          >
            <PhosphorIcons.CaretLeft size={16} />
            Back
          </Button>

          {/* View Content */}
          {selectedView === "kanban" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-semibold text-foreground mb-4">Kanban Board</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["To Do", "In Progress", "Done"].map((status) => (
                  <div key={status} className="bg-muted/20 rounded-lg p-4 border border-border/30">
                    <h5 className="text-xs font-bold uppercase text-muted-foreground mb-3">{status}</h5>
                    <div className="space-y-2">
                      {status === "Done" && (
                        <div className="p-2 rounded bg-success/10 border border-success/20 text-xs text-success">
                          ✓ {completedTasks} completed
                        </div>
                      )}
                      {status === "To Do" && (
                        <div className="p-2 rounded bg-muted/50 border border-border/30 text-xs text-muted-foreground">
                          {totalTasks - completedTasks} tasks
                        </div>
                      )}
                      {status === "In Progress" && (
                        <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-500">
                          View board
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedView === "timeline" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-semibold text-foreground mb-4">Timeline View</h4>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-muted-foreground">
                      {new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1 h-8 rounded bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/10 flex items-center px-3">
                      <span className="text-xs text-muted-foreground">Milestone {i}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedView === "report" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-semibold text-foreground mb-4">Generate Report</h4>
              <div className="bg-muted/20 rounded-lg p-4 border border-border/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Project Summary</span>
                  <Button size="sm" variant="ghost" className="gap-2">
                    <PhosphorIcons.Download size={14} />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Detailed Analytics</span>
                  <Button size="sm" variant="ghost" className="gap-2">
                    <PhosphorIcons.Download size={14} />
                    CSV
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {selectedView === "analytics" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-semibold text-foreground mb-4">Analytics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">Completion Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">Tasks Left</p>
                  <p className="text-2xl font-bold text-warning">{totalTasks - completedTasks}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {views.map((view, index) => (
            <motion.button
              key={view.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.05 }}
              onClick={() => setSelectedView(view.id)}
              className="p-4 rounded-lg border border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all text-left group"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                "bg-primary/10 text-primary"
              )}>
                {view.icon}
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">{view.label}</h4>
              <p className="text-xs text-muted-foreground">{view.description}</p>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
