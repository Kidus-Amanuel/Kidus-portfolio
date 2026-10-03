"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Gamepad2, Sparkles, ArrowUpRight } from "lucide-react";

type Game = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const games: Game[] = [
  {
    title: "Yes-Only Invite",
    description:
      "A playful web game for inviting friends. The 'No' button dodges your cursor until there's only one choice left — confetti included.",
    tags: ["Interactive", "Framer Motion", "Next.js"],
    link: "/lab/invite/new",
    icon: Gamepad2,
    badge: "Most Fun",
  },
  {
    title: "AI Cover Letter Builder",
    description:
      "Paste a job description and watch Gemini 1.5 Pro stream a tailored cover letter that matches your experience in real time.",
    tags: ["AI", "Gemini 1.5", "Vercel AI SDK"],
    link: "/lab/cover-letter",
    icon: Sparkles,
    badge: "Most Useful",
  },
];

export function Games() {
  return (
    <section
      id="games"
      className="py-8 md:py-12 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest">
            Lab / Play
          </h2>
          <span className="text-xs opacity-40">{games.length} live demos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col justify-between p-8 md:p-12 border border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors aspect-square md:aspect-auto md:min-h-[420px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="w-10 h-10 text-white/40 group-hover:text-white transition-colors" />
                    {game.badge && (
                      <span className="text-[10px] uppercase tracking-widest border border-white/20 rounded-full px-3 py-1 text-white/60">
                        {game.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">
                    {game.title}
                  </h3>
                  <p className="text-mutedForeground mb-8 leading-relaxed max-w-sm">
                    {game.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-white/20 px-3 py-1 rounded-full text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={game.link}
                    className="inline-flex items-center gap-2 text-sm font-medium border-b border-transparent group-hover:border-white transition-colors pb-1"
                  >
                    Play Now <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}