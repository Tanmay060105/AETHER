"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicLoader() {
  const [loadingState, setLoadingState] = useState<"percentage" | "done">("percentage");
  const [percentage, setPercentage] = useState(0);

  // Respects prefers-reduced-motion
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      setTimeout(() => setLoadingState("done"), 0);
      return;
    }
    
    // Fast count to 100
    const interval = setInterval(() => {
      setPercentage((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 3;
      });
    }, 40);

    const doneTimeout = setTimeout(() => {
      setLoadingState("done");
    }, 1500); // Give it a moment at 100%

    return () => {
      clearInterval(interval);
      clearTimeout(doneTimeout);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {loadingState !== "done" && (
        <motion.div
          key="loader-container"
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col justify-end p-8 lg:p-16 pointer-events-none"
          aria-hidden="true"
        >
          <div className="flex justify-between items-end w-full overflow-hidden">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-[15vw] leading-none font-medium tracking-tighter text-primary"
            >
              {Math.min(percentage, 100)}%
            </motion.div>
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              className="text-[15vw] leading-none font-medium tracking-tighter text-secondary"
            >
              LOADING
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
