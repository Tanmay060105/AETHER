"use client";

import { motion } from "framer-motion";
import { ObserveFilters, TimeRange, Interval } from "./ObserveFilters";
import { ObserveFiltersResponse } from "@/lib/api";

interface ObserveIntroProps {
  projectName: string;
  availableFilters: ObserveFiltersResponse | null;
  timeRange: TimeRange;
  onTimeRangeChange: (r: TimeRange) => void;
  interval: Interval;
  onIntervalChange: (i: Interval) => void;
  environment: string | null;
  onEnvironmentChange: (e: string | null) => void;
  model: string | null;
  onModelChange: (m: string | null) => void;
}

export function ObserveIntro({
  projectName,
  availableFilters,
  timeRange,
  onTimeRangeChange,
  interval,
  onIntervalChange,
  environment,
  onEnvironmentChange,
  model,
  onModelChange
}: ObserveIntroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-12 pt-12 pb-8 border-b border-surface-2/50"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="font-mono text-metadata tracking-widest uppercase text-tertiary">
            AETHER / {projectName.toUpperCase()}
          </div>
          <div className="font-mono text-metadata tracking-widest uppercase text-primary">
            OBSERVING · LIVE
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-section-title md:text-hero tracking-tighter text-primary leading-none">
            OBSERVE
          </h1>
          <h2 className="font-mono text-body md:text-section-title tracking-tight text-secondary font-light">
            SEE THE SIGNAL BEHIND THE SYSTEM.
          </h2>
        </div>
      </div>

      <div className="w-full">
        <ObserveFilters 
          availableFilters={availableFilters}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
          interval={interval}
          onIntervalChange={onIntervalChange}
          environment={environment}
          onEnvironmentChange={onEnvironmentChange}
          model={model}
          onModelChange={onModelChange}
        />
      </div>
    </motion.div>
  );
}
