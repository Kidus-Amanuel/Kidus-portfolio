"use client";
import { motion } from "framer-motion";

export function EducationCard({ edu, index }: { edu: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
    >
      <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
      <p className="text-mutedForeground mb-4">{edu.school}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70">{edu.startDate} — {edu.endDate}</span>
      </div>
      {edu.description && (
        <p className="text-sm opacity-50">{edu.description}</p>
      )}
    </motion.div>
  );
}
