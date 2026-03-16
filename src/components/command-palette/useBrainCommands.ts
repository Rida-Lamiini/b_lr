"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommandPalette } from "@/hooks/useCommandPalette";

/**
 * Registers all global Brain commands into the command palette store.
 * Mount this hook once in the dashboard layout.
 */
export function useBrainCommands() {
  const router = useRouter();
  const registerCommands = useCommandPalette((s) => s.registerCommands);

  useEffect(() => {
    registerCommands([
      // ── Navigate ──────────────────────────────────────
      {
        id: "nav-dashboard",
        label: "Go to Dashboard",
        icon: "⊞",
        group: "navigate",
        shortcut: ["G", "H"],
        action: () => router.push("/"),
      },
      {
        id: "nav-projects",
        label: "Go to Projects",
        icon: "◫",
        group: "navigate",
        shortcut: ["G", "P"],
        action: () => router.push("/projects"),
      },
      {
        id: "nav-areas",
        label: "Go to Areas",
        icon: "◈",
        group: "navigate",
        action: () => router.push("/areas"),
      },
      {
        id: "nav-resources",
        label: "Go to Resources",
        icon: "⊟",
        group: "navigate",
        action: () => router.push("/resources"),
      },
      {
        id: "nav-tasks",
        label: "Go to Tasks",
        icon: "✓",
        group: "navigate",
        shortcut: ["G", "T"],
        action: () => router.push("/tasks"),
      },
      {
        id: "nav-notes",
        label: "Go to Notes",
        icon: "≡",
        group: "navigate",
        shortcut: ["G", "N"],
        action: () => router.push("/notes"),
      },
      {
        id: "nav-calendar",
        label: "Go to Calendar",
        icon: "▦",
        group: "navigate",
        shortcut: ["G", "C"],
        action: () => router.push("/calendar"),
      },
      {
        id: "nav-daily",
        label: "Go to Daily Log",
        icon: "◉",
        group: "navigate",
        shortcut: ["G", "D"],
        action: () => router.push("/journey/daily"),
      },
      {
        id: "nav-focus",
        label: "Go to Focus",
        icon: "◷",
        group: "navigate",
        shortcut: ["G", "F"],
        action: () => router.push("/focus"),
      },
      {
        id: "nav-graph",
        label: "Go to Brain Graph",
        icon: "⊛",
        group: "navigate",
        action: () => router.push("/graph"),
      },

      // ── Create ────────────────────────────────────────
      {
        id: "create-task",
        label: "New Task",
        icon: "+",
        group: "create",
        shortcut: ["T"],
        action: () => router.push("/tasks?new=true"),
      },
      {
        id: "create-note",
        label: "New Note",
        icon: "+",
        group: "create",
        shortcut: ["N"],
        action: () => router.push("/notes?new=true"),
      },
      {
        id: "create-project",
        label: "New Project",
        icon: "+",
        group: "create",
        shortcut: ["P"],
        action: () => router.push("/projects?new=true"),
      },
      {
        id: "create-journal",
        label: "New Journal Entry",
        icon: "+",
        group: "create",
        action: () => router.push("/journey/journal?new=true"),
      },

      // ── Actions ───────────────────────────────────────
      {
        id: "action-pomodoro",
        label: "Start Pomodoro",
        icon: "◷",
        group: "actions",
        shortcut: ["⌘", "P"],
        action: () => router.push("/focus?start=true"),
      },
      {
        id: "action-review",
        label: "Open Weekly Review",
        icon: "↺",
        group: "actions",
        action: () => router.push("/journey/review"),
      },
    ]);
  }, [registerCommands, router]);
}