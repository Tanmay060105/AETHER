"use client";

import { motion } from "framer-motion";

export function EvaluationSignal() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-background overflow-hidden font-mono text-metadata">
      <div className="relative w-[300px] h-[300px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Main Model Flow */}
          <path d="M 50 150 L 250 150" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
          
          {/* Base Flow Path */}
          <path d="M 50 150 L 150 150 L 150 250 L 250 250" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
          
          {/* Moving Evaluation Signal */}
          <motion.circle 
            r="3" 
            fill="#F5F5F5"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={{ offsetPath: "path('M 50 150 L 150 150 L 150 250 L 250 250')" } as any}
          />
        </svg>

        {/* Node Points */}
        <div className="absolute top-[140px] left-[40px] text-secondary text-[8px]">INPUT</div>
        <div className="absolute top-[140px] left-[140px] text-secondary text-[8px]">MODEL</div>
        <div className="absolute top-[260px] left-[140px] text-secondary text-[8px]">EVALUATOR</div>
        <div className="absolute top-[260px] left-[260px] text-success text-[10px]">PASS (0.94)</div>

        <div className="absolute top-[147px] left-[50px] w-2 h-2 bg-primary rounded-full" />
        <div className="absolute top-[147px] left-[150px] w-2 h-2 bg-primary rounded-full" />
        <div className="absolute top-[247px] left-[150px] w-2 h-2 bg-primary rounded-full" />
        <div className="absolute top-[247px] left-[250px] w-2 h-2 bg-success rounded-full" />
      </div>
    </div>
  );
}
