"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

/**
 * Splits a string into words and animates each with a blur+translate reveal
 * (Apple-style "words fade in on scroll").
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  once = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.3 });
  const words = text.split(" ");

  return (
    <span ref={ref} className={clsx("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline"
          style={{ marginRight: "0.25em" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
            animate={
              inView
                ? { y: "0%", opacity: 1, filter: "blur(0px)" }
                : { y: "110%", opacity: 0, filter: "blur(8px)" }
            }
            transition={{
              duration: 0.9,
              ease: [0.25, 0.1, 0.25, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
