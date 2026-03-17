import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatCard } from "@/components/ui/stat-card"
import { SectionHeader } from "@/components/ui/section-header"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap"
import { WorkloadPartition } from "@/components/dashboard/WorkloadPartition"
import * as Icons from "@phosphor-icons/react/dist/ssr"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "Operative"

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome back, <span className="text-primary">{firstName}</span>
        </h1>
        <p className="text-muted-foreground text-[13px] font-medium uppercase tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Neural Core • <span className="text-foreground font-semibold">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </p>
      </div>

      <div className="space-y-4">
        <SectionHeader label="System Metrics" />
        <DashboardStats />
      </div>

      <div className="space-y-4">
        <SectionHeader label="Activity Matrix" />
        <ActivityHeatmap />
      </div>

      <div className="space-y-4">
        <SectionHeader label="Workload Distribution" />
        <WorkloadPartition />
      </div>

      <div className="space-y-4">
        <SectionHeader label="Quick Access" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group relative overflow-hidden rounded-md bg-card border border-border p-5 transition-all duration-200 hover:border-border/80 hover:shadow-sm flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-md bg-blue-500/15 flex items-center justify-center text-blue-400">
                <Icons.Quotes size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Journey Log</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Record daily reflections and insights.
                </p>
              </div>
              <button className="mt-auto w-full px-3 py-2 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 rounded-md text-[11px] font-semibold transition-all duration-200">
                Access Log
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-md bg-card border border-border p-5 transition-all duration-200 hover:border-border/80 hover:shadow-sm flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-md bg-success/15 flex items-center justify-center text-success/80">
                <Icons.HourglassSimple size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Timeboxing</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Schedule focused work blocks.
                </p>
              </div>
              <button className="mt-auto w-full px-3 py-2 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 rounded-md text-[11px] font-semibold transition-all duration-200">
                Schedule Block
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-md bg-card border border-border p-5 transition-all duration-200 hover:border-border/80 hover:shadow-sm flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-md bg-purple-500/15 flex items-center justify-center text-purple-400">
                <Icons.Brain size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Focus Engine</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Start a deep work session.
                </p>
              </div>
              <button className="mt-auto w-full px-3 py-2 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 rounded-md text-[11px] font-semibold transition-all duration-200">
                Activate Core
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
