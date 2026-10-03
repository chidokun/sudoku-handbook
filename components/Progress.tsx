"use client";

import { useLearned } from "@/lib/progress";

export function LearnedToggle({ slug }: { slug: string }) {
  const { learned, toggle } = useLearned();
  const done = learned.includes(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={done}
      className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[15px] font-semibold transition-colors ${
        done ? "border-transparent text-on-pen" : "border-rule text-ink hover:border-ink-3"
      }`}
      style={done ? { background: "var(--lv)" } : undefined}
    >
      <Check filled={done} />
      {done ? "Đã hiểu kỹ thuật này" : "Đánh dấu đã hiểu"}
    </button>
  );
}

export function LearnedMark({ slug }: { slug: string }) {
  const { learned } = useLearned();
  if (!learned.includes(slug)) return null;
  return (
    <span className="shrink-0" style={{ color: "var(--lv)" }} title="Đã hiểu">
      <Check filled small />
      <span className="sr-only">Đã hiểu</span>
    </span>
  );
}

export function LevelProgress({ slugs }: { slugs: string[] }) {
  const { learned } = useLearned();
  const done = slugs.filter((s) => learned.includes(s)).length;
  return (
    <div className="flex items-center gap-3 text-sm text-ink-3">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
        <div className="h-full rounded-full transition-[width]" style={{ width: `${(done / slugs.length) * 100}%`, background: "var(--lv)" }} />
      </div>
      <span className="tabular-nums">
        Đã hiểu {done}/{slugs.length}
      </span>
    </div>
  );
}

function Check({ filled, small }: { filled: boolean; small?: boolean }) {
  const s = small ? "h-4 w-4" : "h-5 w-5";
  return (
    <svg viewBox="0 0 20 20" className={s} aria-hidden="true">
      <circle cx="10" cy="10" r="8.2" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m6.2 10.2 2.5 2.5 5-5.2"
        fill="none"
        stroke={filled ? "var(--surface)" : "currentColor"}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={filled ? 1 : 0.35}
      />
    </svg>
  );
}
