"use client";

import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { Doodle, ICONS } from "./Doodles";

const carryOn: { title: string; items: string[] }[] = [
  { title: "Code", items: ["Python", "Pandas", "Scikit-learn", "PySpark", "SQL", "Java", "C", "Kotlin", "MATLAB"] },
  { title: "Data & AI", items: ["Machine learning", "LLM applications", "Time-series forecasting", "Data pipelines", "Cloud", "Power BI"] },
  { title: "Business", items: ["Bid management", "Business cases", "Budgeting", "Excel", "Presenting to people who decide"] },
  { title: "Languages", items: ["Spanish (native)", "English (CAE, TOEFL iBT)"] },
];

const offDuty = [
  { icon: "train", label: "Trains", note: "will talk timetables" },
  { icon: "plane", label: "Aviation", note: "window seat, always" },
  { icon: "pencil", label: "Drawing", note: "always sketching" },
  { icon: "music", label: "Choir", note: "NU Choral Society" },
  { icon: "mask", label: "Acting & public speaking", note: "stage > slides" },
  { icon: "brick", label: "FIRST LEGO League", note: "coach & judge" },
];

export default function Packing() {
  return (
    <section id="packing" className="relative px-5 md:px-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="Packing list" title="What I bring along." />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
              Carry-on · work
            </h3>
            <dl className="mt-4 border-t border-ink-900/15">
              {carryOn.map((g) => (
                <div
                  key={g.title}
                  className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6 py-4 border-b border-ink-900/15"
                >
                  <dt className="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-900">
                    {g.title}
                  </dt>
                  <dd className="text-[15px] leading-relaxed text-ink-600">{g.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
              Checked bag · off duty
            </h3>
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {offDuty.map((o, i) => (
                <li
                  key={o.label}
                  className="flex flex-col rounded-xl border border-ink-900/10 bg-paper-light p-4"
                >
                  <Doodle paths={ICONS[o.icon]} viewBox="0 0 64 64" delay={i * 0.1} className="h-11 w-11" />
                  <span className="mt-3 text-[14px] font-medium leading-snug text-ink-900">{o.label}</span>
                  <span className="hand mt-1 text-[1.2rem]">{o.note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
