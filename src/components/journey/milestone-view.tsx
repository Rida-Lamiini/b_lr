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
  const [category, setCategory] = useState("general");
  
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
    setCategory("general");
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleEdit = (m: any) => {
    setEditingMilestone(m);
    setTitle(m.title);
    setDescription(m.description || "");
    setCategory(m.category || "general");
    setDate(format(new Date(m.date), "yyyy-MM-dd"));
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingMilestone?.id,
      title,
      description: description || null,
      category,
      date: new Date(date),
    });
  };

  const categories = [
    { value: "general", label: "General", icon: PhosphorIcons.Flag, color: "text-blue-400", bg: "bg-blue-400/10" },
    { value: "career", label: "Career", icon: PhosphorIcons.Briefcase, color: "text-amber-400", bg: "bg-amber-400/10" },
    { value: "project", label: "Project", icon: PhosphorIcons.RocketLaunch, color: "text-purple-400", bg: "bg-purple-400/10" },
    { value: "personal", label: "Personal", icon: PhosphorIcons.Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
    { value: "fitness", label: "Fitness", icon: PhosphorIcons.Barbell, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">Syncing milestone archives...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono italic uppercase tracking-tight">Key Milestones</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-mono">Pillars of your journey</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsOpen(true); }}
          className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <PhosphorIcons.Flag size={16} weight="bold" />
          Plant Flag
        </button>
      </div>

      <div className="space-y-4">
        {milestones?.map((m) => {
          const catInfo = categories.find(c => c.value === m.category) || categories[0]!;
          return (
            <div key={m.id} className="interactive-card group relative overflow-hidden">
              <div className="p-5 flex items-start gap-5">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-current transition-all group-hover:scale-110", catInfo.bg, catInfo.color)}>
                  <catInfo.icon size={24} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{m.title}</h3>
                      <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter border", catInfo.bg, catInfo.color)}>
                        {catInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => handleEdit(m)} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-all">
                        <PhosphorIcons.PencilLine size={14} />
                      </button>
                      <button onClick={() => deleteMutation.mutate({ id: m.id })} className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-all">
                        <PhosphorIcons.Trash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <PhosphorIcons.Calendar size={12} className="text-primary/60" weight="bold" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {format(new Date(m.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  {m.description && (
                    <p className="text-xs text-muted-foreground/80 mt-3 line-clamp-3 leading-relaxed border-l-2 border-primary/10 pl-4 py-1 italic font-mono">
                      {m.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute left-[33px] bottom-0 top-[72px] w-[2px] bg-gradient-to-b from-primary/20 to-transparent group-last:hidden" />
            </div>
          );
        })}
        {milestones?.length === 0 && (
          <div className="py-20 text-center gh-box border-dashed flex flex-col items-center gap-4">
            <div className="p-5 rounded-full bg-secondary">
              <PhosphorIcons.FlagBanner size={40} weight="duotone" className="text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-bold">The path is clear but empty.</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest">Mark your first major victory</p>
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
                    <PhosphorIcons.Flag size={20} className="text-primary" weight="duotone" />
                  </div>
                  {editingMilestone ? "Refine Milestone" : "Plant New Flag"}
                </Dialog.Title>
                <Dialog.Close className="p-2 hover:bg-secondary rounded-lg transition-all">
                  <PhosphorIcons.X size={18} />
                </Dialog.Close>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Title of Victory</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project Launch, Career Leap..."
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Date of Achievement</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Significance Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-105",
                          category === cat.value 
                            ? cn("border-current bg-current/10 shadow-lg", cat.color) 
                            : "border-border bg-secondary/20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-primary"
                        )}
                      >
                        <cat.icon size={20} weight={category === cat.value ? "bold" : "regular"} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Context & Reflection</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why does this moment matter? Record the impact..."
                    rows={4}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-mono text-foreground/90 leading-relaxed"
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
                  {editingMilestone ? "Update Milestone" : "Commit Milestone"}
                </button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
