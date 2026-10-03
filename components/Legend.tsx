const ITEMS: { swatch: React.ReactNode; text: React.ReactNode }[] = [
  {
    swatch: <text x="14" y="15" className="bd-given" style={{ fontSize: 20 }}>7</text>,
    text: "Số cho sẵn trong đề",
  },
  {
    swatch: <text x="14" y="15" className="bd-placed" style={{ fontSize: 24 }}>7</text>,
    text: "Số đã điền bằng suy luận",
  },
  { swatch: <rect width="28" height="28" className="bd-t-focus" />, text: "Ô đang xét hoặc ô vừa kết luận" },
  { swatch: <rect width="28" height="28" className="bd-t-pattern" />, text: "Các ô tạo nên mẫu hình" },
  {
    swatch: (
      <>
        <circle cx="14" cy="14" r="10" className="bd-ring" />
        <text x="14" y="15" className="bd-given" style={{ fontSize: 15 }}>4</text>
      </>
    ),
    text: "Ô gây chặn: số này chặn hàng, cột, khối của nó",
  },
  {
    swatch: (
      <>
        <rect width="28" height="28" fill="url(#hatch)" />
        <path d="M9 9l10 10M19 9 9 19" className="bd-cross" />
      </>
    ),
    text: "Ô bị chặn, không nhận được số đang xét",
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
    text: "Ứng viên bị loại",
  },
  {
    swatch: (
      <>
        <rect width="14" height="28" className="bd-t-colorA" />
        <rect x="14" width="14" height="28" className="bd-t-colorB" />
      </>
    ),
    text: "Hai khả năng loại trừ nhau (xanh hoặc cam)",
  },
  {
    swatch: <path d="M1 14h17" className="bd-ray" markerEnd="url(#ray-head)" style={{ animation: "none", strokeWidth: 6 }} />,
    text: "Tia chặn: hướng mà số gây chặn loại trừ",
  },
  { swatch: <path d="M3 14h22" className="bd-sight" />, text: "Đường chấm: ô bị loại nhìn thấy ô này của mẫu hình" },
  { swatch: <path d="M2 14h24" className="bd-strong" />, text: "Liên kết mạnh: không phải ô này thì là ô kia" },
  { swatch: <path d="M2 14h24" className="bd-weak" />, text: "Liên kết yếu: là ô này thì không phải ô kia" },
];

export function Legend({ columns = 2 }: { columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {ITEMS.map((it, i) => (
        <li key={i} className="flex items-center gap-3 text-[15px] text-ink-2">
          <svg viewBox="0 0 28 28" className="legend-svg h-7 w-7 shrink-0 overflow-hidden rounded border border-rule" aria-hidden="true">
            <rect width="28" height="28" className="bd-bg" />
            {it.swatch}
          </svg>
          {it.text}
        </li>
      ))}
    </ul>
  );
}
