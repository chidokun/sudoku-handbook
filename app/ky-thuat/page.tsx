import type { Metadata } from "next";
import Link from "next/link";
import { LevelGlyph } from "@/components/LevelGlyph";
import { LevelProgress } from "@/components/Progress";
import { TechList } from "@/components/TechList";
import { LEVELS } from "@/content/levels";
import { TECHNIQUES, techniquesOfLevel } from "@/content/techniques";

export const metadata: Metadata = {
  title: "Tất cả kỹ thuật",
  description: `${TECHNIQUES.length} kỹ thuật giải Sudoku xếp theo độ sâu suy luận: 1 bước, 2 bước và N bước.`,
};

export default function TechniquesIndex() {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight">
        {TECHNIQUES.length} kỹ thuật, xếp theo độ sâu suy luận
      </h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">
        Học theo thứ tự từ trên xuống. Mỗi kỹ thuật có một ví dụ lấy từ đề thật, đi qua từng bước lập luận cho tới khi điền được số hoặc loại được ứng viên.
      </p>

      {LEVELS.map((l) => {
        const items = techniquesOfLevel(l.level);
        return (
          <section key={l.slug} data-level={l.level} className="mt-16" aria-labelledby={`lv-${l.slug}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--lv)" }}>
                  <LevelGlyph level={l.level} /> {l.tagline}
                </p>
                <h2 id={`lv-${l.slug}`} className="mt-1 font-display text-3xl font-extrabold tracking-tight">
                  <Link href={`/suy-luan/${l.slug}`} className="no-underline hover:underline">
                    {l.title}
                  </Link>
                </h2>
              </div>
              <LevelProgress slugs={items.map((t) => t.slug)} />
            </div>
            <p className="mt-3 max-w-[62ch] text-ink-2">{l.when}</p>
            <div className="mt-6">
              <TechList items={items} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
