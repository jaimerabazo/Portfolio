export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[2] border-t border-ink-900/8 bg-bone-100">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 grid gap-6 md:grid-cols-3 items-baseline text-[13px] text-ink-500">
        <p className="text-ink-700">
          © {year} Jaime Rabazo Fernández
        </p>
        <p className="md:text-center editorial-italic text-ink-700 text-base">
          Designed & built in Madrid.
        </p>
        <div className="flex gap-6 md:justify-end">
          <a
            href="https://www.linkedin.com/in/jaime-rabazo-fernandez/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink-900 transition-colors link-reveal"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/jaimerabazo"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink-900 transition-colors link-reveal"
          >
            GitHub
          </a>
          <a
            href="mailto:jaime.rabazofernandez@gmail.com"
            className="hover:text-ink-900 transition-colors link-reveal"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
