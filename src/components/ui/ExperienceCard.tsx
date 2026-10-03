"use client";
import { motion } from "framer-motion";

export function ExperienceCard({ exp, index }: { exp: any; index: number }) {
  // Convert description text into bullet points based on line breaks
  const impacts = exp.description ? exp.description.split('\n').filter((line: string) => line.trim() !== '') : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="md:grid md:grid-cols-4 md:gap-8 items-baseline">
        <div className="mb-2 md:mb-0 text-sm opacity-50 font-medium tracking-wide">
          {exp.startDate} — {exp.endDate}
        </div>
        <div className="md:col-span-3 border-l md:border-l-0 border-white/10 pl-6 md:pl-0 pb-12 relative">
          <div className="absolute left-[-5px] md:hidden top-2 w-2 h-2 rounded-full bg-white" />
          <h3 className="text-2xl font-display font-bold mb-1">{exp.role}</h3>
          <h4 className="text-lg opacity-70 mb-6">{exp.company}</h4>
          <ul className="space-y-3">
            {impacts.map((impact: string, j: number) => (
              <li key={j} className="text-mutedForeground flex items-start">
                <span className="mr-3 text-white/30 mt-1">▹</span>
                <span className="leading-relaxed">{impact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
