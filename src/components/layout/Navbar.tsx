"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Hide the public navbar on admin, lab invite, and cv pages
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/lab/invite") ||
    pathname?.startsWith("/cv")
  )
    return null;

  // Section links are anchors on the home page. From any other route they must
  // point back at "/" first, otherwise "/book#about" lands nowhere.
  const isHome = pathname === "/";
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  const links = [
    { name: "About", href: sectionHref("#about") },
    { name: "Experience", href: sectionHref("#experience") },
    { name: "Work", href: sectionHref("#work") },
    { name: "Skills", href: sectionHref("#skills") },
    { name: "Book", href: "/book" },
    { name: "Contact", href: sectionHref("#contact") },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 md:px-12 py-3.5 sm:py-4 transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-black/90 backdrop-blur-md border-b border-white/10"
            : "bg-black/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-b border-white/5 md:border-transparent"
        )}
      >
        <a
          href={sectionHref("#hero")}
          onClick={() => setMobileOpen(false)}
          className="font-display font-bold text-2xl tracking-tighter cursor-pointer text-white hover:opacity-80 transition-opacity"
        >
          K.
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={sectionHref("#contact")}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile Hamburger / Close Button Icon */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white active:scale-95 transition-all"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-white transition-transform duration-200" />
          ) : (
            <Menu className="w-5 h-5 text-white transition-transform duration-200" />
          )}
        </button>
      </motion.nav>

      {/* Mobile Drawer / Overlay Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden flex flex-col justify-between pt-24 pb-12 px-6"
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-3 my-auto">
              {links.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="text-2xl sm:text-3xl font-display font-bold text-white/90 hover:text-white py-2.5 px-4 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-xs uppercase font-mono tracking-widest text-white/30">0{i + 1}</span>
                </motion.a>
              ))}
            </div>

            {/* Bottom Actions inside Mobile Menu */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <a
                href="/book"
                onClick={handleLinkClick}
                className="w-full group relative inline-flex h-13 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-black px-6 py-3.5 text-white backdrop-blur-3xl text-sm font-semibold">
                  Book a call
                </span>
              </a>

              <p className="text-center text-xs text-white/40 pt-2">
                © {new Date().getFullYear()} Kidus Amanuel • Addis Ababa
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
