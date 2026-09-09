"use client";

import { useState } from "react";
import { IndexOverlay } from "./IndexOverlay";
import Link from "next/link";

export function GlobalHeader() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-8 lg:px-16 lg:py-12 mix-blend-difference text-primary pointer-events-auto">
        <Link 
          href="/" 
          className="text-metadata tracking-widest font-mono hover:opacity-70 transition-opacity uppercase"
          aria-label="AETHER Home"
        >
          AETHER
        </Link>
        
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="text-metadata tracking-widest font-mono hover:opacity-70 transition-opacity uppercase cursor-pointer"
          aria-label="Open Navigation Index"
          aria-expanded={isOverlayOpen}
        >
          Index
        </button>
      </header>

      <IndexOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
      />
    </>
  );
}
