"use client";
import { motion } from "framer-motion";

export function Recommendations() {
  return (
    <section id="recommendations" className="py-8 md:py-12 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-16 text-center">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 border border-white/10 rounded-3xl bg-white/5 relative"
            >
              <div className="text-6xl font-display font-bold text-white/10 absolute top-6 left-6">"</div>
              <p className="text-lg md:text-xl text-mutedForeground leading-relaxed mb-8 relative z-10 italic">
                "[Placeholder] Kidus is an exceptional engineer. He consistently delivers high-quality code and has a deep understanding of product design and user experience."
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/20" />
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm opacity-50">CTO at [Company]</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}