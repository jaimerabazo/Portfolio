"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CSSProperties, useEffect, useRef, useState } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // Raw cursor position normalized to [-1, 1] within the hero
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Spring-smoothed for nicer motion
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  // Photo tilt
  const rotateY = useTransform(sx, [-1, 1], [-8, 8]);
  const rotateX = useTransform(sy, [-1, 1], [6, -6]);
  const photoX = useTransform(sx, [-1, 1], [-10, 10]);
  const photoY = useTransform(sy, [-1, 1], [-8, 8]);

  // Spotlight position — percentage values
  const spotX = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const spotY = useTransform(sy, [-1, 1], ["25%", "75%"]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const heroSrc = `${basePath}/images/jaime-hero.png`;
  const frameSrc = `${basePath}/images/polaroid-frame.png`;

  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mx.set(Math.max(-1, Math.min(1, nx)));
      my.set(Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my]);

  // ─────────────────────────────────────────────────────────────────────
  // PHOTO COMPOSITION — adjust these CSS vars to fit your photo perfectly
  //
  //   --inside-*  : the photo behind the frame (visible through the window)
  //                 Tune so your TORSO sits centered inside the frame window.
  //   --outside-* : the same photo on top of the frame (only top portion shown)
  //                 Tune so your ARMS / HEAD line up above the frame.
  //   --outside-cut: how much of the photo (from top) to keep visible above
  //                  the frame. Lower = less sticking out.
  //
  //   To match perfectly: keep --inside-* and --outside-* IDENTICAL and only
  //   tweak --outside-cut so the bottom of the visible overlay touches the
  //   top edge of the frame's polaroid window.
  // ─────────────────────────────────────────────────────────────────────
  const photoVars: CSSProperties = {
    ["--inside-scale" as string]: "1.05",
    ["--inside-x" as string]: "0%",
    ["--inside-y" as string]: "26%",
    ["--outside-scale" as string]: "1.05",
    ["--outside-x" as string]: "0%",
    ["--outside-y" as string]: "26%",
    ["--outside-cut" as string]: "30%",
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 md:px-10"
      style={{ perspective: 1200 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ink-900/12" />

      {/* Cursor-following soft spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background: useTransform(
            [spotX, spotY] as never,
            ([x, y]: string[]) =>
              `radial-gradient(520px 420px at ${x} ${y}, rgba(50, 122, 117, 0.13), transparent 70%), radial-gradient(520px 360px at 12% 24%, rgba(185, 106, 67, 0.12), transparent 72%)`
          ),
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[100rem] mx-auto pt-28 md:pt-0 grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-center"
      >
        <div>
          <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="h-px w-8 accent-rule" />
            <span>Madrid · Available 2026</span>
          </p>

          <h1 className="mt-10 md:mt-14 font-display font-semibold text-mega tracking-tightest text-ink-900">
            <span className="block">Jaime</span>
            <span className="block">
              Rabazo<span className="accent-text">.</span>
            </span>
          </h1>

          <p className="mt-10 md:mt-12 max-w-2xl text-xl md:text-2xl leading-snug text-ink-700 tracking-tight2">
            CS & Business student at UC3M. Currently doing ML and network
            automation work at Telefónica.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-bone-50 shadow-[0_14px_30px_-20px_rgba(185,106,67,0.75)] hover:bg-copper-600 transition-colors"
            >
              See work
              <span aria-hidden>→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-sea-600/25 px-6 py-3.5 text-sm font-medium text-ink-900 hover:bg-sea-500/10 hover:border-sea-600/40 transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Portrait — parallax tilt following cursor */}
        <motion.div
          ref={photoRef}
          style={{
            rotateX,
            rotateY,
            rotate: -2.75,
            x: photoX,
            y: photoY,
            transformStyle: "preserve-3d",
          }}
          className="relative mx-auto aspect-square w-[370px] md:mx-0 md:w-[530px] md:justify-self-center lg:-ml-8 lg:w-[650px]"
        >
          {imgOk ? (
            <div className="absolute inset-0" style={photoVars}>
              {/* Layer 1 — INSIDE: the part that shows through the polaroid window. */}
              {/* Adjust torso position with --inside-* vars above. */}
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt="Jaime Rabazo"
                  className="absolute left-1/2 top-1/2 w-full max-w-none select-none"
                  draggable={false}
                  onError={() => setImgOk(false)}
                  style={{
                    transform:
                      "translate(-50%, -50%) translate(var(--inside-x), var(--inside-y)) scale(var(--inside-scale))",
                    transformOrigin: "center",
                  }}
                />
              </div>

              {/* Layer 2 — the polaroid frame */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frameSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none drop-shadow-[0_28px_42px_rgba(14,14,16,0.18)]"
                draggable={false}
              />

              {/* Layer 3 — OUTSIDE: photo on top of frame, clipped so only the */}
              {/* top portion (arms / head) sticks out. Tune --outside-cut. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-full max-w-none select-none drop-shadow-[0_18px_24px_rgba(14,14,16,0.14)]"
                draggable={false}
                style={{
                  transform:
                    "translate(-50%, -50%) translate(var(--outside-x), var(--outside-y)) scale(var(--outside-scale))",
                  transformOrigin: "center",
                  clipPath:
                    "inset(0 0 calc(100% - var(--outside-cut)) 0)",
                }}
              />
            </div>
          ) : (
            <div className="aspect-[3/4] w-full rounded-2xl border border-dashed border-ink-900/20 bg-bone-50 flex items-center justify-center text-[12px] uppercase tracking-[0.28em] text-ink-500 text-center px-6">
              Drop transparent
              <br />
              jaime-hero.png
              <br />
              in /public/images
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
