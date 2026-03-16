import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatCard } from "@/components/ui/stat-card"
import { SectionHeader } from "@/components/ui/section-header"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import * as Icons from "@phosphor-icons/react/dist/ssr"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "Operative"

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, <span className="text-primary italic">{firstName}</span>.
        </h1>
        <p className="text-muted-foreground text-[14px] font-mono uppercase tracking-widest opacity-70">
          Neural Core Status: <span className="text-green-500 font-bold">OPTIMAL</span> // {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-4">
        <SectionHeader label="System Metrics" />
        <DashboardStats />
      </div>

      <div className="space-y-4">
        <SectionHeader label="Engine Procedures" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gh-box p-6 flex flex-col items-start gap-4 transition-all hover:border-muted-foreground/30">
            <div className="w-10 h-10 rounded bg-[#1f6feb]/10 flex items-center justify-center text-[#58a6ff]">
              <Icons.Quotes size={20} weight="bold" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1">Journey Log</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Record daily reflections and synaptic connections in your neural journal.
              </p>
            </div>
            <button className="mt-auto w-full px-4 py-1.5 bg-secondary hover:bg-[#30363d] text-foreground border border-border rounded-md text-[12px] font-semibold transition-colors">
              Execute Procedure
            </button>
          </div>

          <div className="gh-box p-6 flex flex-col items-start gap-4 transition-all hover:border-muted-foreground/30">
            <div className="w-10 h-10 rounded bg-[#238636]/10 flex items-center justify-center text-[#3fb950]">
              <Icons.HourglassSimple size={20} weight="bold" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1">Timeboxing</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Schedule focused temporal blocks for deep work and atomic progress.
              </p>
            </div>
            <button className="mt-auto w-full px-4 py-1.5 bg-secondary hover:bg-[#30363d] text-foreground border border-border rounded-md text-[12px] font-semibold transition-colors">
              Allocate Block
            </button>
          </div>

          <div className="gh-box p-6 flex flex-col items-start gap-4 transition-all hover:border-muted-foreground/30">
            <div className="w-10 h-10 rounded bg-[#ab7df8]/10 flex items-center justify-center text-[#d2a8ff]">
              <Icons.Brain size={20} weight="bold" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1">Focus Engine</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Initiate high-cogency session with neuro-optimization and science tips.
              </p>
            </div>
            <button className="mt-auto w-full px-4 py-1.5 bg-secondary hover:bg-[#30363d] text-foreground border border-border rounded-md text-[12px] font-semibold transition-colors">
              Initialize Core
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}