"use client";
import { motion } from "framer-motion";

interface SkillsClientProps {
  skillsData: Record<string, string[]>;
}

export function SkillsClient({ skillsData }: SkillsClientProps) {
  return (
    <section id="skills" className="py-8 md:py-12 px-5 sm:px-6 md:px-12 lg:px-24 bg-black border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-10 sm:mb-16">
          Technical Arsenal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {Object.entries(skillsData).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-lg font-display font-bold mb-6 border-b border-white/10 pb-4 inline-block">
                {category}
              </h3>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item} className="text-mutedForeground hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
