import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Difficulty } from "@/components/Difficulty";
import { ExamplePlayer } from "@/components/ExamplePlayer";
import { LevelChip } from "@/components/LevelGlyph";
import { LearnedToggle } from "@/components/Progress";
import { TechSidebar } from "@/components/TechSidebar";
import { levelInfo } from "@/content/levels";
import { SOURCES } from "@/content/sources";
import { neighbors, TECH_BY_SLUG, TECHNIQUES } from "@/content/techniques";
import { EXAMPLES } from "@/lib/examples";

export function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/ky-thuat/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = TECH_BY_SLUG[slug];
  if (!t) return {};
  return { title: `${t.name} (${t.alias.split(" · ")[0]})`, description: t.summary };
}

export default async function TechniquePage(props: PageProps<"/ky-thuat/[slug]">) {
  const { slug } = await props.params;
  const t = TECH_BY_SLUG[slug];
  if (!t) notFound();
  const lv = levelInfo(t.level);
  const example = EXAMPLES[t.slug];
  const { prev, next } = neighbors(t.slug);

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-8 sm:px-6 lg:pt-12">
      <div className="tech-layout" data-level={t.level}>
        <aside className="tl-nav no-print">
          <TechSidebar current={t.slug} />
        </aside>

        <header className="tl-head">
          <nav aria-label="Vị trí" className="text-sm text-ink-3">
            <Link href="/ky-thuat" className="no-underline hover:text-ink">
              Kỹ thuật
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href={`/suy-luan/${lv.slug}`} className="no-underline hover:text-ink">
              {lv.title}
            </Link>
          </nav>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.3rem)] font-extrabold leading-[1.12] tracking-tight">
            {t.name}
          </h1>
          <p className="mt-1 text-lg text-ink-3">{t.alias}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <LevelChip level={t.level}>{lv.title}</LevelChip>
            <span className="inline-flex items-center gap-2 text-sm text-ink-3">
              Độ khó <Difficulty value={t.difficulty} />
            </span>
          </div>
          <p className="mt-6 max-w-[62ch] text-[19px] leading-relaxed text-ink">{t.summary}</p>
          <div
            className="mt-6 max-w-[62ch] rounded-r-xl border-l-4 py-4 pl-5 pr-4"
            style={{ borderColor: "var(--lv)", background: "var(--lv-soft)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--lv)" }}>
              Quy tắc
            </p>
            <p className="mt-1 font-display text-[19px] font-semibold leading-snug">{t.rule}</p>
          </div>
        </header>

        <section className="tl-ex" aria-label="Ví dụ minh hoạ">
          {example ? (
            <ExamplePlayer example={example} />
          ) : (
            <p className="text-ink-3">Chưa có ví dụ cho kỹ thuật này.</p>
          )}
        </section>

        <div className="tl-body max-w-[66ch]">
          <section>
            <h2 className="font-display text-2xl font-bold">Ý tưởng</h2>
            <div className="prose-vi mt-3 text-ink-2">
              {t.idea.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Cách nhận biết</h2>
            <ul className="mt-3 grid gap-2.5 text-ink-2">
              {t.spot.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--lv)" }} aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Lỗi thường gặp</h2>
            <ul className="mt-3 grid gap-2.5 text-ink-2">
              {t.pitfalls.map((p, i) => (
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
            <LearnedToggle slug={t.slug} />
            <p className="text-sm text-ink-3">Tiến độ được lưu trong trình duyệt của bạn.</p>
          </div>

          {t.related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-ink-3">Kỹ thuật liên quan</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.related.map((r) => {
                  const rt = TECH_BY_SLUG[r];
                  return (
                    <li key={r} data-level={rt.level}>
                      <Link
                        href={`/ky-thuat/${r}`}
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

          {SOURCES[t.slug]?.length > 0 && (
            <section className="mt-10" aria-labelledby="nguon">
              <h2 id="nguon" className="font-display text-2xl font-bold">
                Nguồn tham khảo
              </h2>
              <ul className="mt-3 grid gap-2">
                {SOURCES[t.slug].map((src) => (
                  <li key={src.url}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-baseline gap-2 text-[16px] no-underline"
                    >
                      <span className="w-[6.5rem] shrink-0 text-sm text-ink-3">{src.site}</span>
                      <span className="font-medium text-pen underline decoration-pen/30 underline-offset-4 group-hover:decoration-pen">
                        {src.title}
                      </span>
                      <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 self-center text-ink-3" aria-hidden="true">
                        <path d="M4.5 2H10v5.5M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="sr-only">(mở trong thẻ mới)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-3">
                Tài liệu tiếng Anh. Tên tiếng Việt của kỹ thuật do sổ tay đặt; dùng tên tiếng Anh ({t.alias.split(" · ")[0]}) để tra thêm. Ví dụ trên trang này được sinh từ đề ngẫu nhiên, không lấy từ các nguồn trên.
              </p>
            </section>
          )}

          <nav aria-label="Kỹ thuật trước và sau" className="no-print mt-12 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/ky-thuat/${prev.slug}`} className="rounded-xl border border-rule p-4 no-underline hover:border-ink-3">
                <span className="text-sm text-ink-3">Kỹ thuật trước</span>
                <span className="mt-1 block font-semibold">{prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/ky-thuat/${next.slug}`} className="rounded-xl border border-rule p-4 text-right no-underline hover:border-ink-3">
                <span className="text-sm text-ink-3">Kỹ thuật tiếp theo</span>
                <span className="mt-1 block font-semibold">{next.name}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
