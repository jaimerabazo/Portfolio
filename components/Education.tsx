"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";

type Edu = {
  school: string;
  degree: string;
  location: string;
  period: string;
  gpa?: string;
  highlights?: string[];
};

const education: Edu[] = [
  {
    school: "Universidad Carlos III de Madrid",
    degree:
      "B.Sc. Computer Science & Engineering · B.A. Business Administration",
    location: "Madrid, Spain",
    period: "Sept 2022 — Present",
    gpa: "8.23 / 8.18 · CS expected May 2026 · BA graduated Jan 2026",
    highlights: [
      "Banco Santander Non-European Mobility Scholarship",
      "RETO C4DX 2025 — winning team",
    ],
  },
  {
    school: "Copenhagen Business School",
    degree: "Business Administration · Exchange",
    location: "Copenhagen, Denmark",
    period: "Jan 2025 — Jun 2025",
  },
  {
    school: "Northeastern University",
    degree: "Dual Bachelor's in CS & BBA · Exchange",
    location: "Boston, MA",
    period: "Sept 2023 — May 2024",
    gpa: "3.75 GPA",
    highlights: [
      "Dean's List · Khoury College of Computer Science",
    ],
  },
  {
    school: "Universidad Politécnica de Madrid",
    degree: "Computer Engineering & Business Administration",
    location: "Madrid, Spain",
    period: "Sept 2020 — May 2022",
    gpa: "8.13 / 10",
  },
];

function EduRow({ edu, i }: { edu: Edu; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.65, delay: i * 0.05, ease: "easeOut" }}
      className="grid gap-4 md:grid-cols-[200px_1fr] py-10 md:py-12 border-t border-ink-900/10 first:border-t-0"
    >
      <p className="text-[12px] uppercase tracking-[0.28em] text-ink-500 tabular">
        {edu.period}
      </p>
      <div>
        <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900">
          {edu.school}
        </h3>
        <p className="mt-1 text-ink-700">{edu.degree}</p>
        <p className="mt-1 text-[13px] text-ink-500">{edu.location}</p>
        {edu.gpa && (
          <p className="mt-3 text-[13px] text-ink-600 tabular">{edu.gpa}</p>
        )}
        {edu.highlights && (
          <ul className="mt-3 space-y-1.5 text-[14px] text-ink-700">
            {edu.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-ink-400">—</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function Education() {
  return (
    <section
      id="education"
      className="relative py-32 md:py-40 px-6 md:px-10 border-t border-ink-900/8 bg-bone-50"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="tabular text-ink-900">04</span>
            <span className="h-px w-8 bg-ink-900/30" />
            <span>Education</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-10 font-display font-semibold text-huge text-ink-900">
            Education
          </h2>
        </Reveal>

        <div className="mt-12">
          {education.map((e, i) => (
            <EduRow key={e.school} edu={e} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
