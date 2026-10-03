import Link from "next/link";
import type { Technique } from "@/content/techniques";
import { EXAMPLES } from "@/lib/examples";
import type { Example } from "@/lib/sudoku/types";
import { Board } from "./Board";
import { Difficulty } from "./Difficulty";
import { LearnedMark } from "./Progress";

/** Khung tiêu biểu để làm hình thu nhỏ: khung có phép loại, hoặc khung cuối. */
export function keyFrame(ex: Example) {
  return ex.frames.find((f) => f.elims?.length) ?? ex.frames[ex.frames.length - 1];
}

export function TechThumb({ slug, className = "" }: { slug: string; className?: string }) {
  const ex = EXAMPLES[slug];
  if (!ex) return null;
  const f = keyFrame(ex);
  return (
    <div className={`self-start overflow-hidden rounded-lg border border-rule bg-surface ${className}`}>
      <Board
        grid={ex.grid}
        givens={ex.puzzle}
        frame={{ ...f, lines: [], elims: [], units: [] }}
        labels={false}
        digits={false}
        className="board-thumb"
        label={`Hình thu nhỏ: ${f.title}`}
      />
    </div>
  );
}

export function TechList({ items, start = 1 }: { items: Technique[]; start?: number }) {
  return (
    <ol className="divide-y divide-rule border-y border-rule" start={start}>
      {items.map((t) => (
        <li key={t.slug} data-level={t.level}>
          <Link
            href={`/ky-thuat/${t.slug}`}
            className="group grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 py-5 no-underline sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6"
          >
            <TechThumb slug={t.slug} className="transition-colors group-hover:border-ink-3" />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold leading-snug group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                  {t.name}
                </h3>
                <LearnedMark slug={t.slug} />
              </div>
              <p className="text-sm text-ink-3">{t.alias}</p>
              <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-ink-2">{t.summary}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-3">
                Độ khó <Difficulty value={t.difficulty} />
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
