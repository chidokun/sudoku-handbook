"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SearchItem {
  href: string;
  title: string;
  sub: string;
  kind: string;
  level?: number;
  keywords?: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const index = useMemo(() => items.map((it) => ({ it, text: norm(`${it.title} ${it.sub} ${it.keywords ?? ""}`) })), [items]);
  const results = useMemo(() => {
    const tokens = norm(q).split(/\s+/).filter(Boolean);
    if (!tokens.length) return items.filter((it) => it.kind !== "Thuật ngữ").slice(0, 8);
    return index
      .filter(({ text }) => tokens.every((t) => text.includes(t)))
      .sort((a, b) => Number(norm(b.it.title).startsWith(tokens[0])) - Number(norm(a.it.title).startsWith(tokens[0])))
      .map(({ it }) => it)
      .slice(0, 12);
  }, [q, index, items]);

  const open = () => {
    setQ("");
    setActive(0);
    ref.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const close = () => ref.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex h-9 items-center gap-2 rounded-lg border border-rule bg-surface px-3 text-sm text-ink-3 hover:border-ink-3 hover:text-ink-2"
        aria-label="Tìm kỹ thuật"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Tìm kỹ thuật</span>
        <kbd className="hidden rounded border border-rule px-1.5 font-sans text-xs sm:inline">/</kbd>
      </button>

      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && close()}
        className="m-auto mt-[12vh] w-[min(92vw,560px)] rounded-2xl border border-rule bg-surface p-0 text-ink shadow-2xl backdrop:bg-[rgba(10,15,30,0.45)]"
        aria-label="Tìm trong sổ tay"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ink-3" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && results[active]) {
                close();
                router.push(results[active].href);
              }
            }}
            placeholder="Gõ tên kỹ thuật, ví dụ: cap lo, x-wing…"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-3"
            aria-label="Từ khoá"
          />
          <kbd className="rounded border border-rule px-1.5 text-xs text-ink-3">Esc</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink-3">Không có kết quả cho “{q}”. Thử tên tiếng Anh, như “naked pair”.</li>
          )}
          {results.map((it, k) => (
            <li key={it.href} role="option" aria-selected={k === active}>
              <Link
                href={it.href}
                onClick={close}
                onMouseEnter={() => setActive(k)}
                data-level={it.level}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 no-underline ${k === active ? "bg-sunken" : ""}`}
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: it.level ? "var(--lv)" : "var(--ink-3)" }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block font-medium">{it.title}</span>
                  <span className="block truncate text-sm text-ink-3">{it.sub}</span>
                </span>
                <span className="ml-auto shrink-0 pt-0.5 text-xs text-ink-3">{it.kind}</span>
              </Link>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
