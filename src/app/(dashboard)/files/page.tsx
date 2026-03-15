"use client";

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { 
  File as FileIcon, 
  Trash, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  FilePdf, 
  FileZip, 
  FileCode,
  MagnifyingGlass,
  Plus
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "@/components/files/file-dropzone";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <ImageIcon size={20} weight="duotone" className="text-pink-400" />;
  if (type === "application/pdf") return <FilePdf size={20} weight="duotone" className="text-red-400" />;
  if (type.includes("zip") || type.includes("tar")) return <FileZip size={20} weight="duotone" className="text-yellow-400" />;
  if (type.includes("javascript") || type.includes("html") || type.includes("json")) return <FileCode size={20} weight="duotone" className="text-emerald-400" />;
  return <FileIcon size={20} weight="duotone" className="text-primary" />;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function FilesPage() {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  
  const utils = trpc.useContext();
  const { data: files, isLoading } = trpc.file.getAll.useQuery();
  
  const deleteMutation = trpc.file.delete.useMutation({
    onSuccess: () => utils.file.getAll.invalidate(),
  });

  const filteredFiles = useMemo(() => {
    if (!files) return [];
    return files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  }, [files, search]);

  const stats = useMemo(() => {
    if (!files) return { count: 0, size: 0 };
    return {
      count: files.length,
      size: files.reduce((acc, f) => acc + f.size, 0)
    };
  }, [files]);

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono uppercase italic">Files</h1>
          <p className="text-muted-foreground text-sm max-w-lg font-mono">
            Manage your assets, documents, and media across the second brain.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="gh-box px-4 py-2 flex flex-col min-w-[100px]">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Count</span>
            <span className="text-lg font-bold">{stats.count}</span>
          </div>
          <div className="gh-box px-4 py-2 flex flex-col min-w-[140px]">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Total Size</span>
            <span className="text-lg font-bold">{formatSize(stats.size)}</span>
          </div>
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={24} weight="bold" className={cn("transition-transform duration-300", showUpload && "rotate-45")} />
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <FileDropzone 
              onUploadComplete={() => {
                utils.file.getAll.invalidate();
                setShowUpload(false);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative group">
        <MagnifyingGlass 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" 
        />
        <input
          type="text"
          placeholder="Search files by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
        />
      </div>

      {/* Files Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="gh-box h-48 animate-pulse bg-secondary/20" />
          ))}
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group interactive-card p-4 flex flex-col justify-between h-48 relative"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`/${file.path}`} 
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Download"
                    >
                      <Download size={16} />
                    </a>
                    <button 
                      onClick={() => deleteMutation.mutate({ id: file.id })}
                      disabled={deleteMutation.isLoading}
                      className="p-1.5 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors pr-8">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-1">
                    {formatSize(file.size)} • {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatDistanceToNow(new Date(file.createdAt))} ago
                  </span>
                  
                  <div className="flex gap-1">
                    {file.taskId && (
                      <span className="code-tag !text-[9px] !px-1.5 !py-0.5 bg-blue-500/10 text-blue-400 border-blue-500/20">
                        TASK
                      </span>
                    )}
                    {file.noteId && (
                      <span className="code-tag !text-[9px] !px-1.5 !py-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        NOTE
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="gh-box p-12 flex flex-col items-center justify-center text-center space-y-4 border-dashed">
          <div className="p-4 rounded-full bg-secondary">
            <FileIcon size={32} weight="duotone" className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No files found</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              You haven't uploaded any files yet, or no files match your search.
            </p>
          </div>
          <button 
            onClick={() => setShowUpload(true)}
            className="code-tag !px-4 !py-1.5 hover:text-primary hover:border-primary transition-colors"
          >
            Upload your first file
          </button>
        </div>
      )}
    </div>
  );
}