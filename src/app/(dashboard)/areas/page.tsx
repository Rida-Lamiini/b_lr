"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function AreasPage() {
  const { data: areas, isLoading } = trpc.area.getAll.useQuery();

  return (
    <div className="space-y-6">
      <SectionHeader 
        label="Areas of Responsibility" 
        action={
          <button className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1 rounded-md text-[12px] font-semibold transition-colors">
            <PhosphorIcons.Plus size={14} weight="bold" />
            New Area
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="gh-box p-6 h-40 animate-pulse bg-muted/20" />
          ))
        ) : areas?.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <PhosphorIcons.ShieldCheck size={24} weight="duotone" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold">No areas defined</h3>
              <p className="text-[14px] text-muted-foreground max-w-xs">
                Areas represent ongoing responsibilities. Create one to organize your related projects and tasks.
              </p>
            </div>
          </div>
        ) : (
          areas?.map((area) => (
            <div key={area.id} className="interactive-card p-6 flex flex-col gap-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-foreground border border-border">
                    <PhosphorIcons.Briefcase weight="duotone" size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold group-hover:text-primary transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-[12px] text-muted-foreground line-clamp-1">
                      {area.description || "No description"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <PhosphorIcons.Folders size={14} />
                    0 Projects
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <PhosphorIcons.CheckCircle size={14} />
                    0 Active
                  </div>
                </div>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: area.color || "var(--primary)" }} 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}