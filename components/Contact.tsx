"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { CIRCLE, Doodle, Hand } from "./Doodles";

const EMAIL = "jaime.rabazofernandez@gmail.com";
const CAL_USERNAME = "jaimerabazo";
const CV_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cv/Jaime-Rabazo-CV.pdf`;

type Fare = {
  code: string;
  minutes: number;
  label: string;
  box: string;
  slug: string;
};

// Each fare is a Cal.com event type: cal.com/<username>/<slug>
const fares: Fare[] = [
  { code: "Q", minutes: 30, label: "30 min", box: "30MIN", slug: "30min" },
  { code: "S", minutes: 60, label: "1 h", box: "1H", slug: "60min" },
  { code: "L", minutes: 90, label: "1 h 30", box: "1H30", slug: "90min" },
];

const BOOKING_REF = "2D2026A24";
const FLIGHT = "2D 024";

const fmtTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" });
const fmtDay = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", day: "2-digit" });
const fmtMonth = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", month: "short" });

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

// Decorative 2D "PDF417-ish" code, deterministic for a given seed.
function MatrixCode({ seed, cols, rows, className }: { seed: string; cols: number; rows: number; className?: string }) {
  const cells = useMemo(() => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const out: { x: number; y: number }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        h ^= h << 13;
        h ^= h >>> 17;
        h ^= h << 5;
        if ((h >>> 0) % 100 < 52) out.push({ x, y });
      }
    }
    return out;
  }, [seed, cols, rows]);
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" shapeRendering="crispEdges" className={className} aria-hidden>
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

function Label({ text }: { text: string }) {
  return (
    <span className="block text-[9px] md:text-[10px] leading-tight tracking-[0.08em] text-ink-700">
      {text}
    </span>
  );
}

// Round "alliance" seal: ring text slowly orbiting a plane.
function Seal() {
  const ring = "AVAILABLE NOW · MADRID · OR ANYWHERE · ";
  return (
    <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink-900 text-paper-light md:h-20 md:w-20">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]" aria-hidden>
        <defs>
          <path id="seal-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
        </defs>
        <text fontSize="10.5" fontWeight="700" letterSpacing="1.6" fill="currentColor" className="font-mono">
          <textPath href="#seal-ring">{ring}</textPath>
        </text>
      </svg>
      <span aria-hidden className="text-[18px] text-flap">✈</span>
      <span className="sr-only">Available now, Madrid or anywhere</span>
    </span>
  );
}

// Hand-drawn ballpoint circle around a value; re-draws when `k` changes.
function PenCircle({ k }: { k: string }) {
  return (
    <Doodle
      key={k}
      mode="mount"
      paths={CIRCLE}
      viewBox="0 0 200 64"
      stretch
      strokeWidth={1.6}
      className="pointer-events-none absolute -left-2 -top-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)]"
    />
  );
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono font-bold">
      <span
        className={`grid shrink-0 place-items-center rounded-full border-[2.5px] border-ink-900 leading-none ${
          small ? "h-9 w-9 text-[15px]" : "h-11 w-11 text-[19px] md:h-12 md:w-12 md:text-[21px]"
        }`}
      >
        2°
      </span>
      <span className={`leading-[0.95] tracking-[0.14em] ${small ? "text-[13px]" : "text-[15px] md:text-[18px]"}`}>
        TWO DEGREES
        <span className={`block font-medium tracking-[0.42em] ${small ? "text-[9px]" : "text-[10px] md:text-[11px]"}`}>
          AIRWAYS
        </span>
      </span>
    </span>
  );
}

export default function Contact() {
  const [fare, setFare] = useState(fares[0]);
  const [copied, setCopied] = useState(false);
  const now = useNow();
  // Pen marks mount (and draw) only once the pass has been seen, so the first
  // tick and circles are drawn in front of the reader rather than off-screen.
  const passRef = useRef<HTMLDivElement>(null);
  const seen = useInView(passRef, { once: true, amount: 0.4 });

  const departs = now === null ? "--:--" : fmtTime.format(now);
  const arrives = now === null ? "--:--" : fmtTime.format(now + fare.minutes * 60_000);
  const date = now === null ? "--" : `${fmtDay.format(now)}${fmtMonth.format(now).toUpperCase().slice(0, 3)}`;
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
          note="tick a flight length, then board ✈"
        />

        <Reveal className="mt-10">
          <div ref={passRef} className="thermal relative grid font-mono uppercase md:-rotate-[0.6deg] md:grid-cols-[1fr_4.5rem_19rem]">
            {/* edge notches, like a torn-off roll */}
            <span aria-hidden className="absolute -left-2 top-[38%] h-5 w-4 rounded-r-full bg-paper" />
            <span aria-hidden className="absolute -left-2 top-[52%] h-5 w-4 rounded-r-full bg-paper" />

            {/* ── Main coupon ─────────────────────────────── */}
            <div className="p-5 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <Brand />
                <div className="hidden text-center sm:block">
                  <p className="text-[15px] md:text-[17px] font-bold tracking-[0.08em]">Two Degrees Airways</p>
                  <p className="mt-1 text-[12px] md:text-[13px] font-bold tracking-[0.1em]">Boarding pass</p>
                </div>
                <Seal />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-8">
                <div className="text-[15px] md:text-[17px] leading-snug">
                  <p>{BOOKING_REF}</p>
                  <p className="text-[17px] md:text-[20px]">ETKT 160 0052 0013</p>
                  <p className="mt-1 text-[18px] md:text-[22px] sm:pl-10">Fast track</p>
                </div>
                <div className="text-[15px] md:text-[17px] leading-snug">
                  <p>Recruiter/You</p>
                  <p className="tabular">
                    {FLIGHT} {fare.code} {date}
                    {departs}
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>Madrid</span>
                    <span>MAD</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>Your team</span>
                    <span>YOU</span>
                  </p>
                </div>
              </div>

              {/* Boarding box */}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-[1.5px] border-ink-900 px-3 py-3 md:grid-cols-4 md:px-4">
                <div>
                  <Label text="Boarding begins" />
                  <p className="mt-1 text-[28px] md:text-[34px] font-bold leading-none">NOW</p>
                </div>
                <div>
                  <Label text="Flight length" />
                  <p className="mt-1 text-[28px] md:text-[34px] font-bold leading-none">
                    <span className="relative inline-block">
                      {fare.minutes}
                      <span className="ml-1 text-[12px] font-bold normal-case">min.</span>
                      {seen && <PenCircle k={`d-${fare.slug}`} />}
                    </span>
                  </p>
                </div>
                <div>
                  <Label text="Boarding gate" />
                  <p className="mt-1 text-[28px] md:text-[34px] font-bold leading-none">A24</p>
                  <Label text="Boarding zone" />
                </div>
                <div>
                  <Label text="Seat" />
                  <p className="mt-1 text-[28px] md:text-[34px] font-bold leading-none">1A</p>
                  <p className="mt-1 text-[10px] normal-case">window, always</p>
                </div>
              </div>
              <p className="mt-1 text-[10px] md:text-[11px] normal-case">
                Remarks: OPEN TO RELOCATION · GOOGLE MEET
              </p>

              {/* Footer: selector + group */}
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <fieldset>
                  <legend className="text-[12px] md:text-[13px] leading-snug">
                    2D010524 {date} MAD MADRID
                    <br />
                    Please select flight length
                  </legend>
                  <div className="mt-2 flex gap-3">
                    {fares.map((f) => {
                      const active = f.slug === fare.slug;
                      return (
                        <label
                          key={f.slug}
                          className="group cursor-pointer text-center has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pen"
                        >
                          <input
                            type="radio"
                            name="fare"
                            value={f.slug}
                            checked={active}
                            onChange={() => setFare(f)}
                            className="sr-only"
                          />
                          <span className="block text-[12px] font-bold">{f.box}</span>
                          <span
                            className={`relative mt-0.5 grid h-10 w-14 place-items-center border-[1.5px] border-ink-900 transition-colors ${
                              active ? "" : "group-hover:bg-ink-900/5"
                            }`}
                          >
                            {active && seen && (
                              <Doodle
                                key={`c-${f.slug}`}
                                mode="mount"
                                paths={["M8 16 L 16 25 L 32 4"]}
                                viewBox="0 0 40 30"
                                strokeWidth={2.6}
                                className="h-7 w-9"
                              />
                            )}
                          </span>
                        </label>
                      );
                    })}
                    <Hand as="span" className="self-end pb-1 text-[1.3rem] normal-case">← pick one</Hand>
                  </div>
                </fieldset>

                <div className="sm:text-right">
                  <p className="text-[10px] normal-case">
                    Baggage &nbsp; Seq/Bn &nbsp; Tag number
                  </p>
                  <p className="text-[18px] sm:pr-24">160</p>
                  <p className="mt-2 text-[30px] md:text-[38px] font-bold leading-none tracking-[0.06em]">Group 1</p>
                </div>
              </div>
            </div>

            {/* ── 2D code ─────────────────────────────── */}
            <div className="flex items-center justify-center px-5 pb-2 md:px-0 md:py-8">
              <MatrixCode seed={`${EMAIL}/${fare.slug}`} cols={16} rows={64} className="hidden h-full max-h-[22rem] w-14 text-ink-900 md:block" />
              <MatrixCode seed={`${EMAIL}/${fare.slug}`} cols={64} rows={10} className="h-12 w-full text-ink-900 md:hidden" />
            </div>

            {/* ── Stub ─────────────────────────────── */}
            <div className="relative border-t-2 border-dashed border-ink-900/30 p-5 md:border-l-2 md:border-t-0 md:p-6">
              <Brand small />
              <p className="mt-2 text-[11px] font-bold tracking-[0.1em]">Boarding pass</p>

              <div className="mt-4 text-[14px] leading-snug">
                <p className="text-[8px] normal-case leading-none">Name</p>
                <p>Recruiter/You</p>
                <p className="pl-10">{BOOKING_REF}</p>
                <p className="mt-1 text-[8px] normal-case leading-none">From</p>
                <p className="flex justify-between"><span>Madrid</span><span>MAD</span></p>
                <p className="text-[8px] normal-case leading-none">To</p>
                <p className="flex justify-between"><span>Your team</span><span>YOU</span></p>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-1 text-[8px] normal-case leading-tight">
                <span>Flight</span>
                <span>Class</span>
                <span>Date</span>
                <span className="text-right">Departs</span>
              </div>
              <p className="flex justify-between text-[14px] tabular">
                <span>{FLIGHT}</span>
                <span>{fare.code}</span>
                <span>{date}</span>
                <span>{departs}</span>
              </p>

              <div className="mt-3 flex items-end gap-3">
                <div className="relative">
                  <p className="text-[8px] normal-case">Gate</p>
                  <p className="border-[1.5px] border-ink-900 px-2 py-0.5 text-[16px]">A24</p>
                  {seen && <PenCircle k={`g-${fare.slug}`} />}
                </div>
                <div className="relative">
                  <p className="text-[8px] normal-case">Arrival</p>
                  <p className="border-[1.5px] border-ink-900 px-2 py-0.5 text-[16px] tabular">{arrives}</p>
                  {seen && <PenCircle k={`a-${fare.slug}`} />}
                </div>
                <div>
                  <p className="text-[8px] normal-case">Seat</p>
                  <p className="text-[22px] font-bold leading-none">1A</p>
                </div>
              </div>

              <a
                href={bookHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-between bg-ink-900 px-4 py-3 text-[13px] font-bold tracking-[0.1em] text-paper-light transition-colors hover:bg-pen"
              >
                Board · Book {fare.label}
                <span aria-hidden>→</span>
              </a>
              <p className="mt-2 text-[12px] tracking-[0.08em]">ETKT 160 0052 0013</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
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
            <a href={CV_SRC} download className="px-3 py-3 text-sm font-medium text-ink-600 hover:text-ink-900 link-reveal">
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
