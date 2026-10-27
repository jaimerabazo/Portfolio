"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, RefObject, useRef } from "react";
import clsx from "clsx";

/**
 * How ink appears:
 * - "scroll": tied to scroll position — writes as the element scrolls up into
 *   view, un-writes when you scroll back up.
 * - "time": draws once when first seen (for things visible on load).
 * - "mount": draws as soon as it renders (for marks that appear on interaction,
 *   already on screen — a viewport trigger can miss those).
 */
type InkMode = "scroll" | "time" | "mount";

/** 0 → 1 as the element travels from the bottom of the viewport to ~60% up. */
function useInk(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.6"] });
  // Near the end of the page an element may never reach 60% up the viewport,
  // so finish the ink once the page is scrolled to the bottom.
  const { scrollYProgress: page } = useScroll();
  const target = useTransform([scrollYProgress, page], ([local, whole]: number[]) => (whole > 0.995 ? 1 : local));
  const smooth = useSpring(target, { stiffness: 140, damping: 26, mass: 0.4 });
  const full = useMotionValue(1);
  return reduce ? full : smooth;
}

function InkPath({
  d,
  progress,
  from,
  to,
  strokeWidth,
}: {
  d: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  strokeWidth: number;
}) {
  const pathLength = useTransform(progress, [from, to], [0, 1]);
  const opacity = useTransform(progress, [from, from + 0.02], [0, 1]);
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity }}
    />
  );
}

type DoodleProps = {
  paths: string[];
  viewBox: string;
  className?: string;
  delay?: number;
  strokeWidth?: number;
  stretch?: boolean;
  mode?: InkMode;
};

/** Hand-drawn ballpoint line art. */
export function Doodle({
  paths,
  viewBox,
  className,
  delay = 0,
  strokeWidth = 2.2,
  stretch = false,
  mode = "scroll",
}: DoodleProps) {
  const ref = useRef<SVGSVGElement>(null);
  // useScroll only needs a box to measure; an <svg> works like any element.
  const progress = useInk(ref as unknown as RefObject<HTMLElement | null>);
  // In scroll mode, paths are drawn one after another across the progress range.
  const span = 1 / Math.max(1, paths.length);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      fill="none"
      aria-hidden
      preserveAspectRatio={stretch ? "none" : undefined}
      className={clsx("overflow-visible text-pen", className)}
    >
      {paths.map((d, i) =>
        mode === "scroll" ? (
          <InkPath
            key={i}
            d={d}
            progress={progress}
            from={i * span * 0.85}
            to={Math.min(1, (i + 1) * span)}
            strokeWidth={strokeWidth}
          />
        ) : (
          <motion.path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            {...(mode === "mount"
              ? { animate: { pathLength: 1, opacity: 1 } }
              : { whileInView: { pathLength: 1, opacity: 1 }, viewport: { once: true, amount: 0.6 } })}
            transition={{ duration: 0.9, delay: delay + i * 0.15, ease: "easeInOut" }}
          />
        )
      )}
    </svg>
  );
}

type HandProps = {
  children: ReactNode;
  className?: string;
  as?: "p" | "span";
  mode?: InkMode;
  delay?: number;
};

/** Handwritten note that "writes" itself left to right. */
export function Hand({ children, className, as = "p", mode = "scroll", delay = 0 }: HandProps) {
  const ref = useRef<HTMLElement>(null);
  const progress = useInk(ref);
  const clipPath = useTransform(progress, (v) => `inset(-25% ${(1 - v) * 100}% -25% -5%)`);
  const Tag = (as === "span" ? motion.span : motion.p) as typeof motion.p;
  const cls = clsx("hand", className);

  if (mode !== "scroll") {
    // The viewport trigger sits on the unclipped outer element: a fully
    // clipped box has no visible area, so it would never count as in view.
    return (
      <Tag
        ref={ref as RefObject<HTMLParagraphElement>}
        className={cls}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.span
          className="block"
          variants={{
            hidden: { clipPath: "inset(-25% 100% -25% -5%)" },
            shown: { clipPath: "inset(-25% 0% -25% -5%)" },
          }}
          transition={{ duration: 1.1, delay, ease: "easeInOut" }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }
  return (
    <Tag ref={ref as RefObject<HTMLParagraphElement>} className={cls} style={{ clipPath }}>
      {children}
    </Tag>
  );
}

export const UNDERLINE = ["M3 12 C 40 5, 90 15, 130 9 S 185 6, 197 10"];
export const CIRCLE = ["M18 34 C 8 14, 70 4, 130 6 C 186 8, 200 26, 188 42 C 172 60, 60 62, 20 50 C 2 44, 6 22, 40 12"];
export const ARROW = ["M6 8 C 22 40, 48 56, 88 52", "M74 42 L 90 52 L 74 62"];

export const ICONS: Record<string, string[]> = {
  train: [
    "M18 8 H46 C51 8 54 11 54 16 V44 C54 49 51 52 46 52 H18 C13 52 10 49 10 44 V16 C10 11 13 8 18 8 Z",
    "M16 16 H48 V30 H16 Z",
    "M20 42 h2 M42 42 h2",
    "M18 52 L10 61 M46 52 L54 61 M13 58 H51",
  ],
  plane: [
    "M6 36 L44 30 C52 29 58 31 58 34 C58 37 52 38 44 38 L6 40 Z",
    "M28 33 L20 16 L27 16 L39 32",
    "M30 38 L22 54 L29 54 L41 37",
    "M10 36 L6 24 L12 24 L18 34",
  ],
  music: [
    "M28 46 V14 L54 8 V40",
    "M16 46 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0",
    "M42 40 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0",
    "M28 22 L54 16",
  ],
  mask: [
    "M14 14 C 24 9, 40 9, 50 14 C 51 34, 44 50, 32 53 C 20 50, 13 34, 14 14 Z",
    "M22 27 q4 -4 8 0 M35 27 q4 -4 8 0",
    "M24 38 q8 8 16 0",
  ],
  sofa: [
    "M14 29 V20 C14 16.5 16.5 14 20 14 H44 C47.5 14 50 16.5 50 20 V29",
    "M32 15 V28",
    "M8 34 C8 30.5 10 28.5 13 28.5 C16 28.5 18 30.5 18 34 V38 H46 V34 C46 30.5 48 28.5 51 28.5 C54 28.5 56 30.5 56 34 V46 H8 Z",
    "M13 46 V52 M51 46 V52",
  ],
  brick: [
    "M8 30 H56 V52 H8 Z",
    "M14 30 V23 H24 V30 M28 30 V23 H38 V30 M42 30 V23 H52 V30",
  ],
};
