"use client";

import { motion } from "framer-motion";
import { ObserveRecentTracesResponse } from "@/lib/api";
import Link from "next/link";

interface ObserveRecentActivityProps {
  data: ObserveRecentTracesResponse;
  projectId: string;
}

export function ObserveRecentActivity({ data, projectId }: ObserveRecentActivityProps) {
  if (data.traces.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-mono text-section-title tracking-widest text-primary uppercase border-b border-surface-2 pb-4">
          Recent Activity
        </h2>
        <div className="font-mono text-body text-tertiary">
          No recent activity found.
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-surface-2 pb-4">
        <h2 className="font-mono text-section-title tracking-widest text-primary uppercase">
          Recent Activity
        </h2>
        <Link 
          href={`/projects/${projectId}/traces`}
          className="font-mono text-[10px] tracking-widest uppercase text-tertiary hover:text-primary transition-colors border border-surface-2 hover:border-primary px-3 py-1"
        >
          View All Traces
        </Link>
      </div>

      <div className="w-full overflow-x-auto border border-surface-2 bg-background">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-surface-2 bg-surface-1/30">
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-tertiary font-normal">Timestamp</th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-tertiary font-normal">Trace ID</th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-tertiary font-normal">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-tertiary font-normal">Latency</th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-tertiary font-normal">Model</th>
            </tr>
          </thead>
          <tbody className="font-mono text-body">
            {data.traces.map((trace, i) => {
              const statusColor = trace.status === "failed" ? "text-red-500" : "text-primary";
              return (
                <tr 
                  key={trace.trace_id} 
                  className={`border-b border-surface-2/50 hover:bg-surface-1/30 transition-colors ${i === data.traces.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-4 py-3 text-secondary">
                    {new Date(trace.timestamp).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3 text-secondary truncate max-w-[200px]">
                    <Link href={`/projects/${projectId}/traces/${trace.trace_id}`} className="hover:text-primary hover:underline">
                      {trace.trace_id}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 uppercase tracking-widest text-[10px] ${statusColor}`}>
                    {trace.status}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {trace.latency_ms.toFixed(0)}ms
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {trace.model || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
