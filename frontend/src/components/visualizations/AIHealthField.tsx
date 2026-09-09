"use client";

import { motion } from "framer-motion";

export function AIHealthField() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-background overflow-hidden">
      <div className="relative w-full h-[200px] flex flex-col justify-between">
        
        {/* Latency Signal */}
        <div className="relative w-full h-10 flex items-center">
          <span className="absolute -left-4 top-0 font-mono text-[8px] text-secondary">LATENCY</span>
          <svg className="w-full h-full" preserveAspectRatio="none">
            <motion.path 
              d="M 0 20 L 50 20 L 60 10 L 70 20 L 120 20 L 130 30 L 140 20 L 250 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-surface-2"
            />
            <motion.path 
              d="M 0 20 L 50 20 L 60 10 L 70 20 L 120 20 L 130 30 L 140 20 L 250 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-primary"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Quality Signal */}
        <div className="relative w-full h-10 flex items-center">
          <span className="absolute -left-4 top-0 font-mono text-[8px] text-secondary">QUALITY</span>
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 100 20 L 150 20 L 200 20 L 250 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-surface-2"
            />
            <motion.circle 
              cx="0" cy="20" r="3" fill="#F5F5F5"
              animate={{ cx: ["0%", "100%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Error Signal */}
        <div className="relative w-full h-10 flex items-center">
          <span className="absolute -left-4 top-0 font-mono text-[8px] text-secondary">ERROR</span>
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 80 20 L 90 5 L 100 20 L 250 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-surface-2"
            />
            <motion.circle 
              cx="90" cy="5" r="4" fill="#E97979"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

      </div>
    </div>
  );
}
