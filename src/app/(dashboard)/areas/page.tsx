"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";

export default function AreasPage() {
  const { data: areas, isLoading } = trpc.para.getAll.useQuery({ type: "AREA" });

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
            <PARACard
              key={area.id}
              id={area.id}
              name={area.name}
              description={area.description}
              type="AREA"
              updatedAt={area.updatedAt}
              stats={{
                tasks: (area as any)._count?.tasks ?? 0,
                notes: (area as any)._count?.notes ?? 0
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}