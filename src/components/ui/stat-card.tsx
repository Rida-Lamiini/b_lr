import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  sub,
  trend = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-card border border-border p-4 flex flex-col gap-2 transition-all duration-200 hover:border-muted-foreground/40 hover:shadow-sm group",
        className
      )}
    >
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">
          {label}
        </p>
        <div className="flex items-end gap-2.5 mt-2">
          <p className="text-3xl font-bold text-foreground leading-none">
            {value}
          </p>
          {trend !== "neutral" && (
            <span className={cn(
              "text-[11px] font-semibold flex items-center gap-0.5 pb-1",
              trend === "up" ? "text-success" : "text-destructive"
            )}>
              {trend === "up" ? "↑" : "↓"} <span className="text-[10px]">{trend === "up" ? "up" : "down"}</span>
            </span>
          )}
        </div>
        {sub && (
          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
