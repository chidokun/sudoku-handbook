import Link from "next/link";
import { LevelGlyph } from "@/components/LevelGlyph";
import { LevelProgress } from "@/components/Progress";
import { TechList } from "@/components/TechList";
import { getLevels } from "@/content/levels";
import { getTechniques, techniquesOfLevel } from "@/content/techniques";
import { href, levelHref, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

const COPY = {
  en: {
    title: "All techniques",
    heading: (n: number) => `${n} techniques, ordered by depth of reasoning`,
    lead: "Work through them top to bottom. Each technique has an example from a real puzzle that walks through every step of the argument, until a digit is placed or a candidate is eliminated.",
    description: (n: number) => `${n} Sudoku solving techniques ordered by depth of reasoning: 1-step, 2-step and N-step.`,
  },
  vi: {
    title: "Tất cả kỹ thuật",
    heading: (n: number) => `${n} kỹ thuật, xếp theo độ sâu suy luận`,
    lead: "Học theo thứ tự từ trên xuống. Mỗi kỹ thuật có một ví dụ lấy từ đề thật, đi qua từng bước lập luận cho tới khi điền được số hoặc loại được ứng viên.",
    description: (n: number) => `${n} kỹ thuật giải Sudoku xếp theo độ sâu suy luận: 1 bước, 2 bước và N bước.`,
  },
};

export const techniquesIndexMeta = (lang: Lang) =>
  pageMeta(lang, (l) => href(l, "techniques"), COPY[lang].title, COPY[lang].description(getTechniques(lang).length));

export function TechniquesIndexPage({ lang }: { lang: Lang }) {
  const C = COPY[lang];
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight">{C.heading(getTechniques(lang).length)}</h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">{C.lead}</p>

      {getLevels(lang).map((l) => {
        const items = techniquesOfLevel(lang, l.level);
        return (
          <section key={l.slug} data-level={l.level} className="mt-16" aria-labelledby={`lv-${l.slug}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--lv)" }}>
                  <LevelGlyph level={l.level} /> {l.tagline}
                </p>
                <h2 id={`lv-${l.slug}`} className="mt-1 font-display text-3xl font-extrabold tracking-tight">
                  <Link href={levelHref(lang, l.level)} className="no-underline hover:underline">
                    {l.title}
                  </Link>
                </h2>
              </div>
              <LevelProgress slugs={items.map((x) => x.slug)} lang={lang} />
            </div>
            <p className="mt-3 max-w-[62ch] text-ink-2">{l.when}</p>
            <div className="mt-6">
              <TechList items={items} lang={lang} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
