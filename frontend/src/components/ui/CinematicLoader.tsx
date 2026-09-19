"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type LoaderPhase = "black" | "initializing" | "ready" | "converge" | "reveal" | "transition" | "done";

export function CinematicLoader() {
  const currentPath = usePathname();
  const [phase, setPhase] = useState<LoaderPhase>(currentPath === "/" ? "black" : "done");
  const [percentage, setPercentage] = useState(0);

  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  useEffect(() => {
    if (currentPath !== "/") {
      return;
    }

    if (prefersReducedMotion) {
      // Reduced motion choreography:
      // Black (0.15s) -> AETHER (1.0s) -> Done
      const timer1 = setTimeout(() => setPhase("reveal"), 150);
      const timer2 = setTimeout(() => {
        setPhase("transition");
        window.dispatchEvent(new CustomEvent("aether-loader-complete"));
      }, 1000);
      const timer3 = setTimeout(() => setPhase("done"), 1200);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }

    // Full cinematic choreography
    // 0.00-0.15: black
    // 0.15-2.20: initializing
    // 2.20-2.55: ready
    // 2.55-3.15: reveal
    // 3.15-3.50: transition -> fires event
    // 3.50+: done
    
    let isMounted = true;

    const t1 = setTimeout(() => {
      if (isMounted) setPhase("initializing");
    }, 150);

    const t2 = setTimeout(() => {
      if (isMounted) setPhase("ready");
    }, 2100);

    const t3 = setTimeout(() => {
      if (isMounted) setPhase("converge");
    }, 2500);

    const t4 = setTimeout(() => {
      if (isMounted) setPhase("reveal");
    }, 2800);

    const t5 = setTimeout(() => {
      if (isMounted) {
        setPhase("transition");
        window.dispatchEvent(new CustomEvent("aether-loader-complete"));
      }
    }, 3400);

    const t6 = setTimeout(() => {
      if (isMounted) setPhase("done");
    }, 3800);

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [prefersReducedMotion, currentPath]);

  // Percentage interpolation
  useEffect(() => {
    if (phase === "initializing") {
      const startTime = performance.now();
      const delay = 400; // wait 400ms for the text to fade in
      const duration = 1650; // remaining time (2050 - 400)
      
      let animationFrame: number;
      
      const animate = (time: number) => {
        const elapsed = time - startTime;
        if (elapsed < delay) {
          setPercentage(0);
        } else {
          const progress = Math.min((elapsed - delay) / duration, 1);
          // Easing out curve for the percentage
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setPercentage(Math.floor(easeOut * 100));
        }

        if (elapsed < delay + duration) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setPercentage(100);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [phase]);

  // Interpolation helpers for progressive system formation
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  
  const gridOpacity = clamp(percentage / 100, 0, 1) * 0.15 + 0.05; // 0.05 -> 0.20
  
  // Phase 1: 0-25% (Minimal setup)
  const phase1 = clamp(percentage / 25, 0, 1);
  const opacity1 = phase1 * 0.4;
  
  // Phase 2: 25-50% (Core network)
  const phase2 = clamp((percentage - 25) / 25, 0, 1);
  const opacity2 = phase2 * 0.4;
  
  // Phase 3: 50-75% (Expanded structure)
  const phase3 = clamp((percentage - 50) / 25, 0, 1);
  const opacity3 = phase3 * 0.3;
  
  // Phase 4: 75-100% (Complete network)
  const phase4 = clamp((percentage - 75) / 25, 0, 1);
  const opacity4 = phase4 * 0.3;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader-container"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "transition" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col justify-center items-center overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
        {/* Abstract Technical Background */}
        <AnimatePresence>
          {(phase === "initializing" || phase === "ready" || phase === "converge") && !prefersReducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: phase === "converge" ? 0 : 1,
                scale: phase === "converge" ? 0.97 : 1,
                filter: phase === "converge" ? "blur(4px)" : "blur(0px)"
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center opacity-30"
            >
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern id="loader-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-surface-2 opacity-50" />
                  </pattern>
                </defs>
                <motion.rect 
                  width="100%" height="100%" fill="url(#loader-grid)" 
                  animate={{ opacity: gridOpacity }}
                  transition={{ duration: 0 }}
                />
                
                {/* Baseline (0%) */}
                <motion.circle cx="50%" cy="35%" r="1.5" className="fill-primary opacity-30" />
                <motion.circle cx="50%" cy="65%" r="1.5" className="fill-primary opacity-30" />

                {/* Phase 1 (0-25%) */}
                <motion.path
                  animate={{ pathLength: phase1, opacity: opacity1, scaleY: phase === "converge" ? 0 : 1 }}
                  transition={{ scaleY: { duration: 1.5, ease: "easeOut" }, default: { duration: 0 } }}
                  d="M50%,35% L40%,35% M50%,35% L60%,35% M50%,65% L40%,65% M50%,65% L60%,65%"
                  fill="none" stroke="currentColor" strokeWidth="1" className="text-primary origin-center"
                />
                <motion.circle animate={{ scale: phase1, opacity: opacity1 }} transition={{ duration: 0 }} cx="40%" cy="35%" r="2" className="fill-primary" />
                <motion.circle animate={{ scale: phase1, opacity: opacity1 }} transition={{ duration: 0 }} cx="60%" cy="35%" r="2" className="fill-primary" />
                <motion.circle animate={{ scale: phase1, opacity: opacity1 }} transition={{ duration: 0 }} cx="40%" cy="65%" r="2" className="fill-primary" />
                <motion.circle animate={{ scale: phase1, opacity: opacity1 }} transition={{ duration: 0 }} cx="60%" cy="65%" r="2" className="fill-primary" />

                {/* Phase 2 (25-50%) */}
                <motion.path
                  animate={{ pathLength: phase2, opacity: opacity2, scaleY: phase === "converge" ? 0 : 1 }}
                  transition={{ scaleY: { duration: 1.5, ease: "easeOut" }, default: { duration: 0 } }}
                  d="M50%,35% L50%,28% M50%,28% L45%,28% M50%,28% L55%,28% M50%,65% L50%,72% M50%,72% L45%,72% M50%,72% L55%,72%"
                  fill="none" stroke="currentColor" strokeWidth="1" className="text-primary origin-center"
                />
                <motion.circle animate={{ scale: phase2, opacity: opacity2 }} transition={{ duration: 0 }} cx="50%" cy="28%" r="1.5" className="fill-primary" />
                <motion.circle animate={{ scale: phase2, opacity: opacity2 }} transition={{ duration: 0 }} cx="45%" cy="28%" r="1.5" className="fill-primary" />
                <motion.circle animate={{ scale: phase2, opacity: opacity2 }} transition={{ duration: 0 }} cx="55%" cy="28%" r="1.5" className="fill-primary" />
                <motion.circle animate={{ scale: phase2, opacity: opacity2 }} transition={{ duration: 0 }} cx="50%" cy="72%" r="1.5" className="fill-primary" />
                <motion.circle animate={{ scale: phase2, opacity: opacity2 }} transition={{ duration: 0 }} cx="45%" cy="72%" r="1.5" className="fill-primary" />
                <motion.circle animate={{ scale: phase2, opacity: opacity2 }} transition={{ duration: 0 }} cx="55%" cy="72%" r="1.5" className="fill-primary" />

                {/* Phase 3 (50-75%) */}
                <motion.path
                  animate={{ pathLength: phase3, opacity: opacity3, scaleY: phase === "converge" ? 0 : 1 }}
                  transition={{ scaleY: { duration: 1.5, ease: "easeOut" }, default: { duration: 0 } }}
                  d="M40%,35% L35%,45% M60%,35% L65%,45% M40%,65% L35%,55% M60%,65% L65%,55%"
                  fill="none" stroke="currentColor" strokeWidth="0.5" className="text-surface-2 origin-center"
                />
                <motion.circle animate={{ scale: phase3, opacity: opacity3 }} transition={{ duration: 0 }} cx="35%" cy="45%" r="1.5" className="fill-surface-2" />
                <motion.circle animate={{ scale: phase3, opacity: opacity3 }} transition={{ duration: 0 }} cx="65%" cy="45%" r="1.5" className="fill-surface-2" />
                <motion.circle animate={{ scale: phase3, opacity: opacity3 }} transition={{ duration: 0 }} cx="35%" cy="55%" r="1.5" className="fill-surface-2" />
                <motion.circle animate={{ scale: phase3, opacity: opacity3 }} transition={{ duration: 0 }} cx="65%" cy="55%" r="1.5" className="fill-surface-2" />

                {/* Phase 4 (75-100%) */}
                <motion.path
                  animate={{ pathLength: phase4, opacity: opacity4, scaleY: phase === "converge" ? 0 : 1 }}
                  transition={{ scaleY: { duration: 1.5, ease: "easeOut" }, default: { duration: 0 } }}
                  d="M35%,45% L35%,55% M65%,45% L65%,55%"
                  fill="none" stroke="currentColor" strokeWidth="0.5" className="text-surface-2 origin-center"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Metadata */}
        <AnimatePresence>
          {(phase === "initializing" || phase === "ready" || phase === "converge") && !prefersReducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "converge" ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col gap-2 font-mono text-[10px] md:text-[11px] tracking-widest uppercase opacity-40 z-10"
            >
              <div className="flex gap-6 md:gap-8">
                <span className="w-20 md:w-24 text-surface-2">TELEMETRY</span>
                <span className={percentage >= 40 ? "text-primary" : "text-surface-2"}>
                  {percentage >= 40 ? "ONLINE" : "CONNECTING"}
                </span>
              </div>
              <div className="flex gap-6 md:gap-8">
                <span className="w-20 md:w-24 text-surface-2">TRACE</span>
                <span className={percentage >= 75 ? "text-primary" : "text-surface-2"}>
                  {percentage >= 75 ? "ONLINE" : percentage >= 40 ? "CONNECTING" : "STANDBY"}
                </span>
              </div>
              <div className="flex gap-6 md:gap-8">
                <span className="w-20 md:w-24 text-surface-2">EVALUATION</span>
                <span className={percentage >= 100 ? "text-primary" : "text-surface-2"}>
                  {percentage >= 100 ? "READY" : percentage >= 75 ? "CONNECTING" : "STANDBY"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Foreground Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6">
          
          <AnimatePresence mode="wait">
            {(phase === "initializing" || phase === "ready") && !prefersReducedMotion && (
              <motion.div
                key="percentage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <div className="text-[clamp(80px,12vw,240px)] leading-none font-medium tracking-tighter text-primary">
                  {percentage}%
                </div>
                
                {/* 100% READY STATE */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: phase === "ready" ? 1 : 0, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 text-[12px] md:text-[14px] tracking-widest text-secondary uppercase font-mono overflow-hidden"
                >
                  SYSTEM READY
                </motion.div>
              </motion.div>
            )}

            {(phase === "reveal" || phase === "transition" || (prefersReducedMotion && phase !== "black")) && (
              <motion.div
                key="aether-reveal"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center absolute inset-0"
              >
                <h1 className="text-[clamp(60px,7.5vw,130px)] leading-[0.85] font-semibold tracking-tighter text-primary">
                  AETHER
                </h1>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-6 text-[clamp(12px,1vw,16px)] tracking-[0.2em] text-secondary uppercase font-mono text-center"
                >
                  THE INTELLIGENCE LAYER FOR AI SYSTEMS
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
      )}
    </AnimatePresence>
  );
}
