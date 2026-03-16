"use client";

import { useState, useEffect, useRef } from "react";
import * as Icons from "@phosphor-icons/react";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const MODES = {
  pomodoro: { label: "Focus", minutes: 25 },
  shortBreak: { label: "Short Break", minutes: 5 },
  longBreak: { label: "Long Break", minutes: 15 },
};

export function Timer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES[mode].minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startSessionMut = trpc.focus.startSession.useMutation();
  const endSessionMut = trpc.focus.endSession.useMutation();
  const utils = trpc.useUtils();

  // Handle timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Handle mode switch (reset timer)
  useEffect(() => {
    setTimeLeft(MODES[mode].minutes * 60);
    setIsActive(false);
    if (sessionId) {
      // If we switch modes while running, abandon the session for simplicity (or we could save partial)
      setSessionId(null);
    }
  }, [mode]);

  const toggleTimer = async () => {
    if (!isActive) {
      // Starting
      if (mode === "pomodoro" && !sessionId) {
        const session = await startSessionMut.mutateAsync();
        setSessionId(session.id);
      }
      setIsActive(true);
    } else {
      // Pausing
      setIsActive(false);
    }
  };

  const handleComplete = async () => {
    setIsActive(false);
    if (mode === "pomodoro" && sessionId) {
      const durationSecs = MODES.pomodoro.minutes * 60; // We assume they finished the whole thing
      await endSessionMut.mutateAsync({ id: sessionId, durationSecs });
      setSessionId(null);
      utils.focus.getDailyStats.invalidate();
      utils.focus.getHistory.invalidate();
    }
    // Auto-switch to short break after pomodoro (optional UX improvement)
    if (mode === "pomodoro") {
      setMode("shortBreak");
    } else {
      setMode("pomodoro");
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].minutes * 60);
    setSessionId(null);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 100 - (timeLeft / (MODES[mode].minutes * 60)) * 100;

  return (
    <div className="gh-box p-8 flex flex-col items-center max-w-md w-full mx-auto relative overflow-hidden">
      {/* Background progress indicator */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <div className="flex bg-white/5 p-1 rounded-lg gap-1 border border-white/5 mb-8">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              mode === m 
                ? "bg-white/10 text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="text-[5rem] font-bold font-mono tracking-tighter tabular-nums mb-8 text-foreground drop-shadow-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={cn(
            "w-16 h-16 flex items-center justify-center rounded-2xl transition-all shadow-lg text-white",
            isActive 
              ? "bg-rose-500/80 hover:bg-rose-500 ring-2 ring-rose-500/20" 
              : "bg-primary hover:bg-primary/90 hover:scale-105"
          )}
        >
          {isActive ? <Icons.Pause size={28} weight="fill" /> : <Icons.Play size={28} weight="fill" className="ml-1" />}
        </button>
        
        <button
          onClick={handleReset}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
          title="Reset Timer"
        >
          <Icons.ArrowCounterClockwise size={20} weight="bold" />
        </button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground font-medium uppercase tracking-widest">
        {isActive ? "Focusing..." : "Ready"}
      </p>
    </div>
  );
}
