"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";

export default function ResourcesPage() {
  const { data: resources, isLoading } = trpc.para.getAll.useQuery({ type: "RESOURCE" });

  return (
    <div className="space-y-6">
      <SectionHeader 
        label="Resources" 
        action={
          <button className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1 rounded-md text-[12px] font-semibold transition-colors">
            <PhosphorIcons.Plus size={14} weight="bold" />
            New Resource
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gh-box p-6 h-40 animate-pulse bg-muted/20" />
          ))
        ) : resources?.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <PhosphorIcons.BookBookmark size={24} weight="duotone" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold">No resources yet</h3>
              <p className="text-[14px] text-muted-foreground max-w-xs">
                Resources are topics of ongoing interest. Store knowledge, links, and notes here.
              </p>
            </div>
          </div>
        ) : (
          resources?.map((resource) => (
            <PARACard
              key={resource.id}
              id={resource.id}
              name={resource.name}
              description={resource.description}
              type="RESOURCE"
              updatedAt={resource.updatedAt}
              stats={{
                tasks: (resource as any)._count?.tasks ?? 0,
                notes: (resource as any)._count?.notes ?? 0
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}