"use client";

import { motion } from "framer-motion";

export function TechnicalGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-[0.15]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="technical-grid-small"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-white opacity-20"
            />
          </pattern>
          <pattern
            id="technical-grid-large"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#technical-grid-small)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white opacity-40"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#technical-grid-large)" />

        {/* Crosshair markers */}
        <g className="text-white opacity-60">
          <path d="M 10 10 L 30 10 M 10 10 L 10 30" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M calc(100% - 30px) 10 L calc(100% - 10px) 10 M calc(100% - 10px) 10 L calc(100% - 10px) 30" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 10 calc(100% - 10px) L 30 calc(100% - 10px) M 10 calc(100% - 10px) L 10 calc(100% - 30px)" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M calc(100% - 30px) calc(100% - 10px) L calc(100% - 10px) calc(100% - 10px) M calc(100% - 10px) calc(100% - 10px) L calc(100% - 10px) calc(100% - 30px)" stroke="currentColor" strokeWidth="1" fill="none" />
        </g>
      </svg>
      {/* Scanning line */}
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-white opacity-[0.15] shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      />
    </div>
  );
}
