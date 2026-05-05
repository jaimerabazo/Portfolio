"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("jaime.rabazofernandez@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // no-op
    }
  };

  return (
    <section
      id="contact"
      className="relative py-32 md:py-48 px-6 md:px-10 border-t border-ink-900/8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-500">
            <span className="tabular text-ink-900">06</span>
            <span className="h-px w-8 accent-rule" />
            <span>Contact</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-10 font-display font-semibold text-huge text-ink-900">
            Get in touch
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-ink-700 tracking-tight2">
            Open to roles in data, consulting and technology strategy. Based in
            Madrid, open to relocate.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="mailto:jaime.rabazofernandez@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 text-bone-50 px-6 py-3.5 text-sm font-medium hover:bg-copper-600 transition-colors"
            >
              jaime.rabazofernandez@gmail.com
              <span aria-hidden>→</span>
            </a>
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3.5 text-sm font-medium text-ink-900 hover:bg-ink-900/5 transition-colors"
            >
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <a
              href="https://www.linkedin.com/in/jaime-rabazo-fernandez/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3.5 text-sm font-medium text-ink-900 hover:bg-ink-900/5 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/jaimerabazo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3.5 text-sm font-medium text-ink-900 hover:bg-ink-900/5 transition-colors"
            >
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
