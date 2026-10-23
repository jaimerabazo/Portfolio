"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type Props = {
  text: string;
  /** Render each character in its own flap tile (big board) or as plain text. */
  tiles?: boolean;
  delay?: number;
  /** ms between each character settling */
  step?: number;
  className?: string;
};

/**
 * Departure-board text: characters shuffle through random glyphs and settle
 * left to right when scrolled into view. Screen readers get the plain text.
 */
export default function SplitFlap({ text, tiles = false, delay = 0, step = 45, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = [...text];
    const start = performance.now() + delay * 1000;
    const settleAt = chars.map((_, i) => start + 300 + i * step);
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      if (now - last > 55 && now >= start) {
        last = now;
        let done = true;
        const next = chars
          .map((ch, i) => {
            if (ch === " " || now >= settleAt[i]) return ch;
            done = false;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
        setShown(next);
        if (done) return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, delay, step]);

  return (
    <span ref={ref} className={clsx("whitespace-pre", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tiles
          ? [...shown].map((c, i) => (
              <span key={i} className="flap-tile">
                {c}
              </span>
            ))
          : shown}
      </span>
    </span>
  );
}
