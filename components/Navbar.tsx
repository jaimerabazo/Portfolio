"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Work" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

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
          scrolled
            ? "backdrop-blur-md bg-bone-100/75 border-b border-ink-900/8"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <a
            href="#top"
            className="text-sm font-medium tracking-tight text-ink-900"
          >
            Jaime Rabazo<span className="text-copper-500">.</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[13px] text-ink-600 hover:text-ink-900 transition-colors link-reveal"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="mailto:jaime.rabazofernandez@gmail.com"
            className="hidden md:inline-flex items-center rounded-full bg-ink-900 text-bone-50 text-[13px] font-medium px-4 py-2 hover:bg-copper-600 transition-colors"
          >
            Get in touch
          </a>

          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`h-[1.5px] w-5 bg-ink-900 transition-transform ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-5 bg-ink-900 transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-5 bg-ink-900 transition-transform ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
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
            className="fixed inset-0 z-40 bg-bone-100/98 backdrop-blur-md md:hidden"
          >
            <ul className="flex h-full flex-col items-center justify-center gap-8">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.6 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-3xl font-medium tracking-tight text-ink-900"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                href="mailto:jaime.rabazofernandez@gmail.com"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-ink-900 text-bone-50 px-6 py-3 text-sm font-medium"
              >
                Get in touch
              </motion.a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
