# Jaime Rabazo — Portfolio

Apple-style personal portfolio. Dark, big typography, smooth scroll, scroll-driven animations.

## Stack

- **Next.js 15** (App Router) with static export (`output: 'export'`)
- **TypeScript** + **TailwindCSS**
- **Framer Motion** — reveals, parallax, page animations
- **GSAP** — available for fine-grained timeline animations
- **Lenis** — smooth scrolling
- **Inter** (via `next/font`) — close SF-Pro substitute

## Local development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
# Static site is emitted to ./out
```

## Deploy to GitHub Pages

1. Create a repo on GitHub and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<your-user>/<repo>.git
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The workflow at `.github/workflows/deploy.yml` will:
   - Detect whether the repo is a user site (`<user>.github.io`) or a project site, and set the correct `basePath`.
   - Build, add `.nojekyll`, and publish to Pages.
4. The URL will be printed in the workflow summary (e.g. `https://<user>.github.io/<repo>/`).

### Deploying to a custom domain or Vercel

- **Vercel**: just import the repo — no config needed. Remove `output: 'export'` if you want server features (not required here).
- **Custom domain on Pages**: add a `CNAME` file under `public/` with your domain.

## Editing content

All content lives in these components — no CMS, no extra layers:

| Section     | File                              |
| ----------- | --------------------------------- |
| Hero        | `components/Hero.tsx`             |
| About       | `components/About.tsx`            |
| Experience  | `components/Experience.tsx`       |
| Education   | `components/Education.tsx`        |
| Skills      | `components/Skills.tsx`           |
| Projects    | `components/Projects.tsx`         |
| Contact     | `components/Contact.tsx`          |
| Navbar      | `components/Navbar.tsx`           |
| Footer      | `components/Footer.tsx`           |

Animation primitives:

- `components/Reveal.tsx` — generic blur + slide reveal on scroll
- `components/SplitText.tsx` — Apple-style word-by-word mask reveal
- `components/SmoothScroll.tsx` — Lenis integration and anchor interception

Tailwind tokens live in `tailwind.config.ts` (custom `ink` palette, font-size ramp, marquee keyframes). Global CSS in `app/globals.css` (aura gradient, noise overlay, selection color).

## Project structure

```
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Education.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Projects.tsx
│   ├── Reveal.tsx
│   ├── Skills.tsx
│   ├── SmoothScroll.tsx
│   └── SplitText.tsx
├── .github/workflows/deploy.yml
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```
