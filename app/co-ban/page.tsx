import type { Metadata } from "next";
import Link from "next/link";
import { Board } from "@/components/Board";
import { Legend } from "@/components/Legend";
import { LevelGlyph } from "@/components/LevelGlyph";
import { EXAMPLES, WALKTHROUGH } from "@/lib/examples";
import { PEERS, basicCandidates, parseGrid } from "@/lib/sudoku/core";
import type { Color } from "@/lib/sudoku/types";

export const metadata: Metadata = {
  title: "Cơ bản: luật chơi và cách ghi ứng viên",
  description: "Luật chơi Sudoku, cách gọi tên hàng, cột, khối, ô, cách ghi ứng viên bằng bút chì và quy trình giải một đề.",
};

const STEPS = [
  {
    title: "Quét số duy nhất theo từng số",
    body: "Lần lượt với các số 1 đến 9, chiếu tia từ những bản đã có và tìm khối, hàng, cột chỉ còn một chỗ cho số đó. Ưu tiên số xuất hiện nhiều trên bàn.",
  },
  {
    title: "Nhặt các ô gần đầy",
    body: "Đơn vị còn một ô trống, hoặc ô mà hàng + cột + khối đã có đủ 8 số, điền ngay. Sau mỗi số vừa điền, nhìn lại hàng, cột, khối của nó.",
  },
  {
    title: "Khi bế tắc, ghi đủ ứng viên",
    body: "Ghi mọi số còn có thể vào từng ô trống. Làm cẩn thận một lần: ứng viên thiếu hoặc thừa sẽ khiến các kỹ thuật sau cho kết quả sai.",
  },
  {
    title: "Tìm cấu trúc bị khoá",
    body: "Thử khoá ứng viên (chỉ hướng, chiếm khối), rồi cặp lộ, cặp ẩn, bộ ba. Mỗi phép loại trừ có thể mở ra một số duy nhất mới — quay lại bước 1.",
  },
  {
    title: "Với đề khó, lần theo liên kết",
    body: "Liệt kê liên kết mạnh và ô hai ứng viên, tìm X-Wing, XY-Wing, tô màu, chuỗi. Sau mỗi phép loại, lại quay về các kỹ thuật đơn giản nhất.",
  },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20 scroll-mt-24" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold leading-tight tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Basics() {
  const puzzle = WALKTHROUGH.puzzle;
  const H3C5 = 2 * 9 + 4;
  const H5C5 = 4 * 9 + 4;
  const candEx = EXAMPLES["pointing"];
  const candGrid = parseGrid(candEx.grid);
  const cands = basicCandidates(candGrid);

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">Luật chơi và cách nhìn bàn cờ</h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">
        Mọi kỹ thuật trong sổ tay đều dựng trên vài khái niệm dưới đây. Đọc một lần, sau đó bạn có thể quay lại khi gặp từ lạ, hoặc tra ở trang{" "}
        <Link href="/thuat-ngu" className="font-medium text-pen">
          thuật ngữ
        </Link>
        .
      </p>

      <nav aria-label="Mục lục trang" className="mt-8 flex flex-wrap gap-2 text-[15px]">
        {[
          ["luat", "Luật chơi"],
          ["ten-goi", "Tên gọi"],
          ["nhin-thay", "Ô nhìn thấy nhau"],
          ["ung-vien", "Ghi ứng viên"],
          ["quy-trinh", "Quy trình giải"],
          ["chu-giai", "Chú giải màu"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-rule bg-surface px-3 py-1 no-underline hover:border-ink-3">
            {label}
          </a>
        ))}
      </nav>

      <Section id="luat" title="Luật chơi">
        <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="text-ink-2">
            <p className="text-[19px] text-ink">
              Điền các số từ 1 đến 9 vào 81 ô sao cho mỗi hàng, mỗi cột và mỗi khối 3×3 đều có đủ chín số, không số nào lặp lại.
            </p>
            <ul className="mt-6 grid gap-4">
              <li>
                <strong className="font-semibold text-ink">Mỗi hàng</strong> (9 ô nằm ngang) chứa đủ 1–9.
              </li>
              <li>
                <strong className="font-semibold text-ink">Mỗi cột</strong> (9 ô nằm dọc) chứa đủ 1–9.
              </li>
              <li>
                <strong className="font-semibold text-ink">Mỗi khối</strong> (vùng 3×3 viền đậm) chứa đủ 1–9.
              </li>
            </ul>
            <p className="mt-6">
              Đề Sudoku chuẩn có đúng một lời giải, và luôn giải được bằng suy luận mà không cần đoán. Các số in đậm trên bàn là số cho sẵn; bạn không được thay đổi chúng.
            </p>
            <p className="mt-4">
              Không có phép tính nào ở đây: các chữ số chỉ là chín ký hiệu khác nhau. Bạn có thể thay chúng bằng chín màu và trò chơi vẫn y như cũ.
            </p>
          </div>
          <Board grid={puzzle} givens={puzzle} label="Một đề Sudoku" />
        </div>
      </Section>

      <Section id="ten-goi" title="Tên gọi: hàng, cột, khối, ô">
        <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="text-ink-2">
            <p>
              Hàng đánh số 1–9 từ trên xuống, cột đánh số 1–9 từ trái sang. Một ô được gọi bằng hàng và cột của nó:{" "}
              <strong className="font-semibold text-ink">H3C5</strong> là ô ở hàng 3, cột 5 (tô vàng bên cạnh). Tài liệu tiếng Anh viết cùng ô này là r3c5.
            </p>
            <p className="mt-4">
              Khối được đánh số 1–9 theo thứ tự đọc: khối 1 ở góc trên trái, khối 3 ở góc trên phải, khối 9 ở góc dưới phải. H3C5 thuộc khối 2.
            </p>
            <p className="mt-4">
              Hàng, cột và khối được gọi chung là <strong className="font-semibold text-ink">đơn vị</strong>. Bàn cờ có 27 đơn vị, và mỗi ô thuộc đúng ba đơn vị — viền xanh bên cạnh là ba đơn vị của H3C5.
            </p>
            <p className="mt-4">
              Ba khối nằm cạnh nhau theo chiều ngang tạo thành một <strong className="font-semibold text-ink">băng ngang</strong>, theo chiều dọc là một{" "}
              <strong className="font-semibold text-ink">băng dọc</strong>. Nhiều kỹ thuật quét theo băng vì ba khối trong băng chia nhau ba hàng (hoặc ba cột).
            </p>
          </div>
          <Board
            grid={puzzle}
            givens={puzzle}
            frame={{ title: "", text: "", units: [2, 13, 19], cells: [[H3C5, "focus"]] }}
            label="Ô H3C5 cùng hàng 3, cột 5 và khối 2"
          />
        </div>
      </Section>

      <Section id="nhin-thay" title="Ô nhìn thấy nhau">
        <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="text-ink-2">
            <p>
              Hai ô <strong className="font-semibold text-ink">nhìn thấy nhau</strong> khi chúng chung hàng, chung cột hoặc chung khối. Hai ô nhìn thấy nhau không bao giờ mang cùng một số.
            </p>
            <p className="mt-4">
              Mỗi ô nhìn thấy đúng 20 ô khác: 8 ô cùng hàng, 8 ô cùng cột và 4 ô còn lại trong khối. Hình bên tô xanh 20 ô mà H5C5 nhìn thấy.
            </p>
            <p className="mt-4">
              Hầu hết phép loại trừ nâng cao đều kết thúc bằng câu: &ldquo;ô nào nhìn thấy cả hai ô này thì không thể là số đó&rdquo;. Luyện mắt nhận ra vùng nhìn thấy chung của hai ô là kỹ năng rất đáng đầu tư.
            </p>
          </div>
          <Board
            grid={puzzle}
            givens={puzzle}
            frame={{ title: "", text: "", cells: [...PEERS[H5C5].map((c) => [c, "pattern"] as [number, Color]), [H5C5, "focus"]] }}
            label="20 ô mà H5C5 nhìn thấy"
          />
        </div>
      </Section>

      <Section id="ung-vien" title="Ghi ứng viên bằng bút chì">
        <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="text-ink-2">
            <p>
              <strong className="font-semibold text-ink">Ứng viên</strong> của một ô là các số còn có thể điền vào đó: chưa có trong hàng, cột, khối của ô. Người chơi ghi chúng bằng chữ nhỏ trong ô, gọi là ghi chú bút chì.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <svg viewBox="0 0 96 96" className="legend-svg h-28 w-28 shrink-0" aria-label="Vị trí ghi các số 1 đến 9 trong một ô">
                <rect x="1" y="1" width="94" height="94" rx="4" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
                {Array.from({ length: 9 }, (_, i) => (
                  <text key={i} x={16 + (i % 3) * 32} y={17 + Math.floor(i / 3) * 31} className="bd-cand" style={{ fontSize: 20 }}>
                    {i + 1}
                  </text>
                ))}
              </svg>
              <p>
                Mỗi số có chỗ cố định trong ô, giống bàn phím điện thoại: 1 ở góc trên trái, 5 ở giữa, 9 ở góc dưới phải. Nhờ vậy bạn nhận ra mẫu hình chỉ bằng liếc qua vị trí, không cần đọc từng số.
              </p>
            </div>
            <p className="mt-6">
              Bàn bên cạnh là một thế cờ đã ghi đủ ứng viên. Ở đầu ván, nhiều người chỉ ghi một số khi nó có đúng hai chỗ trong khối (cách ghi của Snyder): ít chữ hơn nhưng vẫn làm lộ ra số duy nhất và khoá ứng viên.
            </p>
            <p className="mt-4">
              Khi đã sang suy luận 2 bước, hãy ghi đủ. Sau mỗi số vừa điền, xoá ngay số đó khỏi ứng viên của 20 ô nó nhìn thấy.
            </p>
          </div>
          <Board grid={candEx.grid} givens={candEx.puzzle} cands={cands} showCands label="Bàn cờ đã ghi đủ ứng viên" />
        </div>
      </Section>

      <Section id="quy-trinh" title="Quy trình giải một đề">
        <p className="mt-4 max-w-[62ch] text-ink-2">Thứ tự này đi từ kỹ thuật rẻ nhất tới đắt nhất. Hễ có tiến triển, quay lại bước đầu.</p>
        <ol className="mt-8 grid gap-0 border-l-2 border-rule">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative pb-8 pl-8 last:pb-0">
              <span className="absolute -left-[15px] top-0 grid h-7 w-7 place-items-center rounded-full border-2 border-rule bg-paper text-sm font-bold tabular-nums">
                {i + 1}
              </span>
              <p className="font-display text-xl font-bold leading-7">{s.title}</p>
              <p className="mt-1 max-w-[62ch] text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="chu-giai" title="Chú giải màu trên bàn cờ minh hoạ">
        <div className="mt-6">
          <Legend />
        </div>
      </Section>

      <div className="mt-20 rounded-2xl border border-rule bg-surface p-6 sm:p-8" data-level={1}>
        <p className="flex items-center gap-2 font-semibold" style={{ color: "var(--lv)" }}>
          <LevelGlyph level={1} /> Bước tiếp theo
        </p>
        <p className="mt-2 font-display text-2xl font-bold">Bắt đầu với các kỹ thuật nhìn là điền được</p>
        <Link href="/suy-luan/1-buoc" className="mt-5 inline-flex h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper no-underline hover:opacity-90">
          Mở Suy luận 1 bước
        </Link>
      </div>
    </div>
  );
}
