"use client";

import Reveal from "./Reveal";

const groups: { title: string; items: string[] }[] = [
  {
    title: "Languages & data",
    items: ["Python", "Pandas", "Scikit-learn", "PySpark", "SQL", "Java", "C", "Kotlin", "MATLAB"],
  },
  {
    title: "ML & analytics",
    items: ["Time Series Forecasting", "Data Pipelines", "Power BI", "Cloud Computing"],
  },
  {
    title: "Domain",
    items: ["Mobile networks (RAN, SON)", "Bid management", "Cybersecurity", "Cloud"],
  },
  {
    title: "Languages",
    items: ["Spanish — Native", "English — CAE / TOEFL"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-32 md:py-40 px-6 md:px-10 border-t border-ink-900/8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="tabular text-ink-900">05</span>
            <span className="h-px w-8 bg-ink-900/30" />
            <span>Skills</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-10 font-display font-semibold text-huge text-ink-900">
            Skills
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px bg-ink-900/10 md:grid-cols-2 border border-ink-900/10">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.04}>
              <div className="bg-bone-100 p-6 md:p-8 h-full">
                <div className="text-[11px] uppercase tracking-[0.28em] text-ink-500">
                  {g.title}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-full border border-ink-900/15 px-3 py-1 text-[13px] text-ink-700"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
