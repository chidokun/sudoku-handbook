import type { Level } from "@/lib/sudoku/types";

/** Biểu tượng độ dài chuỗi suy luận: 1 mắt, 2 mắt, hoặc chuỗi nhiều mắt. */
export function LevelGlyph({ level, className = "" }: { level: Level; className?: string }) {
  const n = level === 1 ? 1 : level === 2 ? 2 : 4;
  const gap = 16;
  const w = 12 + (n - 1) * gap;
  return (
    <svg viewBox={`0 0 ${w} 12`} className={className} aria-hidden="true" style={{ height: "0.8em", width: "auto" }}>
      {Array.from({ length: n - 1 }, (_, i) => (
        <line key={`l${i}`} x1={6 + i * gap} y1={6} x2={6 + (i + 1) * gap} y2={6} stroke="currentColor" strokeWidth={2.2} strokeDasharray={i % 2 ? "3 3" : undefined} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={6 + i * gap} cy={6} r={i === n - 1 ? 5 : 4} fill={i === n - 1 ? "currentColor" : "var(--surface)"} stroke="currentColor" strokeWidth={2.2} />
      ))}
    </svg>
  );
}

export function LevelChip({ level, children }: { level: Level; children: React.ReactNode }) {
  return (
    <span
      data-level={level}
      className="inline-flex items-center gap-2 rounded-full px-3 py-0.5 text-sm font-semibold"
      style={{ background: "var(--lv-soft)", color: "var(--lv)" }}
    >
      <LevelGlyph level={level} />
      {children}
    </span>
  );
}
