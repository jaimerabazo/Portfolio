"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type DoodleProps = {
  paths: string[];
  viewBox: string;
  className?: string;
  delay?: number;
  strokeWidth?: number;
  stretch?: boolean;
};

/** Hand-drawn line art that draws itself in when it scrolls into view. */
export function Doodle({ paths, viewBox, className, delay = 0, strokeWidth = 2.2, stretch = false }: DoodleProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      aria-hidden
      preserveAspectRatio={stretch ? "none" : undefined}
      className={clsx("overflow-visible text-pen", className)}
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: delay + i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </svg>
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
  pencil: [
    "M12 50 L16 38 L42 12 L52 22 L26 48 Z",
    "M16 38 L26 48 M38 16 L48 26",
    "M14 58 C 22 54, 30 60, 38 56 S 50 54, 56 57",
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
  brick: [
    "M8 30 H56 V52 H8 Z",
    "M14 30 V23 H24 V30 M28 30 V23 H38 V30 M42 30 V23 H52 V30",
  ],
};
