import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LevelGlyph } from "@/components/LevelGlyph";
import { LevelProgress } from "@/components/Progress";
import { TechList } from "@/components/TechList";
import { LEVEL_BY_SLUG, LEVELS } from "@/content/levels";
import { techniquesOfLevel } from "@/content/techniques";

export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/suy-luan/[level]">): Promise<Metadata> {
  const { level } = await props.params;
  const l = LEVEL_BY_SLUG[level];
  if (!l) return {};
  return { title: l.title, description: `${l.tagline}. ${l.intro[0]}` };
}

export default async function LevelPage(props: PageProps<"/suy-luan/[level]">) {
  const { level } = await props.params;
  const l = LEVEL_BY_SLUG[level];
  if (!l) notFound();
  const items = techniquesOfLevel(l.level);
  const nextLevel = LEVELS[l.level];
  const prevLevel = LEVELS[l.level - 2];

  return (
    <div data-level={l.level}>
      <section className="border-b border-rule" style={{ background: "var(--lv-soft)" }}>
        <div className="mx-auto max-w-[980px] px-4 py-14 sm:px-6">
          <nav aria-label="Vị trí" className="text-sm text-ink-3">
            <Link href="/ky-thuat" className="no-underline hover:text-ink">
              Kỹ thuật
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
        <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Hai câu hỏi dẫn đường">
          {l.mindset.map((m) => (
            <div key={m.q} className="border-t-2 pt-4" style={{ borderColor: "var(--lv)" }}>
              <p className="font-display text-2xl font-bold">{m.q}</p>
              <p className="mt-2 text-ink-2">{m.a}</p>
            </div>
          ))}
        </section>

        <p className="mt-10 max-w-[64ch] text-ink-2">
          <strong className="font-semibold text-ink">Khi nào dùng:</strong> {l.when}
        </p>

        <section className="mt-12" aria-labelledby="ds">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="ds" className="font-display text-3xl font-extrabold tracking-tight">
              {items.length} kỹ thuật
            </h2>
            <LevelProgress slugs={items.map((t) => t.slug)} />
          </div>
          <div className="mt-6">
            <TechList items={items} />
          </div>
        </section>

        <nav aria-label="Tầng khác" className="mt-12 grid gap-3 sm:grid-cols-2">
          {prevLevel ? (
            <Link href={`/suy-luan/${prevLevel.slug}`} data-level={prevLevel.level} className="rounded-xl border border-rule p-4 no-underline hover:border-ink-3">
              <span className="text-sm text-ink-3">Tầng trước</span>
              <span className="mt-1 flex items-center gap-2 font-semibold">
                <LevelGlyph level={prevLevel.level} />
                {prevLevel.title}
              </span>
            </Link>
          ) : (
            <Link href="/co-ban" className="rounded-xl border border-rule p-4 no-underline hover:border-ink-3">
              <span className="text-sm text-ink-3">Chưa nắm luật chơi?</span>
              <span className="mt-1 block font-semibold">Đọc phần cơ bản</span>
            </Link>
          )}
          {nextLevel ? (
            <Link href={`/suy-luan/${nextLevel.slug}`} data-level={nextLevel.level} className="rounded-xl border border-rule p-4 text-right no-underline hover:border-ink-3">
              <span className="text-sm text-ink-3">Tầng tiếp theo</span>
              <span className="mt-1 flex items-center justify-end gap-2 font-semibold">
                <LevelGlyph level={nextLevel.level} />
                {nextLevel.title}
              </span>
            </Link>
          ) : (
            <Link href="/giai-mau" className="rounded-xl border border-rule p-4 text-right no-underline hover:border-ink-3">
              <span className="text-sm text-ink-3">Tổng hợp lại</span>
              <span className="mt-1 block font-semibold">Xem giải mẫu một đề</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
