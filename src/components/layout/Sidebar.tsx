"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  BookOpen,
  Archive,
  CheckSquare,
  FileText,
  Paperclip,
  CalendarDays,
  Sun,
  BookHeart,
  Trophy,
  BarChart2,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    title: "ORGANIZE",
    links: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/projects", label: "Projects", icon: FolderKanban },
      { href: "/areas", label: "Areas", icon: Layers },
      { href: "/resources", label: "Resources", icon: BookOpen },
      { href: "/archives", label: "Archives", icon: Archive },
    ],
  },
  {
    title: "WORK",
    links: [
      { href: "/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/notes", label: "Notes", icon: FileText },
      { href: "/files", label: "Files", icon: Paperclip },
      { href: "/calendar", label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    title: "JOURNEY",
    links: [
      { href: "/journey/daily", label: "Daily Log", icon: Sun },
      { href: "/journey/journal", label: "Journal", icon: BookHeart },
      { href: "/journey/milestones", label: "Milestones", icon: Trophy },
      { href: "/journey/review", label: "Weekly Review", icon: BarChart2 },
    ],
  },
];

/**
 * Sidebar component for navigation
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <motion.div
      className={`w-60 bg-sidebar border-r border-sidebar-border ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 md:static md:translate-x-0`}
      initial={false}
      animate={{ x: isOpen ? 0 : -240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-sidebar-border">
          <span className="text-2xl mr-2">🧠</span>
          <h1 className="text-xl font-bold text-sidebar-foreground">Brain</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                        onClick={onClose}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sidebar-foreground/70 truncate">
              {session?.user?.email || "user@example.com"}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}