"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  // track whether sidebar should be visible; start closed to match SSR
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // keep the sidebar in sync with viewport changes
    const media = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsOpen(e.matches);
    };

    // set initial value after mount to avoid hydration mismatch
    setIsOpen(media.matches);

    // listen for resize changes
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  console.log('[SidebarProvider] Rendering with children:', !!children, 'isOpen:', isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}