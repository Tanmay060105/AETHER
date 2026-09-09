"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function TelemetryField() {
  // Pre-generate deterministic values for client side only
  const streams = Array.from({ length: 12 }).map((_, i) => ({
    delay: (i * 1.3) % 4,
    duration1: 2 + ((i * 0.7) % 2),
    duration2: 4 + ((i * 0.9) % 3),
    delay2: (i * 1.7) % 3,
    hex: "0x" + Math.floor((i * 1234567) % 16777215).toString(16).padStart(6, '0'),
  }));
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-background overflow-hidden">
      <TechnicalGrid />
      <div className="absolute inset-0 flex justify-evenly items-stretch opacity-100 z-10">
        {streams.map((s, i) => (
          <div key={i} className="relative w-[1px] h-full bg-surface-2/30">
            {/* Primary Signal Particle */}
            <motion.div
              className="absolute top-0 left-[-2px] w-[5px] h-[60px] bg-primary/80 blur-[2px]"
              initial={{ y: "-10%" }}
              animate={{ y: "100vh" }}
              transition={{ 
                duration: s.duration1, 
                repeat: Infinity, 
                ease: "linear",
                delay: s.delay
              }}
            />
            <motion.div
              className="absolute top-0 left-[-1px] w-[3px] h-[30px] bg-white"
              initial={{ y: "-10%" }}
              animate={{ y: "100vh" }}
              transition={{ 
                duration: s.duration1, 
                repeat: Infinity, 
                ease: "linear",
                delay: s.delay
              }}
            />
            {/* Hex Data Stream */}
            <motion.div
              className="absolute left-3 font-mono text-[10px] text-primary/70 tracking-widest"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: "100vh", opacity: [0, 0.8, 0.8, 0] }}
              transition={{ 
                duration: s.duration2, 
                repeat: Infinity, 
                ease: "linear",
                delay: s.delay2
              }}
            >
              {s.hex}
            </motion.div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-20 pointer-events-none" />
    </div>
  );
}
