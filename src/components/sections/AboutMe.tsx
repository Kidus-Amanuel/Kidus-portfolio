"use client";
import { motion } from "framer-motion";

export function AboutMe() {
  return (
    <div id="about" className="flex flex-col justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-6">
          About Me
        </h2>

        <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-8">
          Bridging the gap between{" "}
          <span className="italic opacity-70">elegant design</span> and robust engineering.
        </h3>

        <p className="text-base md:text-lg text-mutedForeground mb-5 leading-relaxed">
          I'm Kidus, a software engineer based in Addis Ababa, Ethiopia. With over 3 years of
          experience building full-stack SaaS products for international and local startups, I
          care deeply about taste, performance, and conversion.
        </p>

        <p className="text-base md:text-lg text-mutedForeground leading-relaxed">
          Currently working as an IT Trainee at Ethiopian Airlines, I am actively transitioning
          into AI engineering — building systems that leverage LLMs to solve real-world
          problems.
        </p>
      </motion.div>
    </div>
  );
}