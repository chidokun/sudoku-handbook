import examplesJson from "@/data/examples.json";
import walkJson from "@/data/walkthrough.json";
import type { Example, Walkthrough } from "@/lib/sudoku/types";

// Dữ liệu sinh bởi scripts/build-examples.ts — chỉ đọc ở server component.
export const EXAMPLES = examplesJson as unknown as Record<string, Example>;
export const WALKTHROUGH = walkJson as unknown as Walkthrough;
