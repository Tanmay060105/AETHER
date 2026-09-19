"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ObserveInvestigationProps {
  projectId: string;
}

export function ObserveInvestigation({ projectId }: ObserveInvestigationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      className="flex flex-col md:flex-row gap-4 items-stretch justify-between pt-12 border-t border-surface-2/50"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-mono text-section-title tracking-widest text-primary uppercase">
          Investigation
        </h3>
        <p className="font-mono text-[10px] tracking-widest text-tertiary uppercase">
          Drill down into raw telemetry or export metrics
        </p>
      </div>

      <div className="flex flex-row gap-4 items-center">
        <Link 
          href={`/projects/${projectId}/traces`}
          className="px-6 py-3 font-mono text-[10px] tracking-widest uppercase bg-primary text-black hover:bg-secondary transition-colors"
        >
          Explore Traces
        </Link>
        <Link 
          href={`/projects/${projectId}/settings/api`}
          className="px-6 py-3 font-mono text-[10px] tracking-widest uppercase border border-surface-2 text-tertiary hover:text-primary hover:border-primary transition-colors"
        >
          View Metrics API
        </Link>
      </div>
    </motion.div>
  );
}
