"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function PhotoPortrait({
  src,
  alt,
  className,
  priority = false,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      className={clsx("relative inline-block", className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-ink-900/10 bg-bone-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="relative w-full h-auto select-none grayscale-[0.15]"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
