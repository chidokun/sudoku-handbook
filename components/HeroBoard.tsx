"use client";

import { useEffect, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import type { Example } from "@/lib/sudoku/types";
import { Board } from "./Board";
import { RichText } from "./RichText";

const DELAYS = [0, 1600, 3600];

/** Bàn cờ ở trang chủ: tự chạy một lần qua các bước của ví dụ quét chéo. */
export function HeroBoard({ example, lang }: { example: Example; lang: Lang }) {
  const L = t(lang);
  const frames = example.frames[lang];
  const n = frames.length;
  const [i, setI] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = reduce
      ? [setTimeout(() => setI(n - 1), 0)]
      : frames.map((_, k) => setTimeout(() => setI(k), DELAYS[k] ?? DELAYS[DELAYS.length - 1] + 1800 * k));
    return () => timers.forEach(clearTimeout);
  }, [run, n, frames]);

  const f = frames[i];
  return (
    <figure className="m-0">
      <div className="rounded-2xl border border-rule bg-surface p-2 shadow-[0_24px_60px_-30px_rgba(22,33,62,0.35)] sm:p-3">
        <Board grid={example.grid} givens={example.puzzle} cands={example.cands} frame={f} label={L.hero.label(f.title)} />
      </div>
      <figcaption className="mt-4 flex items-start gap-4">
        <div className="min-h-[5.5rem] flex-1 text-[15px] leading-relaxed text-ink-2" aria-live="polite">
          <span className="font-semibold text-ink">{f.title}.</span> <RichText text={f.text} />
        </div>
        <button
          type="button"
          onClick={() => {
            setI(0);
            setRun((r) => r + 1);
          }}
          className="shrink-0 rounded-lg border border-rule px-3 py-1.5 text-sm text-ink-2 hover:border-ink-3"
        >
          {L.hero.replay}
        </button>
      </figcaption>
    </figure>
  );
}
