"use client";

import { motion } from "framer-motion";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  type: "task" | "note" | "update";
}

interface CollaborationHubProps {
  projectName: string;
  projectId: string;
  taskCount: number;
  noteCount: number;
}

export function CollaborationHub({ projectName, projectId, taskCount, noteCount }: CollaborationHubProps) {
  // Mock activity data
  const recentActivities: Activity[] = [
    {
      id: "1",
      user: "You",
      action: `created ${projectName}`,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: "update",
    },
    {
      id: "2",
      user: "You",
      action: `added ${taskCount} tasks`,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: "task",
    },
    {
      id: "3",
      user: "You",
      action: `documented progress`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: "note",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-lg bg-card border border-border/60 p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <PhosphorIcons.UsersThree size={20} className="text-primary" />
        Activity Stream
      </h3>

      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + index * 0.05 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/20 transition-colors"
          >
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
              <span className="text-xs font-bold text-primary">Y</span>
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>

            {/* Activity Type Badge */}
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0",
              activity.type === "task" && "bg-blue-500/10",
              activity.type === "note" && "bg-orange-500/10",
              activity.type === "update" && "bg-primary/10"
            )}>
              {activity.type === "task" && <PhosphorIcons.CheckCircle size={14} className="text-blue-500" />}
              {activity.type === "note" && <PhosphorIcons.Note size={14} className="text-orange-500" />}
              {activity.type === "update" && <PhosphorIcons.PencilSimple size={14} className="text-primary" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center p-3 rounded-lg bg-muted/20"
        >
          <p className="text-2xl font-bold text-primary">{taskCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-center p-3 rounded-lg bg-muted/20"
        >
          <p className="text-2xl font-bold text-primary">{noteCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Notes</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
