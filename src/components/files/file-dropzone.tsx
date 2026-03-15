"use client";

import React, { useCallback, useState } from "react";
import { Upload, File as FileIcon, X, CloudArrowUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onUploadComplete?: (file: any) => void;
  className?: string;
}

export function FileDropzone({ onUploadComplete, className }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onUploadComplete?.(data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-all duration-200 group h-40",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.01]" 
          : "border-border hover:border-primary/50 hover:bg-secondary/50",
        uploading && "pointer-events-none opacity-80",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4"
      >
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Uploading...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <CloudArrowUp size={20} className="text-muted-foreground group-hover:text-primary" weight="duotone" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click or drag to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Any file up to 50MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      {/* Progress bar overlay (optional) */}
      {uploading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary overflow-hidden rounded-b-lg">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
}
