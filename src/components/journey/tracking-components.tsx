"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Smiley, 
  SmileyMeh, 
  SmileySad, 
  SmileyNervous, 
  SmileyWink,
  Lightning,
  Moon
} from "@phosphor-icons/react";

interface MoodSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

const moods = [
  { value: 1, icon: SmileySad, label: "Awful", color: "text-red-400" },
  { value: 2, icon: SmileyNervous, label: "Poor", color: "text-orange-400" },
  { value: 3, icon: SmileyMeh, label: "Okay", color: "text-yellow-400" },
  { value: 4, icon: Smiley, label: "Good", color: "text-emerald-400" },
  { value: 5, icon: SmileyWink, label: "Great", color: "text-primary" },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isActive = value === mood.value;
        return (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 min-w-[70px]",
              isActive 
                ? "border-primary bg-primary/10 scale-105" 
                : "border-border hover:border-border-hover hover:bg-secondary/50"
            )}
          >
            <Icon 
              size={24} 
              weight={isActive ? "fill" : "duotone"} 
              className={cn(isActive ? mood.color : "text-muted-foreground")}
            />
            <span className={cn(
              "font-mono text-[9px] uppercase tracking-tighter",
              isActive ? "text-foreground font-bold" : "text-muted-foreground"
            )}>
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface EnergyGaugeProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function EnergyGauge({ value, onChange }: EnergyGaugeProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightning size={18} weight="duotone" className="text-yellow-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Energy Level</span>
        </div>
        <span className="text-lg font-bold font-mono text-primary">{value || 0}/5</span>
      </div>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={cn(
              "h-3 flex-1 rounded-full transition-all duration-500",
              (value || 0) >= level 
                ? "bg-primary shadow-[0_0_10px_rgba(100,180,255,0.4)]" 
                : "bg-secondary"
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface SleepTrackerProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function SleepTracker({ value, onChange }: SleepTrackerProps) {
  return (
    <div className="gh-box p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} weight="duotone" className="text-indigo-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sleep Duration</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold font-mono text-primary">{value || 0}</span>
          <span className="text-xs text-muted-foreground">hrs</span>
        </div>
      </div>

      <input 
        type="range"
        min="0"
        max="15"
        step="0.5"
        value={value || 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
      />
      
      <div className="flex justify-between font-mono text-[9px] text-muted-foreground uppercase opacity-50">
        <span>0h</span>
        <span>7-8h (Opt)</span>
        <span>15h</span>
      </div>
    </div>
  );
}
