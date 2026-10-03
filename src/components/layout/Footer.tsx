"use client";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 border-t border-white/10 bg-black text-white/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
      <p>© {new Date().getFullYear()} Kidus. All rights reserved.</p>
      <div className="flex items-center gap-6">
        <a href="https://github.com/kidus" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        <a href="https://linkedin.com/in/kidus" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-white transition-colors">Upwork</a>
      </div>
    </footer>
  );
}