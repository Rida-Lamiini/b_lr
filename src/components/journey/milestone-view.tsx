"use client";

import React, { useState } from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { format } from "date-fns";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";

export function MilestoneView() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const utils = trpc.useUtils();
  const { data: milestones, isLoading } = trpc.milestone.getAll.useQuery();

  const upsertMutation = trpc.milestone.upsert.useMutation({
    onSuccess: () => {
      utils.milestone.getAll.invalidate();
      setIsOpen(false);
      resetForm();
    },
  });

  const deleteMutation = trpc.milestone.delete.useMutation({
    onSuccess: () => utils.milestone.getAll.invalidate(),
  });

  const resetForm = () => {
    setEditingMilestone(null);
    setTitle("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleEdit = (m: any) => {
    setEditingMilestone(m);
    setTitle(m.title);
    setDescription(m.description || "");
    setDate(format(new Date(m.date), "yyyy-MM-dd"));
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingMilestone?.id,
      title,
      description: description || null,
      date: new Date(date),
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading milestones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Key Milestones</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pillars of your journey</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsOpen(true); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <PhosphorIcons.Flag size={14} weight="bold" />
          Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {milestones?.map((m) => (
          <div key={m.id} className="gh-card group relative">
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <PhosphorIcons.Flag size={20} className="text-primary" weight="bold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[14px] font-bold truncate">{m.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleEdit(m)} className="p-1 hover:text-primary transition-colors">
                      <PhosphorIcons.PencilLine size={14} />
                    </button>
                    <button onClick={() => deleteMutation.mutate({ id: m.id })} className="p-1 hover:text-destructive transition-colors">
                      <PhosphorIcons.Trash size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <PhosphorIcons.Calendar size={12} className="text-muted-foreground" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {format(new Date(m.date), "MMMM d, yyyy")}
                  </span>
                </div>
                {m.description && (
                  <p className="text-[12px] text-muted-foreground mt-2 line-clamp-2">{m.description}</p>
                )}
              </div>
            </div>
            <div className="absolute left-9 bottom-0 top-14 w-px bg-border group-last:hidden" />
          </div>
        ))}
        {milestones?.length === 0 && (
          <div className="py-12 text-center border border-dashed border-border rounded-lg bg-secondary/5">
            <PhosphorIcons.FlagBanner size={32} className="mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Every great Journey starts with a single step.</p>
          </div>
        )}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-border shadow-2xl rounded-xl z-[101] overflow-hidden focus:outline-none">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b border-border bg-secondary/5 flex items-center justify-between">
                <Dialog.Title className="text-sm font-bold flex items-center gap-2">
                  <PhosphorIcons.Flag size={18} className="text-primary" />
                  {editingMilestone ? "Refine Milestone" : "Mark New Milestone"}
                </Dialog.Title>
                <Dialog.Close className="p-1 hover:bg-secondary rounded-md transition-all">
                  <PhosphorIcons.X size={16} />
                </Dialog.Close>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Title</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project Completion, Major Insight..."
                    className="w-full bg-secondary/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date of Significance</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-secondary/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Context & Reflection</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Capture the impact of this moment..."
                    rows={4}
                    className="w-full bg-secondary/5 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-secondary/5 flex justify-end gap-3">
                <Dialog.Close className="px-4 py-2 text-xs font-semibold hover:bg-secondary rounded-md transition-all">
                  Cancel
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {upsertMutation.isPending && <PhosphorIcons.CircleNotch className="animate-spin" size={14} />}
                  {editingMilestone ? "Update Milestone" : "Plant Flag"}
                </button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
