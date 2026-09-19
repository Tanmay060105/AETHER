"use client";

import { ObserveFiltersResponse } from "@/lib/api";

export type TimeRange = "1H" | "24H" | "7D";
export type Interval = "1h" | "1d";

interface ObserveFiltersProps {
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

export function ObserveFilters({
  availableFilters,
  timeRange,
  onTimeRangeChange,
  interval,
  onIntervalChange,
  environment,
  onEnvironmentChange,
  model,
  onModelChange
}: ObserveFiltersProps) {
  
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 py-4 border-b border-surface-2 font-mono text-xs uppercase tracking-widest text-secondary">
      
      {/* Time Range */}
      <div className="flex items-center gap-3">
        <span className="text-tertiary">TIME</span>
        <div className="flex gap-1 bg-surface-1/50 p-1 rounded-sm border border-surface-2">
          {(["1H", "24H", "7D"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`px-3 py-1 transition-colors ${timeRange === r ? "bg-primary text-background" : "hover:text-primary"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Interval */}
      <div className="flex items-center gap-3">
        <span className="text-tertiary">INTERVAL</span>
        <div className="flex gap-1 bg-surface-1/50 p-1 rounded-sm border border-surface-2">
          {(["1h", "1d"] as Interval[]).map((i) => (
            <button
              key={i}
              onClick={() => onIntervalChange(i)}
              className={`px-3 py-1 transition-colors ${interval === i ? "bg-primary text-background" : "hover:text-primary"}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block flex-1" />

      {/* Environment */}
      <div className="flex items-center gap-3">
        <label htmlFor="env-select" className="text-tertiary">ENV</label>
        <select 
          id="env-select"
          value={environment || ""}
          onChange={(e) => onEnvironmentChange(e.target.value || null)}
          className="bg-transparent border-b border-surface-2 py-1 focus:outline-none focus:border-primary transition-colors text-primary cursor-pointer"
        >
          <option value="">ALL</option>
          {availableFilters?.environments.map(env => (
            <option key={env} value={env} className="bg-background text-primary">{env}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="flex items-center gap-3">
        <label htmlFor="model-select" className="text-tertiary">MODEL</label>
        <select 
          id="model-select"
          value={model || ""}
          onChange={(e) => onModelChange(e.target.value || null)}
          className="bg-transparent border-b border-surface-2 py-1 focus:outline-none focus:border-primary transition-colors text-primary cursor-pointer"
        >
          <option value="">ALL</option>
          {availableFilters?.models.map(m => (
            <option key={m} value={m} className="bg-background text-primary">{m}</option>
          ))}
        </select>
      </div>

    </div>
  );
}
