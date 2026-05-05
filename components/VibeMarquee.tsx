"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Editorial quote — full-bleed pause between sections.
 * Replaces the old chromatic marquee. Subtle horizontal parallax.
 */
export default function VibeMarquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative py-32 md:py-48 px-6 md:px-10 overflow-hidden border-t border-ink-900/8"
    >
      <motion.blockquote
        style={{ x }}
        className="mx-auto max-w-6xl font-display font-medium text-[clamp(2rem,7vw,5.5rem)] leading-[1.05] tracking-tightest text-ink-900"
      >
        <span>The best analysts don't answer the question asked.</span>{" "}
        <span className="editorial-italic text-ink-700">
          They answer the one that matters.
        </span>
      </motion.blockquote>
    </section>
  );
}
