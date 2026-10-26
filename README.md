# Jaime Rabazo — Portfolio

Personal portfolio styled as a journey: a split-flap departures board, a logbook of experience, and a boarding pass to book a call.

**Live:** https://jaimerabazo.github.io

## Stack

Next.js 15 (static export) · TypeScript · Tailwind CSS · Framer Motion · Lenis

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
```

## Deploy

Every push to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.

## Where to edit

| Section          | File                        |
| ---------------- | --------------------------- |
| Hero             | `components/Hero.tsx`       |
| Departures       | `components/Departures.tsx` |
| Logbook          | `components/Logbook.tsx`    |
| Route            | `components/Route.tsx`      |
| Packing list     | `components/Packing.tsx`    |
| Book a call      | `components/Contact.tsx`    |

CV: `public/cv/Jaime-Rabazo-CV.pdf` · Colors and fonts: `tailwind.config.ts`
