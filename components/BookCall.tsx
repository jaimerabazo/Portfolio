"use client";

import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

// Cal.com username (cal.com/<username>). Each fare links to an event type with
// the slug below. While empty, the buttons fall back to an email request.
const CAL_USERNAME = "jaimerabazo";
const EMAIL = "jaime.rabazofernandez@gmail.com";

type Fare = {
  name: string;
  minutes: number;
  slug: string;
  arrives: string;
  description: string;
};

const fares: Fare[] = [
  {
    name: "Quick hop",
    minutes: 30,
    slug: "30min",
    arrives: "00:30",
    description: "An intro chat — who you are, what you're looking for.",
  },
  {
    name: "Short-haul",
    minutes: 60,
    slug: "60min",
    arrives: "01:00",
    description: "Go deeper into a role, a team or a project.",
  },
  {
    name: "Long-haul",
    minutes: 90,
    slug: "90min",
    arrives: "01:30",
    description: "Case discussion, technical deep-dive or a proper interview.",
  },
];

function bookingHref(f: Fare) {
  if (CAL_USERNAME) return `https://cal.com/${CAL_USERNAME}/${f.slug}`;
  const subject = encodeURIComponent(`Call request — ${f.minutes} min`);
  return `mailto:${EMAIL}?subject=${subject}`;
}

export default function BookCall() {
  return (
    <section id="book" className="relative px-5 md:px-10 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="Booking"
          title="Or book a call straight away."
          note="pick your flight length ✈"
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {fares.map((f, i) => (
            <Reveal key={f.slug} delay={i * 0.06} className="h-full">
              <a
                href={bookingHref(f)}
                target={CAL_USERNAME ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-paper-light p-6 transition-all hover:-translate-y-1 hover:border-ink-900/25 hover:shadow-[0_24px_40px_-30px_rgba(21,21,21,0.55)]"
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                  <span className="text-ink-900 font-bold">{f.name}</span>
                  <span className="text-ink-500">Non-stop</span>
                </div>

                {/* Flight timeline: departure → arrival */}
                <div className="mt-6 flex items-center gap-3">
                  <div>
                    <p className="font-serif text-[2rem] leading-none text-ink-900 tabular">00:00</p>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-ink-500">MAD</p>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="block border-t-2 border-dashed border-ink-900/20" />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper-light px-1.5 text-pen transition-transform duration-500 group-hover:translate-x-6"
                      >
                        ✈
                      </span>
                    </div>
                    <p className="mt-3 whitespace-nowrap text-center font-mono text-[11px] text-ink-500">{f.minutes} min</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-[2rem] leading-none text-ink-900 tabular">{f.arrives}</p>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-ink-500">YOU</p>
                  </div>
                </div>

                <p className="mt-6 text-[15px] leading-relaxed text-ink-600">{f.description}</p>

                <span className="mt-auto pt-6">
                  <span className="flex items-center justify-between rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-paper transition-colors group-hover:bg-pen">
                    Book {f.minutes} min
                    <span aria-hidden>→</span>
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
            Google Meet · times shown in your time zone · invite lands in your inbox
          </p>
        </Reveal>
      </div>
    </section>
  );
}
