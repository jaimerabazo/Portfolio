"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const EMAIL = "jaime.rabazofernandez@gmail.com";
const CV_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cv/Jaime-Rabazo-CV.pdf`;

// Deterministic, decorative barcode derived from a string.
function Barcode({ value }: { value: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of value) {
    const c = ch.charCodeAt(0);
    for (let k = 0; k < 3; k++) {
      const w = ((c >> k) & 3) + 1;
      bars.push({ x, w });
      x += w + (((c >> (k + 2)) & 1) + 1);
    }
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-16 w-full text-ink-900" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}

function Field({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">{label}</p>
      <p className={big ? "mt-1 font-serif text-[2.25rem] leading-none text-ink-900" : "mt-1 font-mono text-[14px] uppercase text-ink-900"}>
        {value}
      </p>
    </div>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // no-op
    }
  };

  return (
    <section id="contact" className="relative px-5 md:px-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="Final call"
          title="Got a seat on your team?"
          note="this is the part where you email me"
        />

        <Reveal className="mt-10">
          <div className="relative grid overflow-hidden rounded-[22px] bg-paper-light shadow-[0_30px_60px_-40px_rgba(21,21,21,0.6)] border border-ink-900/10 md:grid-cols-[1fr_17rem]">
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="text-ink-900 font-bold">Boarding pass</span>
                <span className="text-ink-500">JR · 2026</span>
              </div>

              <div className="mt-8 flex items-end gap-6">
                <Field label="From" value="MAD" big />
                <span aria-hidden className="pb-2 text-2xl text-pen">✈</span>
                <Field label="To" value="You?" big />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                <Field label="Passenger" value="J. Rabazo" />
                <Field label="Class" value="Data · AI · Strategy" />
                <Field label="Available" value="Now" />
                <Field label="Relocation" value="Yes" />
              </div>
            </div>

            {/* Stub */}
            <div className="relative border-t-2 border-dashed border-ink-900/20 p-6 md:border-l-2 md:border-t-0 md:p-8 flex flex-col justify-between gap-6">
              <span aria-hidden className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-paper md:block" />
              <span aria-hidden className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-paper md:block" />
              <Field label="Gate" value="Your inbox" />
              <Barcode value={EMAIL} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-paper hover:bg-pen transition-colors"
            >
              {EMAIL} <span aria-hidden>→</span>
            </a>
            <button
              onClick={copyEmail}
              className="inline-flex items-center rounded-full border border-ink-900/20 px-6 py-3.5 text-sm font-medium text-ink-900 hover:border-ink-900/40 transition-colors"
            >
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <a
              href={CV_SRC}
              download
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-6 py-3.5 text-sm font-medium text-ink-900 hover:border-ink-900/40 transition-colors"
            >
              Download CV <span aria-hidden className="text-ink-400">↓</span>
            </a>
            <a
              href="https://www.linkedin.com/in/jaime-rabazo-fernandez/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-3.5 text-sm font-medium text-ink-600 hover:text-ink-900 link-reveal"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/jaimerabazo"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-3.5 text-sm font-medium text-ink-600 hover:text-ink-900 link-reveal"
            >
              GitHub ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
