"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero, Body } from "@/components/ui/Typography";

import { TraceNetwork } from "@/components/visualizations/TraceNetwork";
import { TelemetryField } from "@/components/visualizations/TelemetryField";
import { SystemFlow } from "@/components/visualizations/SystemFlow";
import { AIHealthField } from "@/components/visualizations/AIHealthField";
import { CostFlow } from "@/components/visualizations/CostFlow";
import { EvaluationSignal } from "@/components/visualizations/EvaluationSignal";
import { IncidentSignal } from "@/components/visualizations/IncidentSignal";

// Reusable structural components
const Container = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`max-w-[1920px] mx-auto w-full px-6 md:px-12 lg:px-24 ${className}`}>
    {children}
  </div>
);

const Grid = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${className}`}>
    {children}
  </div>
);

function RotatingGallery() {
  const items = [
    { id: 1, component: <TraceNetwork /> },
    { id: 2, component: <TelemetryField /> },
    { id: 3, component: <EvaluationSignal /> },
    { id: 4, component: <AIHealthField /> },
    { id: 5, component: <CostFlow /> },
    { id: 6, component: <IncidentSignal /> },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none perspective-[1200px]">
      <motion.div 
        animate={{ rotateY: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, index) => {
          const angle = (index / items.length) * 360;
          return (
            <div
              key={item.id}
              className="absolute w-80 h-[400px] bg-background/50 backdrop-blur-sm flex items-center justify-center border border-surface-2 overflow-hidden shadow-2xl"
              style={{
                transform: `rotateY(${angle}deg) translateZ(500px)`,
              }}
            >
              {item.component}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function HeroSection() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-background">
      {!introDone ? (
        <motion.div
          key="intro-text"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <Hero>AETHER</Hero>
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
              <div className="lg:col-span-5 z-20 flex flex-col justify-center h-full pt-32 lg:pt-0">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Hero className="mb-8 leading-[0.85] tracking-tighter text-[14vw] lg:text-[7vw]">
                    UNDERSTAND<br />YOUR AI<br />SYSTEM.
                  </Hero>
                  <h2 className="text-xl md:text-2xl font-light tracking-wide text-secondary mb-12 max-w-xl">
                    The intelligence layer for understanding what happens inside modern AI systems.
                  </h2>
                  <button className="text-metadata tracking-widest text-primary hover:text-white transition-colors py-2 uppercase font-mono border-b border-primary hover:border-white w-fit">
                    EXPLORE PLATFORM →
                  </button>
                </motion.div>
              </div>

              {/* Background/Spatial Visualization */}
              <div className="lg:col-span-7 absolute lg:relative inset-0 lg:inset-auto h-full w-full pointer-events-none flex items-center justify-center opacity-30 lg:opacity-100 mix-blend-screen lg:mix-blend-normal">
                <RotatingGallery />
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
  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background">
      <Container className="relative z-10 h-full py-32 lg:py-0">
        <Grid className="h-full">
          <div className="lg:col-span-5 flex flex-col justify-center z-20 relative">
            <div className="overflow-hidden mb-12">
              <motion.h2 style={{ y }} className="text-[12vw] lg:text-[8vw] leading-[0.9] tracking-tighter font-medium text-primary">
                OBSERVE.
              </motion.h2>
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-metadata font-mono text-tertiary uppercase w-32 shrink-0">
                ( TELEMETRY )
              </span>
              <Body className="text-2xl md:text-4xl leading-tight text-secondary max-w-lg">
                See every signal that shapes your AI system.
              </Body>
            </div>
          </div>
          <div className="lg:col-span-7 absolute lg:relative inset-0 lg:inset-auto h-full w-full opacity-40 lg:opacity-100 pointer-events-none">
            <TelemetryField />
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
    <section ref={ref} className="h-[300vh] relative bg-background border-t border-surface-2">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Sticky Typography Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <Container className="h-full flex items-center">
            <Grid className="w-full">
              <div className="lg:col-span-4 mix-blend-difference text-white">
                <h2 className="text-[12vw] lg:text-[8vw] leading-[0.9] tracking-tighter font-medium mb-8">
                  TRACE.
                </h2>
                <Body className="text-2xl md:text-4xl leading-tight opacity-80 max-w-sm">
                  Follow every request, model call, tool, and retrieval step.
                </Body>
              </div>
            </Grid>
          </Container>
        </div>

        {/* Scrolling Visualization Layer */}
        <motion.div style={{ x }} className="flex w-[200vw] lg:w-[150vw] h-full items-center ml-[50vw] lg:ml-[33vw]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[80vw] lg:w-[40vw] h-[50vh] shrink-0 bg-surface-2/10 border border-surface-2 relative overflow-hidden flex items-center justify-center mr-8 lg:mr-16">
              <TraceNetwork />
              <div className="absolute bottom-8 left-8 flex flex-col gap-2 font-mono text-[10px] text-tertiary mix-blend-difference text-white">
                <span className="text-primary">TRACE_ID: tr_7f82{i}a9c</span>
                <span>LATENCY: {842 + i * 112} ms</span>
                <span>MODEL: gpt-4-turbo</span>
              </div>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}

function SectionEvaluate() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background">
      <Container className="py-32 lg:py-0">
        <Grid>
          <div className="lg:col-span-5 relative z-10 flex flex-col justify-center">
            <div className="overflow-hidden mb-12">
              <motion.h2 style={{ y }} className="text-[10vw] lg:text-[7vw] leading-[0.9] tracking-tighter font-medium text-primary">
                EVALUATE.
              </motion.h2>
            </div>
            <div className="flex flex-col gap-8 w-full">
              <span className="text-metadata font-mono text-tertiary uppercase w-32 shrink-0">
                ( QUALITY )
              </span>
              <Body className="text-2xl md:text-4xl leading-tight text-secondary max-w-lg">
                Measure what your AI system actually produces.
              </Body>
            </div>
          </div>
          <div className="lg:col-span-7 h-[60vh] w-full bg-surface-2/10 border border-surface-2 flex items-center justify-center relative shadow-2xl overflow-hidden mt-16 lg:mt-0">
             <EvaluationSignal />
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionDiagnose() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background">
      <Container className="py-32 lg:py-0">
        <Grid>
          {/* Typography on the Right (lg:col-start-8 lg:col-span-5) */}
          <div className="lg:col-start-8 lg:col-span-5 relative z-10 flex flex-col lg:items-end lg:text-right order-1 lg:order-2">
            <div className="overflow-hidden mb-12">
              <motion.h2 style={{ y }} className="text-[10vw] lg:text-[7vw] leading-[0.9] tracking-tighter font-medium text-primary">
                DIAGNOSE.
              </motion.h2>
            </div>
            <div className="flex flex-col lg:items-end gap-8 w-full">
              <span className="text-metadata font-mono text-tertiary uppercase shrink-0">
                ( INCIDENTS )
              </span>
              <Body className="text-2xl md:text-4xl leading-tight text-secondary max-w-lg">
                Understand why the system behaves the way it does.
              </Body>
            </div>
          </div>

          {/* Visualization on the Left (lg:col-span-7) */}
          <div className="lg:col-span-7 lg:row-start-1 relative h-[60vh] w-full order-2 lg:order-1 mt-16 lg:mt-0">
            {/* Primary Visualization */}
            <div className="absolute inset-0 bg-surface-2/10 border border-surface-2 shadow-2xl overflow-hidden flex items-center p-8">
               <AIHealthField />
            </div>
            {/* Secondary Layered Visualization */}
            <div className="absolute bottom-8 lg:-right-8 w-11/12 lg:w-3/4 h-[30vh] bg-background/80 backdrop-blur-md border border-surface-2 shadow-2xl flex items-center p-8 z-20">
               <IncidentSignal />
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionOptimize() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-t border-surface-2 bg-background">
      <Container className="py-32 lg:py-0">
        <Grid>
          <div className="lg:col-span-5 relative z-10">
            <div className="overflow-hidden mb-12">
              <motion.h2 style={{ y }} className="text-[10vw] lg:text-[7vw] leading-[0.9] tracking-tighter font-medium text-primary">
                OPTIMIZE.
              </motion.h2>
            </div>
            <div className="flex flex-col gap-8 w-full">
              <span className="text-metadata font-mono text-tertiary uppercase w-32 shrink-0">
                ( COST & EFFICIENCY )
              </span>
              <Body className="text-2xl md:text-4xl leading-tight text-secondary max-w-lg">
                Turn system intelligence into engineering decisions.
              </Body>
            </div>
          </div>
          <div className="lg:col-span-7 h-[60vh] w-full bg-surface-2/10 border border-surface-2 flex items-center justify-center relative shadow-2xl overflow-hidden mt-16 lg:mt-0">
             <CostFlow />
          </div>
        </Grid>
      </Container>
    </section>
  );
}

function SectionImprove() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center py-32 overflow-hidden border-t border-surface-2 text-center bg-surface">
      {/* Background Visualization - Full Bleed but properly scaled so nodes don't collide with text core */}
      <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen">
        <div className="w-[150%] h-[150%] lg:w-[120%] lg:h-[120%]">
          <SystemFlow />
        </div>
      </div>
      
      <div className="z-10 flex flex-col items-center max-w-7xl px-6 w-full mix-blend-difference text-white">
        <span className="text-metadata font-mono text-tertiary uppercase tracking-widest mb-16">
          ( AETHER INTELLIGENCE )
        </span>
        <div className="flex flex-col items-center">
          {["OBSERVE.", "TRACE.", "EVALUATE.", "DIAGNOSE.", "OPTIMIZE."].map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
            >
              <Hero className="text-[12vw] lg:text-[8vw] tracking-tighter leading-[0.85] font-medium">
                {word}
              </Hero>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col items-center gap-8 mt-24">
          <button className="text-metadata tracking-widest text-background hover:text-white transition-colors py-4 px-8 uppercase font-mono border hover:border-surface-2 bg-white hover:bg-transparent rounded-full mix-blend-normal pointer-events-auto">
            ENTER AETHER →
          </button>
          <span className="font-mono text-[10px] text-tertiary tracking-widest uppercase">
            THE INTELLIGENCE LAYER FOR AI SYSTEMS.
          </span>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <main className="w-full bg-background min-h-screen selection:bg-primary selection:text-background">
      <HeroSection />
      <SectionObserve />
      <SectionTrace />
      <SectionEvaluate />
      <SectionDiagnose />
      <SectionOptimize />
      <SectionImprove />
    </main>
  );
}
