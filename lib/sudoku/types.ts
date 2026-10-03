// Kiểu dữ liệu cho ví dụ minh hoạ (được sinh sẵn vào data/*.json).
import type { Lang } from "./core";

export type { Lang };

export type Level = 1 | 2 | 3; // 3 = suy luận N bước

export type Color =
  | "focus" // ô đang xét / ô kết luận
  | "unit" // đơn vị đang xét
  | "pattern" // ô thuộc mẫu hình
  | "pattern2" // nhóm thứ hai của mẫu hình
  | "blocked" // ô bị chặn
  | "elim" // ô bị loại ứng viên
  | "colorA"
  | "colorB";

/** [ô, số, màu] — tô sáng một ứng viên. */
export type CandMark = [number, number, Color];

export interface Line {
  /** [ô, số]; số = 0 nghĩa là tâm ô. */
  a: [number, number];
  b: [number, number];
  /** strong/weak: liên kết; ray: tia chặn từ một số; sight: ô bị loại "nhìn thấy" ô của mẫu hình. */
  kind: "strong" | "weak" | "ray" | "sight";
}

/** Dải số 1–9: số nào đã thấy, số nào còn thiếu. */
export interface Tally {
  label: string;
  seen: number[];
  missing: number[];
}

export interface Frame {
  title: string;
  text: string; // hỗ trợ **đậm**
  cells?: [number, Color][];
  cands?: CandMark[];
  elims?: [number, number][];
  places?: [number, number][];
  lines?: Line[];
  units?: number[];
  /** Ô chứa số gây chặn — vẽ vòng quanh chữ số. */
  rings?: number[];
  tally?: Tally;
}

export interface Example {
  id: string;
  technique: string;
  puzzle: string; // các số cho sẵn
  grid: string; // trạng thái hiện tại (cho sẵn + đã điền)
  cands: number[]; // bitmask ứng viên, 0 cho ô đã có số
  showCands: boolean;
  carried: boolean; // ứng viên đã bị loại bớt bởi các bước trước
  frames: Record<Lang, Frame[]>;
}

export interface WalkStep {
  tech: string;
  places: [number, number][];
  elims: [number, number][];
  text: Record<Lang, string>;
  cells: [number, Color][];
  cands: CandMark[];
}

export interface Walkthrough {
  puzzle: string;
  solution: string;
  steps: WalkStep[];
}
