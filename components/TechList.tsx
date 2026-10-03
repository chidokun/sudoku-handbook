import Link from "next/link";
import type { Technique } from "@/content/techniques";
import { EXAMPLES } from "@/lib/examples";
import { t, techHref, type Lang } from "@/lib/i18n";
import type { Frame } from "@/lib/sudoku/types";
import { Board } from "./Board";
import { Difficulty } from "./Difficulty";
import { LearnedMark } from "./Progress";

/** Khung tiêu biểu để làm hình thu nhỏ: khung có phép loại, hoặc khung cuối. */
export function keyFrame(frames: Frame[]) {
  return frames.find((f) => f.elims?.length) ?? frames[frames.length - 1];
}

export function TechThumb({ slug, lang, className = "" }: { slug: string; lang: Lang; className?: string }) {
  const ex = EXAMPLES[slug];
  if (!ex) return null;
  const f = keyFrame(ex.frames[lang]);
  return (
    <div className={`self-start overflow-hidden rounded-lg border border-rule bg-surface ${className}`}>
      <Board
        grid={ex.grid}
        givens={ex.puzzle}
        frame={{ ...f, lines: [], elims: [], units: [] }}
        labels={false}
        digits={false}
        className="board-thumb"
        label={t(lang).thumb(f.title)}
      />
    </div>
  );
}

export function TechList({ items, lang }: { items: Technique[]; lang: Lang }) {
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {items.map((tech) => (
        <li key={tech.slug} data-level={tech.level}>
          <Link
            href={techHref(lang, tech.slug)}
            className="group grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 py-5 no-underline sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6"
          >
            <TechThumb slug={tech.slug} lang={lang} className="transition-colors group-hover:border-ink-3" />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold leading-snug group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                  {tech.name}
                </h3>
                <LearnedMark slug={tech.slug} lang={lang} />
              </div>
              {tech.alias !== tech.name && <p className="text-sm text-ink-3">{tech.alias}</p>}
              <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-ink-2">{tech.summary}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-3">
                {t(lang).difficultyWord} <Difficulty value={tech.difficulty} lang={lang} />
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
