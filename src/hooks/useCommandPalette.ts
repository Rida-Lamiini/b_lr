import { create } from "zustand";

export interface Command {
  id: string;
  label: string;
  /** lucide-react icon name as string e.g. "CheckSquare" or custom icon */
  icon: string;
  group: "navigate" | "create" | "actions" | "recent" | "search";
  shortcut?: string[];
  action: () => void;
  data?: any;
}

interface CommandPaletteStore {
  open: boolean;
  query: string;
  selectedIndex: number;
  commands: Command[];
  filteredCommands: Command[];
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  registerCommands: (commands: Command[]) => void;
  executeSelected: () => void;
}

/**
 * Global Zustand store for the command palette.
 * Commands are registered by the layout and feature pages.
 */
export const useCommandPalette = create<CommandPaletteStore>((set, get) => ({
  open: false,
  query: "",
  selectedIndex: 0,
  commands: [],
  filteredCommands: [],

  setOpen: (open) => set({ open, query: "", selectedIndex: 0,
    filteredCommands: get().commands }),

  setQuery: (query) => {
    const filtered = get().commands.filter((c) =>
      c.label.toLowerCase().includes(query.toLowerCase())
    );
    set({ query, filteredCommands: filtered, selectedIndex: 0 });
  },

  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),

  registerCommands: (commands) =>
    set({ commands, filteredCommands: commands }),

  executeSelected: () => {
    const { filteredCommands, selectedIndex } = get();
    const cmd = filteredCommands[selectedIndex];
    if (cmd) {
      cmd.action();
      set({ open: false, query: "", selectedIndex: 0 });
    }
  },
}));