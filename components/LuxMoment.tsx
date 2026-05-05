"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";

/**
 * Editorial intermission — sober manifesto with a portrait detail and
 * subtle parallax. Replaces the previous chrome-italic LUX block.
 */
export default function LuxMoment() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -60]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 px-6 md:px-10 border-t border-ink-900/8 bg-bone-50 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl grid gap-16 md:grid-cols-[1fr_1.2fr] items-center">
        <motion.div style={{ y }} className="flex justify-center md:justify-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/images/jaime-full.png`}
            alt="Jaime Rabazo"
            className="w-[240px] md:w-[340px] grayscale opacity-90 select-none"
            draggable={false}
            loading="lazy"
          />
        </motion.div>

        <div>
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.32em] text-ink-500 flex items-center gap-3">
              <span className="h-px w-8 bg-ink-900/30" />
              Intermission
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="mt-8 font-display font-medium text-huge text-ink-900 leading-[1.02]">
              A hybrid profile.
              <span className="block editorial-italic text-ink-700">
                Engineering discipline, strategic narrative.
              </span>
            </h3>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-8 max-w-md text-lg text-ink-700 tracking-tight2 leading-relaxed">
              Built for teams that want technical conviction and the language
              to defend it in the room where the decision is made.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
