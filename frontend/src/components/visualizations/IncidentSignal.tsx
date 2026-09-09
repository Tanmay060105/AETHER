"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function IncidentSignal() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-background/50 overflow-hidden">
      <TechnicalGrid />
      <div className="relative w-full max-w-[300px] h-[100px] flex items-center justify-center z-10">
        
        {/* Signal Background */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 100">
          {/* Normal Signal segment */}
          <path d="M 0 50 L 100 50" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white opacity-40" />
          
          {/* Anomaly segment */}
          <motion.path 
            d="M 100 50 L 110 30 L 120 70 L 130 20 L 140 80 L 150 50" 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="3"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Return to normal */}
          <path d="M 150 50 L 300 50" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white opacity-40" />
          
          {/* Moving Signal Tracker */}
          <motion.circle 
            r="4" 
            fill="#FFFFFF"
            className="shadow-[0_0_10px_rgba(255,255,255,1)]"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={{ offsetPath: "path('M 0 50 L 100 50 L 110 30 L 120 70 L 130 20 L 140 80 L 150 50 L 300 50')" } as any}
          />
        </svg>

        {/* Metadata */}
        <motion.div 
          className="absolute top-[10px] left-[105px] font-mono text-[9px] tracking-widest font-bold"
          style={{ color: "#ef4444" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          INCIDENT_DETECTED
        </motion.div>

        {/* Vertical markers */}
        <div className="absolute left-[100px] top-[20px] bottom-[20px] w-[1px] bg-[#ef4444]/30" />
        <div className="absolute left-[150px] top-[20px] bottom-[20px] w-[1px] bg-[#ef4444]/30" />
      </div>
    </div>
  );
}
