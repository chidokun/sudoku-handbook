import Link from "next/link";
import { notFound } from "next/navigation";
import { Difficulty } from "@/components/Difficulty";
import { ExamplePlayer } from "@/components/ExamplePlayer";
import { LevelChip } from "@/components/LevelGlyph";
import { LearnedToggle } from "@/components/Progress";
import { TechSidebar } from "@/components/TechSidebar";
import { levelInfo } from "@/content/levels";
import { SOURCES } from "@/content/sources";
import { getTechnique, neighbors } from "@/content/techniques";
import { EXAMPLES } from "@/lib/examples";
import { href, levelHref, techHref, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

const COPY = {
  en: {
    crumbs: "Breadcrumb",
    techniques: "Techniques",
    difficulty: "Difficulty",
    rule: "Rule",
    example: "Worked example",
    noExample: "No example for this technique yet.",
    idea: "The idea",
    spot: "How to spot it",
    pitfalls: "Common mistakes",
    related: "Related techniques",
    sources: "References",
    newTab: "(opens in a new tab)",
    sourcesNote: "The examples on this page are generated from random puzzles, not taken from these sources.",
    prevNext: "Previous and next technique",
    prev: "Previous technique",
    next: "Next technique",
  },
  vi: {
    crumbs: "Vị trí",
    techniques: "Kỹ thuật",
    difficulty: "Độ khó",
    rule: "Quy tắc",
    example: "Ví dụ minh hoạ",
    noExample: "Chưa có ví dụ cho kỹ thuật này.",
    idea: "Ý tưởng",
    spot: "Cách nhận biết",
    pitfalls: "Lỗi thường gặp",
    related: "Kỹ thuật liên quan",
    sources: "Nguồn tham khảo",
    newTab: "(mở trong thẻ mới)",
    sourcesNote: "Tài liệu tiếng Anh. Tên tiếng Việt của kỹ thuật do sổ tay đặt; dùng tên tiếng Anh để tra thêm. Ví dụ trên trang này được sinh từ đề ngẫu nhiên, không lấy từ các nguồn trên.",
    prevNext: "Kỹ thuật trước và sau",
    prev: "Kỹ thuật trước",
    next: "Kỹ thuật tiếp theo",
  },
};

export function techniqueMeta(lang: Lang, slug: string) {
  const tech = getTechnique(lang, slug);
  if (!tech) return {};
  const en = tech.alias.split(" · ")[0];
  const title = lang === "vi" && en !== tech.name ? `${tech.name} (${en})` : tech.name;
  return pageMeta(lang, (l) => techHref(l, slug), title, tech.summary);
}

export function TechniquePage({ lang, slug }: { lang: Lang; slug: string }) {
  const tech = getTechnique(lang, slug);
  if (!tech) notFound();
  const C = COPY[lang];
  const lv = levelInfo(lang, tech.level);
  const example = EXAMPLES[tech.slug];
  const { prev, next } = neighbors(lang, tech.slug);
  const sources = SOURCES[tech.slug] ?? [];

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-8 sm:px-6 lg:pt-12">
      <div className="tech-layout" data-level={tech.level}>
        <aside className="tl-nav no-print">
          <TechSidebar current={tech.slug} lang={lang} />
        </aside>

        <header className="tl-head">
          <nav aria-label={C.crumbs} className="text-sm text-ink-3">
            <Link href={href(lang, "techniques")} className="no-underline hover:text-ink">
              {C.techniques}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href={levelHref(lang, tech.level)} className="no-underline hover:text-ink">
              {lv.title}
            </Link>
          </nav>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.3rem)] font-extrabold leading-[1.12] tracking-tight">{tech.name}</h1>
          {tech.alias !== tech.name && <p className="mt-1 text-lg text-ink-3">{tech.alias}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <LevelChip level={tech.level}>{lv.title}</LevelChip>
            <span className="inline-flex items-center gap-2 text-sm text-ink-3">
              {C.difficulty} <Difficulty value={tech.difficulty} lang={lang} />
            </span>
          </div>
          <p className="mt-6 max-w-[62ch] text-[19px] leading-relaxed text-ink">{tech.summary}</p>
          <div className="mt-6 max-w-[62ch] rounded-r-xl border-l-4 py-4 pl-5 pr-4" style={{ borderColor: "var(--lv)", background: "var(--lv-soft)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--lv)" }}>
              {C.rule}
            </p>
            <p className="mt-1 font-display text-[19px] font-semibold leading-snug">{tech.rule}</p>
          </div>
        </header>

        <section className="tl-ex" aria-label={C.example}>
          {example ? <ExamplePlayer example={example} lang={lang} /> : <p className="text-ink-3">{C.noExample}</p>}
        </section>

        <div className="tl-body max-w-[66ch]">
          <section>
            <h2 className="font-display text-2xl font-bold">{C.idea}</h2>
            <div className="prose-vi mt-3 text-ink-2">
              {tech.idea.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">{C.spot}</h2>
            <ul className="mt-3 grid gap-2.5 text-ink-2">
              {tech.spot.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--lv)" }} aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">{C.pitfalls}</h2>
            <ul className="mt-3 grid gap-2.5 text-ink-2">
              {tech.pitfalls.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <svg viewBox="0 0 16 16" className="mt-[0.35em] h-4 w-4 shrink-0 text-elim" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="no-print mt-10 flex flex-wrap items-center gap-4 border-t border-rule pt-8">
            <LearnedToggle slug={tech.slug} lang={lang} />
            <p className="text-sm text-ink-3">{lang === "vi" ? "Tiến độ được lưu trong trình duyệt của bạn." : "Your progress is saved in this browser."}</p>
          </div>

          {tech.related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-ink-3">{C.related}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tech.related.map((r) => {
                  const rt = getTechnique(lang, r)!;
                  return (
                    <li key={r} data-level={rt.level}>
                      <Link
                        href={techHref(lang, r)}
                        className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1.5 text-[15px] no-underline hover:border-ink-3"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--lv)" }} aria-hidden="true" />
                        {rt.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {sources.length > 0 && (
            <section className="mt-10" aria-labelledby="nguon">
              <h2 id="nguon" className="font-display text-2xl font-bold">
                {C.sources}
              </h2>
              <ul className="mt-3 grid gap-2">
                {sources.map((src) => (
                  <li key={src.url}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-baseline gap-2 text-[16px] no-underline">
                      <span className="w-[6.5rem] shrink-0 text-sm text-ink-3">{src.site}</span>
                      <span className="font-medium text-pen underline decoration-pen/30 underline-offset-4 group-hover:decoration-pen">{src.title}</span>
                      <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 self-center text-ink-3" aria-hidden="true">
                        <path d="M4.5 2H10v5.5M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="sr-only">{C.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-3">{C.sourcesNote}</p>
            </section>
          )}

          <nav aria-label={C.prevNext} className="no-print mt-12 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={techHref(lang, prev.slug)} className="rounded-xl border border-rule p-4 no-underline hover:border-ink-3">
                <span className="text-sm text-ink-3">{C.prev}</span>
                <span className="mt-1 block font-semibold">{prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={techHref(lang, next.slug)} className="rounded-xl border border-rule p-4 text-right no-underline hover:border-ink-3">
                <span className="text-sm text-ink-3">{C.next}</span>
                <span className="mt-1 block font-semibold">{next.name}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
