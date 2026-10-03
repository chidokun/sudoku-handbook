// Sinh đề ngẫu nhiên có lời giải duy nhất. Chỉ dùng trong scripts/.
import { PEERS, bit, digitsOf } from "./core.ts";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Đếm số lời giải (dừng ở `limit`). Ghi lời giải đầu tiên vào `out` nếu có. */
export function countSolutions(grid: number[], limit = 2, out?: number[], rnd?: () => number): number {
  const g = grid.slice();
  let count = 0;
  const rec = (): boolean => {
    let best = -1;
    let bestMask = 0;
    let bestN = 10;
    for (let c = 0; c < 81; c++) {
      if (g[c]) continue;
      let used = 0;
      for (const p of PEERS[c]) if (g[p]) used |= bit(g[p]);
      const mask = 0x1ff & ~used;
      let n = 0;
      for (let m = mask; m; m &= m - 1) n++;
      if (n === 0) return false;
      if (n < bestN) {
        bestN = n;
        best = c;
        bestMask = mask;
        if (n === 1) break;
      }
    }
    if (best < 0) {
      count++;
      if (out && count === 1) for (let i = 0; i < 81; i++) out[i] = g[i];
      return count >= limit;
    }
    const ds = rnd ? shuffle(digitsOf(bestMask), rnd) : digitsOf(bestMask);
    for (const d of ds) {
      g[best] = d;
      if (rec()) return true;
    }
    g[best] = 0;
    return false;
  };
  rec();
  return count;
}

export function randomSolution(rnd: () => number): number[] {
  const out = new Array<number>(81).fill(0);
  countSolutions(new Array<number>(81).fill(0), 1, out, rnd);
  return out;
}

/** Bỏ dần số theo cặp đối xứng tâm, giữ lời giải duy nhất. */
export function makePuzzle(rnd: () => number): { puzzle: number[]; solution: number[] } {
  const solution = randomSolution(rnd);
  const puzzle = solution.slice();
  for (const c of shuffle([...Array(41).keys()], rnd)) {
    const pair = [c, 80 - c];
    const saved = pair.map((x) => puzzle[x]);
    for (const x of pair) puzzle[x] = 0;
    if (countSolutions(puzzle, 2) !== 1) pair.forEach((x, i) => (puzzle[x] = saved[i]));
  }
  return { puzzle, solution };
}
