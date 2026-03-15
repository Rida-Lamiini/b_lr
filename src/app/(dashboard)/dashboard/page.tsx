import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatCard } from "@/components/ui/stat-card"
import { SectionHeader } from "@/components/ui/section-header"
import * as Icons from "@phosphor-icons/react/dist/ssr"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="space-y-6">
        <SectionHeader label="System Overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PARA Method Cards */}
          <StatCard label="Projects" value="0" />
          <StatCard label="Areas" value="0" />
          <StatCard label="Resources" value="0" />
          <StatCard label="Archive" value="0" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <SectionHeader label="Engine Procedures" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="interactive-card p-6 flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
              <Icons.Quotes size={20} weight="duotone" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-foreground mb-1 tracking-tight">Journey Log</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Record daily reflections and synaptic connections
              </p>
            </div>
            <button className="mt-auto px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-mono font-bold transition-all duration-200">
              Execute Procedure
            </button>
          </div>

          <div className="interactive-card p-6 flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 shadow-lg shadow-green-500/5">
              <Icons.HourglassSimple size={20} weight="duotone" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-foreground mb-1 tracking-tight">Timeboxing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Schedule focused temporal blocks for deep work
              </p>
            </div>
            <button className="mt-auto px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-lg text-xs font-mono font-bold transition-all duration-200">
              Allocate Block
            </button>
          </div>

          <div className="interactive-card p-6 flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <Icons.Brain size={20} weight="duotone" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-foreground mb-1 tracking-tight">Focus Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Initiate high-cogency session with neuro-optimization
              </p>
            </div>
            <button className="mt-auto px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-lg text-xs font-mono font-bold transition-all duration-200">
              Initialize Core
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}