"use client";

import React, { useState } from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/ui/section-header";
import { format } from "date-fns";

// Dynamically import the editor to avoid SSR issues with BlockNote
const Editor = dynamic(() => import("@/components/notes/editor"), { ssr: false });

export default function NotesPage() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const utils = trpc.useUtils();

  const { data: notes, isLoading } = trpc.note.getAll.useQuery();
  const selectedNote = notes?.find((n) => n.id === selectedNoteId);

  const upsertMutation = trpc.note.upsert.useMutation({
    onSuccess: () => {
      utils.note.getAll.invalidate();
      setIsEditing(false);
    },
  });

  const deleteMutation = trpc.note.delete.useMutation({
    onSuccess: () => {
      utils.note.getAll.invalidate();
      setSelectedNoteId(null);
    },
  });

  const handleCreate = () => {
    upsertMutation.mutate({
      title: "Untitled Note",
      content: JSON.stringify([{ type: "paragraph", content: "Start writing..." }]),
    });
  };

  const handleSave = (content: string) => {
    if (selectedNote) {
      upsertMutation.mutate({
        id: selectedNote.id,
        title: selectedNote.title,
        content: content,
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNote) {
      upsertMutation.mutate({
        id: selectedNote.id,
        title: e.target.value,
        content: selectedNote.content,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      <SectionHeader 
        label="Second Brain" 
        action={
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90 transition-all"
          >
            <PhosphorIcons.Plus size={14} weight="bold" />
            New Note
          </button>
        }
      />

      <div className="flex-1 flex overflow-hidden gh-box">
        {/* Sidebar */}
        <div className="w-80 border-r border-border flex flex-col bg-secondary/5">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <PhosphorIcons.MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                placeholder="Search thoughts..." 
                className="w-full bg-background border border-border rounded-md pl-9 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground text-xs">Loading context...</div>
            ) : notes?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">No notes found</div>
            ) : (
              notes?.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "w-full p-4 text-left border-b border-border/50 transition-all hover:bg-secondary/10 group",
                    selectedNoteId === note.id ? "bg-secondary/10 border-l-2 border-l-primary" : ""
                  )}
                >
                  <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                    {note.title || "Untitled Note"}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {format(new Date(note.updatedAt), "MMM d, HH:mm")}
                    </span>
                    <PhosphorIcons.DotsThree size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-background relative">
          {selectedNote ? (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/5">
                <input 
                  className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                  value={selectedNote.title}
                  onChange={handleTitleChange}
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => deleteMutation.mutate({ id: selectedNote.id })}
                    className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-all text-muted-foreground"
                    title="Evaporate Note"
                  >
                    <PhosphorIcons.Trash size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <Editor 
                  key={selectedNote.id}
                  initialContent={selectedNote.content} 
                  onChange={handleSave} 
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <PhosphorIcons.Brain size={32} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Select a Note</h3>
              <p className="text-[11px] mt-1 max-w-[200px]">
                Dive into your digital lattice. Thoughts are fleeting, records are forever.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}