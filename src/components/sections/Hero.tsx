"use client";
import { motion } from "framer-motion";
import { ThreeBackground } from "@/components/ui/ThreeBackground";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-24 pt-24 pb-24 sm:pt-28 sm:pb-28 md:py-0 overflow-hidden"
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
          <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-3 py-1 mb-5 sm:mb-8 bg-black/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-medium tracking-wide uppercase text-white/80">
              Available for remote &amp; freelance
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.12] sm:leading-[1.1] tracking-tight mb-5 sm:mb-6">
            Full-stack engineer shipping{" "}
            <span className="italic opacity-80">SaaS fast.</span>
            <br />
            Now building <span className="italic opacity-80">AI systems.</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-10 mb-4 sm:mb-0">
            <a
              href="#contact"
              className="group relative inline-flex h-12 sm:h-13 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-white backdrop-blur-3xl transition-colors hover:bg-white/10 text-sm sm:text-base font-semibold">
                Book a call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#work"
              className="px-6 py-3 h-12 sm:h-13 flex items-center justify-center rounded-full font-medium border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md text-sm sm:text-base text-white/90"
            >
              View work
            </a>
          </div>
        </motion.div>
      </div>

      {/* Marquee Tech Strip at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 py-3 sm:py-4 border-t border-white/10 bg-black/60 backdrop-blur-md flex overflow-hidden whitespace-nowrap text-mutedForeground text-xs sm:text-sm z-10">
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
