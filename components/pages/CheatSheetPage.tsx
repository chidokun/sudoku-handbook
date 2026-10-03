import Link from "next/link";
import { Difficulty } from "@/components/Difficulty";
import { LevelGlyph } from "@/components/LevelGlyph";
import { PrintButton } from "@/components/PrintButton";
import { TechThumb } from "@/components/TechList";
import { getLevels } from "@/content/levels";
import { techniquesOfLevel } from "@/content/techniques";
import { href, techHref, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

const COPY = {
  en: {
    title: "Cheat sheet",
    description: "Every Sudoku technique on one page: a one-line rule and a small diagram, ready to print.",
    lead: "One rule per technique. Each thumbnail shades the cells that form the pattern in that technique's example.",
    remember: "Three things to remember",
    tips: [
      "Always try the simplest technique first. After every elimination, look for singles again.",
      "Strong link: “if not A, then B”. Weak link: “if A, then not B”. Every chain alternates the two.",
      "The most common conclusion: a cell that sees both ends of an “at least one is d” pair cannot be d.",
    ],
  },
  vi: {
    title: "Bảng tóm tắt",
    description: "Mọi kỹ thuật giải Sudoku trên một trang: quy tắc ngắn gọn và hình minh hoạ, có thể in ra giấy.",
    lead: "Mỗi kỹ thuật một dòng quy tắc. Hình nhỏ tô các ô tạo nên mẫu hình trong ví dụ của kỹ thuật đó.",
    remember: "Ba điều cần nhớ",
    tips: [
      "Luôn thử kỹ thuật đơn giản nhất trước. Sau mỗi phép loại, quay lại tìm số duy nhất.",
      "Liên kết mạnh: “không phải A thì là B”. Liên kết yếu: “là A thì không phải B”. Mọi chuỗi xen kẽ hai loại này.",
      "Kết luận quen thuộc nhất: ô nhìn thấy cả hai đầu của một cặp “ít nhất một là d” thì không thể là d.",
    ],
  },
};

export const cheatSheetMeta = (lang: Lang) => pageMeta(lang, (l) => href(l, "cheatSheet"), COPY[lang].title, COPY[lang].description);

export function CheatSheetPage({ lang }: { lang: Lang }) {
  const C = COPY[lang];
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">{C.title}</h1>
          <p className="mt-3 max-w-[60ch] text-lg text-ink-2">{C.lead}</p>
        </div>
        <PrintButton lang={lang} />
      </div>

      {getLevels(lang).map((l) => (
        <section key={l.slug} data-level={l.level} className="print-avoid mt-14" aria-labelledby={`tt-${l.slug}`}>
          <h2
            id={`tt-${l.slug}`}
            className="flex items-center gap-3 border-b-2 pb-2 font-display text-2xl font-extrabold tracking-tight"
            style={{ borderColor: "var(--lv)" }}
          >
            <span style={{ color: "var(--lv)" }}>
              <LevelGlyph level={l.level} />
            </span>
            {l.title}
            <span className="text-base font-medium text-ink-3">{l.tagline}</span>
          </h2>
          <ul className="mt-2 grid gap-x-10 md:grid-cols-2">
            {techniquesOfLevel(lang, l.level).map((x) => (
              <li key={x.slug} className="print-avoid border-b border-rule py-4">
                <Link href={techHref(lang, x.slug)} className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 no-underline">
                  <TechThumb slug={x.slug} lang={lang} />
                  <div>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-lg font-bold">{x.name}</span>
                      {x.alias !== x.name && <span className="text-sm text-ink-3">{x.alias.split(" · ")[0]}</span>}
                    </p>
                    <p className="mt-1 text-[15px] leading-snug text-ink-2">{x.rule}</p>
                    <p className="mt-1.5">
                      <Difficulty value={x.difficulty} lang={lang} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="print-avoid mt-14 rounded-2xl border border-rule bg-surface p-6" aria-labelledby="tt-nho">
        <h2 id="tt-nho" className="font-display text-xl font-bold">
          {C.remember}
        </h2>
        <ul className="mt-3 grid gap-2 text-ink-2 md:grid-cols-3 md:gap-6">
          {C.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
