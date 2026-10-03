import { getGlossary } from "@/content/glossary";
import { href, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { slugify } from "@/lib/text";

const COPY = {
  en: {
    title: "Glossary",
    description: "The Sudoku terms used in this handbook, with their Vietnamese equivalents.",
    lead: "The words used throughout the handbook, with their Vietnamese names alongside.",
  },
  vi: {
    title: "Thuật ngữ",
    description: "Giải thích các thuật ngữ Sudoku dùng trong sổ tay, kèm tên tiếng Anh tương ứng.",
    lead: "Các từ dùng trong sổ tay, kèm tên tiếng Anh để bạn tra thêm tài liệu nước ngoài.",
  },
};

export const glossaryMeta = (lang: Lang) => pageMeta(lang, (l) => href(l, "glossary"), COPY[lang].title, COPY[lang].description);

export function GlossaryPage({ lang }: { lang: Lang }) {
  const C = COPY[lang];
  const terms = getGlossary(lang);
  const groups = [...new Set(terms.map((g) => g.group))];
  return (
    <div className="mx-auto max-w-[880px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">{C.title}</h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">{C.lead}</p>
      {groups.map((g) => (
        <section key={g} className="mt-14" aria-labelledby={slugify(g)}>
          <h2 id={slugify(g)} className="font-display text-2xl font-extrabold tracking-tight">
            {g}
          </h2>
          <dl className="mt-4 divide-y divide-rule border-y border-rule">
            {terms
              .filter((x) => x.group === g)
              .map((x) => (
                <div
                  key={x.term}
                  id={slugify(x.term)}
                  className="grid scroll-mt-24 gap-1 py-4 target:bg-[var(--t-focus)]/40 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6"
                >
                  <dt>
                    <span className="font-semibold">{x.term}</span>
                    <span className="block text-sm text-ink-3" lang={lang === "vi" ? "en" : "vi"}>
                      {x.alt}
                    </span>
                  </dt>
                  <dd className="m-0 text-ink-2">{x.def}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
