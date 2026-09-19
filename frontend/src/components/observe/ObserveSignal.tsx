"use client";

import { useMemo, useState } from "react";
import { TimeseriesBucket } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface ObserveSignalProps {
  data: TimeseriesBucket[];
}

type MetricType = "requests" | "errors" | "latency";

export function ObserveSignal({ data }: ObserveSignalProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricType>("requests");

  const { points, width, height, pathData, areaPathData, yAxisLabels, xAxisLabels } = useMemo(() => {
    const width = 1200;
    const height = 400;
    const padding = { top: 40, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    if (data.length === 0) {
      return { maxCount: 0, points: [], width, height, pathData: "", areaPathData: "", yAxisLabels: [], xAxisLabels: [] };
    }

    const getValue = (d: TimeseriesBucket) => {
      if (activeMetric === "requests") return d.request_count;
      if (activeMetric === "errors") return d.error_count;
      if (activeMetric === "latency") return d.avg_latency_ms;
      return 0;
    };

    const maxVal = Math.max(...data.map(getValue), 1);
    
    // Round up max to nearest nice number for Y axis
    let maxScaled = maxVal;
    if (activeMetric === "latency") {
       maxScaled = Math.ceil(maxVal / 50) * 50;
    } else {
       maxScaled = Math.ceil(maxVal / 10) * 10;
    }
    
    // Fallback if data is all zeros
    if (maxScaled === 0) maxScaled = 10;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * innerWidth;
      const y = padding.top + innerHeight - (getValue(d) / maxScaled) * innerHeight;
      return { x, y, bucket: d };
    });

    const pathData = points.length > 0 
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
      : "";

    const areaPathData = points.length > 0
      ? `${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`
      : "";

    const yAxisLabels = [
      { label: activeMetric === "latency" ? `${maxScaled}ms` : maxScaled.toString(), y: padding.top },
      { label: activeMetric === "latency" ? `${maxScaled / 2}ms` : (maxScaled / 2).toString(), y: padding.top + innerHeight / 2 },
      { label: "0", y: padding.top + innerHeight }
    ];

    const xAxisLabels = points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map(p => {
      const date = new Date(p.bucket.timestamp);
      return {
        label: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        x: p.x
      };
    });

    return { points, width, height, pathData, areaPathData, yAxisLabels, xAxisLabels };
  }, [data, activeMetric]);

  if (data.length === 0) {
    return (
      <div className="w-full h-[400px] border border-surface-2 bg-surface-1/30 flex items-center justify-center font-mono text-metadata text-tertiary uppercase tracking-widest">
        Awaiting Signal
      </div>
    );
  }

  const activeColorClass = activeMetric === "errors" ? "text-red-500" : "text-primary";
  const activeBgClass = activeMetric === "errors" ? "bg-red-500 text-black" : "bg-primary text-black";

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Toggle */}
      <div className="flex gap-4 font-mono text-metadata tracking-widest uppercase">
        <button 
          onClick={() => setActiveMetric("requests")}
          className={`px-3 py-1 border transition-colors ${activeMetric === "requests" ? "border-primary bg-primary text-black" : "border-surface-2 text-tertiary hover:text-secondary"}`}
        >
          Requests
        </button>
        <button 
          onClick={() => setActiveMetric("errors")}
          className={`px-3 py-1 border transition-colors ${activeMetric === "errors" ? "border-red-500 bg-red-500 text-black" : "border-surface-2 text-tertiary hover:text-secondary"}`}
        >
          Errors
        </button>
        <button 
          onClick={() => setActiveMetric("latency")}
          className={`px-3 py-1 border transition-colors ${activeMetric === "latency" ? "border-primary bg-primary text-black" : "border-surface-2 text-tertiary hover:text-secondary"}`}
        >
          Latency
        </button>
      </div>

      <div className="relative w-full overflow-x-auto border border-surface-2 bg-background select-none">
        <div className="min-w-[800px] h-[400px]">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className={`w-full h-full ${activeColorClass}`}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Grid lines */}
            {yAxisLabels.map((lbl, i) => (
              <line 
                key={`h-line-${i}`} 
                x1={60} 
                y1={lbl.y} 
                x2={width - 20} 
                y2={lbl.y} 
                stroke="currentColor" 
                className="opacity-10" 
                strokeWidth={1} 
                strokeDasharray="4 4"
              />
            ))}

            {/* Y Axis Labels */}
            {yAxisLabels.map((lbl, i) => (
              <text 
                key={`y-lbl-${i}`} 
                x={40} 
                y={lbl.y + 4} 
                fill="currentColor" 
                className="font-mono text-[10px] tracking-widest opacity-50 text-end"
                textAnchor="end"
              >
                {lbl.label}
              </text>
            ))}

            {/* X Axis Labels */}
            {xAxisLabels.map((lbl, i) => (
              <text 
                key={`x-lbl-${i}`} 
                x={lbl.x} 
                y={height - 15} 
                fill="currentColor" 
                className="font-mono text-[10px] tracking-widest opacity-50"
                textAnchor="middle"
              >
                {lbl.label}
              </text>
            ))}

            {/* Area under the curve */}
            <path 
              d={areaPathData} 
              fill="currentColor" 
              className="opacity-[0.03]"
            />

            {/* Main signal line */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={1.5} 
              className="opacity-80"
            />

            {/* Interactive Voronoi / Hover Zones */}
            {points.map((p, i) => {
              const nextX = points[i + 1]?.x ?? width;
              const prevX = points[i - 1]?.x ?? 60;
              const zoneWidth = (nextX - prevX) / 2;
              const zoneX = p.x - (p.x - prevX) / 2;
              
              return (
                <rect
                  key={`zone-${i}`}
                  x={zoneX}
                  y={0}
                  width={zoneWidth}
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(i)}
                  className="cursor-crosshair"
                />
              );
            })}

            {/* Hover effects */}
            <AnimatePresence>
              {hoverIndex !== null && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <line 
                    x1={points[hoverIndex].x}
                    y1={40}
                    x2={points[hoverIndex].x}
                    y2={height - 40}
                    stroke="currentColor"
                    strokeWidth={1}
                    className="opacity-30"
                    strokeDasharray="4 4"
                  />
                  <circle 
                    cx={points[hoverIndex].x} 
                    cy={points[hoverIndex].y} 
                    r={4} 
                    fill="currentColor" 
                  />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* Hover Tooltip (HTML overlay for crisp text rendering) */}
          {hoverIndex !== null && (
            <div 
              className="absolute pointer-events-none transition-all duration-75 ease-out"
              style={{
                left: `${(points[hoverIndex].x / width) * 100}%`,
                top: `${(points[hoverIndex].y / height) * 100}%`,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <div className="bg-background border border-surface-2 p-3 flex flex-col gap-1 min-w-[140px] shadow-2xl backdrop-blur-md">
                <span className="text-[10px] font-mono text-tertiary tracking-widest uppercase mb-1">
                  {new Date(points[hoverIndex].bucket.timestamp).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <div className={`flex justify-between items-center gap-4 text-xs font-mono ${activeMetric === 'requests' ? 'opacity-100' : 'opacity-50'}`}>
                  <span className={activeMetric === 'requests' ? 'text-primary' : 'text-secondary'}>Requests</span>
                  <span className={activeMetric === 'requests' ? 'text-primary' : 'text-secondary'}>{points[hoverIndex].bucket.request_count}</span>
                </div>
                <div className={`flex justify-between items-center gap-4 text-xs font-mono ${activeMetric === 'errors' ? 'opacity-100' : 'opacity-50'}`}>
                  <span className={activeMetric === 'errors' ? 'text-red-500' : 'text-secondary'}>Errors</span>
                  <span className={activeMetric === 'errors' ? 'text-red-500' : 'text-secondary'}>{points[hoverIndex].bucket.error_count}</span>
                </div>
                <div className={`flex justify-between items-center gap-4 text-xs font-mono ${activeMetric === 'latency' ? 'opacity-100' : 'opacity-50'}`}>
                  <span className={activeMetric === 'latency' ? 'text-primary' : 'text-secondary'}>Latency</span>
                  <span className={activeMetric === 'latency' ? 'text-primary' : 'text-secondary'}>{points[hoverIndex].bucket.avg_latency_ms.toFixed(0)}ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
