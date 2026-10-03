import Link from "next/link";
import { notFound } from "next/navigation";
import { LevelGlyph } from "@/components/LevelGlyph";
import { LevelProgress } from "@/components/Progress";
import { TechList } from "@/components/TechList";
import { getLevels, levelBySlug } from "@/content/levels";
import { techniquesOfLevel } from "@/content/techniques";
import { href, levelHref, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

const COPY = {
  en: {
    crumbs: "Breadcrumb",
    techniques: "Techniques",
    questions: "Two guiding questions",
    when: "When to use it:",
    count: (n: number) => `${n} techniques`,
    others: "Other levels",
    prev: "Previous level",
    next: "Next level",
    noRules: "New to the rules?",
    readBasics: "Read the basics",
    together: "Putting it together",
    seeWalk: "See a full walkthrough",
  },
  vi: {
    crumbs: "Vị trí",
    techniques: "Kỹ thuật",
    questions: "Hai câu hỏi dẫn đường",
    when: "Khi nào dùng:",
    count: (n: number) => `${n} kỹ thuật`,
    others: "Tầng khác",
    prev: "Tầng trước",
    next: "Tầng tiếp theo",
    noRules: "Chưa nắm luật chơi?",
    readBasics: "Đọc phần cơ bản",
    together: "Tổng hợp lại",
    seeWalk: "Xem giải mẫu một đề",
  },
};

export function levelMeta(lang: Lang, slug: string) {
  const l = levelBySlug(lang, slug);
  if (!l) return {};
  return pageMeta(lang, (x) => levelHref(x, l.level), l.title, `${l.tagline}. ${l.intro[0]}`);
}

export function LevelPage({ lang, slug }: { lang: Lang; slug: string }) {
  const l = levelBySlug(lang, slug);
  if (!l) notFound();
  const C = COPY[lang];
  const levels = getLevels(lang);
  const items = techniquesOfLevel(lang, l.level);
  const nextLevel = levels[l.level];
  const prevLevel = levels[l.level - 2];
  const card = "rounded-xl border border-rule p-4 no-underline hover:border-ink-3";

  return (
    <div data-level={l.level}>
      <section className="border-b border-rule" style={{ background: "var(--lv-soft)" }}>
        <div className="mx-auto max-w-[980px] px-4 py-14 sm:px-6">
          <nav aria-label={C.crumbs} className="text-sm text-ink-3">
            <Link href={href(lang, "techniques")} className="no-underline hover:text-ink">
              {C.techniques}
            </Link>
          </nav>
          <p className="mt-6 flex items-center gap-3 text-lg font-semibold" style={{ color: "var(--lv)" }}>
            <LevelGlyph level={l.level} className="text-2xl" />
            {l.tagline}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.4rem)] font-extrabold leading-[1.08] tracking-tight">{l.title}</h1>
          <div className="prose-vi mt-6 max-w-[64ch] text-[18px] text-ink-2">
            {l.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[980px] px-4 sm:px-6">
        <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label={C.questions}>
          {l.mindset.map((m) => (
            <div key={m.q} className="border-t-2 pt-4" style={{ borderColor: "var(--lv)" }}>
              <p className="font-display text-2xl font-bold">{m.q}</p>
              <p className="mt-2 text-ink-2">{m.a}</p>
            </div>
          ))}
        </section>

        <p className="mt-10 max-w-[64ch] text-ink-2">
          <strong className="font-semibold text-ink">{C.when}</strong> {l.when}
        </p>

        <section className="mt-12" aria-labelledby="ds">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="ds" className="font-display text-3xl font-extrabold tracking-tight">
              {C.count(items.length)}
            </h2>
            <LevelProgress slugs={items.map((x) => x.slug)} lang={lang} />
          </div>
          <div className="mt-6">
            <TechList items={items} lang={lang} />
          </div>
        </section>

        <nav aria-label={C.others} className="mt-12 grid gap-3 sm:grid-cols-2">
          {prevLevel ? (
            <Link href={levelHref(lang, prevLevel.level)} data-level={prevLevel.level} className={card}>
              <span className="text-sm text-ink-3">{C.prev}</span>
              <span className="mt-1 flex items-center gap-2 font-semibold">
                <LevelGlyph level={prevLevel.level} />
                {prevLevel.title}
              </span>
            </Link>
          ) : (
            <Link href={href(lang, "basics")} className={card}>
              <span className="text-sm text-ink-3">{C.noRules}</span>
              <span className="mt-1 block font-semibold">{C.readBasics}</span>
            </Link>
          )}
          {nextLevel ? (
            <Link href={levelHref(lang, nextLevel.level)} data-level={nextLevel.level} className={`${card} text-right`}>
              <span className="text-sm text-ink-3">{C.next}</span>
              <span className="mt-1 flex items-center justify-end gap-2 font-semibold">
                <LevelGlyph level={nextLevel.level} />
                {nextLevel.title}
              </span>
            </Link>
          ) : (
            <Link href={href(lang, "walkthrough")} className={`${card} text-right`}>
              <span className="text-sm text-ink-3">{C.together}</span>
              <span className="mt-1 block font-semibold">{C.seeWalk}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
