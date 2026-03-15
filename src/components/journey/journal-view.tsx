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
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setTitle(entry.title || "");
    setContent(entry.content);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingEntry?.id,
      title: title || null,
      content,
      date: editingEntry?.date ? new Date(editingEntry.date) : new Date(),
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading journal...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Personal Journal</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Reflect and record</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsOpen(true); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90 transition-all"
        >
          <PhosphorIcons.Plus size={14} weight="bold" />
          New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries?.map((entry) => (
          <div key={entry.id} className="gh-card flex flex-col group">
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {format(new Date(entry.date), "MMM d, yyyy")}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(entry)} className="p-1 hover:text-primary transition-colors">
                    <PhosphorIcons.PencilLine size={14} />
                  </button>
                  <button onClick={() => deleteMutation.mutate({ id: entry.id })} className="p-1 hover:text-destructive transition-colors">
                    <PhosphorIcons.Trash size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold mb-2 line-clamp-1">{(entry as any).title || "Untitled Entry"}</h3>
              <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">{entry.content}</p>
            </div>
          </div>
        ))}
        {entries?.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-lg">
            <PhosphorIcons.Notebook size={32} className="mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Shadows of the past await your words.</p>
          </div>
        )}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-background border border-border shadow-2xl rounded-xl z-[101] overflow-hidden focus:outline-none">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b border-border bg-secondary/5 flex items-center justify-between">
                <Dialog.Title className="text-sm font-bold flex items-center gap-2">
                  <PhosphorIcons.Notebook size={18} className="text-primary" />
                  {editingEntry ? "Refine Entry" : "New Journal Entry"}
                </Dialog.Title>
                <Dialog.Close className="p-1 hover:bg-secondary rounded-md transition-all">
                  <PhosphorIcons.X size={16} />
                </Dialog.Close>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Title (Optional)</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Capture the essence..."
                    className="w-full bg-secondary/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">The Record</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your heart out..."
                    rows={12}
                    className="w-full bg-secondary/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-serif leading-relaxed"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-secondary/5 flex justify-end gap-3">
                <Dialog.Close className="px-4 py-2 text-xs font-semibold hover:bg-secondary rounded-md transition-all">
                  Discard
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {upsertMutation.isPending && <PhosphorIcons.CircleNotch className="animate-spin" size={14} />}
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
