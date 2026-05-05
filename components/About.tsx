"use client";

import Reveal from "./Reveal";

const stats = [
  { value: "52,000+", label: "LTE / NR cells optimized" },
  { value: "13", label: "ML models in production" },
  { value: "~160h", label: "Monthly hours automated" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-32 md:py-40 px-6 md:px-10 border-t border-ink-900/8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="tabular text-ink-900">01</span>
            <span className="h-px w-8 accent-rule" />
            <span>About</span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <Reveal>
            <h2 className="font-display font-semibold text-huge text-ink-900">
              About
            </h2>

            <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-ink-700 tracking-tight2">
              <p>
                I'm a dual-degree student in Computer Science and Business
                Administration at Universidad Carlos III de Madrid, with
                exchanges at Northeastern University (Boston) and Copenhagen
                Business School.
              </p>
              <p>
                Most of my technical work has been at Telefónica, where I spent
                eight months building ML pipelines for mobile network
                optimization across the Spanish access network. I'm now doing
                an internship at Telefónica Tech on the bid management side.
              </p>
              <p>
                Looking to join a startup next — somewhere I can keep building
                and own real problems end-to-end.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:pt-2">
            <dl className="space-y-5 text-[14px] text-ink-700">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.28em] text-ink-500">
                  Based in
                </dt>
                <dd className="mt-2">Madrid, Spain · open to relocate</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.28em] text-ink-500">
                  Languages
                </dt>
                <dd className="mt-2">Spanish (native) · English (CAE / TOEFL)</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.28em] text-ink-500">
                  Studied in
                </dt>
                <dd className="mt-2">Madrid · Boston · Copenhagen</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.28em] text-ink-500">
                  Outside work
                </dt>
                <dd className="mt-2">
                  Trains, aviation, drawing. Always sketching something.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 border-t border-ink-900/10">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.04}
              className={`py-8 md:py-10 ${
                i < stats.length - 1 ? "sm:border-r border-ink-900/10" : ""
              } ${i < stats.length - 1 ? "border-b sm:border-b-0" : ""} border-ink-900/10`}
            >
              <div className="px-4 md:px-6">
                <div className="font-display text-3xl md:text-5xl tracking-tight text-ink-900 tabular">
                  {s.value}
                </div>
                <div className="mt-3 text-[12px] uppercase tracking-[0.22em] text-sea-600">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
