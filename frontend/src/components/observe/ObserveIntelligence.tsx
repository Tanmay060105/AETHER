"use client";

import { motion } from "framer-motion";
import { TraceNetwork } from "@/components/visualizations/TraceNetwork";

export function ObserveIntelligence() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      className="flex flex-col gap-6 pt-12 border-t border-surface-2/50"
    >
      <div className="flex flex-col md:flex-row gap-8 items-stretch h-[400px]">
        
        {/* Left Side: Description / Intelligence */}
        <div className="flex-1 flex flex-col gap-4 justify-center border border-surface-2 bg-surface-1/30 p-8">
          <h2 className="font-mono text-section-title tracking-widest text-primary uppercase">
            Intelligence
          </h2>
          <div className="font-mono text-body text-secondary leading-relaxed">
            The telemetry pipeline is automatically profiling trace topologies to identify non-deterministic latency spikes and recurring tool failures.
          </div>
          <div className="mt-4 pt-4 border-t border-surface-2/50 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-widest uppercase text-tertiary">Anomalies Detected</span>
              <span className="font-mono text-body text-primary">0</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-widest uppercase text-tertiary">Active Heuristics</span>
              <span className="font-mono text-body text-primary">12</span>
            </div>
          </div>
        </div>

        {/* Right Side: Network Graph */}
        <div className="flex-[2] border border-surface-2 overflow-hidden bg-background">
          <TraceNetwork />
        </div>
      </div>
    </motion.div>
  );
}
