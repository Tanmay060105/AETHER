"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface IndexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { num: "01", label: "OBSERVE", href: "#" },
  { num: "02", label: "TRACE", href: "#" },
  { num: "03", label: "EVALUATE", href: "#" },
  { num: "04", label: "EXPERIMENT", href: "#" },
  { num: "05", label: "OPTIMIZE", href: "#" },
  { num: "06", label: "INCIDENTS", href: "#" },
  { num: "07", label: "ANALYTICS", href: "#" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 as const },
  },
};

const itemVariants = {
  hidden: { y: "100%" },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  show: { y: "0%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as any } },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exit: { y: "-100%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as any } },
};

export function IndexOverlay({ isOpen, onClose }: IndexOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      overlayRef.current.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { delay: 0.3 } }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col px-8 py-8 lg:px-16 lg:py-12"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Index"
          tabIndex={-1}
        >
          {/* Header row in overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex items-center justify-between text-primary w-full"
          >
            <span className="text-metadata font-mono tracking-widest uppercase">
              AETHER
            </span>
            <button
              onClick={onClose}
              className="text-metadata font-mono tracking-widest hover:opacity-70 transition-opacity uppercase flex items-center gap-2 cursor-pointer"
              aria-label="Close Navigation"
            >
              Close
            </button>
          </motion.div>

          {/* Navigation Content */}
          <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto mt-12 md:mt-0">
            <motion.nav 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-4 md:gap-6"
            >
              {navLinks.map((link, i) => {
                const isHovered = hoveredIndex === i;
                const isOtherHovered = hoveredIndex !== null && hoveredIndex !== i;
                
                return (
                  <div key={link.num} className="overflow-hidden py-1">
                    <motion.div variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`group flex items-baseline gap-6 w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-all duration-500 ease-out ${
                          isOtherHovered ? "opacity-30" : "opacity-100"
                        } ${isHovered ? "translate-x-6" : ""}`}
                      >
                        <span className="text-tertiary font-mono text-metadata md:text-sm tracking-widest group-hover:text-secondary transition-colors">
                          {link.num}
                        </span>
                        <span className="text-section-title font-medium tracking-tight text-primary transition-colors">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </motion.nav>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="mt-24 pt-8 border-t border-surface-2 flex flex-col md:flex-row md:items-end justify-between gap-12"
            >
              <div className="flex flex-col gap-8 md:flex-row md:gap-24">
                <div className="flex flex-col gap-2">
                  <span className="text-tertiary text-metadata font-mono">PROJECT</span>
                  <span className="text-secondary text-body font-mono uppercase tracking-wide">Customer Support AI</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-tertiary text-metadata font-mono">ENVIRONMENT</span>
                  <span className="text-secondary text-body font-mono uppercase tracking-wide">Production</span>
                </div>
              </div>
              
              <Link 
                href="#"
                onClick={onClose}
                className="text-metadata text-secondary font-mono hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-1"
              >
                SETTINGS
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
