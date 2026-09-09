"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function SystemFlow() {
  const nodes = [
    { label: "INPUT", y: 0, x: -100 },
    { label: "MODEL", y: 60, x: -50 },
    { label: "TOOL", y: 120, x: 0 },
    { label: "DATABASE", y: 180, x: 50 },
    { label: "EVALUATION", y: 240, x: 0 },
    { label: "OUTPUT", y: 300, x: -50 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-background overflow-hidden">
      <TechnicalGrid />
      <div className="relative w-[300px] h-[400px] z-10">
        {/* Connecting Line */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          <path 
            d="M 50 20 L 100 80 L 150 140 L 200 200 L 150 260 L 100 320" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="text-surface-2 opacity-50" 
          />
          <motion.path 
            d="M 50 20 L 100 80 L 150 140 L 200 200 L 150 260 L 100 320" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            className="text-white opacity-80"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute flex items-center gap-4"
            style={{ 
              top: `${node.y}px`, 
              left: `${150 + node.x}px`,
              transform: `translateZ(${i * 20}px)`
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
          >
            <div className="w-2.5 h-2.5 bg-white border border-primary/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            <span className="font-mono text-[11px] tracking-widest text-primary font-semibold">{node.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
