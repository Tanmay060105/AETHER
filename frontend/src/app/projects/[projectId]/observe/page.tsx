"use client";

import { useProject } from "../layout";
import { useEffect, useState, useCallback } from "react";
import { ObserveSignal } from "@/components/observe/ObserveSignal";
import { ObserveSystemState } from "@/components/observe/ObserveSystemState";
import { ObserveRecentActivity } from "@/components/observe/ObserveRecentActivity";
import { ObserveIntelligence } from "@/components/observe/ObserveIntelligence";
import { ObserveInvestigation } from "@/components/observe/ObserveInvestigation";
import { TimeRange, Interval } from "@/components/observe/ObserveFilters";
import { ObserveIntro } from "@/components/observe/ObserveIntro";
import { ObservePrimarySignal } from "@/components/observe/ObservePrimarySignal";
import { ObserveSystemMetrics } from "@/components/observe/ObserveSystemMetrics";
import { 
  ObserveFiltersResponse, 
  ObserveMetricsResponse, 
  ObserveTimeseriesResponse,
  ObserveRecentTracesResponse,
  fetchObserveFilters,
  fetchObserveMetrics,
  fetchObserveTimeseries,
  fetchObserveRecentTraces,
  ApiError
} from "@/lib/api";
import { motion } from "framer-motion";

export default function ObservePage() {
  const { project, loading: projectLoading } = useProject();

  const [timeRange, setTimeRange] = useState<TimeRange>("24H");
  const [interval, setInterval] = useState<Interval>("1h");
  const [environment, setEnvironment] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);

  const [filters, setFilters] = useState<ObserveFiltersResponse | null>(null);
  const [metrics, setMetrics] = useState<ObserveMetricsResponse | null>(null);
  const [timeseries, setTimeseries] = useState<ObserveTimeseriesResponse | null>(null);
  const [recentTraces, setRecentTraces] = useState<ObserveRecentTracesResponse | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateTimeRange = useCallback((range: TimeRange) => {
    const end = new Date();
    const start = new Date();
    if (range === "1H") {
      start.setHours(start.getHours() - 1);
    } else if (range === "24H") {
      start.setHours(start.getHours() - 24);
    } else if (range === "7D") {
      start.setDate(start.getDate() - 7);
    }
    return { 
      startTime: start.toISOString(), 
      endTime: end.toISOString() 
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!project) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { startTime, endTime } = calculateTimeRange(timeRange);

      const [f, m, t, r] = await Promise.all([
        fetchObserveFilters(project.id),
        fetchObserveMetrics(project.id, startTime, endTime, model, environment),
        fetchObserveTimeseries(project.id, startTime, endTime, interval, model, environment),
        fetchObserveRecentTraces(project.id)
      ]);

      setFilters(f);
      setMetrics(m);
      setTimeseries(t);
      setRecentTraces(r);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch observe data.");
      }
    } finally {
      setLoading(false);
    }
  }, [project, timeRange, interval, model, environment, calculateTimeRange]);

  useEffect(() => {
    // eslint-disable-next-line
    loadData();
  }, [loadData]);

  if (projectLoading) {
    return null;
  }

  // State: Error
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 min-h-[100svh]">
        <div className="text-metadata font-mono text-red-500 border border-red-500/20 bg-red-500/5 p-4 rounded-sm">
          {error}
        </div>
      </div>
    );
  }

  // State: Loading
  if (loading && !metrics) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[100svh]">
        <div className="text-metadata font-mono tracking-widest uppercase text-tertiary">
          Initializing Instrumentation...
        </div>
      </div>
    );
  }

  // State: Valid project with zero telemetry
  if (!loading && metrics && metrics.request_count === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 min-h-[100svh]">
        <div className="text-metadata font-mono tracking-widest uppercase text-secondary">
          NO TELEMETRY DETECTED
        </div>
        <div className="text-body font-mono text-tertiary max-w-md text-center leading-relaxed">
          Connect an AETHER SDK to this project to begin observing system behavior.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-8 pb-32 flex flex-col gap-12">
      
      {/* LAYER 01: SYSTEM INTRODUCTION */}
      <ObserveIntro 
        projectName={project?.name || "Unknown"}
        availableFilters={filters}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        interval={interval}
        onIntervalChange={setInterval}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        model={model}
        onModelChange={setModel}
      />

      {/* LAYER 02: PRIMARY SIGNAL */}
      {metrics && (
        <ObservePrimarySignal requestCount={metrics.request_count} />
      )}

      {/* LAYER 03: SYSTEM METRICS */}
      {metrics && (
        <ObserveSystemMetrics metrics={metrics} />
      )}

      {/* LAYER 04: SIGNAL ANALYSIS */}
      {timeseries && (
        <div className="flex flex-col gap-4 mt-8 border-t border-surface-2/50 pt-12">
          <h3 className="font-mono text-metadata tracking-widest text-secondary uppercase">
            Signal Analysis
          </h3>
          <ObserveSignal data={timeseries.data} />
        </div>
      )}

      {/* LAYER 05: SYSTEM STATE */}
      {metrics && (
        <ObserveSystemState metrics={metrics} />
      )}

      {/* LAYER 06: RECENT ACTIVITY */}
      {recentTraces && project && (
        <ObserveRecentActivity data={recentTraces} projectId={project.id} />
      )}

      {/* LAYER 07: INTELLIGENCE */}
      <ObserveIntelligence />

      {/* LAYER 08: INVESTIGATION */}
      {project && (
        <ObserveInvestigation projectId={project.id} />
      )}

    </div>
  );
}
