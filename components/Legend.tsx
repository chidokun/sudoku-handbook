import { t, type Lang } from "@/lib/i18n";

// Thứ tự khớp với UI[lang].legend.
const SWATCHES: { swatch: React.ReactNode }[] = [
  {
    swatch: <text x="14" y="15" className="bd-given" style={{ fontSize: 20 }}>7</text>,
  },
  {
    swatch: <text x="14" y="15" className="bd-placed" style={{ fontSize: 24 }}>7</text>,
  },
  { swatch: <rect width="28" height="28" className="bd-t-focus" /> },
  { swatch: <rect width="28" height="28" className="bd-t-pattern" /> },
  {
    swatch: (
      <>
        <circle cx="14" cy="14" r="10" className="bd-ring" />
        <text x="14" y="15" className="bd-given" style={{ fontSize: 15 }}>4</text>
      </>
    ),
  },
  {
    swatch: (
      <>
        <rect width="28" height="28" fill="url(#hatch)" />
        <path d="M9 9l10 10M19 9 9 19" className="bd-cross" />
      </>
    ),
  },
  {
    swatch: (
      <>
        <rect width="28" height="28" className="bd-t-elim" />
        <circle cx="14" cy="14" r="8" className="bd-m-elim" />
        <text x="14" y="14.5" className="bd-cand bd-cand-gone">4</text>
        <line x1="8" y1="20" x2="20" y2="8" className="bd-strike" />
      </>
    ),
  },
  {
    swatch: (
      <>
        <rect width="14" height="28" className="bd-t-colorA" />
        <rect x="14" width="14" height="28" className="bd-t-colorB" />
      </>
    ),
  },
  {
    swatch: <path d="M1 14h17" className="bd-ray" markerEnd="url(#ray-head)" style={{ animation: "none", strokeWidth: 6 }} />,
  },
  { swatch: <path d="M3 14h22" className="bd-sight" /> },
  { swatch: <path d="M2 14h24" className="bd-strong" /> },
  { swatch: <path d="M2 14h24" className="bd-weak" /> },
];

export function Legend({ lang, columns = 2 }: { lang: Lang; columns?: 1 | 2 }) {
  const texts = t(lang).legend;
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {SWATCHES.map((it, i) => (
        <li key={i} className="flex items-center gap-3 text-[15px] text-ink-2">
          <svg viewBox="0 0 28 28" className="legend-svg h-7 w-7 shrink-0 overflow-hidden rounded border border-rule" aria-hidden="true">
            <rect width="28" height="28" className="bd-bg" />
            {it.swatch}
          </svg>
          {texts[i]}
        </li>
      ))}
    </ul>
  );
}
