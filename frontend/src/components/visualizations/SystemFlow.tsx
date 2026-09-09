"use client";

import { motion } from "framer-motion";

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
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-background">
      <div className="relative w-[300px] h-[400px]">
        {/* Connecting Line */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          <path 
            d="M 50 20 L 100 80 L 150 140 L 200 200 L 150 260 L 100 320" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            className="text-surface-2" 
          />
          <motion.path 
            d="M 50 20 L 100 80 L 150 140 L 200 200 L 150 260 L 100 320" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-secondary"
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
            <div className="w-2 h-2 bg-secondary" />
            <span className="font-mono text-metadata tracking-widest text-primary">{node.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
