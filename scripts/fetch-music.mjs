// Saves the latest songs from Jaime's public Apple Music playlist to
// public/data/music.json, read by the site at runtime.
// Reads the playlist's public web page (no Apple developer account needed),
// then adds 30-second previews from the public iTunes lookup.
// If the page can't be read, the existing file is kept as is.

import { mkdir, writeFile } from "node:fs/promises";

const PLAYLIST = "https://music.apple.com/es/playlist/favourite-songs/pl.u-3zUP16pZKN?l=en";
const KEEP = 12; // the playlist lists the most recently added songs first
const COVER_SIZE = 600;
const OUT = new URL("../public/data/music.json", import.meta.url);
const HEADERS = { "User-Agent": "Mozilla/5.0 (jaimerabazo.github.io)" };

// Artwork URLs are templates like ".../{w}x{h}bb.{f}".
const cover = (art) =>
  art?.dictionary?.url?.replace("{w}", COVER_SIZE).replace("{h}", COVER_SIZE).replace("{f}", "jpg") ?? null;

// Maps song id → 30 s preview URL. Missing previews are just left out.
async function previews(ids) {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${ids.join(",")}&country=es`, { headers: HEADERS });
    if (!res.ok) return {};
    const { results } = await res.json();
    return Object.fromEntries(results.filter((r) => r.previewUrl).map((r) => [String(r.trackId), r.previewUrl]));
  } catch {
    return {};
  }
}

async function main() {
  const res = await fetch(PLAYLIST, { headers: HEADERS });
  if (!res.ok) throw new Error(`Apple Music answered ${res.status}`);
  const html = await res.text();

  // The page embeds everything it shows as JSON in this script tag.
  const json = html.match(/<script type="application\/json" id="serialized-server-data">([\s\S]*?)<\/script>/);
  if (!json) throw new Error("Playlist data not found in the page");
  const sections = JSON.parse(json[1]).data?.[0]?.data?.sections ?? [];

  const header = sections.find((s) => s.itemKind === "containerDetailHeaderLockup")?.items?.[0];
  const tracks = sections.find((s) => s.itemKind === "trackLockup")?.items ?? [];
  if (!tracks.length) throw new Error("No songs found in the playlist");

  const latest = tracks.slice(0, KEEP);
  const ids = latest.map((t) => t.contentDescriptor?.identifiers?.storeAdamID).filter(Boolean);
  const preview = await previews(ids);

  const songs = latest.map((t) => {
    const id = t.contentDescriptor?.identifiers?.storeAdamID;
    return {
      title: t.title,
      artist: t.artistName,
      album: t.tertiaryLinks?.[0]?.title ?? null,
      cover: cover(t.artwork),
      color: t.artwork?.dictionary?.bgColor ? `#${t.artwork.dictionary.bgColor}` : null,
      duration: Math.round((t.duration ?? 0) / 1000), // seconds
      explicit: Boolean(t.showExplicitBadge),
      url: t.contentDescriptor?.url ?? null,
      preview: preview[id] ?? null,
    };
  });

  const playlist = {
    title: header?.title ?? "Favourite Songs",
    url: PLAYLIST.split("?")[0],
    total: tracks.length,
  };

  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), playlist, songs }, null, 2) + "\n");
  console.log(`music.json: ${songs.length} song(s) — latest "${songs[0].title}" by ${songs[0].artist}`);
}

main().catch((err) => {
  console.warn(`Apple Music fetch skipped, keeping the previous music.json: ${err.message}`);
});
