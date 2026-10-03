"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";

export function GameNavbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/10"
    >
      {/* Left — K. logo + name, both clickable to home */}
      <Link
        href="/"
        className="flex items-baseline gap-2 hover:opacity-80 transition-opacity"
        aria-label="Back to home"
      >
        <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white">
          K.
        </span>
        <span className="font-display font-medium text-sm md:text-base tracking-tight text-white/70">
          Kidus Amanuel
        </span>
      </Link>

      {/* Right — email + LinkedIn icons */}
      <div className="flex items-center gap-4">
        <a
          href="mailto:kidus@example.com"
          aria-label="Email Kidus"
          className="p-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors"
        >
          <Mail className="w-4 h-4 text-white/80" />
        </a>
        <a
          href="https://linkedin.com/in/kidus"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kidus on LinkedIn"
          className="p-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors"
        >
          <Linkedin className="w-4 h-4 text-white/80" />
        </a>
      </div>
    </motion.nav>
  );
}