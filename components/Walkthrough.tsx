"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PEERS, basicCandidates, bit, cellName, parseGrid } from "@/lib/sudoku/core";
import type { Frame, Walkthrough as WalkData } from "@/lib/sudoku/types";
import { Board } from "./Board";
import { Chevron } from "./ExamplePlayer";
import { RichText } from "./RichText";

interface TechMeta {
  name: string;
  level: number;
}

export function Walkthrough({ data, techs }: { data: WalkData; techs: Record<string, TechMeta> }) {
  const n = data.steps.length;
  // Trạng thái trước mỗi bước: states[k] = sau khi áp dụng k bước đầu.
  const states = useMemo(() => {
    let grid = parseGrid(data.puzzle);
    let cands = basicCandidates(grid);
    const out = [{ grid: data.puzzle, cands }];
    for (const st of data.steps) {
      grid = grid.slice();
      cands = cands.slice();
      for (const [c, d] of st.elims) cands[c] &= ~bit(d);
      for (const [c, d] of st.places) {
        grid[c] = d;
        cands[c] = 0;
        for (const p of PEERS[c]) cands[p] &= ~bit(d);
      }
      out.push({ grid: grid.map((d) => (d ? String(d) : ".")).join(""), cands });
    }
    return out;
  }, [data]);

  const [i, setI] = useState(0); // 0 = đề bài, 1..n = bước, n+1 = hoàn thành
  const [always, setAlways] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const go = (k: number) => setI(Math.max(0, Math.min(n + 1, k)));

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [i]);

  const step = i >= 1 && i <= n ? data.steps[i - 1] : null;
  const state = i === 0 ? states[0] : i > n ? { grid: data.solution, cands: [] } : states[i - 1];
  const frame: Frame | undefined = step
    ? { title: "", text: "", cells: step.cells, cands: step.cands, elims: step.elims, places: step.places }
    : undefined;
  const needCands = !!step && step.elims.length > 0;
  const showCands = always || needCands;
  const meta = step ? techs[step.tech] : null;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-[88px]">
        <div className="rounded-2xl border border-rule bg-surface p-2 sm:p-3">
          <Board grid={state.grid} givens={data.puzzle} cands={state.cands} frame={frame} showCands={showCands} label={`Giải mẫu, bước ${i}`} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => go(i - 1)}
            disabled={i === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-rule px-3 text-sm font-medium disabled:opacity-40"
          >
            <Chevron dir="left" /> Bước trước
          </button>
          <button
            type="button"
            onClick={() => go(i + 1)}
            disabled={i === n + 1}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-pen px-4 text-sm font-semibold text-on-pen disabled:opacity-40"
          >
            Bước tiếp <Chevron dir="right" />
          </button>
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" className="h-4 w-4 accent-[var(--pen)]" checked={always} onChange={(e) => setAlways(e.target.checked)} />
            Luôn hiện ứng viên
          </label>
        </div>
        <input
          type="range"
          min={0}
          max={n + 1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="mt-4 w-full accent-[var(--pen)]"
          aria-label="Chọn bước"
        />
      </div>

      <div>
        <div className="min-h-[9rem] rounded-2xl border border-rule bg-surface p-5" aria-live="polite" data-level={meta?.level}>
          {i === 0 && (
            <>
              <p className="font-display text-xl font-bold">Đề bài</p>
              <p className="mt-1 text-ink-2">
                {data.puzzle.replace(/\./g, "").length} số cho sẵn. Bấm &ldquo;Bước tiếp&rdquo; hoặc dùng phím mũi tên để đi qua lời giải.
              </p>
            </>
          )}
          {step && meta && (
            <>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold tabular-nums text-ink-3">
                  Bước {i}/{n}
                </span>
                <Link href={`/ky-thuat/${step.tech}`} className="font-semibold no-underline hover:underline" style={{ color: "var(--lv)" }}>
                  {meta.name}
                </Link>
              </p>
              <p className="mt-2 text-[17px] leading-relaxed">
                <RichText text={step.text} />
              </p>
              {needCands && !always && <p className="mt-2 text-sm text-ink-3">Bước này loại ứng viên nên bàn cờ tự hiện ghi chú bút chì.</p>}
            </>
          )}
          {i > n && (
            <>
              <p className="font-display text-xl font-bold">Hoàn thành</p>
              <p className="mt-1 text-ink-2">Mọi ô đã được điền bằng suy luận, không cần đoán một lần nào.</p>
            </>
          )}
        </div>

        <ol
          ref={listRef}
          className="mt-6 max-h-[60vh] overflow-y-auto rounded-2xl border border-rule bg-surface p-2"
          aria-label="Danh sách các bước"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault();
              go(i + 1);
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault();
              go(i - 1);
            }
          }}
        >
          {data.steps.map((st, k) => {
            const m = techs[st.tech];
            const on = k + 1 === i;
            const target = st.places.length
              ? `${cellName(st.places[0][0])} = ${st.places[0][1]}`
              : `loại ${st.elims.length} ứng viên`;
            return (
              <li key={k} data-step={k + 1} data-level={m.level}>
                <button
                  type="button"
                  onClick={() => setI(k + 1)}
                  aria-current={on ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left text-[15px] ${on ? "bg-sunken" : "hover:bg-sunken/60"}`}
                >
                  <span className="w-7 shrink-0 text-right text-sm tabular-nums text-ink-3">{k + 1}</span>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--lv)" }} aria-hidden="true" />
                  <span className={m.level > 1 ? "font-semibold" : ""}>{m.name}</span>
                  <span className="ml-auto shrink-0 text-sm tabular-nums text-ink-3">{target}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
