import type { Metadata } from "next";
import Link from "next/link";
import SplitFlap from "@/components/SplitFlap";
import { Hand } from "@/components/Doodles";
import Reading from "@/components/Reading";
import InflightEntertainment from "@/components/InflightEntertainment";

export const metadata: Metadata = {
  title: "The Lounge — Jaime Rabazo",
  description: "Off duty: what Jaime is reading, listening to and up to between flights.",
  alternates: { canonical: "/lounge/" },
};

export default function Lounge() {
  return (
    <section className="relative px-5 md:px-10 pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 hover:text-ink-900 transition-colors link-reveal"
        >
          ← Back to departures
        </Link>

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">Gate A24 · Off duty</p>
            <h1 className="board mt-4 inline-block p-3 md:p-4 font-mono font-bold leading-none text-[clamp(2.2rem,7vw,4.5rem)]">
              <SplitFlap text="THE LOUNGE" tiles step={70} delay={0.2} />
            </h1>
          </div>
          <Hand mode="time" delay={1.2} className="text-[1.6rem] md:max-w-[17rem] md:text-right md:-rotate-2">
            shoes off, make yourself at home
          </Hand>
        </div>

        <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-ink-600">
          The bit of me that doesn&apos;t fit on a CV: what I&apos;m reading, what&apos;s on repeat, and
          what keeps me busy between flights.
        </p>

        <div className="mt-6">
          <Reading />
          <InflightEntertainment />
        </div>
      </div>
    </section>
  );
}
