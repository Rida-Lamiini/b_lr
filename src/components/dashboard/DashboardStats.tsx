"use client";

import { trpc } from "@/lib/trpc-client";
import { StatCard } from "@/components/ui/stat-card";
import { BackupControl } from "@/components/dashboard/BackupControl";

export function DashboardStats() {
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="gh-box p-4 h-24 animate-pulse bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Projects" 
          value={stats?.para.projects ?? 0} 
          sub="Active logical targets"
        />
        <StatCard 
          label="Areas" 
          value={stats?.para.areas ?? 0} 
          sub="Ongoing responsibility loci"
        />
        <StatCard 
          label="Tasks" 
          value={stats?.tasks.pending ?? 0} 
          sub={`${stats?.tasks.completedToday ?? 0} completed today`}
          trend={stats?.tasks.completedToday && stats.tasks.completedToday > 0 ? "up" : "neutral"}
        />
        <StatCard 
          label="Habits" 
          value={stats?.habits.activeCount ?? 0} 
          sub="Daily active protocols"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Resources" 
          value={stats?.para.resources ?? 0} 
          sub="Neural knowledge assets"
        />
        <StatCard 
          label="Archive" 
          value={stats?.para.archive ?? 0} 
          sub="Historical data nodes"
        />
        <StatCard 
          label="Glossary Nodes" 
          value={stats?.notes.total ?? 0} 
          sub="Total research notes"
        />
        <BackupControl />
      </div>
    </div>
  );
}
