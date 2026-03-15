"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc-client";
import { 
  CaretLeft, 
  CaretRight, 
  Calendar,
  CheckCircle,
  Clock,
  NotePencil,
  ArrowRight
} from "@phosphor-icons/react";
import { format, addDays, subDays, isSameDay, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { MoodSelector, EnergyGauge, SleepTracker } from "@/components/journey/tracking-components";
import { cn } from "@/lib/utils";

export default function DailyLogPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const utils = trpc.useContext();
  
  const { data: log, isLoading } = trpc.dailyLog.getByDate.useQuery(
    { date: currentDate },
    { staleTime: 0 }
  );

  useEffect(() => {
    if (log) {
      setContent(log.content || "");
      setMood(log.mood);
      setEnergy(log.energy);
      setSleep(log.sleep);
    } else {
      setContent("");
      setMood(null);
      setEnergy(null);
      setSleep(null);
    }
  }, [log]);

  const upsertMutation = trpc.dailyLog.upsert.useMutation({
    onSuccess: () => {
      utils.dailyLog.getByDate.invalidate({ date: currentDate });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  });

  const handleSave = () => {
    upsertMutation.mutate({
      date: currentDate,
      mood,
      energy,
      sleep,
      content: content || null,
    });
  };

  const navigateDay = (days: number) => {
    setCurrentDate(prev => addDays(prev, days));
  };

  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono uppercase italic">Daily Log</h1>
          <p className="text-muted-foreground text-sm font-mono tracking-tight">
            Track your status and optimize your performance.
          </p>
        </div>

        <div className="flex items-center gap-3 gh-box p-1.5 bg-secondary/30">
          <button 
            onClick={() => navigateDay(-1)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-1.5 h-10 min-w-[180px] justify-center text-sm font-bold font-mono">
            <Calendar size={18} weight="duotone" className="text-primary" />
            {format(currentDate, "EEEE, MMM do")}
            {isToday && (
              <span className="ml-2 code-tag !text-[9px] bg-primary/20 text-primary border-primary/30">TODAY</span>
            )}
          </div>

          <button 
            onClick={() => navigateDay(1)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trackers */}
        <div className="lg:col-span-7 space-y-6">
          <section className="gh-box p-6 space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Vital Metrics
            </h2>

            <div className="space-y-8 py-4">
              <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">How are you feeling?</span>
                <MoodSelector value={mood} onChange={setMood} />
              </div>

              <EnergyGauge value={energy} onChange={setEnergy} />
              
              <SleepTracker value={sleep} onChange={setSleep} />
            </div>
          </section>

          <section className="gh-box p-6 space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4 flex items-center gap-2">
              <NotePencil size={18} weight="duotone" className="text-emerald-400" />
              Daily Reflection
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Any particular wins, challenges, or thoughts for today?"
              className="w-full bg-secondary/30 border border-border rounded-xl p-4 min-h-[160px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-mono placeholder:text-muted-foreground/50"
            />
          </section>
        </div>

        {/* Right Column: Actions & Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-8 space-y-6">
            <button
              onClick={handleSave}
              disabled={upsertMutation.isPending || isLoading}
              className={cn(
                "w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl",
                isSaved 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                  : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] shadow-primary/20"
              )}
            >
              {upsertMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : isSaved ? (
                <>
                  <CheckCircle size={24} weight="bold" />
                  <span className="font-bold uppercase tracking-widest text-sm">Synchronized</span>
                </>
              ) : (
                <>
                  <span className="font-bold uppercase tracking-widest text-sm">Save Day Status</span>
                  <ArrowRight size={20} weight="bold" />
                </>
              )}
            </button>

            <div className="gh-box p-6 space-y-6">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Clock size={18} weight="duotone" className="text-primary" />
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Tracking Active</span>
                  <span className="text-xs font-mono text-emerald-400">ONLINE</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Entries Made</span>
                  <span className="text-xs font-mono font-bold">{(mood ? 1 : 0) + (energy ? 1 : 0) + (sleep ? 1 : 0)}/3</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-muted-foreground">Last Synced</span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {log?.updatedAt ? format(new Date(log.updatedAt), "HH:mm:ss") : "NEVER"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-[11px] leading-relaxed text-muted-foreground font-mono">
                <span className="text-primary font-bold mr-1">TIPS:</span>
                Consistent tracking helps the neuro-engine correlate your health with your productivity levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}