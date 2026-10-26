import Reveal from "./Reveal";
import { Hand } from "./Doodles";

type Props = {
  kicker: string;
  title: string;
  note?: string;
  dark?: boolean;
};

export default function SectionTitle({ kicker, title, note, dark = false }: Props) {
  return (
    <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
            dark ? "text-paper/50" : "text-ink-500"
          }`}
        >
          {kicker}
        </p>
        <h2
          className={`mt-3 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.98] tracking-tight ${
            dark ? "text-paper" : "text-ink-900"
          }`}
        >
          {title}
        </h2>
      </div>
      {note && (
        <Hand className="text-[1.6rem] md:max-w-[17rem] md:text-right md:-rotate-2">{note}</Hand>
      )}
    </Reveal>
  );
}
