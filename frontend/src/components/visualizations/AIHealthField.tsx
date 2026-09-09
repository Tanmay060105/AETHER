"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function AIHealthField() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-background overflow-hidden">
      <TechnicalGrid />
      <div className="relative w-full h-[250px] flex flex-col justify-between z-10 max-w-xl">
        
        {/* Latency Signal */}
        <div className="relative w-full h-12 flex items-center">
          <span className="absolute left-0 top-0 font-mono text-[10px] text-primary font-bold">LATENCY</span>
          <span className="absolute right-0 top-0 font-mono text-[10px] text-tertiary">P99</span>
          <svg className="w-full h-full mt-4" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 25 20 L 30 10 L 35 20 L 60 20 L 65 30 L 70 20 L 100 20" 
              vectorEffect="non-scaling-stroke"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="text-surface-2 opacity-50"
            />
            <motion.path 
              d="M 0 20 L 25 20 L 30 10 L 35 20 L 60 20 L 65 30 L 70 20 L 100 20" 
              vectorEffect="non-scaling-stroke"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className="text-primary opacity-90"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Quality Signal */}
        <div className="relative w-full h-12 flex items-center">
          <span className="absolute left-0 top-0 font-mono text-[10px] text-primary font-bold">QUALITY</span>
          <span className="absolute right-0 top-0 font-mono text-[10px] text-tertiary">SCORE</span>
          <svg className="w-full h-full mt-4" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 100 20" 
              vectorEffect="non-scaling-stroke"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="text-surface-2 opacity-50"
            />
            <motion.circle 
              cx="0" cy="20" r="4" fill="#FFFFFF"
              className="shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              animate={{ cx: ["0%", "100%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Error Signal */}
        <div className="relative w-full h-12 flex items-center">
          <span className="absolute left-0 top-0 font-mono text-[10px] text-[#ef4444] font-bold">ERROR RATE</span>
          <span className="absolute right-0 top-0 font-mono text-[10px] text-tertiary">5XX</span>
          <svg className="w-full h-full mt-4" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 40 20 L 45 5 L 50 20 L 100 20" 
              vectorEffect="non-scaling-stroke"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="text-surface-2 opacity-50"
            />
            <motion.path 
              d="M 0 20 L 40 20 L 45 5 L 50 20 L 100 20" 
              vectorEffect="non-scaling-stroke"
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="2.5" 
              className="opacity-70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle 
              cx="45%" cy="5" r="5" fill="#ef4444"
              className="shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

      </div>
    </div>
  );
}
