"use client";

import { motion } from "framer-motion";
import { TechnicalGrid } from "./TechnicalGrid";

export function IncidentSignal() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 lg:p-12 bg-background/50 overflow-hidden">
      <TechnicalGrid />
      
      {/* Container for the unified, large visualization */}
      <div className="relative w-full max-w-4xl aspect-[2/1] z-10 flex items-center justify-center">
        
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
           {/* Latency */}
           <text x="20" y="50" fill="currentColor" fontSize="14" className="font-mono tracking-widest text-primary uppercase">LATENCY</text>
           <text x="100" y="50" fill="currentColor" fontSize="10" className="font-mono tracking-widest text-tertiary opacity-50 uppercase">MS</text>
           <path d="M 0 60 L 350 60 L 400 90 L 800 90" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white opacity-20" />
           <motion.path 
             d="M 0 60 L 350 60 L 400 90 L 800 90"
             fill="none" 
             stroke="currentColor" 
             strokeWidth="1.5" 
             className="text-white opacity-60"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           />
           
           {/* Quality */}
           <text x="20" y="110" fill="currentColor" fontSize="14" className="font-mono tracking-widest text-primary uppercase">QUALITY</text>
           <text x="100" y="110" fill="currentColor" fontSize="10" className="font-mono tracking-widest text-tertiary opacity-50 uppercase">SCORE</text>
           <path d="M 0 120 L 380 120 L 440 160 L 800 160" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white opacity-20" />
           <motion.path 
             d="M 0 120 L 380 120 L 440 160 L 800 160"
             fill="none" 
             stroke="currentColor" 
             strokeWidth="1.5" 
             className="text-white opacity-60"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
           />

           {/* P99 */}
           <text x="20" y="170" fill="currentColor" fontSize="14" className="font-mono tracking-widest text-primary uppercase">P99</text>
           <text x="60" y="170" fill="currentColor" fontSize="10" className="font-mono tracking-widest text-tertiary opacity-50 uppercase">TAIL</text>
           <path d="M 0 180 L 410 180 L 470 220 L 800 220" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white opacity-20" />
           <motion.path 
             d="M 0 180 L 410 180 L 470 220 L 800 220"
             fill="none" 
             stroke="currentColor" 
             strokeWidth="1.5" 
             className="text-white opacity-60"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
           />

           {/* Incident Detection Zone / Window */}
           <rect x="420" y="40" width="180" height="320" fill="#ef4444" opacity="0.04" />
           <line x1="420" y1="40" x2="420" y2="360" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
           <line x1="600" y1="40" x2="600" y2="360" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />

           {/* Root Incident Signal - Base line */}
           <path d="M 0 300 L 420 300" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white opacity-40" />
           <path d="M 600 300 L 800 300" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white opacity-40" />

           {/* Anomaly Spike (Increased amplitude and visibility) */}
           <motion.path 
             d="M 420 300 L 440 180 L 460 380 L 490 100 L 520 360 L 550 220 L 580 340 L 600 300" 
             fill="none" 
             stroke="#ef4444" 
             strokeWidth="3.5"
             initial={{ opacity: 0.4 }}
             animate={{ opacity: [0.4, 1, 0.4] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
           />

           {/* Arrow pointing to anomaly */}
           <text x="320" y="275" fill="currentColor" fontSize="12" className="font-mono text-tertiary opacity-70 uppercase tracking-widest">↗ ANOMALY</text>

           {/* Incident Detected Callout */}
           <motion.text
             x="510" y="380"
             fill="#ef4444"
             fontSize="14"
             textAnchor="middle"
             className="font-mono font-bold tracking-widest"
             initial={{ opacity: 0 }}
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
           >
             INCIDENT_DETECTED
           </motion.text>
           
           {/* Moving Signal Tracker on ROOT SIGNAL */}
           <motion.circle 
             r="6" 
             fill="#FFFFFF"
             className="shadow-[0_0_12px_rgba(255,255,255,1)]"
             initial={{ offsetDistance: "0%" }}
             animate={{ offsetDistance: "100%" }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             style={{ offsetPath: "path('M 0 300 L 420 300 L 440 180 L 460 380 L 490 100 L 520 360 L 550 220 L 580 340 L 600 300 L 800 300')" } as any}
           />
        </svg>

      </div>
    </div>
  );
}
