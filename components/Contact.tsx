"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const EMAIL = "jaime.rabazofernandez@gmail.com";
const CAL_USERNAME = "jaimerabazo";
const CV_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cv/Jaime-Rabazo-CV.pdf`;

type Fare = {
  name: string;
  minutes: number;
  label: string;
  slug: string;
  description: string;
};

// Each fare is a Cal.com event type: cal.com/<username>/<slug>
const fares: Fare[] = [
  { name: "Quick hop", minutes: 30, label: "30 min", slug: "30min", description: "An intro chat — who you are, what you're looking for." },
  { name: "Short-haul", minutes: 60, label: "1 h", slug: "60min", description: "Go deeper into a role, a team or a project." },
  { name: "Long-haul", minutes: 90, label: "1 h 30", slug: "90min", description: "Case discussion, technical deep-dive or a proper interview." },
];

const madridTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
});

// Ticks every 15 s; null until mounted so server and client markup match.
function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);
  return now;
}

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
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-14 w-full text-ink-900" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">{label}</p>
      <p className="mt-1 font-mono text-[14px] uppercase text-ink-900">{value}</p>
    </div>
  );
}

export default function Contact() {
  const [fare, setFare] = useState(fares[0]);
  const [copied, setCopied] = useState(false);
  const now = useNow();

  const departs = now === null ? "--:--" : madridTime.format(now);
  const arrives = now === null ? "--:--" : madridTime.format(now + fare.minutes * 60_000);
  const bookHref = `https://cal.com/${CAL_USERNAME}/${fare.slug}`;

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
          note="pick your flight length, then board ✈"
        />

        <Reveal className="mt-10">
          <div className="relative grid overflow-hidden rounded-[22px] border border-ink-900/10 bg-paper-light shadow-[0_30px_60px_-40px_rgba(21,21,21,0.6)] md:grid-cols-[1fr_18rem]">
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="font-bold text-ink-900">Boarding pass</span>
                <span className="text-ink-500">Gate A24</span>
              </div>

              {/* Route with live times */}
              <div className="mt-8 flex items-end gap-4 md:gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">From · MAD</p>
                  <p className="mt-1 font-serif text-[2.4rem] md:text-[3rem] leading-none text-ink-900 tabular">{departs}</p>
                </div>
                <div className="mb-3 flex-1">
                  <div className="relative">
                    <span className="block border-t-2 border-dashed border-ink-900/20" />
                    <span aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper-light px-2 text-pen">
                      ✈
                    </span>
                  </div>
                  <p className="mt-3 whitespace-nowrap text-center font-mono text-[11px] text-ink-500">
                    {fare.label}
                    <span className="hidden sm:inline"> · non-stop</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">To · You</p>
                  <p className="mt-1 font-serif text-[2.4rem] md:text-[3rem] leading-none text-ink-900 tabular">{arrives}</p>
                </div>
              </div>

              {/* Fare selector */}
              <fieldset className="mt-8">
                <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
                  Flight length
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {fares.map((f) => {
                    const active = f.slug === fare.slug;
                    return (
                      <label
                        key={f.slug}
                        className={`cursor-pointer rounded-xl border px-3 py-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pen ${
                          active
                            ? "border-ink-900 bg-ink-900 text-paper"
                            : "border-ink-900/15 text-ink-900 hover:border-ink-900/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="fare"
                          value={f.slug}
                          checked={active}
                          onChange={() => setFare(f)}
                          className="sr-only"
                        />
                        <span className="block font-serif text-[1.35rem] leading-none">{f.label}</span>
                        <span className={`mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] ${active ? "text-paper/60" : "text-ink-500"}`}>
                          {f.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-4 text-[15px] text-ink-600">{fare.description}</p>
              </fieldset>

              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                <Field label="Passenger" value="J. Rabazo" />
                <Field label="Class" value={fare.name} />
                <Field label="Aircraft" value="Google Meet" />
                <Field label="Relocation" value="Yes" />
              </div>
            </div>

            {/* Stub */}
            <div className="relative flex flex-col justify-between gap-6 border-t-2 border-dashed border-ink-900/20 p-6 md:border-l-2 md:border-t-0 md:p-8">
              <span aria-hidden className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-paper md:block" />
              <span aria-hidden className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-paper md:block" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Departs" value={departs} />
                <Field label="Duration" value={fare.label} />
              </div>
              <Barcode value={`${EMAIL}/${fare.slug}`} />
              <a
                href={bookHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-full bg-ink-900 px-5 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-pen"
              >
                Book {fare.label} call
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <p className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">Rather write?</p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-5 py-3 text-sm font-medium text-ink-900 hover:border-ink-900/40 transition-colors"
            >
              {EMAIL}
            </a>
            <button
              onClick={copyEmail}
              className="inline-flex items-center rounded-full border border-ink-900/20 px-5 py-3 text-sm font-medium text-ink-900 hover:border-ink-900/40 transition-colors"
            >
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <a
              href={CV_SRC}
              download
              className="px-3 py-3 text-sm font-medium text-ink-600 hover:text-ink-900 link-reveal"
            >
              Download CV ↓
            </a>
            <a
              href="https://www.linkedin.com/in/jaime-rabazo-fernandez/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-3 text-sm font-medium text-ink-600 hover:text-ink-900 link-reveal"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/jaimerabazo"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-3 text-sm font-medium text-ink-600 hover:text-ink-900 link-reveal"
            >
              GitHub ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
