"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hashes that map to sections inside this toggle
const TOGGLE_SECTION_IDS = [
  "experience",
  "education",
  "certificates",
  "work",
  "skills",
  "recommendations",
];

interface MoreAboutToggleProps {
  children: ReactNode;
  label?: string;
  collapseLabel?: string;
}

export function MoreAboutToggle({
  children,
  label = "More about Kidus",
  collapseLabel = "Show less",
}: MoreAboutToggleProps) {
  const [open, setOpen] = useState(false);

  // Open the toggle AND scroll to the targeted section, accounting for the fixed nav
  const openAndScroll = (rawHash: string) => {
    const targetId = rawHash.replace("#", "");
    if (!TOGGLE_SECTION_IDS.includes(targetId)) return;

    // Open the toggle so the section actually mounts into the DOM
    setOpen(true);

    // Wait for the height-open animation to complete, then scroll
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (!el) return;
      const navOffset = 80; // height of the fixed navbar
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }, 550);
  };

  // On mount: if the page was loaded with a hash like #work, open + scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    openAndScroll(window.location.hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While the user is on the page: clicking nav links changes the hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => openAndScroll(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Static base line spanning full width */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/10" />
        {/* Silver light flowing left → right */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-[40%] animate-flow-right bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        {/* Silver light flowing right → left */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-[40%] animate-flow-left bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        {/* Button centered on top of the flow line */}
        <div className="relative flex justify-center px-6 py-6 md:py-8">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="more-about-kidus-content"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none w-full sm:w-auto sm:min-w-[320px] md:min-w-[420px]"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-10 md:px-20 py-4 text-white backdrop-blur-3xl transition-colors hover:bg-white/10 text-base whitespace-nowrap">
              {open ? collapseLabel : label}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="more-about-kidus-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}