import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import { body, display, hand } from "@/lib/fonts";
import "./globals.css";

// Hai root layout (en, vi) nên trang 404 phải tự dựng khung; nội dung song ngữ.
const BASE = process.env.PAGES_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "404 — Sudoku Handbook",
  description: "Page not found · Không tìm thấy trang",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${hand.variable}`}>
      <body className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center antialiased">
        <LogoMark className="h-10 w-10" />
        <p className="mt-6 font-hand text-7xl text-pen">?</p>
        <div className="mt-6 grid gap-10 sm:grid-cols-2 sm:gap-16">
          <section lang="en">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Page not found</h1>
            <p className="mx-auto mt-3 max-w-[32ch] text-ink-2">The link may have changed. Head back to the handbook.</p>
            <a href={`${BASE}/`} className="mt-6 inline-flex h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper no-underline">
              Sudoku Handbook
            </a>
          </section>
          <section lang="vi">
            <p className="font-display text-3xl font-extrabold tracking-tight">Không tìm thấy trang</p>
            <p className="mx-auto mt-3 max-w-[32ch] text-ink-2">Đường dẫn có thể đã đổi. Hãy quay về sổ tay.</p>
            <a href={`${BASE}/vi/`} className="mt-6 inline-flex h-11 items-center rounded-xl border border-rule px-5 font-semibold no-underline">
              Sổ tay Sudoku
            </a>
          </section>
        </div>
      </body>
    </html>
  );
}
