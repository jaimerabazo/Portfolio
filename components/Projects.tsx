"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";

type Project = {
  title: string;
  context: string;
  description: string;
  impact: string[];
  href?: string;
};

const projects: Project[] = [
  {
    title: "ML for mobile network optimization",
    context: "Telefónica España",
    description:
      "Production ML platform for KPI forecasting and automated parameter tuning across the Spanish mobile access network.",
    impact: ["52,000+ cells", "13 models in prod", "~160h/month automated"],
  },
  {
    title: "Arrays con Gambas — JetBrains Hackathon",
    context: "Winning team · Kotlin",
    description:
      "Hackathon-winning project at JetBrains. Built end-to-end in Kotlin with a four-person team under tight time constraints.",
    impact: ["Winner", "Kotlin", "Team of 4"],
    href: "https://github.com/jaimerabazo/HACKATHON-JETBRAINS-ARRAYS-CON-GAMBAS",
  },
  {
    title: "RETO C4DX 2025",
    context: "UC3M · Digital transformation challenge",
    description:
      "National university competition on digital transformation for Occupational Health & Safety. Our team won.",
    impact: ["1st place", "Team project"],
  },
  {
    title: "€200M+ cybersecurity & cloud bid",
    context: "Telefónica Tech",
    description:
      "Supporting the pre-sales team on a strategic bid for Aena and the Spanish Ministry of Defense.",
    impact: ["Bid support", "Public sector"],
  },
];

const cardAccents = [
  "from-sea-500 via-slate2-500 to-copper-400",
  "from-copper-500 via-copper-400 to-sea-400",
  "from-slate2-600 via-sea-500 to-sea-400",
  "from-copper-600 via-slate2-500 to-sea-500",
];

function Card({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const accent = cardAccents[i % cardAccents.length];

  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink-500">
          {p.context}
        </p>
        <h3 className="mt-5 font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight">
          {p.title}
        </h3>
        <p className="mt-5 text-base md:text-lg text-ink-700 leading-relaxed tracking-tight2">
          {p.description}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {p.impact.map((imp) => (
          <span
            key={imp}
            className="rounded-full border border-ink-900/10 bg-bone-50/70 px-3 py-1 text-[12px] text-ink-600"
          >
            {imp}
          </span>
        ))}
      </div>

      {p.href && (
        <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-sea-600 group-hover:text-copper-600 transition-colors">
          View on GitHub
          <span aria-hidden>→</span>
        </div>
      )}
    </>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-lg border border-ink-900/10 bg-white/75 p-8 md:p-10 min-h-[320px] flex flex-col justify-between shadow-[0_18px_50px_-36px_rgba(14,14,16,0.32)] transition-colors hover:bg-white hover:border-ink-900/20"
    >
      {p.href ? (
        <a
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="contents"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-32 md:py-40 px-6 md:px-10 border-y border-ink-900/8 accent-sheen text-ink-900"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="tabular text-ink-900">03</span>
            <span className="h-px w-8 accent-rule" />
            <span>Selected work</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-10 font-display font-semibold text-huge text-ink-900">
            Selected work
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <Card key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
