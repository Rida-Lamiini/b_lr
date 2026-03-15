import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ label, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4 mb-6", className)}>
      <div className="flex items-center gap-2 group">
        <span className="w-1.5 h-4 bg-primary rounded-full group-hover:scale-y-125 transition-transform" />
        <h2 className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] select-none">
          {label}
        </h2>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-border/50 via-border to-transparent" />
      {action && (
        <div className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          {action}
        </div>
      )}
    </div>
  );
}