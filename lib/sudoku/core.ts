// Lõi Sudoku dùng chung cho ứng dụng và script sinh ví dụ.
// Ô được đánh số 0..80 theo hàng; ứng viên lưu dạng bitmask (bit d-1 ứng với số d).

export type UnitType = "row" | "col" | "box";

export interface Unit {
  id: number; // 0-8 hàng, 9-17 cột, 18-26 khối
  type: UnitType;
  index: number; // 0-8
  cells: number[];
}

export const rowOf = (c: number) => Math.floor(c / 9);
export const colOf = (c: number) => c % 9;
export const boxOf = (c: number) => Math.floor(rowOf(c) / 3) * 3 + Math.floor(colOf(c) / 3);
export const cellAt = (r: number, c: number) => r * 9 + c;

export const UNITS: Unit[] = [];
for (let i = 0; i < 9; i++) {
  UNITS.push({ id: i, type: "row", index: i, cells: Array.from({ length: 9 }, (_, j) => i * 9 + j) });
}
for (let i = 0; i < 9; i++) {
  UNITS.push({ id: 9 + i, type: "col", index: i, cells: Array.from({ length: 9 }, (_, j) => j * 9 + i) });
}
for (let i = 0; i < 9; i++) {
  const r0 = Math.floor(i / 3) * 3;
  const c0 = (i % 3) * 3;
  const cells: number[] = [];
  for (let r = r0; r < r0 + 3; r++) for (let c = c0; c < c0 + 3; c++) cells.push(r * 9 + c);
  UNITS.push({ id: 18 + i, type: "box", index: i, cells });
}

export const ROW_UNITS = UNITS.slice(0, 9);
export const COL_UNITS = UNITS.slice(9, 18);
export const BOX_UNITS = UNITS.slice(18, 27);

/** Ba đơn vị (hàng, cột, khối) chứa mỗi ô. */
export const CELL_UNITS: Unit[][] = Array.from({ length: 81 }, (_, c) => [
  UNITS[rowOf(c)],
  UNITS[9 + colOf(c)],
  UNITS[18 + boxOf(c)],
]);

/** 20 ô "nhìn thấy" mỗi ô (cùng hàng, cột hoặc khối). */
export const PEERS: number[][] = Array.from({ length: 81 }, (_, c) => {
  const set = new Set<number>();
  for (const u of CELL_UNITS[c]) for (const p of u.cells) if (p !== c) set.add(p);
  return [...set].sort((a, b) => a - b);
});

export const sees = (a: number, b: number) =>
  a !== b && (rowOf(a) === rowOf(b) || colOf(a) === colOf(b) || boxOf(a) === boxOf(b));

export const ALL = 0x1ff;
export const bit = (d: number) => 1 << (d - 1);
export const has = (mask: number, d: number) => (mask & bit(d)) !== 0;

export function popcount(mask: number): number {
  let n = 0;
  while (mask) {
    mask &= mask - 1;
    n++;
  }
  return n;
}

export function digitsOf(mask: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= 9; d++) if (mask & bit(d)) out.push(d);
  return out;
}

export function maskOf(digits: number[]): number {
  let m = 0;
  for (const d of digits) m |= bit(d);
  return m;
}

export function parseGrid(s: string): number[] {
  const clean = s.replace(/[^0-9.]/g, "");
  if (clean.length !== 81) throw new Error(`Chuỗi đề phải có 81 ký tự, nhận ${clean.length}`);
  return [...clean].map((ch) => (ch === "." ? 0 : Number(ch)));
}

export const gridToString = (g: number[]) => g.map((d) => (d ? String(d) : ".")).join("");

/** Ứng viên cơ bản: loại các số đã có trong hàng, cột, khối. */
export function basicCandidates(grid: number[]): number[] {
  const cands = new Array<number>(81).fill(0);
  for (let c = 0; c < 81; c++) {
    if (grid[c]) continue;
    let used = 0;
    for (const p of PEERS[c]) if (grid[p]) used |= bit(grid[p]);
    cands[c] = ALL & ~used;
  }
  return cands;
}

// ---------- Cách gọi tên theo ngôn ngữ ----------

export type Lang = "en" | "vi";

/** Tên ô: H3C5 (hàng 3, cột 5) trong tiếng Việt, r3c5 trong tiếng Anh. */
export const cellName = (c: number, lang: Lang = "vi") =>
  lang === "vi" ? `H${rowOf(c) + 1}C${colOf(c) + 1}` : `r${rowOf(c) + 1}c${colOf(c) + 1}`;

const UNIT_LABEL: Record<Lang, Record<UnitType, string>> = {
  vi: { row: "hàng", col: "cột", box: "khối" },
  en: { row: "row", col: "column", box: "box" },
};

export function unitName(u: Unit | number, lang: Lang = "vi"): string {
  const unit = typeof u === "number" ? UNITS[u] : u;
  return `${UNIT_LABEL[lang][unit.type]} ${unit.index + 1}`;
}

/** Nối danh sách: "a, b và c" / "a, b and c". */
export function joinList(items: (string | number)[], lang: Lang = "vi", last?: string): string {
  const xs = items.map(String);
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} ${last ?? (lang === "vi" ? "và" : "and")} ${xs[xs.length - 1]}`;
}

export const joinVi = (items: (string | number)[], last = "và") => joinList(items, "vi", last);
