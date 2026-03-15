"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";

export default function ArchivePage() {
  const { data: archivedItems, isLoading } = trpc.para.getAll.useQuery({ type: "ARCHIVE" });

  return (
    <div className="space-y-6">
      <SectionHeader label="Archive" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="gh-box p-6 h-40 animate-pulse bg-muted/20" />
          ))
        ) : archivedItems?.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <PhosphorIcons.Archive size={24} weight="duotone" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold">Archive is empty</h3>
              <p className="text-[14px] text-muted-foreground max-w-xs">
                Completed projects and inactive areas will appear here when you archive them.
              </p>
            </div>
          </div>
        ) : (
          archivedItems?.map((item) => (
            <PARACard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              type="ARCHIVE"
              updatedAt={item.updatedAt}
              stats={{
                tasks: (item as any)._count?.tasks ?? 0,
                notes: (item as any)._count?.notes ?? 0
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
