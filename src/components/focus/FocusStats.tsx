"use client";

import { trpc } from "@/lib/trpc-client";
import { StatCard } from "@/components/ui/stat-card";
import { format, formatDistanceToNow } from "date-fns";
import * as Icons from "@phosphor-icons/react";

export function FocusStats() {
  const { data: dailyStats, isLoading: statsLoading } = trpc.focus.getDailyStats.useQuery();
  const { data: history, isLoading: historyLoading } = trpc.focus.getHistory.useQuery({ take: 5 });

  const totalMinutes = Math.floor((dailyStats?.totalDurationSecs || 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Today's Focus"
          value={statsLoading ? "..." : (hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`)}
          sub={`${dailyStats?.sessionCount || 0} completed sessions`}
        />
        <StatCard
          label="Daily Goal"
          value={statsLoading ? "..." : `${Math.round(Math.min((totalMinutes / 120) * 100, 100))}%`} /* Assuming 2 hr goal for demo */
          sub="of 2 hours target"
          trend={totalMinutes >= 120 ? "up" : "neutral"}
        />
      </div>

      <div className="gh-box p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Sessions</h3>
        {historyLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 animate-pulse bg-white/5 rounded-md" />
            ))}
          </div>
        ) : history?.length === 0 ? (
          <p className="text-sm text-text-3 py-4 text-center">No focus sessions recorded yet.</p>
        ) : (
          <div className="space-y-1">
            {history?.map(session => (
              <div key={session.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icons.Timer size={16} weight="fill" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">Pomodoro</span>
                    <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(session.start), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                  +{Math.round((session.duration || 0) / 60)}m
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
