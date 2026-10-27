// Saves the book(s) on Jaime's Goodreads "currently-reading" shelf to
// public/data/reading.json, read by the site at runtime.
// Uses the shelf's public RSS feed (Goodreads no longer offers an API).
// If the feed can't be read, the existing file is kept as is.

import { mkdir, writeFile } from "node:fs/promises";

const USER_ID = "185658865";
const FEED = `https://www.goodreads.com/review/list_rss/${USER_ID}?shelf=currently-reading`;
const OUT = new URL("../public/data/reading.json", import.meta.url);

// Text of <tag> inside an RSS item, with CDATA and entities unwrapped.
function field(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return m[1]
    .replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

async function main() {
  const res = await fetch(FEED, { headers: { "User-Agent": "jaimerabazo.github.io" } });
  if (!res.ok) throw new Error(`Goodreads answered ${res.status}`);
  const xml = await res.text();
  if (!xml.includes("<rss")) throw new Error("Response is not an RSS feed");

  const books = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const [title, ...rest] = field(item, "title").split(":");
    return {
      title: title.trim(),
      subtitle: rest.join(":").trim() || null,
      author: field(item, "author_name"),
      cover: field(item, "book_large_image_url") || field(item, "book_image_url"),
      url: field(item, "link").split("?")[0],
      added: new Date(field(item, "user_date_added")).toISOString(),
    };
  });

  // Most recently started first.
  books.sort((a, b) => b.added.localeCompare(a.added));

  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), books }, null, 2) + "\n");
  console.log(`reading.json: ${books.length} book(s) — ${books.map((b) => b.title).join(", ") || "none"}`);
}

main().catch((err) => {
  console.warn(`Goodreads fetch skipped, keeping the previous reading.json: ${err.message}`);
});
