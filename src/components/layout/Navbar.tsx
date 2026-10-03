"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hide the public navbar on the admin dashboard
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = ["About", "Experience", "Work", "Skills", "Contact"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent mix-blend-difference"
      )}
    >
      <span className="font-display font-bold text-2xl tracking-tighter cursor-pointer hover:opacity-70 transition-opacity">K.</span>
      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            {link}
          </a>
        ))}
      </div>
      <button className="md:hidden text-sm font-medium hover:opacity-70 transition-opacity">Menu</button>
    </motion.nav>
  );
}
