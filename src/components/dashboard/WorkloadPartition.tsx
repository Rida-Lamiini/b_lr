"use client";

import { trpc } from "@/lib/trpc-client";
import Partition, { type PartitionData } from "@/components/blocks/partition";
import { useMemo } from "react";

export function WorkloadPartition() {
  const { data, isLoading } = trpc.dashboard.getPartitionData.useQuery();

  const partitionData: PartitionData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-md bg-card border border-border p-5 animate-pulse">
        <div className="h-44 bg-muted/30 rounded-md" />
      </div>
    );
  }

  return (
    <div className="rounded-md bg-card border border-border p-5 hover:border-border/80 transition-colors duration-200">
      <Partition data={partitionData} height={180} />
    </div>
  );
}
