// Kiểm tra bộ giải: mọi bước suy luận phải khớp với lời giải duy nhất của đề.
// Chạy: node scripts/check-solver.ts [số đề] [seed]
import { State, SOLVER_ORDER, type TechId } from "../lib/sudoku/techniques.ts";
import { makePuzzle, mulberry32 } from "../lib/sudoku/generate.ts";

const N = Number(process.argv[2] ?? 300);
const rnd = mulberry32(Number(process.argv[3] ?? 7));
const usage = new Map<TechId, number>();
let solved = 0;
let errors = 0;
const t0 = Date.now();

for (let i = 0; i < N; i++) {
  const { puzzle, solution } = makePuzzle(rnd);
  const s = new State(puzzle);
  const used = new Set<TechId>();
  for (;;) {
    let step = null;
    for (const [, fn] of SOLVER_ORDER) {
      const steps = fn(s);
      for (const st of steps) {
        for (const [c, d] of st.places)
          if (solution[c] !== d) {
            errors++;
            console.error("SAI place", st.tech, c, d, solution[c]);
          }
        for (const [c, d] of st.elims)
          if (solution[c] === d) {
            errors++;
            console.error("SAI elim", st.tech, c, d, JSON.stringify(st.info));
          }
      }
      if (steps.length) {
        step = steps[0];
        break;
      }
    }
    if (!step) break;
    used.add(step.tech);
    s.apply(step);
  }
  if (s.emptyCount() === 0) solved++;
  for (const t of used) usage.set(t, (usage.get(t) ?? 0) + 1);
}

console.log(`${N} đề, giải được ${solved}, lỗi ${errors}, ${Date.now() - t0}ms`);
for (const [t] of SOLVER_ORDER) console.log(t.padEnd(20), usage.get(t) ?? 0);
if (errors) process.exit(1);
