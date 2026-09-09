"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function EvaluationSignal() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-background overflow-hidden font-mono text-metadata">
      <TechnicalGrid />
      <div className="relative w-[400px] h-[300px] z-10">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Threshold Line */}
          <line x1="50" y1="150" x2="350" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-surface-2 opacity-50" />
          <text x="360" y="153" className="text-[8px] fill-tertiary">THRESHOLD (0.80)</text>

          {/* Score Trajectory (Sine-ish curve going up) */}
          <path 
            d="M 50 250 Q 150 250, 200 150 T 350 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="text-white opacity-40" 
          />
          <motion.path 
            d="M 50 250 Q 150 250, 200 150 T 350 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            className="text-primary opacity-90"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
          
          {/* Data Points */}
          <circle cx="50" cy="250" r="3" className="fill-surface-2" />
          <circle cx="125" cy="215" r="3" className="fill-surface-2" />
          <circle cx="200" cy="150" r="4" className="fill-white" />
          <circle cx="275" cy="85" r="3" className="fill-primary opacity-80" />
          <circle cx="350" cy="50" r="5" className="fill-primary" />
        </svg>

        {/* Labels */}
        <div className="absolute top-[260px] left-[40px] text-tertiary text-[10px]">V1</div>
        <div className="absolute top-[135px] left-[210px] text-white text-[10px]">V3 (0.80)</div>
        <div className="absolute top-[35px] left-[360px] text-primary text-[11px] font-bold">V5 (0.94)</div>

        <div className="absolute top-[280px] left-[50px] flex flex-col gap-1 text-[8px] text-tertiary">
          <span>METRIC: RELEVANCE</span>
          <span>DATASET: ds_eval_prod</span>
        </div>
      </div>
    </div>
  );
}
