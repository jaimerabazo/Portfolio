// Saves the films Jaime logged last on Letterboxd to public/data/films.json,
// read by the site at runtime.
// Uses the profile's public RSS feed (no API key needed).
// If the feed can't be read, the existing file is kept as is.

import { mkdir, writeFile } from "node:fs/promises";

const USER = "jamesrabazo";
const FEED = `https://letterboxd.com/${USER}/rss/`;
const KEEP = 5;
const OUT = new URL("../public/data/films.json", import.meta.url);

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

// Text of <tag> inside an RSS item, with CDATA and entities unwrapped.
function field(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return decode(m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")).trim();
}

async function main() {
  const res = await fetch(FEED, { headers: { "User-Agent": "Mozilla/5.0 (jaimerabazo.github.io)" } });
  if (!res.ok) throw new Error(`Letterboxd answered ${res.status}`);
  const xml = await res.text();
  if (!xml.includes("<rss")) throw new Error("Response is not an RSS feed");

  const films = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => item)
    // Diary entries and reviews carry a film title; list posts don't.
    .filter((item) => field(item, "letterboxd:filmTitle"))
    .map((item) => {
      const description = field(item, "description");
      const rating = Number(field(item, "letterboxd:memberRating"));
      // The review is the description minus the poster paragraph.
      const review = decode(
        description
          .replace(/<p><img[^>]*\/?><\/p>/, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
      ).trim();
      return {
        title: field(item, "letterboxd:filmTitle"),
        year: Number(field(item, "letterboxd:filmYear")) || null,
        rating: rating || null, // 0.5 – 5 stars
        liked: field(item, "letterboxd:memberLike") === "Yes",
        rewatch: field(item, "letterboxd:rewatch") === "Yes",
        watched: field(item, "letterboxd:watchedDate") || null,
        poster: description.match(/<img src="([^"]+)"/)?.[1] ?? null,
        review: /^Watched on /.test(review) ? null : review || null,
      };
    });

  // Most recently watched first.
  films.sort((a, b) => (b.watched ?? "").localeCompare(a.watched ?? ""));
  const latest = films.slice(0, KEEP);
  if (!latest.length) throw new Error("No films found in the feed");

  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), films: latest }, null, 2) + "\n");
  console.log(`films.json: ${latest.length} film(s) — latest "${latest[0].title}"`);
}

main().catch((err) => {
  console.warn(`Letterboxd fetch skipped, keeping the previous films.json: ${err.message}`);
});
