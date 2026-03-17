"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";

interface AreaCollaborationHubProps {
  areaName: string;
  areaId: string;
  projectCount: number;
  taskCount: number;
  noteCount: number;
}

export function AreaCollaborationHub({
  areaName,
  areaId,
  projectCount,
  taskCount,
  noteCount,
}: AreaCollaborationHubProps) {
  const activities = [
    {
      user: "You",
      action: "Created this area",
      time: "Recently",
      icon: PhosphorIcons.FolderPlus,
    },
    ...(projectCount > 0 ? [{
      user: "Area",
      action: `${projectCount} project${projectCount !== 1 ? 's' : ''} organized`,
      time: "In this area",
      icon: PhosphorIcons.FolderOpen,
    }] : []),
    ...(taskCount > 0 ? [{
      user: "Area",
      action: `${taskCount} task${taskCount !== 1 ? 's' : ''} active`,
      time: "To complete",
      icon: PhosphorIcons.CheckCircle,
    }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-md bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.Users size={20} className="text-primary" />
        Activity Stream
      </h3>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No activities yet</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border/40">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{projectCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Projects</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{taskCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{noteCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Notes</p>
        </div>
      </div>
    </motion.div>
  );
}
