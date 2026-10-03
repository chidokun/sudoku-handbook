"use client";

import { useCallback, useSyncExternalStore } from "react";

// Tiến độ học lưu trong trình duyệt của người đọc (không có máy chủ, không có CSDL).
const KEY = "sudoku-handbook:learned";
const EVENT = "sudoku-handbook:learned-change";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

const cache = new Map<string, string[]>();
function parse(raw: string): string[] {
  let v = cache.get(raw);
  if (!v) {
    try {
      const x = JSON.parse(raw);
      v = Array.isArray(x) ? x.filter((s) => typeof s === "string") : [];
    } catch {
      v = [];
    }
    cache.set(raw, v);
  }
  return v;
}

export function useLearned() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const learned = parse(raw);
  const toggle = useCallback((slug: string) => {
    const cur = parse(read());
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Trình duyệt chặn bộ nhớ: bỏ qua, tiến độ chỉ không được lưu.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { learned, toggle };
}
