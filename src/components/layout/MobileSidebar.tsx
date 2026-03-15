"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Mobile sidebar drawer — slides in from the left.
 * Only rendered on small screens via CSS.
 */
export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-bg-0/80 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed left-0 top-0 z-50 lg:hidden"
          >
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
