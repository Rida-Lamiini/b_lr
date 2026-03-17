import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ label, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4 mb-6", className)}>
      <div className="flex items-center gap-2.5 group">
        <span className="w-1.5 h-5 bg-primary rounded-sm group-hover:h-6 transition-all duration-200" />
        <h2 className="font-sans text-sm font-semibold text-foreground uppercase tracking-wide select-none">
          {label}
        </h2>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
      {action && (
        <div className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer font-medium">
          {action}
        </div>
      )}
    </div>
  );
}
