"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function OptimizationPath() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-8 overflow-hidden bg-background">
      <TechnicalGrid />
      
      {/* Container for the visualization */}
      <div className="relative w-full h-full max-w-4xl mx-auto flex items-center">
        
        {/* Left Side: Before (Bottleneck/High Latency) */}
        <div className="flex-1 h-full relative flex items-center">
          {/* Chaotic paths */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <motion.path
              d="M 0 40 Q 25 10, 50 45 T 100 50"
              fill="none"
              stroke="#ef4444"
              strokeWidth="0.5"
              className="opacity-40"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M 0 60 Q 20 80, 60 55 T 100 50"
              fill="none"
              stroke="#f97316"
              strokeWidth="0.5"
              className="opacity-40"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M 0 50 Q 30 30, 40 70 T 100 50"
              fill="none"
              stroke="#ef4444"
              strokeWidth="0.5"
              className="opacity-30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          
          <div className="absolute left-4 top-1/4 flex flex-col gap-2 font-mono text-[10px] text-red-400">
            <span>LATENCY: 4,250ms</span>
            <span>TOKENS: 12,400</span>
            <span>COST: $0.12/req</span>
          </div>
        </div>

        {/* Center: Optimization Threshold */}
        <div className="w-16 h-3/4 border-x border-primary/30 relative flex flex-col items-center justify-center z-10 bg-background/50 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/5"
          />
          <span className="font-mono text-[8px] text-primary -rotate-90 tracking-widest whitespace-nowrap">
            OPTIMIZATION
          </span>
        </div>

        {/* Right Side: After (Improved System) */}
        <div className="flex-1 h-full relative flex items-center">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Clean straight path */}
            <motion.path
              d="M 0 50 L 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary opacity-80"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            {/* Sub-paths tightly grouped */}
            <motion.path
              d="M 0 48 L 100 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-white opacity-40"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
            />
            <motion.path
              d="M 0 52 L 100 52"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-white opacity-40"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.1 }}
            />
          </svg>
          
          <div className="absolute right-4 bottom-1/4 flex flex-col gap-2 font-mono text-[10px] text-primary text-right">
            <span>LATENCY: 420ms</span>
            <span>TOKENS: 1,800</span>
            <span>COST: $0.01/req</span>
          </div>
        </div>

      </div>
    </div>
  );
}
