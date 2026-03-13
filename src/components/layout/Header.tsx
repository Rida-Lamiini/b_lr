"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Header component with navigation and date
 */
export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // Derive page title from pathname
  const getPageTitle = (path: string): string => {
    if (path === "/") return "Dashboard";
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const pageTitle = getPageTitle(pathname);

  // Current date formatted
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-background border-b border-border px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors mr-3"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentDate}
        </div>
      </div>
    </header>
  );
}