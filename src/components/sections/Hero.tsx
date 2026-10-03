"use client";
import { motion } from "framer-motion";
import { ThreeBackground } from "@/components/ui/ThreeBackground";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeBackground />
      </div>
      
      <div className="relative z-10 max-w-4xl mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-3 py-1 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs font-medium tracking-wide uppercase">Available for remote & freelance</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] tracking-tight mb-6">
            Full-stack engineer shipping <span className="italic opacity-80">SaaS fast.</span><br />
            Now building <span className="italic opacity-80">AI systems.</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
            <a href="#contact" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none">
              <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
                Book a call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a href="#work" className="px-6 py-3 h-12 flex items-center justify-center rounded-full font-medium border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
              View work
            </a>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 py-4 border-t border-white/10 bg-black/50 backdrop-blur-md flex overflow-hidden whitespace-nowrap text-mutedForeground text-sm z-10">
        <div className="animate-marquee gap-12 px-6 flex">
          <span>Next.js App Router</span><span>TypeScript (Strict)</span><span>Tailwind CSS</span><span>Framer Motion</span><span>Vercel AI SDK</span><span>Supabase & pgvector</span><span>Neon DB</span>
          {/* Duplicate */}
          <span>Next.js App Router</span><span>TypeScript (Strict)</span><span>Tailwind CSS</span><span>Framer Motion</span><span>Vercel AI SDK</span><span>Supabase & pgvector</span><span>Neon DB</span>
        </div>
      </div>
    </section>
  );
}
