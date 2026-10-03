import type { Metadata } from "next";
import Link from "next/link";
import { Walkthrough } from "@/components/Walkthrough";
import { TECH_BY_SLUG, TECHNIQUES } from "@/content/techniques";
import { WALKTHROUGH } from "@/lib/examples";

export const metadata: Metadata = {
  title: "Giải mẫu một đề",
  description: "Theo dõi một đề Sudoku được giải trọn vẹn từng bước, mỗi bước ghi rõ kỹ thuật và lý do.",
};

export default function WalkthroughPage() {
  const techs = Object.fromEntries(TECHNIQUES.map((t) => [t.slug, { name: t.name, level: t.level }]));
  const counts = new Map<string, number>();
  for (const s of WALKTHROUGH.steps) counts.set(s.tech, (counts.get(s.tech) ?? 0) + 1);
  const used = TECHNIQUES.filter((t) => counts.has(t.slug));

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">Giải mẫu một đề</h1>
      <p className="mt-4 max-w-[64ch] text-lg text-ink-2">
        Một đề độ khó trung bình, giải trọn trong {WALKTHROUGH.steps.length} bước. Bộ giải luôn chọn kỹ thuật đơn giản nhất còn dùng được, đúng như quy trình trong phần{" "}
        <Link href="/co-ban#quy-trinh" className="font-medium text-pen">
          cơ bản
        </Link>
        : hết số duy nhất mới chuyển sang suy luận 2 bước, loại xong lại quay về điền số.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Các kỹ thuật được dùng">
        {used.map((t) => (
          <li key={t.slug} data-level={t.level}>
            <Link
              href={`/ky-thuat/${t.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1 text-[15px] no-underline hover:border-ink-3"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--lv)" }} aria-hidden="true" />
              {TECH_BY_SLUG[t.slug].name}
              <span className="tabular-nums text-ink-3">×{counts.get(t.slug)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Walkthrough data={WALKTHROUGH} techs={techs} />
      </div>
    </div>
  );
}
