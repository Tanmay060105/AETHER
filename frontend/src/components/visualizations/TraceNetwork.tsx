"use client";

import { motion } from "framer-motion";

export function TraceNetwork() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-background">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-sm max-h-sm opacity-80" fill="none">
        {/* Abstract Trace Network Paths */}
        <motion.path 
          d="M 50 200 L 150 200 L 250 100 L 350 100" 
          stroke="currentColor" 
          strokeWidth="1" 
          className="text-secondary" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.path 
          d="M 150 200 L 250 300 L 350 300" 
          stroke="currentColor" 
          strokeWidth="1" 
          className="text-secondary" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        />
        
        {/* Nodes */}
        <circle cx="50" cy="200" r="4" fill="currentColor" className="text-secondary" />
        <circle cx="150" cy="200" r="4" fill="currentColor" className="text-secondary" />
        <circle cx="250" cy="100" r="4" fill="currentColor" className="text-secondary" />
        <circle cx="350" cy="100" r="4" fill="currentColor" className="text-secondary" />
        <circle cx="250" cy="300" r="4" fill="currentColor" className="text-secondary" />
        <circle cx="350" cy="300" r="4" fill="currentColor" className="text-secondary" />

        {/* Labels */}
        <text x="40" y="190" fontSize="10" fill="currentColor" className="text-tertiary font-mono tracking-widest">REQUEST</text>
        <text x="140" y="190" fontSize="10" fill="currentColor" className="text-tertiary font-mono tracking-widest">TRACE</text>
        <text x="240" y="90" fontSize="10" fill="currentColor" className="text-tertiary font-mono tracking-widest">MODEL</text>
        <text x="240" y="290" fontSize="10" fill="currentColor" className="text-tertiary font-mono tracking-widest">TOOL</text>

        {/* Moving Signal 1 */}
        <motion.circle
          r="2"
          fill="#F5F5F5"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={{ offsetPath: "path('M 50 200 L 150 200 L 250 100 L 350 100')" } as any}
        />
        
        {/* Moving Signal 2 */}
        <motion.circle
          r="2"
          fill="#F5F5F5"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={{ offsetPath: "path('M 150 200 L 250 300 L 350 300')" } as any}
        />
      </svg>
    </div>
  );
}
