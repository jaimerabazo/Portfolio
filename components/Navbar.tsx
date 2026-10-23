"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#departures", label: "Departures" },
  { href: "#logbook", label: "Logbook" },
  { href: "#route", label: "Route" },
  { href: "#packing", label: "Packing list" },
  { href: "#contact", label: "Contact" },
];

const CV_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cv/Jaime-Rabazo-CV.pdf`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-md bg-paper/80 border-b border-ink-900/10" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-10">
          <a href="#top" aria-label="Jaime Rabazo — back to top" className="board inline-flex gap-[2px] rounded-md p-1 font-mono text-[15px] font-bold">
            <span className="flap-tile">J</span>
            <span className="flap-tile">R</span>
          </a>

          <ul className="hidden items-center gap-7 md:flex font-mono text-[12px] uppercase tracking-[0.12em]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ink-600 hover:text-ink-900 transition-colors link-reveal">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <a
              href={CV_SRC}
              download
              className="inline-flex items-center rounded-full border border-ink-900/20 text-ink-900 text-[13px] font-medium px-4 py-2 hover:border-ink-900/40 transition-colors"
            >
              CV ↓
            </a>
            <a
              href="mailto:jaime.rabazofernandez@gmail.com"
              className="inline-flex items-center rounded-full bg-ink-900 text-paper text-[13px] font-medium px-4 py-2 hover:bg-pen transition-colors"
            >
              Get in touch
            </a>
          </div>

          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex flex-col gap-[5px]">
              <span className={`h-[1.5px] w-5 bg-ink-900 transition-transform ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-ink-900 transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-ink-900 transition-transform ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </div>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-paper/98 backdrop-blur-md md:hidden"
          >
            <ul className="flex h-full flex-col items-center justify-center gap-7">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.6 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="font-serif text-4xl text-ink-900">
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="mt-6 flex gap-3">
                <a href="mailto:jaime.rabazofernandez@gmail.com" onClick={() => setOpen(false)} className="rounded-full bg-ink-900 text-paper px-6 py-3 text-sm font-medium">
                  Get in touch
                </a>
                <a href={CV_SRC} download onClick={() => setOpen(false)} className="rounded-full border border-ink-900/20 text-ink-900 px-6 py-3 text-sm font-medium">
                  Download CV
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
