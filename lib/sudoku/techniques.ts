// Bộ tìm kỹ thuật giải. Chỉ dùng trong script sinh ví dụ (scripts/), không đưa lên trình duyệt.
import {
  BOX_UNITS,
  CELL_UNITS,
  COL_UNITS,
  PEERS,
  ROW_UNITS,
  UNITS,
  type Unit,
  basicCandidates,
  bit,
  boxOf,
  cellAt,
  colOf,
  digitsOf,
  has,
  popcount,
  rowOf,
  sees,
} from "./core.ts";

export type TechId =
  | "full-house"
  | "hidden-single-box"
  | "hidden-single-line"
  | "naked-single"
  | "pointing"
  | "claiming"
  | "naked-pair"
  | "hidden-pair"
  | "naked-triple"
  | "hidden-triple"
  | "naked-quad"
  | "hidden-quad"
  | "x-wing"
  | "swordfish"
  | "jellyfish"
  | "skyscraper"
  | "two-string-kite"
  | "xy-wing"
  | "xyz-wing"
  | "w-wing"
  | "simple-coloring"
  | "unique-rectangle"
  | "bug-plus-one"
  | "xy-chain";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Info = Record<string, any>;

export interface Step {
  tech: TechId;
  places: [number, number][];
  elims: [number, number][];
  info: Info;
}

export class State {
  grid: number[];
  cands: number[];

  constructor(grid: number[], cands?: number[]) {
    this.grid = grid.slice();
    this.cands = cands ? cands.slice() : basicCandidates(grid);
  }

  clone() {
    return new State(this.grid, this.cands);
  }

  place(c: number, d: number) {
    this.grid[c] = d;
    this.cands[c] = 0;
    for (const p of PEERS[c]) this.cands[p] &= ~bit(d);
  }

  apply(step: Step) {
    for (const [c, d] of step.elims) this.cands[c] &= ~bit(d);
    for (const [c, d] of step.places) if (!this.grid[c]) this.place(c, d);
  }

  emptyCount() {
    return this.grid.filter((d) => !d).length;
  }

  /** Vị trí có ứng viên d trong đơn vị. */
  positions(u: Unit, d: number) {
    return u.cells.filter((c) => has(this.cands[c], d));
  }

  unitHas(u: Unit, d: number) {
    return u.cells.some((c) => this.grid[c] === d);
  }
}

function combos<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  const pick: T[] = [];
  const rec = (start: number) => {
    if (pick.length === k) {
      out.push(pick.slice());
      return;
    }
    for (let i = start; i < arr.length; i++) {
      pick.push(arr[i]);
      rec(i + 1);
      pick.pop();
    }
  };
  rec(0);
  return out;
}

const uniqPairs = (pairs: [number, number][]) => {
  const seen = new Set<string>();
  return pairs.filter(([c, d]) => {
    const k = `${c}:${d}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/** Các ô có ứng viên d mà nhìn thấy mọi ô trong `cells` (không tính chính các ô đó). */
function seersOf(s: State, cells: number[], d: number, exclude: number[] = []) {
  const out: number[] = [];
  for (let c = 0; c < 81; c++) {
    if (!has(s.cands[c], d) || cells.includes(c) || exclude.includes(c)) continue;
    if (cells.every((x) => sees(c, x))) out.push(c);
  }
  return out;
}

// ============ Suy luận 1 bước ============

export function findFullHouse(s: State): Step[] {
  const out: Step[] = [];
  for (const u of UNITS) {
    const empties = u.cells.filter((c) => !s.grid[c]);
    if (empties.length !== 1) continue;
    let present = 0;
    for (const c of u.cells) if (s.grid[c]) present |= bit(s.grid[c]);
    const d = digitsOf(0x1ff & ~present)[0];
    out.push({ tech: "full-house", places: [[empties[0], d]], elims: [], info: { unit: u.id, cell: empties[0], digit: d } });
  }
  return out;
}

function hiddenSingles(s: State, units: Unit[], tech: TechId): Step[] {
  const out: Step[] = [];
  for (const u of units) {
    for (let d = 1; d <= 9; d++) {
      if (s.unitHas(u, d)) continue;
      const pos = s.positions(u, d);
      if (pos.length === 1) {
        out.push({ tech, places: [[pos[0], d]], elims: [], info: { unit: u.id, cell: pos[0], digit: d } });
      }
    }
  }
  return out;
}

export const findHiddenSingleBox = (s: State) => hiddenSingles(s, BOX_UNITS, "hidden-single-box");
export const findHiddenSingleLine = (s: State) =>
  hiddenSingles(s, [...ROW_UNITS, ...COL_UNITS], "hidden-single-line");

export function findNakedSingle(s: State): Step[] {
  const out: Step[] = [];
  for (let c = 0; c < 81; c++) {
    if (!s.grid[c] && popcount(s.cands[c]) === 1) {
      const d = digitsOf(s.cands[c])[0];
      out.push({ tech: "naked-single", places: [[c, d]], elims: [], info: { cell: c, digit: d } });
    }
  }
  return out;
}

// ============ Suy luận 2 bước ============

export function findPointing(s: State): Step[] {
  const out: Step[] = [];
  for (const box of BOX_UNITS) {
    for (let d = 1; d <= 9; d++) {
      const pos = s.positions(box, d);
      if (pos.length < 2) continue;
      for (const lineOf of [rowOf, colOf]) {
        const line = lineOf(pos[0]);
        if (!pos.every((c) => lineOf(c) === line)) continue;
        const lineUnit = lineOf === rowOf ? ROW_UNITS[line] : COL_UNITS[line];
        const elims = lineUnit.cells
          .filter((c) => boxOf(c) !== box.index && has(s.cands[c], d))
          .map((c) => [c, d] as [number, number]);
        if (elims.length)
          out.push({ tech: "pointing", places: [], elims, info: { box: box.id, line: lineUnit.id, digit: d, cells: pos } });
      }
    }
  }
  return out;
}

export function findClaiming(s: State): Step[] {
  const out: Step[] = [];
  for (const line of [...ROW_UNITS, ...COL_UNITS]) {
    for (let d = 1; d <= 9; d++) {
      const pos = s.positions(line, d);
      if (pos.length < 2) continue;
      const b = boxOf(pos[0]);
      if (!pos.every((c) => boxOf(c) === b)) continue;
      const box = BOX_UNITS[b];
      const elims = box.cells
        .filter((c) => !line.cells.includes(c) && has(s.cands[c], d))
        .map((c) => [c, d] as [number, number]);
      if (elims.length)
        out.push({ tech: "claiming", places: [], elims, info: { box: box.id, line: line.id, digit: d, cells: pos } });
    }
  }
  return out;
}

const NAKED: Record<number, TechId> = { 2: "naked-pair", 3: "naked-triple", 4: "naked-quad" };
const HIDDEN: Record<number, TechId> = { 2: "hidden-pair", 3: "hidden-triple", 4: "hidden-quad" };

export function findNakedSubset(s: State, n: number): Step[] {
  const out: Step[] = [];
  const seen = new Set<string>();
  for (const u of UNITS) {
    const empties = u.cells.filter((c) => !s.grid[c]);
    const pool = empties.filter((c) => {
      const k = popcount(s.cands[c]);
      return k >= 2 && k <= n;
    });
    for (const cells of combos(pool, n)) {
      let union = 0;
      for (const c of cells) union |= s.cands[c];
      if (popcount(union) !== n) continue;
      const key = cells.join(",");
      if (seen.has(key)) continue;
      seen.add(key);
      const units = UNITS.filter((v) => cells.every((c) => v.cells.includes(c)));
      const elims: [number, number][] = [];
      for (const v of units)
        for (const c of v.cells)
          if (!cells.includes(c)) for (const d of digitsOf(s.cands[c] & union)) elims.push([c, d]);
      if (elims.length)
        out.push({
          tech: NAKED[n],
          places: [],
          elims: uniqPairs(elims),
          info: { units: units.map((v) => v.id), cells, digits: digitsOf(union) },
        });
    }
  }
  return out;
}

export function findHiddenSubset(s: State, n: number): Step[] {
  const out: Step[] = [];
  for (const u of UNITS) {
    const pool: number[] = [];
    for (let d = 1; d <= 9; d++) {
      if (s.unitHas(u, d)) continue;
      const k = s.positions(u, d).length;
      if (k >= 2 && k <= n) pool.push(d);
    }
    for (const ds of combos(pool, n)) {
      const cellSet = new Set<number>();
      for (const d of ds) for (const c of s.positions(u, d)) cellSet.add(c);
      if (cellSet.size !== n) continue;
      const cells = [...cellSet].sort((a, b) => a - b);
      const keep = ds.reduce((m, d) => m | bit(d), 0);
      const elims: [number, number][] = [];
      for (const c of cells) for (const d of digitsOf(s.cands[c] & ~keep)) elims.push([c, d]);
      if (elims.length) out.push({ tech: HIDDEN[n], places: [], elims, info: { unit: u.id, cells, digits: ds } });
    }
  }
  return out;
}

// ============ Suy luận N bước ============

const FISH: Record<number, TechId> = { 2: "x-wing", 3: "swordfish", 4: "jellyfish" };

export function findFish(s: State, n: number): Step[] {
  const out: Step[] = [];
  for (let d = 1; d <= 9; d++) {
    for (const [bases, covers, crossOf] of [
      [ROW_UNITS, COL_UNITS, colOf],
      [COL_UNITS, ROW_UNITS, rowOf],
    ] as const) {
      const pool = bases.filter((u) => {
        const k = s.positions(u, d).length;
        return k >= 2 && k <= n;
      });
      for (const set of combos(pool, n)) {
        let cover = 0;
        const cells: number[] = [];
        for (const u of set)
          for (const c of s.positions(u, d)) {
            cover |= 1 << crossOf(c);
            cells.push(c);
          }
        if (popcount(cover) !== n) continue;
        const coverUnits = covers.filter((_, i) => cover & (1 << i));
        const elims: [number, number][] = [];
        for (const cu of coverUnits)
          for (const c of cu.cells) if (!cells.includes(c) && has(s.cands[c], d)) elims.push([c, d]);
        if (elims.length)
          out.push({
            tech: FISH[n],
            places: [],
            elims,
            info: { digit: d, bases: set.map((u) => u.id), covers: coverUnits.map((u) => u.id), cells },
          });
      }
    }
  }
  return out;
}

/** Các cặp liên kết mạnh (đơn vị chỉ có đúng 2 chỗ cho d). */
function strongLinks(s: State, d: number, units: Unit[] = UNITS) {
  const out: { unit: number; cells: [number, number] }[] = [];
  for (const u of units) {
    const pos = s.positions(u, d);
    if (pos.length === 2) out.push({ unit: u.id, cells: [pos[0], pos[1]] });
  }
  return out;
}

export function findSkyscraper(s: State): Step[] {
  const out: Step[] = [];
  for (let d = 1; d <= 9; d++) {
    for (const [lines, crossOf] of [
      [ROW_UNITS, colOf],
      [COL_UNITS, rowOf],
    ] as const) {
      const links = strongLinks(s, d, lines);
      for (let i = 0; i < links.length; i++)
        for (let j = i + 1; j < links.length; j++) {
          const A = links[i].cells;
          const B = links[j].cells;
          for (const a of [0, 1])
            for (const b of [0, 1]) {
              const baseA = A[a];
              const baseB = B[b];
              const topA = A[1 - a];
              const topB = B[1 - b];
              if (crossOf(baseA) !== crossOf(baseB)) continue;
              if (crossOf(topA) === crossOf(topB)) continue; // X-Wing
              const elims = seersOf(s, [topA, topB], d, [baseA, baseB]).map((c) => [c, d] as [number, number]);
              if (elims.length)
                out.push({
                  tech: "skyscraper",
                  places: [],
                  elims,
                  info: { digit: d, lines: [links[i].unit, links[j].unit], bases: [baseA, baseB], tops: [topA, topB] },
                });
            }
        }
    }
  }
  return out;
}

export function findTwoStringKite(s: State): Step[] {
  const out: Step[] = [];
  for (let d = 1; d <= 9; d++) {
    const rows = strongLinks(s, d, ROW_UNITS);
    const cols = strongLinks(s, d, COL_UNITS);
    for (const R of rows)
      for (const C of cols)
        for (const x of [0, 1])
          for (const y of [0, 1]) {
            const rx = R.cells[x];
            const cy = C.cells[y];
            const rEnd = R.cells[1 - x];
            const cEnd = C.cells[1 - y];
            const all = new Set([rx, cy, rEnd, cEnd]);
            if (all.size !== 4) continue;
            if (boxOf(rx) !== boxOf(cy)) continue;
            if (boxOf(rEnd) === boxOf(rx) || boxOf(cEnd) === boxOf(rx)) continue;
            const elims = seersOf(s, [rEnd, cEnd], d, [rx, cy]).map((c) => [c, d] as [number, number]);
            if (elims.length)
              out.push({
                tech: "two-string-kite",
                places: [],
                elims,
                info: { digit: d, row: R.unit, col: C.unit, rowCells: [rx, rEnd], colCells: [cy, cEnd], box: 18 + boxOf(rx) },
              });
          }
  }
  return out;
}

const bivalues = (s: State) => {
  const out: number[] = [];
  for (let c = 0; c < 81; c++) if (!s.grid[c] && popcount(s.cands[c]) === 2) out.push(c);
  return out;
};

export function findXYWing(s: State): Step[] {
  const out: Step[] = [];
  const bv = bivalues(s);
  for (const P of bv) {
    const [x, y] = digitsOf(s.cands[P]);
    const wings = bv.filter((c) => c !== P && sees(c, P));
    for (const A of wings)
      for (const B of wings) {
        if (A === B) continue;
        const ma = s.cands[A];
        const mb = s.cands[B];
        // A = {x,z}, B = {y,z}
        if (!has(ma, x) || has(ma, y)) continue;
        if (!has(mb, y) || has(mb, x)) continue;
        const z = digitsOf(ma & ~bit(x))[0];
        if (!has(mb, z)) continue;
        const elims = seersOf(s, [A, B], z, [P]).map((c) => [c, z] as [number, number]);
        if (elims.length)
          out.push({ tech: "xy-wing", places: [], elims, info: { pivot: P, pincers: [A, B], x, y, z } });
      }
  }
  return out;
}

export function findXYZWing(s: State): Step[] {
  const out: Step[] = [];
  const bv = bivalues(s);
  for (let P = 0; P < 81; P++) {
    if (s.grid[P] || popcount(s.cands[P]) !== 3) continue;
    const mp = s.cands[P];
    const wings = bv.filter((c) => sees(c, P) && (s.cands[c] & ~mp) === 0);
    for (let i = 0; i < wings.length; i++)
      for (let j = i + 1; j < wings.length; j++) {
        const A = wings[i];
        const B = wings[j];
        if ((s.cands[A] | s.cands[B]) !== mp) continue;
        const common = s.cands[A] & s.cands[B];
        if (popcount(common) !== 1) continue;
        const z = digitsOf(common)[0];
        const elims = seersOf(s, [P, A, B], z).map((c) => [c, z] as [number, number]);
        if (elims.length) {
          const x = digitsOf(s.cands[A] & ~common)[0];
          const y = digitsOf(s.cands[B] & ~common)[0];
          out.push({ tech: "xyz-wing", places: [], elims, info: { pivot: P, pincers: [A, B], x, y, z } });
        }
      }
  }
  return out;
}

export function findWWing(s: State): Step[] {
  const out: Step[] = [];
  const bv = bivalues(s);
  for (let i = 0; i < bv.length; i++)
    for (let j = i + 1; j < bv.length; j++) {
      const A = bv[i];
      const B = bv[j];
      if (s.cands[A] !== s.cands[B] || sees(A, B)) continue;
      const [p, q] = digitsOf(s.cands[A]);
      for (const [x, y] of [
        [p, q],
        [q, p],
      ]) {
        const elims = seersOf(s, [A, B], y).map((c) => [c, y] as [number, number]);
        if (!elims.length) continue;
        for (const link of strongLinks(s, x)) {
          const [L1, L2] = link.cells;
          if ([L1, L2].some((c) => c === A || c === B)) continue;
          let pair: [number, number] | null = null;
          if (sees(L1, A) && sees(L2, B)) pair = [L1, L2];
          else if (sees(L2, A) && sees(L1, B)) pair = [L2, L1];
          if (!pair) continue;
          out.push({
            tech: "w-wing",
            places: [],
            elims,
            info: { cells: [A, B], x, y, link: pair, linkUnit: link.unit },
          });
          break;
        }
      }
    }
  return out;
}

export function findSimpleColoring(s: State): Step[] {
  const out: Step[] = [];
  for (let d = 1; d <= 9; d++) {
    const links = strongLinks(s, d);
    const adj = new Map<number, Set<number>>();
    for (const { cells: [a, b] } of links) {
      if (!adj.has(a)) adj.set(a, new Set());
      if (!adj.has(b)) adj.set(b, new Set());
      adj.get(a)!.add(b);
      adj.get(b)!.add(a);
    }
    const color = new Map<number, 0 | 1>();
    for (const start of adj.keys()) {
      if (color.has(start)) continue;
      const comp: number[] = [];
      color.set(start, 0);
      const queue = [start];
      let ok = true;
      while (queue.length) {
        const v = queue.shift()!;
        comp.push(v);
        for (const w of adj.get(v)!) {
          if (!color.has(w)) {
            color.set(w, (1 - color.get(v)!) as 0 | 1);
            queue.push(w);
          } else if (color.get(w) === color.get(v)) ok = false;
        }
      }
      if (!ok || comp.length < 4) continue;
      const A = comp.filter((c) => color.get(c) === 0).sort((a, b) => a - b);
      const B = comp.filter((c) => color.get(c) === 1).sort((a, b) => a - b);
      const edges: [number, number][] = [];
      for (const { cells: [a, b] } of links) if (comp.includes(a)) edges.push([a, b]);
      const uniqEdges = edges.filter(
        ([a, b], i) => edges.findIndex(([p, q]) => (p === a && q === b) || (p === b && q === a)) === i,
      );
      // Quy tắc 2: hai ô cùng màu nhìn thấy nhau → màu đó sai.
      for (const [bad, good, badName] of [
        [A, B, "A"],
        [B, A, "B"],
      ] as const) {
        const clash = bad.flatMap((a, i) => bad.slice(i + 1).filter((b) => sees(a, b)).map((b) => [a, b]));
        if (clash.length) {
          out.push({
            tech: "simple-coloring",
            places: good.map((c) => [c, d] as [number, number]),
            elims: bad.map((c) => [c, d] as [number, number]),
            info: { digit: d, rule: "wrap", A, B, edges: uniqEdges, bad: badName, clash: clash[0] },
          });
        }
      }
      // Quy tắc 4: ô ngoài chuỗi nhìn thấy cả hai màu → loại.
      const traps: { cell: number; a: number; b: number }[] = [];
      for (let c = 0; c < 81; c++) {
        if (!has(s.cands[c], d) || comp.includes(c)) continue;
        const a = A.find((x) => sees(c, x));
        const b = B.find((x) => sees(c, x));
        if (a !== undefined && b !== undefined) traps.push({ cell: c, a, b });
      }
      if (traps.length)
        out.push({
          tech: "simple-coloring",
          places: [],
          elims: traps.map((t) => [t.cell, d] as [number, number]),
          info: { digit: d, rule: "trap", A, B, edges: uniqEdges, traps },
        });
    }
  }
  return out;
}

export function findUniqueRectangle(s: State): Step[] {
  const out: Step[] = [];
  for (let r1 = 0; r1 < 9; r1++)
    for (let r2 = r1 + 1; r2 < 9; r2++)
      for (let c1 = 0; c1 < 9; c1++)
        for (let c2 = c1 + 1; c2 < 9; c2++) {
          const cells = [cellAt(r1, c1), cellAt(r1, c2), cellAt(r2, c1), cellAt(r2, c2)];
          if (cells.some((c) => s.grid[c])) continue;
          if (new Set(cells.map(boxOf)).size !== 2) continue;
          const pairs = cells.filter((c) => popcount(s.cands[c]) === 2);
          if (pairs.length !== 3) continue;
          const m = s.cands[pairs[0]];
          if (!pairs.every((c) => s.cands[c] === m)) continue;
          const roof = cells.find((c) => !pairs.includes(c))!;
          if ((s.cands[roof] & m) !== m) continue;
          const elims = digitsOf(m).map((d) => [roof, d] as [number, number]);
          out.push({
            tech: "unique-rectangle",
            places: [],
            elims,
            info: { cells, floor: pairs, roof, digits: digitsOf(m) },
          });
        }
  return out;
}

export function findBug(s: State): Step[] {
  let tri = -1;
  for (let c = 0; c < 81; c++) {
    if (s.grid[c]) continue;
    const k = popcount(s.cands[c]);
    if (k === 2) continue;
    if (k === 3 && tri < 0) tri = c;
    else return [];
  }
  if (tri < 0) return [];
  for (const d of digitsOf(s.cands[tri])) {
    if (!CELL_UNITS[tri].every((u) => s.positions(u, d).length === 3)) continue;
    // Bỏ d khỏi ô ba ứng viên thì mọi số phải xuất hiện đúng 0 hoặc 2 lần trong mỗi đơn vị (trạng thái BUG).
    const t = s.clone();
    t.cands[tri] &= ~bit(d);
    const bug = UNITS.every((u) => {
      for (let e = 1; e <= 9; e++) {
        const k = t.positions(u, e).length;
        if (k !== 0 && k !== 2) return false;
      }
      return true;
    });
    if (bug) return [{ tech: "bug-plus-one", places: [[tri, d]], elims: [], info: { cell: tri, digit: d } }];
  }
  return [];
}

export function findXYChain(s: State, maxLen = 8): Step[] {
  const bv = bivalues(s);
  const other = (c: number, d: number) => digitsOf(s.cands[c] & ~bit(d))[0];
  for (let len = 4; len <= maxLen; len++) {
    const out: Step[] = [];
    for (const start of bv)
      for (const z of digitsOf(s.cands[start])) {
        const chain: { cell: number; from: number; to: number }[] = [{ cell: start, from: z, to: other(start, z) }];
        const rec = () => {
          const last = chain[chain.length - 1];
          if (chain.length === len) {
            if (last.to !== z) return;
            const ends = [start, last.cell];
            const elims = seersOf(
              s,
              ends,
              z,
              chain.map((l) => l.cell),
            ).map((c) => [c, z] as [number, number]);
            if (elims.length) out.push({ tech: "xy-chain", places: [], elims, info: { digit: z, chain: chain.map((l) => ({ ...l })) } });
            return;
          }
          for (const nxt of bv) {
            if (!sees(nxt, last.cell) || !has(s.cands[nxt], last.to)) continue;
            if (chain.some((l) => l.cell === nxt)) continue;
            chain.push({ cell: nxt, from: last.to, to: other(nxt, last.to) });
            rec();
            chain.pop();
          }
        };
        rec();
        if (out.length > 40) break;
      }
    if (out.length) return out;
  }
  return [];
}

// ============ Bộ giải theo thứ tự độ khó ============

export const SOLVER_ORDER: [TechId, (s: State) => Step[]][] = [
  ["full-house", findFullHouse],
  ["hidden-single-box", findHiddenSingleBox],
  ["hidden-single-line", findHiddenSingleLine],
  ["naked-single", findNakedSingle],
  ["pointing", findPointing],
  ["claiming", findClaiming],
  ["naked-pair", (s) => findNakedSubset(s, 2)],
  ["hidden-pair", (s) => findHiddenSubset(s, 2)],
  ["naked-triple", (s) => findNakedSubset(s, 3)],
  ["hidden-triple", (s) => findHiddenSubset(s, 3)],
  ["naked-quad", (s) => findNakedSubset(s, 4)],
  ["hidden-quad", (s) => findHiddenSubset(s, 4)],
  ["x-wing", (s) => findFish(s, 2)],
  ["skyscraper", findSkyscraper],
  ["two-string-kite", findTwoStringKite],
  ["xy-wing", findXYWing],
  ["xyz-wing", findXYZWing],
  ["w-wing", findWWing],
  ["swordfish", (s) => findFish(s, 3)],
  ["simple-coloring", findSimpleColoring],
  ["unique-rectangle", findUniqueRectangle],
  ["bug-plus-one", findBug],
  ["jellyfish", (s) => findFish(s, 4)],
  ["xy-chain", (s) => findXYChain(s)],
];

export const SINGLES: TechId[] = ["full-house", "hidden-single-box", "hidden-single-line", "naked-single"];

export function allSingles(s: State): Step[] {
  return [...findFullHouse(s), ...findHiddenSingleBox(s), ...findHiddenSingleLine(s), ...findNakedSingle(s)];
}

/** Tìm bước dễ nhất tiếp theo, kèm mọi phiên bản của kỹ thuật đó. */
export function nextSteps(s: State): Step[] {
  for (const [, fn] of SOLVER_ORDER) {
    const steps = fn(s);
    if (steps.length) return steps;
  }
  return [];
}
