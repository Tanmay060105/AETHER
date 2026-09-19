"use client";

import { motion } from "framer-motion";
import { ObserveMetricsResponse } from "@/lib/api";

interface ObserveSystemMetricsProps {
  metrics: ObserveMetricsResponse;
}

export function ObserveSystemMetrics({ metrics }: ObserveSystemMetricsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 pb-16 border-t border-surface-2/50"
    >
      <div className="flex flex-col gap-2">
        <div className="font-mono text-metadata tracking-widest uppercase text-tertiary">
          Error Rate
        </div>
        <div className={`font-mono text-section-title tracking-tight ${metrics.error_rate > 0 ? "text-red-500" : "text-primary"}`}>
          {(metrics.error_rate * 100).toFixed(2)}%
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-mono text-metadata tracking-widest uppercase text-tertiary">
          Avg Latency
        </div>
        <div className="font-mono text-section-title tracking-tight text-primary">
          {metrics.avg_latency_ms.toFixed(0)}<span className="text-body text-secondary ml-1">ms</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-mono text-metadata tracking-widest uppercase text-tertiary">
          Tokens
        </div>
        <div className="font-mono text-section-title tracking-tight text-primary">
          {metrics.total_tokens.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-mono text-metadata tracking-widest uppercase text-tertiary">
          Cost
        </div>
        <div className="font-mono text-section-title tracking-tight text-primary">
          ${metrics.total_cost.toFixed(4)}
        </div>
      </div>
    </motion.div>
  );
}
