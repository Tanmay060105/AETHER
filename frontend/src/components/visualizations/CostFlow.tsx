"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CostFlow() {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    xOffset: ((i * 13) % 100) - 50,
    delay: (i * 0.3) % 2,
    duration: 2 + ((i * 0.7) % 1),
  }));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-background overflow-hidden">
      
      {/* Funnel Outline */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
        <path d="M 0 0 L 100 0 L 150 150 L 150 300 L 250 300 L 250 150 L 300 0 L 400 0" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
      </svg>
      
      <div className="relative w-[100px] h-[300px] flex justify-center">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-1.5 h-1.5 bg-secondary rounded-full"
            initial={{ y: -50, x: p.xOffset, opacity: 0 }}
            animate={{ 
              y: ["0%", "50%", "100%"], 
              x: [p.xOffset, 0, 0],
              opacity: [0, 1, 0.5],
              scale: [1, 1, 2]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: p.delay 
            }}
          />
        ))}

        <div className="absolute bottom-0 w-full h-8 border-t border-surface-2 flex items-center justify-center">
          <span className="font-mono text-metadata text-primary">$COST</span>
        </div>
      </div>
      
    </div>
  );
}
