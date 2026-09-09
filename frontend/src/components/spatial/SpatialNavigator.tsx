"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { spatialNodes, SpatialNodeData } from "./spatialData";

function SpatialNode({
  node,
  index,
  totalNodes,
  isActive,
  onTransitionStart,
  onTransitionEnd,
}: {
  node: SpatialNodeData;
  index: number;
  totalNodes: number;
  isActive: boolean;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const angle = (index / totalNodes) * 360;

  const handleClick = () => {
    // Cinematic Node Emphasis Transition
    setIsTransitioning(true);
    if (onTransitionStart) onTransitionStart();
    
    // Short delay before routing to allow the transition emphasis to play out
    setTimeout(() => {
      setIsTransitioning(false);
      if (onTransitionEnd) onTransitionEnd();
      
      // Force smooth scroll to the element to ensure it works even if already on that hash
      const targetElement = document.getElementById(node.hash.replace('#', ''));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Update URL hash without jumping (using history API) to keep URLs shareable
      window.history.pushState(null, '', node.hash);
    }, 400); // 400ms transition
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Visual state calculation
  // Base scale is 1. Hover slightly increases it. Transition emphasizes it more.
  const scale = isTransitioning ? 1.08 : (isHovered ? 1.05 : (isActive ? 1.02 : 1));
  const brightness = isTransitioning ? "brightness-150" : (isHovered ? "brightness-125" : (isActive ? "brightness-110" : "brightness-100"));
  const borderColor = isHovered || isActive || isTransitioning ? "border-primary/40" : "border-surface-2";
  const zIndex = isTransitioning ? 50 : (isHovered || isActive ? 20 : 10);

  return (
    <motion.div
      className={`absolute w-96 h-[480px] bg-background/50 backdrop-blur-sm flex items-center justify-center border ${borderColor} overflow-hidden shadow-2xl transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${brightness}`}
      style={{
        transform: `rotateY(${angle}deg) translateZ(320px) scale(${scale})`,
        zIndex,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${node.label} section`}
    >
      <AnimatePresence>
        {(isHovered || isActive || isTransitioning) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-4 z-20 pointer-events-none"
          >
            <div className="font-mono text-[10px] text-tertiary tracking-widest uppercase">
              0{index + 1}
            </div>
            <div className="font-semibold text-primary tracking-widest text-sm uppercase">
              {node.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none opacity-80">
        {node.component}
      </div>
    </motion.div>
  );
}

export function SpatialNavigator() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isAnyTransitioning, setIsAnyTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Manual Horizontal Rotation (Right-Click Drag)
  const manualRotateY = useMotionValue(0);
  const springManualY = useSpring(manualRotateY, { stiffness: 60, damping: 20 });
  const isDragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Intersection Observer for scroll sync
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let closestEntry: IntersectionObserverEntry | null = null;
        let minDistance = Infinity;
        const viewportCenter = window.innerHeight / 2;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const entryCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - entryCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestEntry = entry;
            }
          }
        });

        if (closestEntry) {
          const id = (closestEntry as IntersectionObserverEntry).target.id;
          setActiveNodeId(id);
        } else {
          // If at the very top (hero), no active node
          if (window.scrollY < window.innerHeight * 0.5) {
            setActiveNodeId(null);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.1, 0.5, 0.9, 1], // More thresholds for smoother detection
      }
    );

    spatialNodes.forEach((node) => {
      const el = document.getElementById(node.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 2) { // Right mouse button
      isDragging.current = true;
      lastX.current = e.clientX;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (prefersReducedMotion || !isDragging.current) return;
    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;
    // Lowered sensitivity: 1px movement = 0.3 degrees rotation
    manualRotateY.set(manualRotateY.get() + deltaX * 0.3);
  }, [prefersReducedMotion, manualRotateY]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (e.button === 2 && isDragging.current) {
      isDragging.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden perspective-[1200px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={handleContextMenu}
      style={{ touchAction: "none" }} // Prevent browser interference during drag
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        animate={{ scale: isAnyTransitioning ? 1.05 : 1, opacity: isAnyTransitioning ? 0.8 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transformStyle: "preserve-3d",
          rotateY: springManualY, // Manual secondary horizontal rotation
        }}
      >
        <motion.div
          className="relative w-full h-full flex items-center justify-center transform-style-3d"
          style={{ transformStyle: "preserve-3d" }}
          animate={prefersReducedMotion ? {} : { rotateY: 360 }}
          transition={
            prefersReducedMotion 
              ? {} 
              : { duration: 80, repeat: Infinity, ease: "linear" }
          }
        >
          {spatialNodes.map((node, index) => (
            <SpatialNode
              key={node.id}
              node={node}
              index={index}
              totalNodes={spatialNodes.length}
              isActive={activeNodeId === node.id}
              onTransitionStart={() => setIsAnyTransitioning(true)}
              onTransitionEnd={() => setIsAnyTransitioning(false)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
