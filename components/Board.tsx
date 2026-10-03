import { colOf, has, rowOf, UNITS } from "@/lib/sudoku/core";
import type { Frame, Line } from "@/lib/sudoku/types";

const S = 56; // kích thước một ô trong hệ toạ độ SVG
const N = S * 9;
const SUB = S / 3;

export interface BoardProps {
  grid: string;
  givens: string;
  cands?: number[];
  frame?: Frame;
  showCands?: boolean;
  labels?: boolean;
  digits?: boolean;
  label?: string;
  className?: string;
}

const cellX = (c: number) => colOf(c) * S;
const cellY = (c: number) => rowOf(c) * S;

function point([c, d]: [number, number]): [number, number] {
  if (!d) return [cellX(c) + S / 2, cellY(c) + S / 2];
  return [cellX(c) + ((d - 1) % 3) * SUB + SUB / 2, cellY(c) + Math.floor((d - 1) / 3) * SUB + SUB / 2];
}

function unitRect(id: number) {
  const u = UNITS[id];
  if (u.type === "row") return { x: 0, y: u.index * S, w: N, h: S };
  if (u.type === "col") return { x: u.index * S, y: 0, w: S, h: N };
  return { x: (u.index % 3) * 3 * S, y: Math.floor(u.index / 3) * 3 * S, w: 3 * S, h: 3 * S };
}

function linePath(l: Line) {
  let [x1, y1] = point(l.a);
  let [x2, y2] = point(l.b);
  if (l.kind === "ray") {
    // Tia bắt đầu từ mép vòng tròn quanh số gây chặn và kéo tới mép ô cuối để mũi tên không đè lên dấu ×.
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    x1 += ux * 20;
    y1 += uy * 20;
    x2 += ux * (S / 2 - 10);
    y2 += uy * (S / 2 - 10);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  // Rút ngắn hai đầu để không đè lên chữ số ứng viên.
  const t = 8.5 / (Math.hypot(x2 - x1, y2 - y1) || 1);
  [x1, y1, x2, y2] = [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, x2 - (x2 - x1) * t, y2 - (y2 - y1) * t];
  // Liên kết giữa hai ô khác nhau uốn cong nhẹ cho dễ phân biệt; đường nhìn thì giữ thẳng.
  if (l.kind !== "sight" && l.a[0] !== l.b[0]) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const bend = Math.min(22, Math.hypot(dx, dy) * 0.12);
    const len = Math.hypot(dx, dy) || 1;
    const cx = mx - (dy / len) * bend;
    const cy = my + (dx / len) * bend;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function Board({ grid, givens, cands, frame, showCands = false, labels = true, digits = true, label, className }: BoardProps) {
  const pad = labels ? 26 : 3;
  const places = new Map((frame?.places ?? []).map(([c, d]) => [c, d]));
  const elims = new Set((frame?.elims ?? []).map(([c, d]) => `${c}:${d}`));
  const marks = new Map((frame?.cands ?? []).map(([c, d, color]) => [`${c}:${d}`, color]));
  const blocked = new Set((frame?.cells ?? []).filter(([, color]) => color === "blocked").map(([c]) => c));
  const lines = frame?.lines ?? [];
  const rays = lines.filter((l) => l.kind === "ray");
  const links = lines.filter((l) => l.kind !== "ray");

  const cellContent = (c: number) => {
    const ch = grid[c];
    const x = cellX(c);
    const y = cellY(c);
    if (ch && ch !== "." && ch !== "0") {
      const given = givens[c] === ch;
      return (
        <text key={c} x={x + S / 2} y={y + S / 2 + 1} className={given ? "bd-given" : "bd-placed"}>
          {ch}
        </text>
      );
    }
    const placed = places.get(c);
    if (placed) {
      return (
        <text key={c} x={x + S / 2} y={y + S / 2 + 1} className="bd-placed bd-new">
          {placed}
        </text>
      );
    }
    if (!showCands && blocked.has(c)) {
      // Ô trống bị chặn: đánh dấu × để thấy rõ ô này không nhận được số đang xét.
      return (
        <path
          key={c}
          d={`M${x + S / 2 - 8} ${y + S / 2 - 8}l16 16M${x + S / 2 + 8} ${y + S / 2 - 8}l-16 16`}
          className="bd-cross"
        />
      );
    }
    if (!showCands || !cands) return null;
    const m = cands[c];
    const out = [];
    for (let d = 1; d <= 9; d++) {
      if (!has(m, d)) continue;
      const [px, py] = point([c, d]);
      const k = `${c}:${d}`;
      const color = marks.get(k);
      const gone = elims.has(k);
      out.push(
        <g key={k}>
          {color && !gone && <circle cx={px} cy={py} r={8.6} className={`bd-m-${color}`} />}
          {gone && <circle cx={px} cy={py} r={8.6} className="bd-m-elim" />}
          <text x={px} y={py + 0.5} className={gone ? "bd-cand bd-cand-gone" : color ? "bd-cand bd-cand-on" : "bd-cand"}>
            {d}
          </text>
          {gone && <line x1={px - 7} y1={py + 7} x2={px + 7} y2={py - 7} className="bd-strike" />}
        </g>,
      );
    }
    return <g key={c}>{out}</g>;
  };

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${N + pad + 3} ${N + pad + 3}`}
      className={`board ${className ?? ""}`}
      role="img"
      aria-label={label ?? "Bàn cờ Sudoku minh hoạ"}
    >
      <rect x={0} y={0} width={N} height={N} className="bd-bg" />

      {frame?.units?.map((u) => {
        const r = unitRect(u);
        return <rect key={`ut${u}`} x={r.x} y={r.y} width={r.w} height={r.h} className="bd-t-unit" />;
      })}

      {frame?.cells?.map(([c, color], i) => (
        <rect key={`c${i}`} x={cellX(c)} y={cellY(c)} width={S} height={S} className={`bd-t-${color}`} />
      ))}

      {rays.map((l, i) => (
        <path key={`r${i}`} d={linePath(l)} className="bd-ray" markerEnd="url(#ray-head)" />
      ))}

      {/* Lưới */}
      {Array.from({ length: 8 }, (_, i) => i + 1).map((i) => (
        <g key={`g${i}`} className={i % 3 === 0 ? "bd-line-box" : "bd-line"}>
          <line x1={i * S} y1={0} x2={i * S} y2={N} />
          <line x1={0} y1={i * S} x2={N} y2={i * S} />
        </g>
      ))}
      <rect x={0} y={0} width={N} height={N} className="bd-frame" />

      {frame?.units?.map((u) => {
        const r = unitRect(u);
        return <rect key={`uo${u}`} x={r.x + 2} y={r.y + 2} width={r.w - 4} height={r.h - 4} rx={4} className="bd-unit-outline" />;
      })}

      {frame?.rings?.map((c) => (
        <circle key={`ring${c}`} cx={cellX(c) + S / 2} cy={cellY(c) + S / 2} r={19} className="bd-ring" />
      ))}

      {labels &&
        Array.from({ length: 9 }, (_, i) => (
          <g key={`l${i}`} className="bd-label">
            <text x={i * S + S / 2} y={-12}>
              {i + 1}
            </text>
            <text x={-13} y={i * S + S / 2}>
              {i + 1}
            </text>
          </g>
        ))}

      {/* Chữ số và ứng viên */}
      {digits && Array.from({ length: 81 }, (_, c) => cellContent(c))}

      {links.map((l, i) => (
        <path key={`k${i}`} d={linePath(l)} className={`bd-${l.kind}`} />
      ))}
    </svg>
  );
}
