"use client";

import { motion } from "framer-motion";
import { ObserveMetricsResponse } from "@/lib/api";

interface ObserveSystemStateProps {
  metrics: ObserveMetricsResponse;
}

export function ObserveSystemState({ metrics }: ObserveSystemStateProps) {
  // Determine state based on approved rules:
  // 0% -> NOMINAL
  // >0% and <5% -> ELEVATED
  // >=5% -> DEGRADED
  
  let state = "NOMINAL";
  let colorClass = "text-primary border-primary/20 bg-primary/5";
  let textColorClass = "text-primary";
  let message = "System is operating within expected parameters.";

  const errorPercent = metrics.error_rate * 100;

  if (errorPercent >= 5) {
    state = "DEGRADED";
    colorClass = "text-red-500 border-red-500/20 bg-red-500/5";
    textColorClass = "text-red-500";
    message = "System error rate has exceeded acceptable thresholds.";
  } else if (errorPercent > 0) {
    state = "ELEVATED";
    colorClass = "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
    textColorClass = "text-yellow-500";
    message = "System error rate is elevated but below critical thresholds.";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="flex flex-col gap-6 pt-12 pb-12 border-t border-surface-2/50"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className={`font-mono text-section-title tracking-widest px-4 py-2 border ${colorClass}`}>
          {state}
        </div>
        <div className={`font-mono text-body tracking-widest uppercase ${textColorClass}`}>
          {message}
        </div>
      </div>
    </motion.div>
  );
}
