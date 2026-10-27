"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import music from "@/public/data/music.json";
import { Hand } from "./Doodles";

// Latest songs from the public Apple Music playlist, refreshed at build time
// by scripts/fetch-music.mjs (and the daily scheduled deploy). Shown on a
// seat-back entertainment screen; play uses Apple's 30-second previews.

type Song = (typeof music.songs)[number];

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const TABS = ["Movies", "TV", "Music", "Map"];

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}

function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={clsx("h-4 w-4", back && "rotate-180")} fill="currentColor" aria-hidden>
      <path d="M5 5.5v13a1 1 0 0 0 1.55.83L15 13.6V18a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v4.4L6.55 4.67A1 1 0 0 0 5 5.5Z" />
    </svg>
  );
}

/** Animated bars next to the song that is playing. */
function Bars() {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[0, 0.2, 0.4].map((d) => (
        <span key={d} className="w-[3px] animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-livery-gold" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}

export default function InflightMusic() {
  const songs: Song[] = music.songs;
  const audio = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const song = songs[index];

  // Swap the preview when the song changes; keep playing if it was.
  useEffect(() => {
    const el = audio.current;
    if (!el || !song?.preview) return;
    el.src = song.preview;
    setElapsed(0);
    if (playing) el.play().catch(() => setPlaying(false));
    // `playing` is read, not watched: toggling play must not reload the song.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!song) return null;

  const toggle = () => {
    const el = audio.current;
    if (!el || !song.preview) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };
  const go = (i: number, play = playing) => {
    setPlaying(play);
    if (i === index) {
      if (play && !playing) toggle();
      return;
    }
    setIndex((i + songs.length) % songs.length);
  };
  // Previews last ~30 s; fall back to that before metadata loads.
  const length = audio.current?.duration || 30;

  return (
    <section aria-label="In-flight entertainment" className="grid gap-10 py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-12 lg:py-24">
      <div className="relative flex min-w-0 flex-col pl-6 lg:order-2 lg:pl-8">
        {/* navy spine, matching the reading card */}
        <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 rounded-full bg-livery" />
        <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500 sm:text-[11px] sm:tracking-[0.2em]">
          In-flight entertainment <span className="text-livery-gold">●</span> on repeat
        </p>
        <p className="mt-3 font-serif text-[1.6rem] leading-[1.08] text-ink-900 sm:text-[2.2rem]">
          What&apos;s in my headphones
        </p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-600">
          The last {songs.length} songs I saved, straight from my Apple Music favourites. Press play for a 30-second taste.
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
            {music.playlist.total} songs · via Apple Music
          </span>
          <Hand as="span" mode="time" delay={0.6} className="text-[1.1rem]">
            volume up, please
          </Hand>
        </div>
      </div>

      {/* Seat-back shell around the screen, in the seat's colours */}
      <div className="rounded-[34px] lg:order-1 bg-[linear-gradient(160deg,#f4f2ed,#dcd8d0)] p-3 shadow-[0_30px_60px_-35px_rgba(21,21,21,0.6),inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-4">
        <div className="rounded-[24px] bg-[#0c0d10] p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] sm:p-2.5">
          <div
            className="relative overflow-hidden rounded-[18px] text-paper-light transition-[background] duration-700"
            style={{ background: `radial-gradient(120% 90% at 0% 0%, ${song.color ?? "#2a3550"}cc, transparent 60%), #10141f` }}
          >
            {/* screen glare */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_35%)]" />

            {/* top bar */}
            <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] sm:px-5">
              <span className="text-livery-gold">JR 024</span>
              <nav aria-hidden className="flex gap-3 sm:gap-5">
                {TABS.map((t) => (
                  <span key={t} className={clsx(t === "Music" ? "text-paper-light underline decoration-livery-gold decoration-2 underline-offset-[6px]" : "hidden text-white/35 sm:inline")}>
                    {t}
                  </span>
                ))}
              </nav>
              <span className="text-white/45">MAD → YOU</span>
            </div>

            <div className="relative grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:p-5">
              {/* now playing */}
              <div className="flex min-w-0 flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={song.cover}
                  src={song.cover ?? ""}
                  alt={`Cover of ${song.album ?? song.title}`}
                  className="mx-auto aspect-square w-full max-w-[15rem] sm:max-w-none animate-[fadein_0.5s_ease-out] rounded-xl object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]"
                />
                <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                  {playing ? <Bars /> : null}
                  {playing ? "Now playing" : elapsed > 0 ? "Paused" : "Ready to play"}
                </p>
                <p className="mt-1 truncate font-serif text-[1.35rem] leading-tight">
                  {song.title}
                  {song.explicit && <span className="ml-2 rounded-[3px] bg-white/20 px-1 align-middle font-mono text-[9px] not-italic">E</span>}
                </p>
                <p className="truncate text-[14px] text-white/65">{song.artist}</p>

                {/* progress of the 30-second preview */}
                <div className="mt-4">
                  <div className="h-1 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-livery-gold transition-[width] duration-200 ease-linear" style={{ width: `${(elapsed / length) * 100}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/45">
                    <span>{mmss(elapsed)}</span>
                    <span>preview · {mmss(song.duration)}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-6">
                  <button type="button" aria-label="Previous song" onClick={() => go(index - 1)} className="text-white/70 transition-colors hover:text-white">
                    <SkipIcon back />
                  </button>
                  <button
                    type="button"
                    aria-label={playing ? "Pause preview" : "Play 30-second preview"}
                    onClick={toggle}
                    disabled={!song.preview}
                    className="grid h-12 w-12 place-items-center rounded-full bg-paper-light text-livery transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                  >
                    <PlayIcon playing={playing} />
                  </button>
                  <button type="button" aria-label="Next song" onClick={() => go(index + 1)} className="text-white/70 transition-colors hover:text-white">
                    <SkipIcon />
                  </button>
                </div>
              </div>

              {/* up next */}
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Playlist · latest first</p>
                <ol className="mt-2 max-h-[22rem] space-y-0.5 overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin] sm:max-h-[26rem]" data-lenis-prevent>
                  {songs.map((s, i) => (
                    <li key={`${s.title}-${i}`}>
                      <button
                        type="button"
                        onClick={() => go(i, true)}
                        aria-current={i === index}
                        className={clsx(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors",
                          i === index ? "bg-white/[0.12]" : "hover:bg-white/[0.06]"
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.cover ?? ""} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className={clsx("block truncate text-[13px]", i === index ? "text-livery-gold" : "text-paper-light")}>{s.title}</span>
                          <span className="block truncate text-[12px] text-white/50">{s.artist}</span>
                        </span>
                        {i === index && playing ? <Bars /> : <span className="font-mono text-[10px] text-white/35">{mmss(s.duration)}</span>}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        {/* headphone jack under the screen */}
        <div aria-hidden className="mt-2.5 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-400">
          <span className="h-2 w-2 rounded-full bg-[#2a2b2f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
          Audio
        </div>
      </div>

      <audio
        ref={audio}
        preload="none"
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onEnded={() => go(index + 1, true)}
      />
    </section>
  );
}
