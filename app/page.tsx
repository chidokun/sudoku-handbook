import Link from "next/link";
import { Board } from "@/components/Board";
import { HeroBoard } from "@/components/HeroBoard";
import { Legend } from "@/components/Legend";
import { LevelGlyph } from "@/components/LevelGlyph";
import { LearnedMark, LevelProgress } from "@/components/Progress";
import { LEVELS } from "@/content/levels";
import { TECHNIQUES, techniquesOfLevel } from "@/content/techniques";
import { EXAMPLES, WALKTHROUGH } from "@/lib/examples";

const STAIR = ["md:mt-0", "md:mt-12", "md:mt-24"];

export default function Home() {
  const techUsed = new Set(WALKTHROUGH.steps.map((s) => s.tech));
  return (
    <>
      <section className="graph-paper border-b border-rule">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16 lg:py-20">
          <div className="max-w-[40rem]">
            <p className="inline-block rounded-md bg-surface px-2 py-0.5 text-[15px] font-medium text-ink-2">Sổ tay giải Sudoku bằng tiếng Việt</p>
            <h1 className="mt-5 font-display text-[clamp(2.9rem,7.2vw,5.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em] [font-stretch:92%]">
              Mọi con số đều có lý do.
            </h1>
            <p className="mt-6 max-w-[34rem] bg-paper/70 text-[19px] leading-relaxed text-ink-2">
              Sudoku không cần đoán. Sổ tay này dạy bạn lập luận để điền từng ô: từ những bước nhìn là thấy, tới những chuỗi suy luận nhiều mắt xích của đề khó.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/co-ban" className="inline-flex h-12 items-center rounded-xl bg-ink px-5 font-semibold text-paper no-underline hover:opacity-90">
                Bắt đầu từ luật chơi
              </Link>
              <Link
                href="/ky-thuat"
                className="inline-flex h-12 items-center rounded-xl border border-ink/25 bg-surface px-5 font-semibold no-underline hover:border-ink"
              >
                Xem {TECHNIQUES.length} kỹ thuật
              </Link>
            </div>
          </div>
          <HeroBoard example={EXAMPLES["hidden-single-box"]} />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 pt-20 sm:px-6" aria-labelledby="ba-tang">
        <div className="max-w-[46rem]">
          <h2 id="ba-tang" className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-tight">
            Ba tầng suy luận
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            Các kỹ thuật được xếp theo số bước lập luận cần có trước khi đặt được bút: một bước là điền ngay, hai bước là loại trước rồi điền, N bước là lần theo một chuỗi hệ quả.
          </p>
        </div>

        <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {LEVELS.map((l, idx) => {
            const items = techniquesOfLevel(l.level);
            return (
              <li key={l.slug} data-level={l.level} className={`border-t-[3px] pt-5 ${STAIR[idx]}`} style={{ borderColor: "var(--lv)" }}>
                <p className="flex items-center gap-2 font-semibold" style={{ color: "var(--lv)" }}>
                  <LevelGlyph level={l.level} className="text-xl" />
                  {l.tagline}
                </p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                  <Link href={`/suy-luan/${l.slug}`} className="no-underline hover:underline hover:decoration-2 hover:underline-offset-4">
                    {l.title}
                  </Link>
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{l.intro[0]}</p>
                <ul className="mt-5 grid gap-1">
                  {items.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/ky-thuat/${t.slug}`}
                        className="flex items-center justify-between gap-2 rounded-md py-1.5 text-[16px] font-medium no-underline hover:text-[var(--lv)]"
                      >
                        {t.name}
                        <LearnedMark slug={t.slug} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <LevelProgress slugs={items.map((t) => t.slug)} />
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mx-auto mt-24 grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" aria-labelledby="doc-ban-co">
        <div>
          <h2 id="doc-ban-co" className="font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold leading-tight tracking-tight">
            Cách đọc bàn cờ minh hoạ
          </h2>
          <p className="mt-4 max-w-[52ch] text-ink-2">
            Ô được gọi theo hàng và cột: <strong className="font-semibold text-ink">H3C5</strong> là ô ở hàng 3, cột 5. Số hàng ghi bên trái bàn cờ, số cột ghi phía trên. Khối được đánh số 1–9 theo thứ tự đọc, từ góc trên trái.
          </p>
          <p className="mt-3 max-w-[52ch] text-ink-2">
            Mỗi ví dụ là một bàn cờ thật lấy giữa lời giải của một đề. Bấm qua từng bước để xem lập luận hình thành, và bật &ldquo;Hiện ứng viên&rdquo; khi muốn thấy mọi khả năng của từng ô.
          </p>
        </div>
        <Legend />
      </section>

      <section className="mx-auto mt-24 max-w-[1320px] px-4 sm:px-6" aria-labelledby="giai-mau">
        <div className="grid items-center gap-10 rounded-3xl border border-rule bg-surface p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <h2 id="giai-mau" className="font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold leading-tight tracking-tight">
              Xem một đề được giải trọn vẹn
            </h2>
            <p className="mt-4 max-w-[54ch] text-ink-2">
              {WALKTHROUGH.steps.length} bước từ đề bài đến lời giải, dùng {techUsed.size} kỹ thuật khác nhau. Mỗi bước ghi rõ kỹ thuật và lý do, để bạn thấy các kỹ thuật phối hợp với nhau thế nào trong một ván thật.
            </p>
            <Link href="/giai-mau" className="mt-6 inline-flex h-11 items-center rounded-xl bg-pen px-5 font-semibold text-on-pen no-underline hover:opacity-90">
              Mở phần giải mẫu
            </Link>
          </div>
          <div className="mx-auto w-full max-w-[280px]">
            <Board grid={WALKTHROUGH.puzzle} givens={WALKTHROUGH.puzzle} labels={false} label="Đề bài của phần giải mẫu" />
          </div>
        </div>
      </section>
    </>
  );
}
