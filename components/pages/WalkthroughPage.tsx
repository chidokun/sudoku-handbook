import Link from "next/link";
import { Walkthrough } from "@/components/Walkthrough";
import { getTechniques } from "@/content/techniques";
import { WALKTHROUGH } from "@/lib/examples";
import { href, techHref, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

const COPY = {
  en: {
    title: "Walkthrough",
    heading: "A puzzle, solved step by step",
    description: "Follow a Sudoku puzzle solved from start to finish, with the technique and the reason for every step.",
    lead: (n: number, basics: React.ReactNode) => (
      <>
        A medium puzzle solved in {n} steps. The solver always picks the simplest technique that still works, just like the routine in the {basics}: it moves on to 2-step reasoning only when the singles run out, and goes back to placing digits after every elimination.
      </>
    ),
    basics: "basics",
    used: "Techniques used",
  },
  vi: {
    title: "Giải mẫu một đề",
    heading: "Giải mẫu một đề",
    description: "Theo dõi một đề Sudoku được giải trọn vẹn từng bước, mỗi bước ghi rõ kỹ thuật và lý do.",
    lead: (n: number, basics: React.ReactNode) => (
      <>
        Một đề độ khó trung bình, giải trọn trong {n} bước. Bộ giải luôn chọn kỹ thuật đơn giản nhất còn dùng được, đúng như quy trình trong phần {basics}: hết số duy nhất mới chuyển sang suy luận 2 bước, loại xong lại quay về điền số.
      </>
    ),
    basics: "cơ bản",
    used: "Các kỹ thuật được dùng",
  },
};

export const walkthroughMeta = (lang: Lang) => pageMeta(lang, (l) => href(l, "walkthrough"), COPY[lang].title, COPY[lang].description);

export function WalkthroughPage({ lang }: { lang: Lang }) {
  const C = COPY[lang];
  const list = getTechniques(lang);
  const techs = Object.fromEntries(list.map((x) => [x.slug, { name: x.name, level: x.level }]));
  const counts = new Map<string, number>();
  for (const s of WALKTHROUGH.steps) counts.set(s.tech, (counts.get(s.tech) ?? 0) + 1);
  const used = list.filter((x) => counts.has(x.slug));
  const basicsLink = (
    <Link href={`${href(lang, "basics")}#quy-trinh`} className="font-medium text-pen">
      {C.basics}
    </Link>
  );

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">{C.heading}</h1>
      <p className="mt-4 max-w-[64ch] text-lg text-ink-2">{C.lead(WALKTHROUGH.steps.length, basicsLink)}</p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label={C.used}>
        {used.map((x) => (
          <li key={x.slug} data-level={x.level}>
            <Link
              href={techHref(lang, x.slug)}
              className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1 text-[15px] no-underline hover:border-ink-3"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--lv)" }} aria-hidden="true" />
              {x.name}
              <span className="tabular-nums text-ink-3">×{counts.get(x.slug)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Walkthrough data={WALKTHROUGH} techs={techs} lang={lang} />
      </div>
    </div>
  );
}
