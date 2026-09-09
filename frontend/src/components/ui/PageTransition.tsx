"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  // Use a minimal, spatial transition (moving "deeper" into the system)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.02, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
