"use client";

import { motion } from "framer-motion";

interface ObservePrimarySignalProps {
  requestCount: number;
}

export function ObservePrimarySignal({ requestCount }: ObservePrimarySignalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col gap-1 pt-12 pb-8"
    >
      <div className="font-mono text-8xl md:text-9xl tracking-tighter font-light leading-none text-primary">
        {requestCount.toLocaleString()}
      </div>
      <div className="font-mono text-metadata tracking-widest uppercase text-tertiary ml-2">
        Requests
      </div>
    </motion.div>
  );
}
