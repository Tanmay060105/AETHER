"use client";

import { useEffect, useState, useRef, createContext, useContext } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

import { TraceNetwork } from "@/components/visualizations/TraceNetwork";
import { TelemetryField } from "@/components/visualizations/TelemetryField";
import { SystemFlow } from "@/components/visualizations/SystemFlow";
import { AIHealthField } from "@/components/visualizations/AIHealthField";
import { OptimizationPath } from "@/components/visualizations/OptimizationPath";
import { EvaluationSignal } from "@/components/visualizations/EvaluationSignal";
import { IncidentSignal } from "@/components/visualizations/IncidentSignal";
import { SpatialNavigator } from "@/components/spatial/SpatialNavigator";

// Reusable structural components
const Container = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`max-w-[1920px] mx-auto w-full px-6 md:px-12 lg:px-24 ${className}`}>
    {children}
  </div>
);

const Grid = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${className}`}>
    {children}
  </div>
);

export type TransitionPhase = 'IDLE' | 'GRID_EXPANDING' | 'ENTERING' | 'SETTLED';
export type TransitionContextType = {
  activeHash: string | null;
  phase: TransitionPhase;
  startTransition: (hash: string) => void;
};
export const TransitionContext = createContext<TransitionContextType>({
  activeHash: null,
  phase: 'IDLE',
  startTransition: () => {},
});

const GridExpansionOverlay = () => {
  const { phase } = useContext(TransitionContext);
  return (
    <AnimatePresence>
      {phase === 'GRID_EXPANDING' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-background/50 backdrop-blur-md border border-surface-2"
        />
      )}
    </AnimatePresence>
  );
};

const SectionTextReveal = ({ children, delay = 0, enterFrom = "left", sectionHash, className = "" }: { children: React.ReactNode, delay?: number, enterFrom?: "left" | "right", sectionHash?: string, className?: string }) => {
  const { activeHash, phase } = useContext(TransitionContext);
  const xOffset = enterFrom === "left" ? -60 : 60;
  const isTarget = activeHash === sectionHash && sectionHash !== undefined;

  if (isTarget && (phase === 'ENTERING' || phase === 'SETTLED')) {
    return (
        <motion.div
          initial={{ opacity: 0, x: xOffset }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 + delay, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full flex flex-col justify-center ${className}`}
        >
        {children}
      </motion.div>
    );
  } else if (isTarget && phase === 'GRID_EXPANDING') {
    return <div className={`h-full flex flex-col justify-center opacity-0 ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`h-full flex flex-col justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
};

const SectionVisualReveal = ({ children, delay = 0, enterFrom = "right", sectionHash }: { children: React.ReactNode, delay?: number, enterFrom?: "left" | "right", sectionHash?: string }) => {
  const { activeHash, phase } = useContext(TransitionContext);
  const xOffset = enterFrom === "left" ? -60 : 60;
  const isTarget = activeHash === sectionHash && sectionHash !== undefined;

  if (isTarget && (phase === 'ENTERING' || phase === 'SETTLED')) {
    return (
        <motion.div
          initial={{ opacity: 0, scale: 1.05, x: xOffset }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 + delay, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
        {children}
      </motion.div>
    );
  } else if (isTarget && phase === 'GRID_EXPANDING') {
    return <div className="w-full h-full relative opacity-0">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05, x: xOffset }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full relative"
    >
      {children}
    </motion.div>
  );
};

function HeroSection() {
  const [introDone, setIntroDone] = useState(false);
  const { startTransition } = useContext(TransitionContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  const supportingStatements = [
    "OBSERVE EVERY SIGNAL.",
    "TRACE EVERY DECISION.",
    "EVALUATE EVERY OUTCOME.",
    "DIAGNOSE EVERY FAILURE.",
    "OPTIMIZE THE SYSTEM."
  ];

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-background pt-20 lg:pt-0">
      {!introDone ? (
        <motion.div
          key="intro-text"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <h1 className="text-[clamp(60px,7.5vw,130px)] font-semibold tracking-tighter text-primary">AETHER</h1>
        </motion.div>
      ) : (
        <motion.div
          key="main-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Container className="h-full flex items-center">
            <Grid className="w-full h-full relative">
              
              {/* Foreground Typography */}
              <div className="lg:col-span-7 z-30 flex flex-col justify-center h-full pt-20 pb-20 lg:py-0">
                <div className="mb-12 overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                    className="leading-[0.85] tracking-tighter text-[clamp(60px,7.5vw,130px)] font-semibold text-primary relative z-30"
                  >
                    UNDERSTAND<br />YOUR AI<br />SYSTEM.
                  </motion.h1>
                </div>

                <div className="mb-16 flex flex-col gap-2 relative z-30">
                  {supportingStatements.map((statement, idx) => (
                    <div key={idx} className="overflow-hidden">
                      <motion.div
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(18px,1.5vw,28px)] font-medium tracking-wide text-secondary uppercase"
                      >
                        {statement}
                      </motion.div>
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="relative z-30"
                >
                  <button className="text-[12px] tracking-widest text-primary hover:text-white transition-colors py-2 uppercase font-mono border-b border-primary hover:border-white w-fit">
                    EXPLORE PLATFORM →
                  </button>
                </motion.div>
              </div>

              {/* Background/Spatial Visualization */}
              <div className="lg:col-span-5 absolute lg:relative inset-0 lg:inset-auto h-full w-full flex items-center justify-center opacity-30 lg:opacity-100 mix-blend-screen lg:mix-blend-normal z-10">
                <SpatialNavigator onNodeClick={startTransition} />
              </div>
            </Grid>
          </Container>
        </motion.div>
      )}
    </section>
  );
}

function SectionObserve() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  return (
    <section id="observe" ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background py-24 lg:py-0">
      <Container className="relative z-10">
        <Grid>
          <div className="lg:col-span-5 flex flex-col justify-center z-20 order-1">
            <SectionTextReveal sectionHash="#observe" enterFrom="left">
              <span className="text-[10px] md:text-[12px] font-mono text-tertiary uppercase mb-6 tracking-widest block">
                AETHER / 01 — TELEMETRY
              </span>
              <div className="overflow-hidden mb-8 lg:mb-10">
                <motion.h2 style={{ y }} className="text-[clamp(56px,7vw,120px)] leading-[0.9] tracking-tighter font-semibold text-primary">
                  SEE THE SIGNAL<br />BEHIND THE SYSTEM.
                </motion.h2>
              </div>
              <p className="text-[clamp(18px,1.5vw,28px)] leading-tight text-secondary max-w-lg font-medium">
                Capture the signals behind every model call, tool execution, token, latency shift, and system event.
              </p>
            </SectionTextReveal>
          </div>
          <div className="lg:col-span-7 h-[50vh] lg:h-[70vh] w-full opacity-80 pointer-events-none order-2 lg:relative absolute inset-0 lg:inset-auto z-0 lg:z-10 mt-12 lg:mt-0 mix-blend-screen lg:mix-blend-normal">
            <SectionVisualReveal sectionHash="#observe" enterFrom="right">
              <TelemetryField />
            </SectionVisualReveal>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionTrace() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section id="trace" ref={ref} className="h-[250vh] lg:h-[300vh] relative bg-background border-t border-surface-2">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Sticky Typography Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <Container className="h-full flex items-center">
            <Grid className="w-full">
              <div className="lg:col-span-6 mix-blend-difference text-white pt-24 lg:pt-0">
                <SectionTextReveal sectionHash="#trace" enterFrom="left">
                  <span className="text-[10px] md:text-[12px] font-mono text-tertiary uppercase mb-6 tracking-widest block">
                    AETHER / 02 — DISTRIBUTED TRACING
                  </span>
                  <h2 className="text-[clamp(56px,7vw,120px)] leading-[0.9] tracking-tighter font-semibold mb-6 lg:mb-10">
                    FOLLOW<br />EVERY DECISION.
                  </h2>
                  <p className="text-[clamp(18px,1.5vw,28px)] leading-tight opacity-90 max-w-xl font-medium mb-8">
                    Trace an AI request from its first signal to its final response — across models, tools, retrieval, and every step between.
                  </p>
                  <div className="font-mono text-[10px] md:text-[12px] tracking-widest text-tertiary uppercase flex flex-wrap gap-2 items-center">
                    <span>REQUEST</span> <span className="opacity-50">→</span>
                    <span>TRACE</span> <span className="opacity-50">→</span>
                    <span>MODEL</span> <span className="opacity-50">→</span>
                    <span>TOOL</span> <span className="opacity-50">→</span>
                    <span>RETRIEVAL</span> <span className="opacity-50">→</span>
                    <span>RESPONSE</span>
                  </div>
                </SectionTextReveal>
              </div>
            </Grid>
          </Container>
        </div>

        {/* Scrolling Visualization Layer */}
        <div className="absolute inset-0 lg:left-[45vw] lg:w-[55vw] overflow-hidden z-10 lg:[mask-image:linear-gradient(to_right,transparent,black_15%)]">
          <SectionVisualReveal delay={0.2} sectionHash="#trace" enterFrom="right">
            <motion.div style={{ x }} className="flex w-[300vw] lg:w-[150vw] h-full items-center pl-[10vw] md:pl-[20vw] lg:pl-[10vw] mt-24 lg:mt-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[85vw] lg:w-[40vw] h-[50vh] lg:h-[60vh] shrink-0 bg-surface-2/10 border border-surface-2 relative overflow-hidden flex items-center justify-center mr-8 lg:mr-16">
                  <TraceNetwork />
                  <div className="absolute bottom-6 left-6 flex flex-col gap-2 font-mono text-[10px] text-tertiary mix-blend-difference text-white z-10">
                    <span className="text-primary font-bold">TRACE_ID: tr_7f82{i}a9c</span>
                    <span>LATENCY: {842 + i * 112} ms</span>
                    <span>MODEL: gpt-4-turbo</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </SectionVisualReveal>
        </div>
        
      </div>
    </section>
  );
}

function SectionEvaluate() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  return (
    <section id="evaluate" ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background py-24 lg:py-0">
      <Container>
        <Grid>
          <div className="lg:col-span-5 relative z-10 flex flex-col justify-center order-1">
            <SectionTextReveal sectionHash="#evaluate" enterFrom="left">
              <span className="text-[10px] md:text-[12px] font-mono text-tertiary uppercase mb-6 tracking-widest block">
                AETHER / 03 — EVALUATION
              </span>
              <div className="overflow-hidden mb-8 lg:mb-10">
                <motion.h2 style={{ y }} className="text-[clamp(56px,7vw,120px)] leading-[0.9] tracking-tighter font-semibold text-primary">
                  KNOW WHEN<br />QUALITY DRIFTS.
                </motion.h2>
              </div>
              <p className="text-[clamp(18px,1.5vw,28px)] leading-tight text-secondary max-w-lg font-medium mb-8">
                Evaluate every outcome against the behavior, quality, and signals your system is expected to produce.
              </p>
              <div className="flex gap-6 font-mono text-[10px] md:text-[12px] tracking-widest text-tertiary uppercase">
                <span>QUALITY</span>
                <span>THRESHOLD</span>
                <span>DRIFT</span>
                <span>SCORE</span>
              </div>
            </SectionTextReveal>
          </div>
          <div className="lg:col-span-7 h-[40vh] lg:h-[60vh] w-full bg-surface-2/10 border border-surface-2 flex items-center justify-center relative shadow-2xl overflow-hidden order-2 mt-12 lg:mt-0">
            <SectionVisualReveal sectionHash="#evaluate" enterFrom="right">
              <EvaluationSignal />
            </SectionVisualReveal>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionDiagnose() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  return (
    <section id="diagnose" ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background py-24 lg:py-0">
      <Container>
        <Grid>
          {/* Typography on the Right */}
          <div className="lg:col-start-8 lg:col-span-5 relative z-10 flex flex-col lg:items-end lg:text-right order-1 lg:order-2">
            <SectionTextReveal sectionHash="#diagnose" enterFrom="right" className="lg:items-end">
              <span className="text-[10px] md:text-[12px] font-mono text-tertiary uppercase mb-6 tracking-widest block">
                AETHER / 04 — INCIDENTS
              </span>
              <div className="overflow-hidden mb-8 lg:mb-10">
                <motion.h2 style={{ y }} className="text-[clamp(56px,7vw,120px)] leading-[0.9] tracking-tighter font-semibold text-primary">
                  FIND THE MOMENT<br />IT BREAKS.
                </motion.h2>
              </div>
              <p className="text-[clamp(18px,1.5vw,28px)] leading-tight text-secondary max-w-lg font-medium mb-8">
                Turn anomalies into evidence. Isolate the failure across quality, latency, cost, and reliability.
              </p>
              <div className="flex gap-4 font-mono text-[10px] md:text-[12px] tracking-widest text-tertiary uppercase lg:justify-end flex-wrap">
                <span>ANOMALY</span>
                <span className="hidden lg:inline">•</span>
                <span>DEVIATION</span>
                <span className="hidden lg:inline">•</span>
                <span>IMPACT</span>
                <span className="hidden lg:inline">•</span>
                <span>ROOT SIGNAL</span>
              </div>
            </SectionTextReveal>
          </div>

          {/* Visualization on the Left */}
          <div className="lg:col-span-7 lg:row-start-1 relative h-[50vh] lg:h-[60vh] w-full order-2 lg:order-1 mt-12 lg:mt-0">
            <SectionVisualReveal sectionHash="#diagnose" enterFrom="left">
              <div className="absolute inset-0 bg-surface-2/10 border border-surface-2 shadow-2xl overflow-hidden flex items-center p-8">
                 <AIHealthField />
              </div>
              <div className="absolute -bottom-4 lg:-bottom-8 -right-4 lg:-right-12 w-11/12 lg:w-[110%] h-[25vh] lg:h-[30vh] bg-background/90 backdrop-blur-md border border-surface-2 shadow-2xl flex items-center p-8 z-20">
                 <IncidentSignal />
              </div>
            </SectionVisualReveal>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionOptimize() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  return (
    <section id="optimize" ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background py-24 lg:py-0">
      <Container>
        <Grid>
          <div className="lg:col-span-6 relative z-20 order-1">
            <SectionTextReveal sectionHash="#optimize" enterFrom="left">
              <span className="text-[10px] md:text-[12px] font-mono text-tertiary uppercase mb-6 tracking-widest block">
                AETHER / 05 — EFFICIENCY
              </span>
              <div className="overflow-hidden mb-8 lg:mb-10">
                <motion.h2 style={{ y }} className="text-[clamp(44px,5.5vw,100px)] leading-[0.9] tracking-tighter font-semibold text-primary">
                  FIND THE<br />BOTTLENECK.<br />CHANGE THE<br />SYSTEM.
                </motion.h2>
              </div>
              <p className="text-[clamp(18px,1.5vw,28px)] leading-tight text-secondary max-w-lg font-medium mb-8">
                Expose what slows your AI down, drives its cost, or weakens its output — then measure the improvement.
              </p>
              <div className="flex gap-4 font-mono text-[10px] md:text-[12px] tracking-widest text-tertiary uppercase flex-wrap">
                <span>LATENCY</span>
                <span>TOKENS</span>
                <span>COST</span>
                <span>BEFORE</span>
                <span>AFTER</span>
              </div>
            </SectionTextReveal>
          </div>
          <div className="lg:col-span-6 h-[40vh] lg:h-[60vh] w-full bg-surface-2/10 border border-surface-2 flex items-center justify-center relative shadow-2xl overflow-hidden order-2 mt-12 lg:mt-0 z-10">
            <SectionVisualReveal sectionHash="#optimize" enterFrom="right">
              <OptimizationPath />
            </SectionVisualReveal>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionImprove() {
  const words = ["OBSERVE.", "TRACE.", "EVALUATE.", "DIAGNOSE.", "OPTIMIZE."];
  
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center py-20 lg:py-24 overflow-hidden border-t border-surface-2 bg-background">
      <Container className="relative z-10 flex-1 flex flex-col justify-center py-12 lg:py-0 w-full">
        <Grid className="w-full h-full items-center">
          
          {/* Typography side */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start text-left order-1">
            {/* TOP: Contextual Label */}
            <div className="mb-10 lg:mb-12 flex-shrink-0 flex flex-col items-start gap-2">
              <h3 className="text-[clamp(18px,1.5vw,28px)] font-semibold tracking-widest text-primary">AETHER</h3>
              <span className="text-[10px] md:text-[12px] font-mono text-tertiary uppercase tracking-widest">
                SYSTEM INTELLIGENCE
              </span>
            </div>

            {/* CENTER: Large Lifecycle Typography */}
            <div className="flex flex-col items-start justify-center text-primary py-4 lg:py-8">
              {words.map((word, i) => (
                <div key={word} className="overflow-hidden py-1">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex w-full"
                  >
                    <h2 className="text-[clamp(44px,5.5vw,90px)] tracking-tighter leading-[0.95] font-semibold">
                      {word}
                    </h2>
                  </motion.div>
                </div>
              ))}
            </div>
            
            {/* LOWER & BOTTOM: CTA and System Statement */}
            <div className="mt-10 lg:mt-12 flex flex-col items-start gap-8 lg:gap-10 flex-shrink-0">
              <h3 className="text-[clamp(16px,1.2vw,24px)] font-medium text-secondary max-w-xl text-left leading-tight uppercase tracking-wide">
                TURN AI BEHAVIOR INTO<br />ENGINEERING INTELLIGENCE.
              </h3>
              <button className="text-[12px] tracking-widest text-background hover:text-white transition-colors py-4 px-10 uppercase font-mono border hover:border-surface-2 bg-white hover:bg-transparent rounded-full pointer-events-auto shadow-2xl">
                ENTER AETHER →
              </button>
            </div>
          </div>

          {/* Graph side */}
          <div className="lg:col-span-6 h-[50vh] lg:h-[70vh] w-full bg-surface-2/10 border border-surface-2 relative flex items-center justify-center mt-12 lg:mt-0 order-2 overflow-hidden shadow-2xl">
            <div className="w-[150%] h-[150%] lg:w-[120%] lg:h-[120%] opacity-60">
              <SystemFlow />
            </div>
          </div>

        </Grid>
      </Container>
    </section>
  );
}

export default function LandingPage() {
  const [transitionState, setTransitionState] = useState<TransitionPhase>('IDLE');
  const [activeHash, setActiveHash] = useState<string | null>(null);

  const startTransition = (hash: string) => {
    setActiveHash(hash);
    setTransitionState('GRID_EXPANDING');
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Grid Expansion lasts ~600ms
    setTimeout(() => {
      // Instantly jump viewport to the section while grid is full screen
      const target = document.getElementById(hash.replace('#', ''));
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: 'auto' }); // auto = instant jump
        // Also update URL instantly
        window.history.pushState(null, '', hash);
      }
      
      // Short breathing moment
      setTimeout(() => {
        // Start entering phase (graphs and text animate in)
        setTransitionState('ENTERING');
        
        // After animations complete (~1.6s total), settle and restore scrollability
        setTimeout(() => {
          setTransitionState('SETTLED');
          document.body.style.overflow = '';
        }, 1600);
      }, 200);
      
    }, 600);
  };

  return (
    <TransitionContext.Provider value={{ activeHash, phase: transitionState, startTransition }}>
      <main className="bg-background min-h-screen text-primary selection:bg-white selection:text-black">
        <GridExpansionOverlay />
        <HeroSection />
        <SectionObserve />
        <SectionTrace />
        <SectionEvaluate />
        <SectionDiagnose />
        <SectionOptimize />
        <SectionImprove />
      </main>
    </TransitionContext.Provider>
  );
}
