"use client";

import { cn } from "@/lib/utils";

export interface DevTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
}

interface DevTableProps<T extends { id: string }> {
  columns: DevTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * Monospace data table styled like GitHub PR/issue lists.
 * All text is font-mono. Supports custom cell renderers.
 */
export function DevTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No items found.",
  isLoading = false,
  className,
}: DevTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("dev-card overflow-hidden", className)}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-10 border-b border-border-subtle animate-pulse bg-bg-2 last:border-0"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("dev-card flex items-center justify-center py-12", className)}>
        <p className="font-mono text-xs text-text-3">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("dev-card overflow-hidden", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={cn(
                  "px-3 py-2 font-mono text-2xs text-text-3",
                  "uppercase tracking-widest font-normal text-left",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b border-border-subtle last:border-0",
                "transition-colors duration-fast",
                onRowClick && "cursor-pointer hover:bg-bg-2"
              )}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    "px-3 py-2 font-mono text-xs text-text-2",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}