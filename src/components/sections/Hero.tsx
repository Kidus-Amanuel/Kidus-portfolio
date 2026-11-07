"use client";
import { motion } from "framer-motion";
import { ThreeBackground } from "@/components/ui/ThreeBackground";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] sm:min-h-[88vh] md:min-h-[90vh] w-full flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-24 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-20 overflow-hidden"
    >
      {/* Background 3D Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ThreeBackground />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-4xl my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Availability pill */}
          <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-3 py-1 mb-4 sm:mb-6 bg-black/40 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-medium tracking-wide uppercase text-white/80">
              Available for remote &amp; freelance
            </span>
          </div>

          {/* Heading — balanced and refined */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-display font-bold leading-[1.15] sm:leading-[1.12] tracking-tight mb-5 sm:mb-6">
            Full-stack engineer shipping{" "}
            <span className="italic opacity-80">SaaS fast.</span>
            <br />
            Now building <span className="italic opacity-80">AI systems.</span>
          </h1>

          {/* CTA Buttons — sleek and compact */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mt-6 sm:mt-8 mb-4 sm:mb-6">
            <a
              href="#contact"
              className="group relative inline-flex h-11 sm:h-12 shrink-0 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-6 sm:px-7 py-3 text-white backdrop-blur-3xl transition-colors hover:bg-white/10 text-sm sm:text-base font-semibold whitespace-nowrap">
                Book a call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#work"
              className="inline-flex h-11 sm:h-12 shrink-0 items-center justify-center px-6 sm:px-7 rounded-full font-medium border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md text-sm sm:text-base text-white/90 whitespace-nowrap"
            >
              View work
            </a>
          </div>
        </motion.div>
      </div>

      {/* Marquee Tech Strip (Sliding part) — now clearly visible above the fold */}
      <div className="absolute bottom-0 left-0 right-0 h-11 sm:h-12 border-t border-white/10 bg-black/80 backdrop-blur-md flex items-center overflow-hidden whitespace-nowrap text-mutedForeground text-xs sm:text-sm z-20">
        <div className="animate-marquee gap-6 sm:gap-12 px-4 sm:px-6 flex">
          <span>Next.js App Router</span>
          <span>TypeScript (Strict)</span>
          <span>Tailwind CSS</span>
          <span>Framer Motion</span>
          <span>Vercel AI SDK</span>
          <span>Supabase &amp; pgvector</span>
          <span>Neon DB</span>
          {/* Duplicate for infinite loop */}
          <span>Next.js App Router</span>
          <span>TypeScript (Strict)</span>
          <span>Tailwind CSS</span>
          <span>Framer Motion</span>
          <span>Vercel AI SDK</span>
          <span>Supabase &amp; pgvector</span>
          <span>Neon DB</span>
        </div>
      </div>
    </section>
  );
}
