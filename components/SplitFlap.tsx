"use client";

import { useInView } from "framer-motion";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// Order of the characters on a tile's drum — flaps always advance forward.
const DRUM = " " + GLYPHS;
// One full flip: top half falls, then bottom half lands.
const FLIP_MS = 110;

type Props = {
  text: string;
  /** Render each character as a mechanical flap tile (big board) or as plain text. */
  tiles?: boolean;
  delay?: number;
  /** ms between each character starting */
  step?: number;
  className?: string;
};

/**
 * A single Solari-style tile. On each `run` it rewinds a few positions on the
 * drum and flips forward, one character at a time, until it lands on `target`.
 */
function FlapTile({ target, delay, run }: { target: string; delay: number; run: number }) {
  const [cur, setCur] = useState(target);
  const [next, setNext] = useState(target);
  const [flip, setFlip] = useState(0);

  useEffect(() => {
    if (run === 0) return;
    const ti = DRUM.indexOf(target);
    if (ti < 0) return;

    const flips = 6 + Math.floor(Math.random() * 10);
    let i = (ti - flips + DRUM.length * 2) % DRUM.length;
    setCur(DRUM[i]);
    setNext(DRUM[i]);

    let timer = 0;
    const advance = () => {
      const n = (i + 1) % DRUM.length;
      setNext(DRUM[n]);
      setFlip((f) => f + 1);
      timer = window.setTimeout(() => {
        i = n;
        setCur(DRUM[n]);
        if (DRUM[n] !== target) timer = window.setTimeout(advance, 0);
      }, FLIP_MS);
    };
    timer = window.setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [run, target, delay]);

  const flipping = cur !== next;

  return (
    <span className="flap-tile" style={{ ["--flap-ms" as string]: `${FLIP_MS / 2}ms` } as CSSProperties}>
      {/* Static halves: the next top is revealed, the current bottom stays until covered */}
      <span className="flap-half flap-top">
        <span className="flap-text">{next}</span>
      </span>
      <span className="flap-half flap-bottom">
        <span className="flap-text">{cur}</span>
      </span>
      {flipping && (
        <>
          <span key={`t${flip}`} className="flap-half flap-top flap-fold-top">
            <span className="flap-text">{cur}</span>
          </span>
          <span key={`b${flip}`} className="flap-half flap-bottom flap-fold-bottom">
            <span className="flap-text">{next}</span>
          </span>
        </>
      )}
    </span>
  );
}

/**
 * Departure-board text. With `tiles`, each character is a mechanical flap that
 * flips through the drum into place on scroll-in (and again on hover). Without
 * it, characters shuffle and settle left to right. Screen readers get the text.
 */
export default function SplitFlap({ text, tiles = false, delay = 0, step = 45, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState(text);
  const [run, setRun] = useState(0);
  const lastRun = useRef(-Infinity);

  const replay = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    if (now - lastRun.current < 2500) return;
    lastRun.current = now;
    setRun((r) => r + 1);
  }, []);

  // Tiles: flip in when first seen.
  useEffect(() => {
    if (tiles && inView) replay();
  }, [tiles, inView, replay]);

  // Plain text: shuffle and settle.
  useEffect(() => {
    if (tiles || !inView) return;
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
  }, [tiles, inView, text, delay, step]);

  return (
    <span
      ref={ref}
      className={clsx("whitespace-pre", className)}
      onPointerEnter={tiles ? replay : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tiles
          ? [...text].map((c, i) => (
              <FlapTile key={i} target={c} delay={delay * 1000 + i * step} run={run} />
            ))
          : shown}
      </span>
    </span>
  );
}
