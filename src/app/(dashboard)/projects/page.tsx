"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { trpc } from "@/lib/trpc-client";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { data: projects, isLoading } = trpc.container.getAll.useQuery({ type: "PROJECT" });

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
        <StatCard label="Active Projects" value={projects?.length ?? 0} trend="neutral" />
        <StatCard label="Completed" value="0" sub="last 30 days" />
        <StatCard label="Efficiency" value="84%" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="gh-box p-4 h-32 animate-pulse bg-muted/20" />
          ))
        ) : projects?.length === 0 ? (
          <div className="lg:col-span-2 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <PhosphorIcons.Kanban size={24} weight="duotone" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold">No projects yet</h3>
              <p className="text-[14px] text-muted-foreground max-w-xs">
                Create your first project to start organizing your work with the PARA method.
              </p>
            </div>
            <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-[14px] font-semibold transition-colors">
              Get Started
            </button>
          </div>
        ) : (
          projects?.map((project) => (
            <div key={project.id} className="interactive-card p-4 flex flex-col gap-3 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <PhosphorIcons.Folder weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-[12px] text-muted-foreground line-clamp-1">
                      {project.description || "No description provided"}
                    </p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <PhosphorIcons.DotsThree weight="bold" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Active
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <PhosphorIcons.CheckCircle size={14} />
                  0/0 tasks
                </div>
                <div className="text-[11px] text-muted-foreground ml-auto">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}