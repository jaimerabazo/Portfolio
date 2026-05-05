"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Paper plane that follows the cursor.
 * - Smooth spring trailing motion
 * - Rotates to face direction of travel
 * - Leaves a short fading color trail
 * - Hides once user scrolls past the hero, on touch devices, and on reduced-motion
 */
export default function PaperPlane() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const planeSrc = `${basePath}/images/paper-plane.webp`;

  // Trailing spring — slower than cursor for nice lag
  const sx = useSpring(x, { stiffness: 125, damping: 24, mass: 0.72 });
  const sy = useSpring(y, { stiffness: 125, damping: 24, mass: 0.72 });

  const lastRef = useRef({ x: -100, y: -100, t: performance.now() });
  const angle = useMotionValue(-30);
  const sangle = useSpring(angle, { stiffness: 60, damping: 14, mass: 0.6 });

  // Periodic 360° barrel-roll, additive on top of directional rotation
  const loop = useMotionValue(0);

  // Trail dots (fixed-size ring buffer)
  const TRAIL = 8;
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const trailIdRef = useRef(0);

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !isFinePointer) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const last = lastRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      // Only update angle if there's meaningful movement
      if (Math.hypot(dx, dy) > 2) {
        const a = Math.atan2(dy, dx) * (180 / Math.PI);
        angle.set(a);
      }
      lastRef.current = { x: e.clientX, y: e.clientY, t: now };

      x.set(e.clientX);
      y.set(e.clientY);

      // Push trail point behind the plane, not at the cursor/tip.
      setTrail((prev) => {
        const id = ++trailIdRef.current;
        const next = [...prev, { x: e.clientX, y: e.clientY, id }];
        return next.slice(-TRAIL);
      });
    };

    const onScroll = () => {
      const h = window.innerHeight;
      setVisible(window.scrollY < h * 0.85);
    };
    onScroll();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [x, y, angle]);


  // Compose translate + rotate (directional + barrel-roll)
  const transform = useTransform(
    [sx, sy, angle, loop] as never,
    ([cx, cy, a, l]: number[]) =>
      `translate(${cx - 50}px, ${cy - 10}px) rotate(${a + 12 + l}deg)`
  );

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
      }}
    >
      {/* Trail dots */}
      {trail.map((t, i) => {
        const progress = (i + 1) / trail.length;
        const opacity = progress * 0.34;
        const size = 4 + i * 0.55;
        return (
          <span
            key={t.id}
            className="absolute rounded-full"
            style={{
              left: t.x,
              top: t.y,
              width: size,
              height: size,
              opacity,
              background:
                i % 2 === 0
                  ? "rgba(185, 106, 67, 0.52)"
                  : "rgba(50, 122, 117, 0.46)",
              boxShadow: "0 0 18px rgba(185, 106, 67, 0.18)",
              transform: "translate(-50%, -50%)",
              transition: "opacity 600ms ease",
            }}
          />
        );
      })}

      {/* Paper plane image */}
      <motion.img
        src={planeSrc}
        alt=""
        width="56"
        height="56"
        draggable={false}
        className="select-none"
        style={{
          transform,
          position: "absolute",
          left: 0,
          top: 0,
          width: 56,
          height: 56,
          transformOrigin: "50px 10px",
          willChange: "transform",
          filter: "drop-shadow(0 10px 14px rgba(14,14,16,0.18))",
        }}
      />
    </div>
  );
}
