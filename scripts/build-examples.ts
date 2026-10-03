// Sinh ví dụ minh hoạ cho từng kỹ thuật từ các đề thật, kèm lời giải thích từng bước.
// Mọi kết luận được đối chiếu với lời giải duy nhất của đề trước khi ghi ra data/.
// Chạy: node scripts/build-examples.ts [số đề] [seed]
import { writeFileSync, mkdirSync } from "node:fs";
import {
  BOX_UNITS,
  CELL_UNITS,
  COL_UNITS,
  ROW_UNITS,
  UNITS,
  basicCandidates,
  boxOf,
  cellAt,
  cellName,
  colOf,
  digitsOf,
  gridToString,
  has,
  joinVi,
  popcount,
  rowOf,
  unitName,
} from "../lib/sudoku/core.ts";
import { makePuzzle, mulberry32 } from "../lib/sudoku/generate.ts";
import {
  State,
  allSingles,
  findFullHouse,
  findHiddenSingleBox,
  findHiddenSingleLine,
  findNakedSingle,
  nextSteps,
  type Step,
  type TechId,
} from "../lib/sudoku/techniques.ts";
import type { CandMark, Color, Example, Frame, Line, WalkStep, Walkthrough } from "../lib/sudoku/types.ts";

const N = Number(process.argv[2] ?? 30000);
const rnd = mulberry32(Number(process.argv[3] ?? 2026));

const LEVEL1: TechId[] = ["full-house", "hidden-single-box", "hidden-single-line", "naked-single"];
const WANTED: TechId[] = [
  ...LEVEL1,
  "pointing",
  "claiming",
  "naked-pair",
  "hidden-pair",
  "naked-triple",
  "hidden-triple",
  "x-wing",
  "swordfish",
  "skyscraper",
  "two-string-kite",
  "xy-wing",
  "xyz-wing",
  "w-wing",
  "simple-coloring",
  "unique-rectangle",
  "bug-plus-one",
  "xy-chain",
];
const LEVEL2: TechId[] = ["pointing", "claiming", "naked-pair", "hidden-pair", "naked-triple", "hidden-triple"];

// ---------- tiện ích viết câu ----------
const cn = cellName;
const un = unitName;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const b = (x: string | number) => `**${x}**`;
const cells = (cs: number[]) => joinVi(cs.map(cn));
const nums = (ds: number[]) => joinVi(ds.map(b));
const key = (c: number, d: number) => `${c}:${d}`;

interface Candidate {
  score: number;
  tech: TechId;
  state: State;
  step: Step;
  puzzle: number[];
  solution: number[];
  carried: boolean;
  extra?: Record<string, unknown>;
}

const best = new Map<TechId, Candidate>();
function offer(c: Candidate) {
  c.score += rnd() * 0.5;
  const cur = best.get(c.tech);
  if (!cur || c.score > cur.score) best.set(c.tech, { ...c, state: c.state.clone() });
}

const isPure = (s: State) => {
  const basic = basicCandidates(s.grid);
  return basic.every((m, i) => m === s.cands[i]);
};
const totalCands = (s: State) => s.cands.reduce((a, m) => a + popcount(m), 0);

// ---------- chấm điểm cho ví dụ 1 bước ----------

/** Các "tia" chặn ô trống trong khối cho số d (quét chéo), bỏ qua các ô trong `exclude`. */
function hatching(s: State, box: number, d: number, exclude: number[]) {
  const u = BOX_UNITS[box - 18];
  const r0 = Math.floor(u.index / 3) * 3;
  const c0 = (u.index % 3) * 3;
  const lines: { kind: "row" | "col"; idx: number; src: number; covers: number[] }[] = [];
  const empties = u.cells.filter((c) => !s.grid[c] && !exclude.includes(c));
  for (let r = r0; r < r0 + 3; r++) {
    const src = ROW_UNITS[r].cells.find((c) => s.grid[c] === d);
    if (src !== undefined) lines.push({ kind: "row", idx: r, src, covers: empties.filter((c) => rowOf(c) === r) });
  }
  for (let c = c0; c < c0 + 3; c++) {
    const src = COL_UNITS[c].cells.find((x) => s.grid[x] === d);
    if (src !== undefined) lines.push({ kind: "col", idx: c, src, covers: empties.filter((x) => colOf(x) === c) });
  }
  let bestSet: typeof lines | null = null;
  for (let mask = 1; mask < 1 << lines.length; mask++) {
    const set = lines.filter((_, i) => mask & (1 << i));
    if (set.some((l) => l.covers.length === 0)) continue;
    const covered = new Set(set.flatMap((l) => l.covers));
    if (covered.size !== empties.length) continue;
    const mixed = set.some((l) => l.kind === "row") && set.some((l) => l.kind === "col");
    const better =
      !bestSet ||
      set.length < bestSet.length ||
      (set.length === bestSet.length && mixed && !(bestSet.some((l) => l.kind === "row") && bestSet.some((l) => l.kind === "col")));
    if (better) bestSet = set;
  }
  return { empties, lines: bestSet ?? [] };
}

/** Tia vẽ từ số gây chặn, xuyên qua khối tới mép bên kia. */
function hatchRays(box: number, lines: ReturnType<typeof hatching>["lines"]): Line[] {
  const u = BOX_UNITS[box - 18];
  const r0 = Math.floor(u.index / 3) * 3;
  const c0 = (u.index % 3) * 3;
  return lines.map((l) => {
    const end =
      l.kind === "row" ? cellAt(l.idx, colOf(l.src) < c0 ? c0 + 2 : c0) : cellAt(rowOf(l.src) < r0 ? r0 + 2 : r0, l.idx);
    return { a: [l.src, 0], b: [end, 0], kind: "ray" };
  });
}

/** Lý do một ô trống trong đơn vị `line` không nhận được d: số d ở đơn vị cắt ngang hoặc ở khối của ô. */
function lineReasons(s: State, line: (typeof UNITS)[number], d: number, others: number[]) {
  const cross = line.type === "row" ? colOf : rowOf;
  const crossUnits = line.type === "row" ? COL_UNITS : ROW_UNITS;
  const out: { cell: number; via: "cross" | "box"; src: number }[] = [];
  for (const e of others) {
    const src = crossUnits[cross(e)].cells.find((c) => s.grid[c] === d);
    if (src !== undefined) {
      out.push({ cell: e, via: "cross", src });
      continue;
    }
    const bsrc = BOX_UNITS[boxOf(e)].cells.find((c) => s.grid[c] === d);
    if (bsrc === undefined) return null; // bị loại bởi suy luận trước đó, không vẽ được tia
    out.push({ cell: e, via: "box", src: bsrc });
  }
  return out;
}

/** Đường nhìn: nối mỗi ứng viên bị loại tới các ô mẫu hình mà nó nhìn thấy. */
function sightLines(elims: [number, number][], targets: (c: number) => [number, number][]): Line[] {
  return elims.flatMap(([c, d]) => targets(c).map((t) => ({ a: [c, d], b: t, kind: "sight" }) as Line));
}

function scoreLevel1(s: State, st: Step, solution: number[], puzzle: number[]) {
  const t = st.info.cell as number;
  const d = st.info.digit as number;
  const empty = s.emptyCount();
  const nakedToo = popcount(s.cands[t]) === 1;
  let score = 0;
  let extra: Record<string, unknown> = {};

  if (st.tech === "full-house") {
    score = empty / 8 + (UNITS[st.info.unit].type === "box" ? 2 : 0);
    if (empty < 45) score -= 5;
  } else if (st.tech === "hidden-single-box") {
    if (nakedToo) return;
    const { empties, lines } = hatching(s, st.info.unit, d, [t]);
    if (!lines.length) return;
    const mixed = lines.some((l) => l.kind === "row") && lines.some((l) => l.kind === "col");
    score = 6;
    if (empties.length + 1 >= 4 && empties.length + 1 <= 6) score += 3;
    if (mixed) score += 2;
    if (lines.length >= 2 && lines.length <= 4) score += 2;
    if (empty >= 45) score += 2;
    extra = { empties, lines };
  } else if (st.tech === "hidden-single-line") {
    if (nakedToo) return;
    if (s.positions(BOX_UNITS[boxOf(t)], d).length === 1) return;
    const line = UNITS[st.info.unit];
    const others = line.cells.filter((c) => !s.grid[c] && c !== t);
    if (others.length < 2 || others.length > 5) return;
    const reasons = lineReasons(s, line, d, others);
    if (!reasons) return;
    const hasBox = reasons.some((r) => r.via === "box");
    const hasCross = reasons.some((r) => r.via === "cross");
    score = 6 + (hasBox && hasCross ? 3 : 0) + (others.length >= 3 ? 2 : 0) + (line.type === "row" ? 0.5 : 0);
    if (empty >= 40) score += 2;
    if (empty < 30) score -= 4;
    extra = { reasons };
  } else if (st.tech === "naked-single") {
    // Không được đồng thời là "số duy nhất" trong bất kỳ đơn vị nào.
    if (CELL_UNITS[t].some((u) => s.positions(u, d).length === 1)) return;
    const [ru, cu, bu] = CELL_UNITS[t];
    const set = (u: typeof ru) => new Set(u.cells.map((c) => s.grid[c]).filter(Boolean));
    const R = set(ru);
    const C = set(cu);
    const B = set(bu);
    const only = (x: Set<number>, y: Set<number>, z: Set<number>) => [...x].filter((v) => !y.has(v) && !z.has(v)).length;
    const contrib = [only(R, C, B), only(C, R, B), only(B, R, C)];
    score = 6 + contrib.filter((v) => v > 0).length * 2 + (empty >= 40 ? 1 : 0);
  }
  offer({ score, tech: st.tech, state: s, step: st, puzzle, solution, carried: false, extra });
}

// ---------- kết quả tiếp theo sau khi loại ----------

function followUp(s: State, st: Step): Step | null {
  const before = new Set(allSingles(s).flatMap((x) => x.places.map(([c, d]) => key(c, d))));
  const t = s.clone();
  t.apply(st);
  const after = allSingles(t).filter((x) => !before.has(key(...x.places[0])));
  if (!after.length) return null;
  const elimCells = new Set(st.elims.map(([c]) => c));
  const elimKeys = new Set(st.elims.map(([c, d]) => key(c, d)));
  const rank = (x: Step) => {
    const [c, d] = x.places[0];
    if (x.tech === "naked-single" && elimCells.has(c)) return 0;
    if (x.tech !== "naked-single") {
      const u = UNITS[x.info.unit];
      if (u.cells.some((e) => elimKeys.has(key(e, d)))) return x.tech === "hidden-single-box" ? 1 : 2;
    }
    return 5;
  };
  after.sort((p, q) => rank(p) - rank(q));
  return rank(after[0]) < 5 ? after[0] : null;
}

function scoreAdvanced(s: State, st: Step, puzzle: number[], solution: number[]) {
  const pure = isPure(s);
  const follow = followUp(s, st);
  let score = 0;
  if (follow) score += 10;
  if (LEVEL2.includes(st.tech)) score += pure ? 8 : 0;
  else score += pure ? 2 : 0;
  const ne = st.elims.length;
  if (ne >= 1 && ne <= 4) score += 2;
  if (ne > 6) score -= 2;
  // Ưu tiên bàn cờ ở giữa ván: đủ số cho sẵn để dễ nhìn, chưa kín số đã điền.
  score -= Math.abs(s.emptyCount() - 36) / 6;
  if (totalCands(s) > 130) score -= 2;
  const i = st.info;
  switch (st.tech) {
    case "naked-pair":
    case "naked-triple":
      if (i.units.length === 1) score += 1;
      if (st.tech === "naked-triple" && i.cells.some((c: number) => popcount(s.cands[c]) === 2)) score += 2;
      break;
    case "hidden-pair":
    case "hidden-triple": {
      const empties = UNITS[i.unit].cells.filter((c) => !s.grid[c]).length;
      if (empties >= i.cells.length + 3) score += 2;
      break;
    }
    case "x-wing":
    case "swordfish":
      if (UNITS[i.bases[0]].type === "row") score += 1;
      break;
    case "simple-coloring":
      if (i.rule === "trap") score += 2;
      // Chuỗi đủ dài mới thể hiện được ý tưởng tô màu (chuỗi 4 ô chỉ là toà nhà/cánh diều).
      if (i.A.length + i.B.length >= 6 && i.A.length + i.B.length <= 10) score += 4;
      break;
    case "xy-chain":
      score -= i.chain.length;
      break;
    case "unique-rectangle":
      break;
  }
  offer({ score, tech: st.tech, state: s, step: st, puzzle, solution, carried: !pure, extra: { follow } });
}

// ---------- tạo khung minh hoạ ----------

const mark = (cs: number[], d: number, color: Color): CandMark[] => cs.map((c) => [c, d, color]);
const tint = (cs: number[], color: Color): [number, Color][] => cs.map((c) => [c, color]);
const elimMarks = (st: Step): [number, number][] => st.elims.map(([c, d]) => [c, d]);
const elimCells = (st: Step) => [...new Set(st.elims.map(([c]) => c))];
const elimsText = (st: Step) => {
  const byDigit = new Map<number, number[]>();
  for (const [c, d] of st.elims) byDigit.set(d, [...(byDigit.get(d) ?? []), c]);
  // Gộp các số bị loại khỏi cùng một nhóm ô: "2 và 4 khỏi H3C6".
  const byCells = new Map<string, { ds: number[]; cs: number[] }>();
  for (const [d, cs] of byDigit) {
    const k = cs.join(",");
    const g = byCells.get(k) ?? { ds: [], cs };
    g.ds.push(d);
    byCells.set(k, g);
  }
  return joinVi([...byCells.values()].map((g) => `${nums(g.ds)} khỏi ${cells(g.cs)}`), "và");
};

function followFrame(prev: Frame, follow: Step | null): Frame[] {
  if (!follow) return [];
  const [c, d] = follow.places[0];
  let text: string;
  let units: number[] = [];
  if (follow.tech === "naked-single") {
    text = `Sau khi loại, ô ${cn(c)} chỉ còn đúng một ứng viên là ${b(d)} → điền ${b(d)}. Phép loại vừa rồi đã mở ra một bước điền số mới.`;
  } else if (follow.tech === "full-house") {
    text = `Sau khi loại, ${un(follow.info.unit)} chỉ còn một ô trống ${cn(c)} → điền ${b(d)}.`;
    units = [follow.info.unit];
  } else {
    text = `Sau khi loại, trong ${un(follow.info.unit)} số ${b(d)} chỉ còn một chỗ duy nhất là ${cn(c)} → điền ${b(d)}.`;
    units = [follow.info.unit];
  }
  return [
    {
      title: "Điền số",
      text,
      cells: [[c, "focus"]],
      cands: [[c, d, "pattern"]],
      elims: prev.elims,
      places: [[c, d]],
      units,
    },
  ];
}

function framesFor(cand: Candidate): Frame[] {
  const s = cand.state;
  const st = cand.step;
  const i = st.info;
  const follow = (cand.extra?.follow as Step | null) ?? null;
  const E = elimMarks(st);
  const Ec = elimCells(st);

  switch (st.tech) {
    case "full-house": {
      const u = UNITS[i.unit];
      const present = u.cells.filter((c) => s.grid[c]).map((c) => s.grid[c]).sort();
      const others = u.cells.filter((c) => c !== i.cell);
      return [
        {
          title: "Tìm đơn vị gần đầy",
          text: `${cap(un(u))} đã có 8 số, chỉ còn trống đúng một ô là ${cn(i.cell)}.`,
          units: [u.id],
          cells: [...tint(others, "unit"), [i.cell, "focus"]],
        },
        {
          title: "Điền số còn thiếu",
          text: `Đánh dấu các số đã có trong ${un(u)}: ${present.join(", ")}. Số duy nhất còn thiếu là ${b(i.digit)}, vậy ${cn(i.cell)} = ${b(i.digit)}.`,
          units: [u.id],
          cells: [...tint(others, "pattern"), [i.cell, "focus"]],
          places: [[i.cell, i.digit]],
          tally: { label: `Các số trong ${un(u)}`, seen: present, missing: [i.digit] },
        },
      ];
    }
    case "hidden-single-box": {
      const box = UNITS[i.unit];
      const { empties, lines } = cand.extra as ReturnType<typeof hatching>;
      const d = i.digit as number;
      const allD = s.grid.map((v, c) => (v === d ? c : -1)).filter((c) => c >= 0);
      const rays = hatchRays(box.id, lines);
      const srcs = lines.map((l) => l.src);
      const srcText = joinVi(lines.map((l) => `${cn(l.src)} (chặn ${l.kind === "row" ? "hàng" : "cột"} ${l.idx + 1})`));
      return [
        {
          title: "Chọn một khối và một số",
          text: `Xét số ${b(d)} trong ${un(box)}. Khối này chưa có số ${d} và còn ${empties.length + 1} ô trống. Các số ${d} đã có trên bàn được tô xanh.`,
          units: [box.id],
          cells: [...tint(allD, "pattern"), ...tint([...empties, i.cell], "unit")],
        },
        {
          title: "Quét tia",
          text: `Mỗi số ${d} chiếu một tia dọc theo hàng và cột của nó: ô trống nằm trên tia không thể là ${d} nữa. Các số ${d} được khoanh tròn ở ${srcText} chặn ${empties.length} ô trống của ${un(box)} (đánh dấu ×), chỉ chừa lại một ô.`,
          units: [box.id],
          cells: [...tint(srcs, "pattern"), ...tint(empties, "blocked"), [i.cell, "focus"]],
          rings: srcs,
          lines: rays,
        },
        {
          title: "Điền số",
          text: `Ô duy nhất không bị tia nào chạm tới là ${cn(i.cell)}, nên số ${d} của ${un(box)} phải nằm ở đó → ${cn(i.cell)} = ${b(d)}.`,
          units: [box.id],
          cells: [...tint(srcs, "pattern"), ...tint(empties, "blocked"), [i.cell, "focus"]],
          rings: srcs,
          lines: rays,
          places: [[i.cell, d]],
        },
      ];
    }
    case "hidden-single-line": {
      const line = UNITS[i.unit];
      const d = i.digit as number;
      const reasons = (cand.extra as { reasons: { cell: number; via: "cross" | "box"; src: number }[] }).reasons;
      const crossName = line.type === "row" ? "cột" : "hàng";
      const others = reasons.map((r) => r.cell);
      const rays: Line[] = reasons.map((r) => ({ a: [r.src, 0], b: [r.cell, 0], kind: "ray" }));
      const boxUnits = [...new Set(reasons.filter((r) => r.via === "box").map((r) => 18 + boxOf(r.cell)))];
      const why = reasons
        .map((r) =>
          r.via === "cross"
            ? `${cn(r.cell)} bị chặn vì ${crossName} ${(line.type === "row" ? colOf(r.cell) : rowOf(r.cell)) + 1} đã có ${d} (ở ${cn(r.src)})`
            : `${cn(r.cell)} bị chặn vì khối ${boxOf(r.cell) + 1} đã có ${d} (ở ${cn(r.src)})`,
        )
        .join("; ");
      const srcs = [...new Set(reasons.map((r) => r.src))];
      return [
        {
          title: "Chọn một hàng/cột và một số",
          text: `Xét số ${b(d)} trong ${un(line)}. ${cap(un(line))} chưa có số ${d} và còn ${others.length + 1} ô trống.`,
          units: [line.id],
          cells: tint([...others, i.cell], "unit"),
        },
        {
          title: "Loại từng ô",
          text: `Kiểm tra từng ô trống: ${why}. Mỗi mũi tên đi từ số gây chặn (khoanh tròn) tới ô bị chặn.`,
          units: [line.id, ...boxUnits],
          cells: [...tint(srcs, "pattern"), ...tint(others, "blocked"), [i.cell, "focus"]],
          rings: srcs,
          lines: rays,
        },
        {
          title: "Điền số",
          text: `Trong ${un(line)}, chỉ còn ${cn(i.cell)} nhận được số ${d} → ${cn(i.cell)} = ${b(d)}.`,
          units: [line.id],
          cells: [...tint(srcs, "pattern"), ...tint(others, "blocked"), [i.cell, "focus"]],
          rings: srcs,
          lines: rays,
          places: [[i.cell, d]],
        },
      ];
    }
    case "naked-single": {
      const [ru, cu, bu] = CELL_UNITS[i.cell];
      const has_ = (u: typeof ru) =>
        u.cells
          .map((c) => s.grid[c])
          .filter(Boolean)
          .sort();
      const filledPeers = [...new Set([...ru.cells, ...cu.cells, ...bu.cells].filter((c) => s.grid[c]))];
      const all = [...new Set([...has_(ru), ...has_(cu), ...has_(bu)])].sort();
      const tally = { label: `Các số ${cn(i.cell)} nhìn thấy`, seen: all, missing: [i.digit as number] };
      return [
        {
          title: "Chọn một ô",
          text: `Xét ô ${cn(i.cell)}. Ô này cùng lúc thuộc ${un(ru)}, ${un(cu)} và ${un(bu)} — ba đơn vị mà nó "nhìn thấy".`,
          units: [ru.id, cu.id, bu.id],
          cells: [[i.cell, "focus"]],
        },
        {
          title: "Gom các số đã thấy",
          text: `${cap(un(ru))} có ${has_(ru).join(", ")}; ${un(cu)} có ${has_(cu).join(", ")}; ${un(bu)} có ${has_(bu).join(", ")}. Gạch các số này trên dải 1–9: được 8 số khác nhau.`,
          units: [ru.id, cu.id, bu.id],
          cells: [...tint(filledPeers, "pattern"), [i.cell, "focus"]],
          tally,
        },
        {
          title: "Điền số",
          text: `Chỉ còn thiếu số ${b(i.digit)} → ${cn(i.cell)} = ${b(i.digit)}. Ô này không cần so sánh với ô nào khác: nó chỉ còn đúng một khả năng.`,
          units: [ru.id, cu.id, bu.id],
          cells: [...tint(filledPeers, "pattern"), [i.cell, "focus"]],
          places: [[i.cell, i.digit]],
          tally,
        },
      ];
    }
    case "pointing":
    case "claiming": {
      const d = i.digit as number;
      const box = UNITS[i.box];
      const line = UNITS[i.line];
      const pattern = i.cells as number[];
      // Vì sao số d chỉ còn ở các ô này: các ô còn lại bị số d khác chặn.
      let blockedCells: number[] = [];
      let rays: Line[] = [];
      let srcs: number[] = [];
      if (st.tech === "pointing") {
        const h = hatching(s, box.id, d, pattern);
        if (h.lines.length && h.empties.length) {
          blockedCells = h.empties;
          rays = hatchRays(box.id, h.lines);
          srcs = h.lines.map((l) => l.src);
        }
      } else {
        const others = line.cells.filter((c) => !s.grid[c] && !pattern.includes(c));
        const reasons = lineReasons(s, line, d, others);
        if (reasons && reasons.length) {
          blockedCells = others;
          rays = reasons.map((r) => ({ a: [r.src, 0], b: [r.cell, 0], kind: "ray" }));
          srcs = [...new Set(reasons.map((r) => r.src))];
        }
      }
      const whyText = srcs.length
        ? ` Các ô trống khác đều bị số ${d} ở ${cells(srcs)} (khoanh tròn) chặn.`
        : "";
      // Tia "chỉ hướng": từ nhóm ô bị khoá, dọc theo đơn vị cần dọn, tới ô bị loại xa nhất mỗi phía.
      const sweepUnit = st.tech === "pointing" ? line : box;
      const order = sweepUnit.cells;
      const pIdx = pattern.map((c) => order.indexOf(c));
      const sweep: Line[] = [];
      if (st.tech === "pointing") {
        const lo = Math.min(...pIdx);
        const hi = Math.max(...pIdx);
        const before = Ec.filter((c) => order.indexOf(c) < lo);
        const after = Ec.filter((c) => order.indexOf(c) > hi);
        if (before.length) sweep.push({ a: [order[lo], 0], b: [before.reduce((m, c) => (order.indexOf(c) < order.indexOf(m) ? c : m)), 0], kind: "ray" });
        if (after.length) sweep.push({ a: [order[hi], 0], b: [after.reduce((m, c) => (order.indexOf(c) > order.indexOf(m) ? c : m)), 0], kind: "ray" });
      }
      const first: Frame =
        st.tech === "pointing"
          ? {
              title: "Số bị khoá trong khối",
              text: `Không còn ô nào điền được ngay. Nhìn số ${b(d)} trong ${un(box)}: nó chỉ có thể nằm ở ${cells(pattern)} — tất cả đều thuộc ${un(line)}.${whyText}`,
              units: [box.id],
              cands: mark(pattern, d, "pattern"),
              cells: [...tint(srcs, "pattern"), ...tint(blockedCells, "blocked"), ...tint(pattern, "pattern")],
              rings: srcs,
              lines: rays,
            }
          : {
              title: "Số bị khoá trong hàng/cột",
              text: `Không còn ô nào điền được ngay. Nhìn số ${b(d)} trong ${un(line)}: nó chỉ có thể nằm ở ${cells(pattern)} — tất cả đều thuộc ${un(box)}.${whyText}`,
              units: [line.id],
              cands: mark(pattern, d, "pattern"),
              cells: [...tint(srcs, "pattern"), ...tint(blockedCells, "blocked"), ...tint(pattern, "pattern")],
              rings: srcs,
              lines: rays,
            };
      const second: Frame =
        st.tech === "pointing"
          ? {
              title: "Loại ứng viên",
              text: `Dù ${d} rơi vào ô nào trong số đó, số ${d} của ${un(line)} chắc chắn nằm bên trong ${un(box)}. Nhóm ô này "chỉ" dọc theo ${un(line)} (mũi tên) và chặn phần còn lại: loại ${elimsText(st)}.`,
              units: [box.id, line.id],
              cands: mark(pattern, d, "pattern"),
              cells: [...tint(pattern, "pattern"), ...tint(Ec, "elim")],
              lines: sweep,
              elims: E,
            }
          : {
              title: "Loại ứng viên",
              text: `Số ${d} của ${un(box)} vì thế buộc phải nằm trên ${un(line)}, trong nhóm ô tô xanh. Các ô khác của ${un(box)} không thể là ${d}: loại ${elimsText(st)}.`,
              units: [box.id, line.id],
              cands: mark(pattern, d, "pattern"),
              cells: [...tint(pattern, "pattern"), ...tint(Ec, "elim")],
              elims: E,
            };
      return [first, second, ...followFrame(second, follow)];
    }
    case "naked-pair":
    case "naked-triple": {
      const ds = i.digits as number[];
      const unitsTxt = joinVi(i.units.map((u: number) => un(u)));
      const pair = st.tech === "naked-pair";
      const partial = !pair && i.cells.some((c: number) => popcount(s.cands[c]) < 3);
      const marks = i.cells.flatMap((c: number) => digitsOf(s.cands[c]).map((d) => [c, d, "pattern"] as CandMark));
      const first: Frame = {
        title: pair ? "Tìm hai ô cùng cặp số" : "Tìm ba ô dùng chung ba số",
        text: pair
          ? `Trong ${un(i.units[0])}, hai ô ${cells(i.cells)} đều chỉ có đúng hai ứng viên ${nums(ds)}.`
          : `Trong ${un(i.units[0])}, ba ô ${cells(i.cells)} chỉ chứa các ứng viên thuộc bộ ${nums(ds)}: ba ô, ba số.${partial ? " Không ô nào bắt buộc phải có đủ cả ba số; chỉ cần gộp lại đúng ba số là đủ." : ""}`,
        units: i.units,
        cells: tint(i.cells, "pattern"),
        cands: marks,
      };
      const second: Frame = {
        title: "Loại ứng viên",
        text: pair
          ? `Hai số ${nums(ds)} sẽ lấp đúng hai ô này (chưa biết ô nào nhận số nào), nên không ô nào khác trong ${unitsTxt} được chứa chúng: loại ${elimsText(st)}.`
          : `Ba số ${nums(ds)} sẽ lấp đúng ba ô này, nên không ô nào khác trong ${unitsTxt} được chứa chúng: loại ${elimsText(st)}.`,
        units: i.units,
        cells: [...tint(i.cells, "pattern"), ...tint(Ec, "elim")],
        cands: marks,
        elims: E,
      };
      return [first, second, ...followFrame(second, follow)];
    }
    case "hidden-pair":
    case "hidden-triple": {
      const ds = i.digits as number[];
      const pair = st.tech === "hidden-pair";
      const u = UNITS[i.unit];
      const marks = i.cells.flatMap((c: number) => ds.filter((d) => has(s.cands[c], d)).map((d) => [c, d, "pattern"] as CandMark));
      const first: Frame = {
        title: pair ? "Tìm hai số chỉ có hai chỗ" : "Tìm ba số chỉ có ba chỗ",
        text: pair
          ? `Trong ${un(u)}, số ${b(ds[0])} chỉ có thể ở ${cells(i.cells)}; số ${b(ds[1])} cũng chỉ có thể ở đúng hai ô đó.`
          : `Trong ${un(u)}, ba số ${nums(ds)} chỉ xuất hiện trong ba ô ${cells(i.cells)}.`,
        units: [u.id],
        cells: tint(i.cells, "pattern"),
        cands: marks,
      };
      const second: Frame = {
        title: "Dọn ứng viên thừa",
        text: pair
          ? `Hai ô này phải dành cho ${nums(ds)}, nên mọi ứng viên khác trong chúng đều bị loại: loại ${elimsText(st)}. Cặp ẩn giờ trở thành cặp lộ.`
          : `Ba ô này phải dành cho ${nums(ds)}, nên mọi ứng viên khác trong chúng đều bị loại: loại ${elimsText(st)}.`,
        units: [u.id],
        cells: tint(i.cells, "pattern"),
        cands: marks,
        elims: E,
      };
      return [first, second, ...followFrame(second, follow)];
    }
    case "x-wing":
    case "swordfish": {
      const d = i.digit as number;
      const bases = i.bases.map((u: number) => UNITS[u]);
      const covers = i.covers.map((u: number) => UNITS[u]);
      const baseWord = bases[0].type === "row" ? "hàng" : "cột";
      const coverWord = covers[0].type === "row" ? "hàng" : "cột";
      const pattern = i.cells as number[];
      const strong: Line[] = [];
      for (const bu of bases) {
        const cs = pattern.filter((c) => bu.cells.includes(c));
        for (let k = 0; k + 1 < cs.length; k++) strong.push({ a: [cs[k], d], b: [cs[k + 1], d], kind: "strong" });
      }
      const coverIdx = covers.map((u: (typeof UNITS)[number]) => u.index + 1);
      // Đường nhìn từ ô bị loại tới các ô mẫu hình nằm cùng đơn vị phủ.
      const coverSight = sightLines(E, (c) =>
        pattern.filter((x) => covers.some((u: (typeof UNITS)[number]) => u.cells.includes(x) && u.cells.includes(c))).map((x) => [x, d] as [number, number]),
      );
      const baseIdx = bases.map((u: (typeof UNITS)[number]) => u.index + 1);
      if (st.tech === "x-wing") {
        const [p, q] = bases.map((bu: (typeof UNITS)[number]) => pattern.filter((c) => bu.cells.includes(c)));
        const diagA = [p[0], q[1]];
        const diagB = [p[1], q[0]];
        const first: Frame = {
          title: "Hai " + baseWord + " giống nhau",
          text: `Số ${b(d)} trong ${baseWord} ${baseIdx[0]} chỉ có thể ở ${cells(p)}; trong ${baseWord} ${baseIdx[1]} cũng chỉ ở ${cells(q)} — cùng hai ${coverWord} ${joinVi(coverIdx)}.`,
          units: bases.map((u: (typeof UNITS)[number]) => u.id),
          cells: tint(pattern, "pattern"),
          cands: mark(pattern, d, "pattern"),
          lines: strong,
        };
        const second: Frame = {
          title: "Chỉ có hai khả năng",
          text: `Mỗi ${baseWord} cần đúng một số ${d}, và hai số này phải nằm ở hai ${coverWord} khác nhau. Vậy chỉ có hai cách: ${d} ở ${cells(diagA)} (màu xanh), hoặc ở ${cells(diagB)} (màu cam). Cách nào thì ${coverWord} ${joinVi(coverIdx)} cũng đã có ${d} nằm trong bốn góc này.`,
          units: covers.map((u: (typeof UNITS)[number]) => u.id),
          cells: [...tint(diagA, "colorA"), ...tint(diagB, "colorB")],
          cands: [...mark(diagA, d, "colorA"), ...mark(diagB, d, "colorB")],
          lines: strong,
        };
        const third: Frame = {
          title: "Loại ứng viên",
          text: `Vì thế mọi ô khác trên ${coverWord} ${joinVi(coverIdx)} không thể là ${d}: mỗi ô bị loại nhìn thấy hai góc cùng ${coverWord} (đường chấm), mà một trong hai góc chắc chắn là ${d}. Loại ${elimsText(st)}.`,
          units: covers.map((u: (typeof UNITS)[number]) => u.id),
          cells: [...tint(pattern, "pattern"), ...tint(Ec, "elim")],
          cands: mark(pattern, d, "pattern"),
          lines: [...strong, ...coverSight],
          elims: E,
        };
        return [first, second, third, ...followFrame(third, follow)];
      }
      const first: Frame = {
        title: "Ba " + baseWord + ", ba " + coverWord,
        text: `Số ${b(d)} trong ${baseWord} ${joinVi(baseIdx)} chỉ nằm trong ba ${coverWord} ${joinVi(coverIdx)} (mỗi ${baseWord} có 2 hoặc 3 chỗ).`,
        units: bases.map((u: (typeof UNITS)[number]) => u.id),
        cells: tint(pattern, "pattern"),
        cands: mark(pattern, d, "pattern"),
        lines: strong,
      };
      const second: Frame = {
        title: "Ba số chiếm trọn ba " + coverWord,
        text: `Ba ${baseWord} này cần ba số ${d}, mỗi số một ${coverWord} khác nhau. Vì chỉ có ba ${coverWord} để chọn, mỗi ${coverWord} ${joinVi(coverIdx)} sẽ nhận đúng một số ${d} từ ba ${baseWord} trên.`,
        units: covers.map((u: (typeof UNITS)[number]) => u.id),
        cells: tint(pattern, "pattern"),
        cands: mark(pattern, d, "pattern"),
        lines: strong,
      };
      const third: Frame = {
        title: "Loại ứng viên",
        text: `Các ô khác trên ${coverWord} ${joinVi(coverIdx)} không còn chỗ cho ${d}: ${coverWord} của chúng đã dành ${d} cho các ô của mẫu hình (đường chấm). Loại ${elimsText(st)}.`,
        units: covers.map((u: (typeof UNITS)[number]) => u.id),
        cells: [...tint(pattern, "pattern"), ...tint(Ec, "elim")],
        cands: mark(pattern, d, "pattern"),
        lines: [...strong, ...coverSight],
        elims: E,
      };
      return [first, second, third, ...followFrame(third, follow)];
    }
    case "skyscraper": {
      const d = i.digit as number;
      const [l1, l2] = i.lines.map((u: number) => UNITS[u]);
      const [bA, bB] = i.bases as number[];
      const [tA, tB] = i.tops as number[];
      const crossName = l1.type === "row" ? `cột ${colOf(bA) + 1}` : `hàng ${rowOf(bA) + 1}`;
      const pattern = [bA, tA, bB, tB];
      const strong: Line[] = [
        { a: [bA, d], b: [tA, d], kind: "strong" },
        { a: [bB, d], b: [tB, d], kind: "strong" },
      ];
      const first: Frame = {
        title: "Hai liên kết mạnh",
        text: `Số ${b(d)} trong ${un(l1)} chỉ có hai chỗ: ${cn(bA)} và ${cn(tA)}. Trong ${un(l2)} cũng chỉ có hai chỗ: ${cn(bB)} và ${cn(tB)}. Mỗi cặp là một liên kết mạnh: nếu ô này không phải ${d} thì ô kia chắc chắn là ${d}.`,
        units: [l1.id, l2.id],
        cells: tint(pattern, "pattern"),
        cands: mark(pattern, d, "pattern"),
        lines: strong,
      };
      const second: Frame = {
        title: "Chung một chân",
        text: `${cn(bA)} và ${cn(bB)} cùng nằm trên ${crossName} (chân "toà nhà") nên nhiều nhất một ô là ${d}. Ô chân nào không phải ${d} thì đỉnh cùng hàng/cột với nó là ${d}. Suy ra ít nhất một trong hai đỉnh ${cn(tA)}, ${cn(tB)} là ${d}.`,
        cells: [...tint([bA, bB], "pattern"), ...tint([tA, tB], "colorA")],
        cands: [...mark([bA, bB], d, "pattern"), ...mark([tA, tB], d, "colorA")],
        lines: [...strong, { a: [bA, d], b: [bB, d], kind: "weak" }],
      };
      const third: Frame = {
        title: "Loại ứng viên",
        text: `Ô nào nhìn thấy cả hai đỉnh (đường chấm) đều không thể là ${d}: loại ${elimsText(st)}.`,
        cells: [...tint([bA, bB], "pattern"), ...tint([tA, tB], "colorA"), ...tint(Ec, "elim")],
        cands: [...mark([bA, bB], d, "pattern"), ...mark([tA, tB], d, "colorA")],
        lines: [...strong, { a: [bA, d], b: [bB, d], kind: "weak" }, ...sightLines(E, () => [[tA, d], [tB, d]])],
        elims: E,
      };
      return [first, second, third, ...followFrame(third, follow)];
    }
    case "two-string-kite": {
      const d = i.digit as number;
      const [rx, rEnd] = i.rowCells as number[];
      const [cy, cEnd] = i.colCells as number[];
      const pattern = [rx, rEnd, cy, cEnd];
      const strong: Line[] = [
        { a: [rx, d], b: [rEnd, d], kind: "strong" },
        { a: [cy, d], b: [cEnd, d], kind: "strong" },
      ];
      const first: Frame = {
        title: "Hai sợi dây",
        text: `Số ${b(d)} trong ${un(i.row)} chỉ có hai chỗ: ${cn(rx)} và ${cn(rEnd)}. Trong ${un(i.col)} cũng chỉ có hai chỗ: ${cn(cy)} và ${cn(cEnd)}.`,
        units: [i.row, i.col],
        cells: tint(pattern, "pattern"),
        cands: mark(pattern, d, "pattern"),
        lines: strong,
      };
      const second: Frame = {
        title: "Nút thắt trong một khối",
        text: `${cn(rx)} và ${cn(cy)} cùng nằm trong ${un(i.box)} nên không thể cùng là ${d}. Ô nào trong hai ô này không phải ${d} thì đầu dây bên kia là ${d}. Vậy ít nhất một trong hai đầu ${cn(rEnd)}, ${cn(cEnd)} là ${d}.`,
        units: [i.box],
        cells: [...tint([rx, cy], "pattern"), ...tint([rEnd, cEnd], "colorA")],
        cands: [...mark([rx, cy], d, "pattern"), ...mark([rEnd, cEnd], d, "colorA")],
        lines: [...strong, { a: [rx, d], b: [cy, d], kind: "weak" }],
      };
      const third: Frame = {
        title: "Loại ứng viên",
        text: `Ô nhìn thấy cả hai đầu dây (đường chấm) không thể là ${d}: loại ${elimsText(st)}.`,
        cells: [...tint([rx, cy], "pattern"), ...tint([rEnd, cEnd], "colorA"), ...tint(Ec, "elim")],
        cands: [...mark([rx, cy], d, "pattern"), ...mark([rEnd, cEnd], d, "colorA")],
        lines: [...strong, { a: [rx, d], b: [cy, d], kind: "weak" }, ...sightLines(E, () => [[rEnd, d], [cEnd, d]])],
        elims: E,
      };
      return [first, second, third, ...followFrame(third, follow)];
    }
    case "xy-wing":
    case "xyz-wing": {
      const { pivot: P, x, y, z } = i;
      const [A, B] = i.pincers as number[];
      const xyz = st.tech === "xyz-wing";
      const marks: CandMark[] = [
        ...digitsOf(s.cands[P]).map((d) => [P, d, "pattern"] as CandMark),
        [A, x, "pattern"],
        [A, z, "colorA"],
        [B, y, "pattern"],
        [B, z, "colorA"],
      ];
      if (xyz) marks.push([P, z, "colorA"]);
      const links: Line[] = [
        { a: [P, x], b: [A, x], kind: "weak" },
        { a: [P, y], b: [B, y], kind: "weak" },
      ];
      const cellsT: [number, Color][] = [[P, "focus"], ...tint([A, B], "pattern")];
      const first: Frame = {
        title: "Trục và hai càng",
        text: xyz
          ? `Ô trục ${cn(P)} có ba ứng viên ${nums([x, y, z].sort())}. Nó nhìn thấy hai "càng": ${cn(A)} (${x}, ${z}) và ${cn(B)} (${y}, ${z}).`
          : `Ô trục ${cn(P)} có đúng hai ứng viên ${nums([x, y])}. Nó nhìn thấy hai "càng": ${cn(A)} (${x}, ${z}) và ${cn(B)} (${y}, ${z}).`,
        cells: cellsT,
        cands: marks,
      };
      const second: Frame = {
        title: "Xét mọi khả năng của trục",
        text: xyz
          ? `Nếu ${cn(P)} = ${x} thì ${cn(A)} = ${z}. Nếu ${cn(P)} = ${y} thì ${cn(B)} = ${z}. Nếu ${cn(P)} = ${z} thì chính trục là ${z}. Vậy số ${b(z)} chắc chắn nằm ở một trong ba ô.`
          : `Nếu ${cn(P)} = ${x} thì ${cn(A)} phải là ${z}. Nếu ${cn(P)} = ${y} thì ${cn(B)} phải là ${z}. Dù trục nhận số nào, ít nhất một càng là ${b(z)}.`,
        cells: cellsT,
        cands: marks,
        lines: links,
      };
      const third: Frame = {
        title: "Loại ứng viên",
        text: xyz
          ? `Ô nhìn thấy cả ba ô — trục và hai càng (đường chấm) — không thể là ${z}: loại ${elimsText(st)}.`
          : `Ô nhìn thấy cả hai càng (đường chấm) không thể là ${z}: loại ${elimsText(st)}.`,
        cells: [...cellsT, ...tint(Ec, "elim")],
        cands: marks,
        lines: [...links, ...sightLines(E, () => (xyz ? [[P, z], [A, z], [B, z]] : [[A, z], [B, z]]))],
        elims: E,
      };
      return [first, second, third, ...followFrame(third, follow)];
    }
    case "w-wing": {
      const [A, B] = i.cells as number[];
      const { x, y } = i;
      const [L1, L2] = i.link as number[];
      const marks: CandMark[] = [
        [A, x, "pattern"],
        [A, y, "colorA"],
        [B, x, "pattern"],
        [B, y, "colorA"],
        [L1, x, "pattern2"],
        [L2, x, "pattern2"],
      ];
      const first: Frame = {
        title: "Hai ô giống hệt nhau",
        text: `${cn(A)} và ${cn(B)} có cùng cặp ứng viên ${nums([x, y].sort())} nhưng không nhìn thấy nhau, nên chưa phải cặp lộ.`,
        cells: tint([A, B], "pattern"),
        cands: marks.slice(0, 4),
      };
      const links: Line[] = [
        { a: [L1, x], b: [L2, x], kind: "strong" },
        { a: [A, x], b: [L1, x], kind: "weak" },
        { a: [B, x], b: [L2, x], kind: "weak" },
      ];
      const second: Frame = {
        title: "Cây cầu nối",
        text: `Trong ${un(i.linkUnit)}, số ${b(x)} chỉ có hai chỗ: ${cn(L1)} và ${cn(L2)}. ${cn(L1)} nhìn thấy ${cn(A)}, còn ${cn(L2)} nhìn thấy ${cn(B)}.`,
        units: [i.linkUnit],
        cells: [...tint([A, B], "pattern"), ...tint([L1, L2], "pattern2")],
        cands: marks,
        lines: links,
      };
      const third: Frame = {
        title: "Loại ứng viên",
        text: `Giả sử ${cn(A)} không phải ${y} → ${cn(A)} = ${x} → ${cn(L1)} ≠ ${x} → ${cn(L2)} = ${x} → ${cn(B)} ≠ ${x} → ${cn(B)} = ${y}. Vậy ít nhất một trong hai ô là ${b(y)}. Ô nhìn thấy cả hai (đường chấm) bị loại: ${elimsText(st)}.`,
        units: [i.linkUnit],
        cells: [...tint([A, B], "pattern"), ...tint([L1, L2], "pattern2"), ...tint(Ec, "elim")],
        cands: marks,
        lines: [...links, ...sightLines(E, () => [[A, y], [B, y]])],
        elims: E,
      };
      return [first, second, third, ...followFrame(third, follow)];
    }
    case "simple-coloring": {
      const d = i.digit as number;
      const A = i.A as number[];
      const Bc = i.B as number[];
      const all = [...A, ...Bc];
      const links: Line[] = (i.edges as [number, number][]).map(([p, q]) => ({ a: [p, d], b: [q, d], kind: "strong" }));
      const first: Frame = {
        title: "Nối các liên kết mạnh",
        text: `Với số ${b(d)}, tìm các đơn vị chỉ còn đúng hai chỗ cho ${d} và nối hai chỗ đó lại. Các liên kết nối tiếp nhau thành một chuỗi ${all.length} ô.`,
        cells: tint(all, "pattern"),
        cands: mark(all, d, "pattern"),
        lines: links,
      };
      const second: Frame = {
        title: "Tô hai màu xen kẽ",
        text: `Trong mỗi liên kết, đúng một đầu là ${d}. Tô xen kẽ xanh – cam dọc chuỗi, ta có: hoặc mọi ô xanh là ${d}, hoặc mọi ô cam là ${d}.`,
        cells: [...tint(A, "colorA"), ...tint(Bc, "colorB")],
        cands: [...mark(A, d, "colorA"), ...mark(Bc, d, "colorB")],
        lines: links,
      };
      if (i.rule === "trap") {
        const traps = i.traps as { cell: number; a: number; b: number }[];
        const t0 = traps[0];
        const third: Frame = {
          title: "Bẫy giữa hai màu",
          text: `${cn(t0.cell)} nhìn thấy cả ô xanh ${cn(t0.a)} lẫn ô cam ${cn(t0.b)} (đường chấm). Màu nào đúng thì ô này cũng thấy một số ${d}, nên không thể là ${d}. Loại ${elimsText(st)}.`,
          cells: [...tint(A, "colorA"), ...tint(Bc, "colorB"), ...tint(Ec, "elim")],
          cands: [...mark(A, d, "colorA"), ...mark(Bc, d, "colorB")],
          lines: [
            ...links,
            ...traps.flatMap((t) => [
              { a: [t.cell, d], b: [t.a, d], kind: "sight" } as Line,
              { a: [t.cell, d], b: [t.b, d], kind: "sight" } as Line,
            ]),
          ],
          elims: E,
        };
        return [first, second, third, ...followFrame(third, follow)];
      }
      const bad = i.bad === "A" ? A : Bc;
      const good = i.bad === "A" ? Bc : A;
      const badName = i.bad === "A" ? "xanh" : "cam";
      const [c1, c2] = i.clash as number[];
      const third: Frame = {
        title: "Một màu tự mâu thuẫn",
        text: `Hai ô ${badName} ${cn(c1)} và ${cn(c2)} lại nhìn thấy nhau — không thể cùng là ${d}. Vậy màu ${badName} sai: loại ${d} khỏi mọi ô ${badName}, và mọi ô màu còn lại chính là ${d}.`,
        cells: [...tint(bad, "elim"), ...tint(good, i.bad === "A" ? "colorB" : "colorA")],
        cands: mark(good, d, i.bad === "A" ? "colorB" : "colorA"),
        lines: links,
        elims: bad.map((c) => [c, d]),
        places: good.map((c) => [c, d]),
      };
      return [first, second, third];
    }
    case "unique-rectangle": {
      const [x, y] = i.digits as number[];
      const roof = i.roof as number;
      const floor = i.floor as number[];
      const marks: CandMark[] = [...floor.flatMap((c) => [[c, x, "pattern"], [c, y, "pattern"]] as CandMark[]), [roof, x, "colorA"], [roof, y, "colorA"]];
      const first: Frame = {
        title: "Hình chữ nhật trên hai khối",
        text: `Bốn ô ${cells(i.cells)} tạo thành một hình chữ nhật nằm gọn trên 2 hàng, 2 cột và 2 khối. Ba ô trong đó chỉ có đúng hai ứng viên ${nums([x, y])}.`,
        cells: [...tint(floor, "pattern"), [roof, "focus"]],
        cands: marks,
      };
      const second: Frame = {
        title: "Mẫu hình chết",
        text: `Nếu ô thứ tư ${cn(roof)} cũng chỉ còn ${x} hoặc ${y}, ta có thể hoán đổi ${x} ↔ ${y} ở cả bốn ô mà bàn cờ vẫn hợp lệ — đề sẽ có hai lời giải. Đề Sudoku chuẩn chỉ có một lời giải, nên điều đó không được xảy ra.`,
        cells: [...tint(floor, "pattern"), [roof, "focus"]],
        cands: marks,
      };
      const third: Frame = {
        title: "Loại ứng viên",
        text: `Vậy ${cn(roof)} không được là ${x} hay ${y}: loại ${elimsText(st)}.`,
        cells: [...tint(floor, "pattern"), [roof, "elim"]],
        cands: marks,
        elims: E,
      };
      return [first, second, third, ...followFrame(third, follow)];
    }
    case "bug-plus-one": {
      const c = i.cell as number;
      const d = i.digit as number;
      const units = CELL_UNITS[c];
      const three = units.flatMap((u) => s.positions(u, d));
      const uniq = [...new Set(three)];
      const bv: number[] = [];
      for (let k = 0; k < 81; k++) if (!s.grid[k] && k !== c) bv.push(k);
      const first: Frame = {
        title: "Gần như toàn ô hai ứng viên",
        text: `Mọi ô trống đều chỉ còn đúng hai ứng viên, trừ ${cn(c)} có ba: ${nums(digitsOf(s.cands[c]))}.`,
        cells: [...tint(bv, "unit"), [c, "focus"]],
      };
      const second: Frame = {
        title: "Tránh bẫy BUG",
        text: `Nếu ${cn(c)} không phải ${d}, mọi số sẽ xuất hiện đúng hai lần trong mỗi hàng, cột, khối — trạng thái "BUG" luôn dẫn tới 0 hoặc từ 2 lời giải trở lên. Số ${b(d)} là số xuất hiện ba lần trong ${un(units[0])}, ${un(units[1])} và ${un(units[2])} của ô này.`,
        units: units.map((u) => u.id),
        cells: [[c, "focus"]],
        cands: mark(uniq, d, "pattern"),
      };
      const third: Frame = {
        title: "Điền số",
        text: `Để đề có đúng một lời giải, ${cn(c)} phải là ${b(d)}.`,
        units: units.map((u) => u.id),
        cells: [[c, "focus"]],
        cands: mark(uniq, d, "pattern"),
        places: [[c, d]],
      };
      return [first, second, third];
    }
    case "xy-chain": {
      const z = i.digit as number;
      const chain = i.chain as { cell: number; from: number; to: number }[];
      const cs = chain.map((l) => l.cell);
      const first = chain[0].cell;
      const last = chain[chain.length - 1].cell;
      const links: Line[] = [];
      chain.forEach((l, k) => {
        links.push({ a: [l.cell, l.from], b: [l.cell, l.to], kind: "strong" });
        if (k > 0) links.push({ a: [chain[k - 1].cell, chain[k - 1].to], b: [l.cell, l.from], kind: "weak" });
      });
      const marks: CandMark[] = chain.flatMap((l) => [
        [l.cell, l.from, "pattern"],
        [l.cell, l.to, "pattern2"],
      ]);
      marks[0] = [first, z, "colorA"];
      marks[marks.length - 1] = [last, z, "colorA"];
      const walk = chain.map((l) => `${cn(l.cell)} = ${l.to}`).join(" → ");
      const f1: Frame = {
        title: "Chuỗi ô hai ứng viên",
        text: `Chuỗi ${chain.length} ô ${cells(cs)}: mỗi ô chỉ có hai ứng viên, ô sau nhìn thấy ô trước và có chung một số với nó. Hai đầu chuỗi đều chứa ${b(z)}.`,
        cells: tint(cs, "pattern"),
        cands: marks,
        lines: links,
      };
      const f2: Frame = {
        title: "Đi dọc chuỗi",
        text: `Giả sử ${cn(first)} không phải ${z}. Khi đó: ${walk}. Nghĩa là nếu đầu này không phải ${z} thì đầu kia là ${z} — ít nhất một đầu chuỗi là ${b(z)}.`,
        cells: [...tint(cs, "pattern"), ...tint([first, last], "focus")],
        cands: marks,
        lines: links,
      };
      const f3: Frame = {
        title: "Loại ứng viên",
        text: `Ô nhìn thấy cả hai đầu chuỗi (đường chấm) không thể là ${z}: loại ${elimsText(st)}.`,
        cells: [...tint(cs, "pattern"), ...tint([first, last], "focus"), ...tint(Ec, "elim")],
        cands: marks,
        lines: [...links, ...sightLines(E, () => [[first, z], [last, z]])],
        elims: E,
      };
      return [f1, f2, f3, ...followFrame(f3, follow)];
    }
  }
  throw new Error("Chưa có lời giải thích cho " + st.tech);
}

// ---------- tóm tắt cho phần giải mẫu ----------

function summarize(s: State, st: Step): WalkStep {
  const i = st.info;
  const E = elimMarks(st);
  let text = "";
  let cellsT: [number, Color][] = [];
  let cands: CandMark[] = [];
  switch (st.tech) {
    case "full-house":
      text = `${cap(un(i.unit))} chỉ còn một ô trống: ${cn(i.cell)} = ${b(i.digit)}.`;
      cellsT = [...tint(UNITS[i.unit].cells, "unit"), [i.cell, "focus"]];
      break;
    case "hidden-single-box":
    case "hidden-single-line":
      text = `Trong ${un(i.unit)}, số ${b(i.digit)} chỉ còn một chỗ: ${cn(i.cell)}.`;
      cellsT = [...tint(UNITS[i.unit].cells, "unit"), [i.cell, "focus"]];
      break;
    case "naked-single":
      text = `${cn(i.cell)} chỉ còn một ứng viên: ${b(i.digit)}.`;
      cellsT = [[i.cell, "focus"]];
      break;
    case "pointing":
      text = `Số ${b(i.digit)} trong ${un(i.box)} nằm gọn trên ${un(i.line)} → loại ${elimsText(st)}.`;
      cellsT = [...tint(i.cells, "pattern"), ...tint(elimCells(st), "elim")];
      cands = mark(i.cells, i.digit, "pattern");
      break;
    case "claiming":
      text = `Số ${b(i.digit)} trong ${un(i.line)} nằm gọn trong ${un(i.box)} → loại ${elimsText(st)}.`;
      cellsT = [...tint(i.cells, "pattern"), ...tint(elimCells(st), "elim")];
      cands = mark(i.cells, i.digit, "pattern");
      break;
    case "naked-pair":
    case "naked-triple":
    case "naked-quad":
      text = `Bộ lộ ${nums(i.digits)} ở ${cells(i.cells)} → loại ${elimsText(st)}.`;
      cellsT = [...tint(i.cells, "pattern"), ...tint(elimCells(st), "elim")];
      cands = i.cells.flatMap((c: number) => digitsOf(s.cands[c]).map((d) => [c, d, "pattern"] as CandMark));
      break;
    case "hidden-pair":
    case "hidden-triple":
    case "hidden-quad":
      text = `Bộ ẩn ${nums(i.digits)} trong ${un(i.unit)} ở ${cells(i.cells)} → loại ${elimsText(st)}.`;
      cellsT = tint(i.cells, "pattern");
      cands = i.cells.flatMap((c: number) => (i.digits as number[]).filter((d) => has(s.cands[c], d)).map((d) => [c, d, "pattern"] as CandMark));
      break;
    default:
      throw new Error("Giải mẫu không dùng " + st.tech);
  }
  return { tech: st.tech, places: st.places, elims: E, text, cells: cellsT, cands };
}

// ---------- chạy ----------

let walkBest: { score: number; walk: Walkthrough } | null = null;
const t0 = Date.now();

for (let n = 0; n < N; n++) {
  const { puzzle, solution } = makePuzzle(rnd);
  const s = new State(puzzle);
  const trace: WalkStep[] = [];
  let walkOk = true;
  const used = new Set<TechId>();
  for (;;) {
    if (isPure(s)) {
      for (const st of [...findFullHouse(s), ...findHiddenSingleBox(s), ...findHiddenSingleLine(s), ...findNakedSingle(s)])
        scoreLevel1(s, st, solution, puzzle);
    }
    const steps = nextSteps(s);
    if (!steps.length) break;
    const tech = steps[0].tech;
    if (WANTED.includes(tech) && !LEVEL1.includes(tech)) for (const st of steps) scoreAdvanced(s, st, puzzle, solution);
    used.add(tech);
    if (walkOk) {
      if (LEVEL1.includes(tech) || LEVEL2.includes(tech)) trace.push(summarize(s, steps[0]));
      else walkOk = false;
    }
    s.apply(steps[0]);
  }
  if (walkOk && s.emptyCount() === 0) {
    const lvl2 = [...used].filter((t) => LEVEL2.includes(t));
    const score = lvl2.length * 3 + (used.has("naked-single") ? 1 : 0) + (used.has("hidden-single-line") ? 1 : 0) + rnd();
    if (lvl2.length >= 3 && (!walkBest || score > walkBest.score)) {
      walkBest = { score, walk: { puzzle: gridToString(puzzle), solution: gridToString(solution), steps: trace } };
    }
  }
  if (n % 5000 === 4999) console.log(`${n + 1} đề… (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

// ---------- kiểm chứng và ghi file ----------

const examples: Record<string, Example> = {};
for (const tech of WANTED) {
  const cand = best.get(tech);
  if (!cand) {
    console.warn("THIẾU ví dụ cho", tech);
    continue;
  }
  const frames = framesFor(cand);
  for (const f of frames) {
    for (const [c, d] of f.places ?? [])
      if (cand.solution[c] !== d) throw new Error(`${tech}: điền sai ${cn(c)}=${d}`);
    for (const [c, d] of f.elims ?? [])
      if (cand.solution[c] === d) throw new Error(`${tech}: loại sai ${d} ở ${cn(c)}`);
    for (const [c, d] of f.elims ?? [])
      if (!has(cand.state.cands[c], d)) throw new Error(`${tech}: loại ứng viên không tồn tại ${d} ở ${cn(c)}`);
  }
  const showCands = !LEVEL1.includes(tech);
  examples[tech] = {
    id: tech,
    technique: tech,
    puzzle: gridToString(cand.puzzle),
    grid: gridToString(cand.state.grid),
    cands: cand.state.cands,
    showCands,
    carried: cand.carried,
    frames,
  };
  console.log(
    tech.padEnd(20),
    "điểm",
    cand.score.toFixed(1),
    cand.carried ? "(ứng viên mang từ bước trước)" : "",
    frames.length,
    "khung",
  );
}

if (!walkBest) throw new Error("Không tìm được đề cho phần giải mẫu");
{
  // Kiểm chứng phần giải mẫu.
  const sol = walkBest.walk.solution;
  for (const st of walkBest.walk.steps) {
    for (const [c, d] of st.places) if (Number(sol[c]) !== d) throw new Error("Giải mẫu điền sai");
    for (const [c, d] of st.elims) if (Number(sol[c]) === d) throw new Error("Giải mẫu loại sai");
  }
}

mkdirSync("data", { recursive: true });
writeFileSync("data/examples.json", JSON.stringify(examples));
writeFileSync("data/walkthrough.json", JSON.stringify(walkBest.walk));
console.log(`Xong: ${Object.keys(examples).length} ví dụ, giải mẫu ${walkBest.walk.steps.length} bước, ${((Date.now() - t0) / 1000).toFixed(1)}s`);
