"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";

export default function ProjectsPage() {
  const { data: projects, isLoading } = trpc.para.getAll.useQuery({ type: "PROJECT" });

  return (
    <div className="space-y-6">
      <SectionHeader 
        label="Projects" 
        action={
          <button className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1 rounded-md text-[12px] font-semibold transition-colors">
            <PhosphorIcons.Plus size={14} weight="bold" />
            New Project
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active" value={projects?.length ?? 0} trend="neutral" />
        <StatCard label="Completed" value="0" sub="last 30 days" />
        <StatCard label="Efficiency" value="84%" trend="up" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gh-box p-4 h-32 animate-pulse bg-muted/20" />
          ))
        ) : projects?.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <PhosphorIcons.Kanban size={24} weight="duotone" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold">No active projects</h3>
              <p className="text-[14px] text-muted-foreground max-w-xs">
                Time to start something new? Create a project to organize your focused efforts.
              </p>
            </div>
          </div>
        ) : (
          projects?.map((project) => (
            <PARACard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              type="PROJECT"
              updatedAt={project.updatedAt}
              stats={{
                tasks: (project as any)._count?.tasks ?? 0,
                notes: (project as any)._count?.notes ?? 0
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}