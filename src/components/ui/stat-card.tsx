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
        "interactive-card p-5 group flex flex-col gap-2",
        className
      )}
    >
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold group-hover:text-primary transition-colors">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="font-mono text-2xl font-bold text-foreground leading-none tracking-tight">
          {value}
        </p>
        {trend !== "neutral" && (
          <span className={cn(
            "text-[10px] font-mono",
            trend === "up" ? "text-green-500" : "text-destructive"
          )}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      {sub && (
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}