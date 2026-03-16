"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { trpc } from "@/lib/trpc-client";
import { useWindowSize } from "react-use";
import { useRouter } from "next/navigation";
import * as Icons from "@phosphor-icons/react";

export function BrainGraph() {
  const fgRef = useRef<ForceGraphMethods>();
  const { data, isLoading } = trpc.graph.getGraphData.useQuery();
  const { width, height } = useWindowSize();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const graphData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };
    return data;
  }, [data]);

  const handleNodeClick = (node: any) => {
    // Navigate based on node type
    if (node.group === "AREA" || node.group === "PROJECT") {
      router.push(`/projects`); // We can refine this later to specific IDs
    } else if (node.group === "TASK") {
      router.push(`/tasks`);
    } else if (node.group === "NOTE") {
      router.push(`/notes`);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[500px]">
        <Icons.CircleNotch className="animate-spin text-primary w-8 h-8" />
        <span className="ml-3 text-sm font-mono text-muted-foreground">Mapping Neural Pathways...</span>
      </div>
    );
  }

  // Pre-calculate colors for performance
  const colorMap: Record<string, string> = {
    AREA: "#d2a8ff", // Light purple
    PROJECT: "#58a6ff", // Blue
    TASK: "#3fb950", // Green
    NOTE: "#e3b341", // Yellow/Gold
  };

  return (
    <div className="w-full h-full overflow-hidden absolute inset-0 bg-[#0d1117] flex items-center justify-center">
      <ForceGraph2D
        ref={fgRef}
        width={width}
        height={height - 64} // Adjust for top header if any
        graphData={graphData}
        nodeLabel="name"
        nodeColor={(node: any) => colorMap[node.group] || "#8b949e"}
        nodeVal={(node: any) => node.val}
        linkColor={() => "rgba(139, 148, 158, 0.2)"}
        linkWidth={1}
        onNodeClick={handleNodeClick}
        d3Force="charge"
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = Math.max(12 / globalScale, 4);
          ctx.font = `${fontSize}px Inter, sans-serif`;
          
          // Draw Node Circle
          const radius = Math.sqrt(node.val) * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = colorMap[node.group] || "#8b949e";
          ctx.fill();

          // Draw Label for Areas/Projects at all scales, tasks/notes only when zoomed in
          if (globalScale > 1.5 || node.group === "AREA" || node.group === "PROJECT") {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillText(label, node.x, node.y + radius + (fontSize * 1.2));
          }
        }}
      />
      
      {/* Legend Override Overlay */}
      <div className="absolute bottom-8 left-8 gh-box p-4 flex flex-col gap-2 z-10 bg-[#0d1117]/80 backdrop-blur-md">
        <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Neural Legend</h3>
        {Object.entries(colorMap).map(([group, color]) => (
          <div key={group} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs font-medium text-foreground">{group}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
