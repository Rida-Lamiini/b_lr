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
        "gh-box p-4 flex flex-col gap-1 transition-all hover:border-muted-foreground/30",
        className
      )}
    >
      <p className="text-[12px] font-medium text-muted-foreground tracking-tight">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-foreground tracking-tight">
          {value}
        </p>
        {trend !== "neutral" && (
          <span className={cn(
            "text-[10px] font-medium",
            trend === "up" ? "text-green-500" : "text-destructive"
          )}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      {sub && (
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {sub}
        </p>
      )}
    </div>
  );
}