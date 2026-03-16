"use client";

import { useState } from "react";
import * as Icons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function BackupControl() {
  const [downloading, setDownloading] = useState(false);

  const handleBackup = async () => {
    try {
      setDownloading(true);
      const response = await fetch("/api/backup");
      
      if (!response.ok) {
        throw new Error("Backup failed");
      }

      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Get filename from header or fallback
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `locus-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.zip`;
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }

      // Create a temporary link element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download backup:", error);
      alert("Failed to create backup. Check console for details.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={cn(
      "gh-box p-4 flex flex-col gap-3 transition-all",
      downloading ? "border-primary/50" : "hover:border-muted-foreground/30"
    )}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-muted-foreground tracking-tight">
          System Backup
        </p>
        <div className={cn(
          "w-6 h-6 rounded flex items-center justify-center transition-colors",
          downloading ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
        )}>
          {downloading ? (
             <Icons.Spinner size={14} className="animate-spin" />
          ) : (
            <Icons.Database size={14} />
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-auto">
        <p className="text-[11px] text-muted-foreground leading-tight">
          Archive database and uploaded files to a local .zip
        </p>
        <button
          onClick={handleBackup}
          disabled={downloading}
          className="w-full mt-1 px-3 py-1.5 bg-secondary hover:bg-[#30363d] text-foreground border border-border rounded-md text-[11px] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {downloading ? "Archiving..." : "Download Backup"}
          {!downloading && <Icons.DownloadSimple size={12} weight="bold" />}
        </button>
      </div>
    </div>
  );
}
