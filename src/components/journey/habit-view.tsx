"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";
import * as PhosphorIcons from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfDay } from "date-fns";

export function HabitView() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "", color: "#3B82F6" });
  
  const utils = trpc.useUtils();
  const { data: habits, isLoading } = trpc.habit.getAll.useQuery();
  
  const upsertMutation = trpc.habit.upsert.useMutation({
    onSuccess: () => {
      utils.habit.getAll.invalidate();
      setIsAdding(false);
      setNewHabit({ title: "", description: "", color: "#3B82F6" });
    },
  });

  const toggleMutation = trpc.habit.toggleLog.useMutation({
    onSuccess: () => utils.habit.getAll.invalidate(),
  });

  const deleteMutation = trpc.habit.delete.useMutation({
    onSuccess: () => utils.habit.getAll.invalidate(),
  });

  const handleToggle = (habitId: string, completed: boolean) => {
    toggleMutation.mutate({
      habitId,
      date: new Date(),
      completed: !completed,
    });
  };

  if (isLoading) return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading habits...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Habits</div>
          <div className="text-2xl font-mono text-primary">{habits?.length || 0}</div>
        </div>
        <div className="bg-background/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Streaks</div>
          <div className="text-2xl font-mono text-orange-500">
            {habits?.reduce((acc: number, h: any) => acc + (h.currentStreak || 0), 0) || 0} <span className="text-xs text-muted-foreground">total days</span>
          </div>
        </div>
        <div className="bg-background/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Consistency</div>
            <div className="text-2xl font-mono text-green-500">
              {habits?.length 
                ? Math.round((habits.filter((h: any) => h.completedToday).length / habits.length) * 100) 
                : 0}%
            </div>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-all"
          >
            <PhosphorIcons.Plus size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {habits?.map((habit: any) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative bg-background/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all overflow-hidden"
            >
              {/* Background Glow */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 opacity-[0.03] blur-[100px] pointer-events-none rounded-full transition-all duration-700 group-hover:opacity-[0.08]"
                style={{ backgroundColor: habit.color || "#3B82F6" }}
              />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20"
                    style={{ backgroundColor: habit.color || "#3B82F6" }}
                  >
                    <PhosphorIcons.Target size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground/90 group-hover:text-primary transition-colors">{habit.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{habit.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-orange-500/80 uppercase tracking-tighter">Current Streak</div>
                    <div className="text-xl font-mono flex items-center gap-1 justify-end">
                      {habit.currentStreak}
                      <PhosphorIcons.Fire size={16} weight="fill" className="text-orange-500 animate-pulse" />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggle(habit.id, !!habit.completedToday)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                      habit.completedToday
                        ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        : "bg-secondary/10 border-white/5 text-muted-foreground hover:border-primary/50 hover:text-primary"
                    )}
                  >
                    <PhosphorIcons.Check size={24} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Progress Bar / Visualizer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Longest: {habit.longestStreak} days</div>
                    <div className="h-1 w-1 rounded-full bg-white/10" />
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Active: {habit.active ? "Yes" : "Paused"}</div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                       onClick={() => deleteMutation.mutate(habit.id)}
                       className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <PhosphorIcons.Trash size={16} />
                    </button>
                  </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {habits?.length === 0 && !isAdding && (
          <div className="text-center py-20 bg-background/20 rounded-3xl border border-dashed border-white/5">
             <PhosphorIcons.Wind size={48} className="mx-auto text-muted-foreground/30 mb-4" />
             <p className="text-muted-foreground font-medium">No habits yet. Start small, win big.</p>
             <button 
                onClick={() => setIsAdding(true)}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >
               + Create your first habit
             </button>
          </div>
        )}
      </div>

      {/* Add Habit Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">New Habit</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Habit Name</label>
                  <input 
                    autoFocus
                    value={newHabit.title}
                    onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                    placeholder="e.g. Morning Meditation"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Brief Goal</label>
                  <input 
                    value={newHabit.description}
                    onChange={e => setNewHabit({...newHabit, description: e.target.value})}
                    placeholder="e.g. 10 minutes of mindfulness"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Theme Color</label>
                  <div className="flex gap-2">
                    {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"].map(c => (
                      <button 
                        key={c}
                        onClick={() => setNewHabit({...newHabit, color: c})}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          newHabit.color === c ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-secondary/20 text-sm font-bold transition-colors hover:bg-secondary/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => upsertMutation.mutate(newHabit)}
                  disabled={!newHabit.title || upsertMutation.isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-black text-sm font-bold transition-opacity disabled:opacity-50"
                >
                  Create Habit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
