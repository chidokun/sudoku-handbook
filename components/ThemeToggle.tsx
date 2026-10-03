"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const EVENT = "sudoku-handbook:theme";

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, current, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
        window.dispatchEvent(new Event(EVENT));
      }}
      className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-sunken hover:text-ink"
      aria-label={next === "dark" ? "Chuyển sang nền tối" : "Chuyển sang nền sáng"}
      title={next === "dark" ? "Nền tối" : "Nền sáng"}
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true" suppressHydrationWarning>
        {theme === "dark" ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
          </g>
        ) : (
          <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
