"use client";

import { useState } from "react";
import type { Example, Tally } from "@/lib/sudoku/types";
import { Board } from "./Board";
import { RichText } from "./RichText";

export function ExamplePlayer({ example, compact = false }: { example: Example; compact?: boolean }) {
  const [i, setI] = useState(0);
  const [showCands, setShowCands] = useState(example.showCands);
  const n = example.frames.length;
  const f = example.frames[i];
  const go = (k: number) => setI(Math.max(0, Math.min(n - 1, k)));
  const last = i === n - 1;

  return (
    <figure
      className="m-0"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <div className="rounded-2xl border border-rule bg-surface p-2 sm:p-3">
        <Board
          grid={example.grid}
          givens={example.puzzle}
          cands={example.cands}
          frame={f}
          showCands={showCands}
          label={`Ví dụ minh hoạ, bước ${i + 1}: ${f.title}`}
        />
      </div>

      <figcaption className="mt-4">
        <ol className="flex flex-wrap gap-1.5" aria-label="Các bước suy luận">
          {example.frames.map((fr, k) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={k === i ? "step" : undefined}
                className={`flex h-8 items-center gap-2 rounded-full border px-3 text-sm transition-colors ${
                  k === i
                    ? "border-ink bg-ink text-paper"
                    : k < i
                      ? "border-rule bg-sunken text-ink-2"
                      : "border-rule text-ink-3 hover:border-ink-3"
                }`}
              >
                <span className="font-semibold tabular-nums">{k + 1}</span>
                {!compact && k === i && <span className="max-w-[16ch] truncate sm:max-w-none">{fr.title}</span>}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-3 min-h-[7.5rem]" aria-live="polite">
          <p className="font-display text-lg font-semibold leading-snug">{f.title}</p>
          <p className="mt-1 text-[16px] leading-relaxed text-ink-2">
            <RichText text={f.text} />
          </p>
          {f.tally && <TallyStrip tally={f.tally} />}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => go(i - 1)}
            disabled={i === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-rule px-3 text-sm font-medium disabled:opacity-40"
          >
            <Chevron dir="left" />
            Bước trước
          </button>
          <button
            type="button"
            onClick={() => (last ? setI(0) : go(i + 1))}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-pen px-4 text-sm font-semibold text-on-pen"
          >
            {last ? "Xem lại từ đầu" : "Bước tiếp"}
            {!last && <Chevron dir="right" />}
          </button>
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--pen)]"
              checked={showCands}
              onChange={(e) => setShowCands(e.target.checked)}
            />
            Hiện ứng viên
          </label>
        </div>

        {example.carried && showCands && (
          <p className="mt-3 border-l-2 border-rule pl-3 text-sm text-ink-3">
            Ứng viên trên bàn đã được rút gọn bởi các bước loại trừ trước đó trong lời giải của đề này.
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path
        d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dải số 1–9: gạch các số đã thấy, tô vàng số còn thiếu. */
function TallyStrip({ tally }: { tally: Tally }) {
  return (
    <div className="mt-3">
      <p className="text-sm text-ink-3">{tally.label}</p>
      <ol className="mt-1.5 flex flex-wrap gap-1.5">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((d) => {
          const seen = tally.seen.includes(d);
          const missing = tally.missing.includes(d);
          return (
            <li
              key={d}
              className={`grid h-8 w-8 place-items-center rounded-md border text-[15px] tabular-nums ${
                missing
                  ? "border-transparent bg-[var(--t-focus)] font-bold text-ink"
                  : seen
                    ? "border-rule bg-sunken text-ink-3 line-through decoration-2"
                    : "border-rule text-ink-2"
              }`}
              aria-label={missing ? `${d}: còn thiếu` : seen ? `${d}: đã có` : String(d)}
            >
              {d}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
