"use client";

import React, { useState } from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { format } from "date-fns";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";

export function JournalView() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const utils = trpc.useUtils();
  const { data: entries, isLoading } = trpc.journal.getAll.useQuery();

  const upsertMutation = trpc.journal.upsert.useMutation({
    onSuccess: () => {
      utils.journal.getAll.invalidate();
      setIsOpen(false);
      resetForm();
    },
  });

  const deleteMutation = trpc.journal.delete.useMutation({
    onSuccess: () => utils.journal.getAll.invalidate(),
  });

  const resetForm = () => {
    setEditingEntry(null);
    setTitle("");
    setContent("");
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setTitle(entry.title || "");
    setContent(entry.content);
    setDate(format(new Date(entry.date), "yyyy-MM-dd"));
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingEntry?.id,
      title: title || null,
      content,
      date: new Date(date),
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">Synchronizing journal records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono italic uppercase tracking-tight">Personal Journal</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-mono">Reflect and preserve knowledge</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsOpen(true); }}
          className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <PhosphorIcons.Plus size={16} weight="bold" />
          Commit Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries?.map((entry) => (
          <div key={entry.id} className="interactive-card flex flex-col group p-0 overflow-hidden">
            <div className="p-5 flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhosphorIcons.Calendar size={14} className="text-primary" weight="duotone" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {format(new Date(entry.date), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(entry)} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-all">
                    <PhosphorIcons.PencilLine size={14} />
                  </button>
                  <button onClick={() => deleteMutation.mutate({ id: entry.id })} className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-all">
                    <PhosphorIcons.Trash size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold border-l-2 border-primary/30 pl-3 py-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                {(entry as any).title || "Untitled Entry"}
              </h3>
              <p className="text-xs text-muted-foreground/80 line-clamp-4 whitespace-pre-wrap leading-relaxed font-mono">
                {entry.content}
              </p>
            </div>
            <div className="px-5 py-3 bg-secondary/30 border-t border-border flex items-center justify-between">
               <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-50">Length: {entry.content.length} chars</span>
               <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-primary/40" />
                 <div className="w-1 h-1 rounded-full bg-primary/20" />
               </div>
            </div>
          </div>
        ))}
        {entries?.length === 0 && (
          <div className="col-span-full py-16 text-center gh-box border-dashed flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-secondary">
              <PhosphorIcons.Notebook size={32} weight="duotone" className="text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-bold">Shadows of the past await your words.</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Start your first journal record today.</p>
            </div>
          </div>
        )}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-background border border-border shadow-2xl rounded-2xl z-[101] overflow-hidden focus:outline-none">
            <form onSubmit={handleSubmit}>
              <div className="p-5 border-b border-border bg-secondary/20 flex items-center justify-between">
                <Dialog.Title className="text-sm font-bold font-mono uppercase tracking-tight flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PhosphorIcons.Notebook size={20} className="text-primary" weight="duotone" />
                  </div>
                  {editingEntry ? "Refine Entry" : "New Journal Entry"}
                </Dialog.Title>
                <Dialog.Close className="p-2 hover:bg-secondary rounded-lg transition-all">
                  <PhosphorIcons.X size={18} />
                </Dialog.Close>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Capture Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Essence of the moment..."
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Record Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">The Record</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your heart out..."
                    rows={12}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-sans leading-relaxed text-foreground/90"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-border bg-secondary/20 flex justify-end gap-3">
                <Dialog.Close className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary rounded-lg transition-all">
                  Discard
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {upsertMutation.isPending && <PhosphorIcons.CircleNotch className="animate-spin" size={16} />}
                  {editingEntry ? "Update Entry" : "Preserve Record"}
                </button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
