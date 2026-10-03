import type { Metadata } from "next";
import Link from "next/link";
import { Difficulty } from "@/components/Difficulty";
import { LevelGlyph } from "@/components/LevelGlyph";
import { PrintButton } from "@/components/PrintButton";
import { TechThumb } from "@/components/TechList";
import { LEVELS } from "@/content/levels";
import { techniquesOfLevel } from "@/content/techniques";

export const metadata: Metadata = {
  title: "Bảng tóm tắt",
  description: "Mọi kỹ thuật giải Sudoku trên một trang: quy tắc ngắn gọn và hình minh hoạ, có thể in ra giấy.",
};

export default function CheatSheet() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">Bảng tóm tắt</h1>
          <p className="mt-3 max-w-[60ch] text-lg text-ink-2">Mỗi kỹ thuật một dòng quy tắc. Hình nhỏ tô các ô tạo nên mẫu hình trong ví dụ của kỹ thuật đó.</p>
        </div>
        <PrintButton />
      </div>

      {LEVELS.map((l) => (
        <section key={l.slug} data-level={l.level} className="mt-14 print-avoid" aria-labelledby={`tt-${l.slug}`}>
          <h2 id={`tt-${l.slug}`} className="flex items-center gap-3 border-b-2 pb-2 font-display text-2xl font-extrabold tracking-tight" style={{ borderColor: "var(--lv)" }}>
            <span style={{ color: "var(--lv)" }}>
              <LevelGlyph level={l.level} />
            </span>
            {l.title}
            <span className="text-base font-medium text-ink-3">{l.tagline}</span>
          </h2>
          <ul className="mt-2 grid gap-x-10 md:grid-cols-2">
            {techniquesOfLevel(l.level).map((t) => (
              <li key={t.slug} className="print-avoid border-b border-rule py-4">
                <Link href={`/ky-thuat/${t.slug}`} className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 no-underline">
                  <TechThumb slug={t.slug} />
                  <div>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-lg font-bold">{t.name}</span>
                      <span className="text-sm text-ink-3">{t.alias.split(" · ")[0]}</span>
                    </p>
                    <p className="mt-1 text-[15px] leading-snug text-ink-2">{t.rule}</p>
                    <p className="mt-1.5">
                      <Difficulty value={t.difficulty} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-14 print-avoid rounded-2xl border border-rule bg-surface p-6" aria-labelledby="tt-nho">
        <h2 id="tt-nho" className="font-display text-xl font-bold">Ba điều cần nhớ</h2>
        <ul className="mt-3 grid gap-2 text-ink-2 md:grid-cols-3 md:gap-6">
          <li>Luôn thử kỹ thuật đơn giản nhất trước. Sau mỗi phép loại, quay lại tìm số duy nhất.</li>
          <li>Liên kết mạnh: &ldquo;không phải A thì là B&rdquo;. Liên kết yếu: &ldquo;là A thì không phải B&rdquo;. Mọi chuỗi xen kẽ hai loại này.</li>
          <li>Kết luận quen thuộc nhất: ô nhìn thấy cả hai đầu của một cặp &ldquo;ít nhất một là d&rdquo; thì không thể là d.</li>
        </ul>
      </section>
    </div>
  );
}
