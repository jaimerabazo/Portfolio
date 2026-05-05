"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";

type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
  highlight?: boolean;
};

const jobs: Job[] = [
  {
    role: "Network Automation & ML Engineer",
    company: "Telefónica España",
    location: "Madrid · Internship",
    period: "Jun 2025 — Feb 2026",
    bullets: [
      "Built and deployed 13 ML models for KPI forecasting and automated parameter tuning across the Spanish mobile network.",
      "ML-driven optimization running across 52,000+ LTE and NR cells, integrated into production telecom platforms.",
      "Automated network processes saving roughly 160 hours/month for a team of 20 — now operating at national scale.",
    ],
    tags: ["Python", "ML", "Time Series", "RAN", "SON"],
    highlight: true,
  },
  {
    role: "Bid Manager",
    company: "Telefónica Tech",
    location: "Madrid · Internship",
    period: "Feb 2026 — Present",
    bullets: [
      "Supporting technical and commercial inputs on bids including a €200M+ cybersecurity and cloud engagement.",
      "Working with clients including Aena and the Spanish Ministry of Defense.",
    ],
    tags: ["Consulting", "Cybersecurity", "Cloud"],
  },
];

function JobRow({ job, i }: { job: Job; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
      className="grid gap-6 md:grid-cols-[200px_1fr] py-12 md:py-16 border-t border-ink-900/10 first:border-t-0"
    >
      <div className="text-[12px] uppercase tracking-[0.28em] text-ink-500 tabular">
        <p>{job.period}</p>
        <p className="mt-1 text-ink-400 normal-case tracking-normal">
          {job.location}
        </p>
        {job.highlight && (
          <p className="mt-3 inline-block rounded-full bg-copper-500 text-bone-50 px-2.5 py-0.5 text-[10px] tracking-[0.2em]">
            MAIN ROLE
          </p>
        )}
      </div>

      <div>
        <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-ink-900">
          {job.role}
        </h3>
        <p className="mt-1 text-xl md:text-2xl text-sea-600">
          {job.company}
        </p>

        <ul className="mt-6 space-y-3 text-ink-700 text-base md:text-lg leading-relaxed tracking-tight2 max-w-3xl">
          {job.bullets.map((b, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="mt-2.5 h-px w-3 shrink-0 bg-copper-500/70" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {job.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-ink-900/15 px-3 py-1 text-[12px] text-ink-600"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-32 md:py-40 px-6 md:px-10 border-t border-ink-900/8 bg-bone-50"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="tabular text-ink-900">02</span>
            <span className="h-px w-8 accent-rule" />
            <span>Experience</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-10 font-display font-semibold text-huge text-ink-900">
            Experience
          </h2>
        </Reveal>

        <div className="mt-12">
          {jobs.map((job, i) => (
            <JobRow key={job.role} job={job} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
