"use client";
import { Mail, Linkedin } from "lucide-react";

export function GameFooter() {
  return (
    <footer className="px-6 md:px-12 py-10 border-t border-white/10 bg-black/80 backdrop-blur-md text-white/70">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        {/* Playful credit */}
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-display font-bold text-white">
            Kidus Amanuel
          </h3>
          <p className="text-sm italic opacity-70 max-w-md">
            Built by Kidus because apparently normal websites weren&apos;t enough.
          </p>
        </div>

        {/* Clickable contact */}
        <div className="flex items-center gap-5">
          <a
            href="mailto:kidus@example.com"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
          <a
            href="https://linkedin.com/in/kidus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </div>

      <p className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/10 text-xs opacity-50">
        © {new Date().getFullYear()} Kidus Amanuel. Yes-Only is a comedy experiment, not financial advice.
      </p>
    </footer>
  );
}