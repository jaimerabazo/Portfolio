"use client";

import reading from "@/public/data/reading.json";
import { Hand } from "./Doodles";

// Goodreads "currently reading" shelf, refreshed at build time by
// scripts/fetch-reading.mjs (and a daily scheduled deploy).
const fmtDay = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "Europe/Madrid" });
const fmtMonth = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "Europe/Madrid" });
// "07 SEP": three-letter month, like the boarding pass dates.
const since = (iso: string) => `${fmtDay.format(new Date(iso))} ${fmtMonth.format(new Date(iso)).slice(0, 3)}`;

export default function Reading() {
  const [book, ...others] = reading.books;
  if (!book) return null;

  return (
    <a
      href={book.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex gap-5 overflow-hidden rounded-xl border border-ink-900/10 bg-paper-light p-4 pl-6 transition-colors hover:border-ink-900/25 sm:gap-6 sm:p-5 sm:pl-7"
    >
      {/* navy spine, matching the boarding pass livery */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-livery" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={book.cover}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        className="h-32 w-auto shrink-0 -rotate-2 rounded-sm shadow-[0_10px_24px_-10px_rgba(21,21,21,0.55)] transition-transform duration-500 group-hover:rotate-0 sm:h-36"
      />

      <div className="flex min-w-0 flex-col">
        <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500 sm:text-[11px] sm:tracking-[0.2em]">
          In-flight reading <span className="text-livery-gold">●</span> now
        </p>
        <p className="mt-2 font-serif text-[1.4rem] leading-[1.1] text-ink-900 sm:text-[1.6rem]">{book.title}</p>
        {book.subtitle && (
          <p className="mt-1 line-clamp-2 font-serif text-[15px] italic leading-snug text-ink-600">{book.subtitle}</p>
        )}
        <p className="mt-2 text-[14px] text-ink-600">by {book.author}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-1 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
            Since {since(book.added)} · via Goodreads ↗
          </span>
          {others.length > 0 && (
            <Hand as="span" className="text-[1.1rem]">
              + {others.length} more on the go
            </Hand>
          )}
        </div>
      </div>
    </a>
  );
}
