import type { Metadata } from "next";
import { GLOSSARY } from "@/content/glossary";
import { slugify } from "@/lib/text";

export const metadata: Metadata = {
  title: "Thuật ngữ",
  description: "Giải thích các thuật ngữ Sudoku dùng trong sổ tay, kèm tên tiếng Anh tương ứng.",
};

export default function GlossaryPage() {
  const groups = [...new Set(GLOSSARY.map((g) => g.group))];
  return (
    <div className="mx-auto max-w-[880px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">Thuật ngữ</h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">
        Các từ dùng trong sổ tay, kèm tên tiếng Anh để bạn tra thêm tài liệu nước ngoài.
      </p>
      {groups.map((g) => (
        <section key={g} className="mt-14" aria-labelledby={slugify(g)}>
          <h2 id={slugify(g)} className="font-display text-2xl font-extrabold tracking-tight">
            {g}
          </h2>
          <dl className="mt-4 divide-y divide-rule border-y border-rule">
            {GLOSSARY.filter((t) => t.group === g).map((t) => (
              <div key={t.term} id={slugify(t.term)} className="grid scroll-mt-24 gap-1 py-4 target:bg-[var(--t-focus)]/40 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
                <dt>
                  <span className="font-semibold">{t.term}</span>
                  <span className="block text-sm text-ink-3">{t.en}</span>
                </dt>
                <dd className="m-0 text-ink-2">{t.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
