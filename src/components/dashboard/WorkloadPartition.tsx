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
      <div className="gh-box p-5 animate-pulse">
        <div className="h-[180px] bg-white/5 rounded" />
      </div>
    );
  }

  return (
    <div className="gh-box p-5">
      <Partition data={partitionData} height={180} />
    </div>
  );
}
