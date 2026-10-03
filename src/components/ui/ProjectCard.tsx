"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col justify-between p-8 md:p-12 border border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors aspect-square md:aspect-auto md:min-h-[500px]"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-widest opacity-50 mb-4">{project.category}</p>
        <h3 className="text-3xl font-display font-bold mb-4">{project.title}</h3>
        <p className="text-mutedForeground mb-8 leading-relaxed max-w-sm">{project.description}</p>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-8">
          {(project.tags || []).map((tag: string) => (
            <span key={tag} className="text-xs border border-white/20 px-3 py-1 rounded-full text-white/70">
              {tag}
            </span>
          ))}
        </div>
        {project.link && (
          <a href={project.link} className="inline-flex items-center gap-2 text-sm font-medium border-b border-transparent group-hover:border-white transition-colors pb-1">
            Read Case Study <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
