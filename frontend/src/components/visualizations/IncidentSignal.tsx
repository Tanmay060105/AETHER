"use client";

import { motion } from "framer-motion";

export function IncidentSignal() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-background overflow-hidden">
      <div className="relative w-full max-w-[300px] h-[100px] flex items-center justify-center">
        
        {/* Signal Background */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Normal Signal segment */}
          <path d="M 0 50 L 100 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary" />
          
          {/* Anomaly segment */}
          <motion.path 
            d="M 100 50 L 110 30 L 120 70 L 130 20 L 140 80 L 150 50" 
            fill="none" 
            stroke="#E97979" 
            strokeWidth="2"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Return to normal */}
          <path d="M 150 50 L 300 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary" />
          
          {/* Moving Signal Tracker */}
          <motion.circle 
            r="3" 
            fill="#F5F5F5"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={{ offsetPath: "path('M 0 50 L 100 50 L 110 30 L 120 70 L 130 20 L 140 80 L 150 50 L 300 50')" } as any}
          />
        </svg>

        {/* Metadata */}
        <motion.div 
          className="absolute top-[20px] left-[105px] font-mono text-[8px] tracking-widest"
          style={{ color: "#E97979" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          INCIDENT_DETECTED
        </motion.div>
      </div>
    </div>
  );
}
