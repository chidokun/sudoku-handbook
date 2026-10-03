import Link from "next/link";
import { Board } from "@/components/Board";
import { Legend } from "@/components/Legend";
import { LevelGlyph } from "@/components/LevelGlyph";
import { EXAMPLES, WALKTHROUGH } from "@/lib/examples";
import { href, levelHref, type Lang } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { PEERS, basicCandidates, parseGrid } from "@/lib/sudoku/core";
import type { Color } from "@/lib/sudoku/types";

const S = ({ children }: { children: React.ReactNode }) => <strong className="font-semibold text-ink">{children}</strong>;

const COPY = {
  en: {
    title: "Basics: rules and pencil marks",
    description: "The rules of Sudoku, how rows, columns, boxes and cells are named, how to write pencil marks, and a routine for solving a puzzle.",
    heading: "The rules, and how to read the board",
    lead: (glossary: React.ReactNode) => <>Every technique in this handbook builds on the few ideas below. Read them once, then come back when you meet an unfamiliar word, or look it up in the {glossary}.</>,
    glossary: "glossary",
    toc: "On this page",
    sections: { rules: "Rules", names: "Names", sees: "Cells that see each other", cands: "Pencil marks", routine: "Solving routine", legend: "Colour key" },
    rulesTitle: "The rules",
    rulesLead: "Fill the 81 cells with the digits 1 to 9 so that every row, every column and every 3×3 box contains all nine digits, with no repeats.",
    rulesList: [
      <><S>Each row</S> (9 cells across) contains 1–9.</>,
      <><S>Each column</S> (9 cells down) contains 1–9.</>,
      <><S>Each box</S> (the 3×3 areas with thick borders) contains 1–9.</>,
    ],
    rulesP1: "A proper Sudoku has exactly one solution and can always be solved by reasoning, without guessing. The bold digits on the board are the givens; you may not change them.",
    rulesP2: "There is no arithmetic involved: the digits are just nine different symbols. You could replace them with nine colours and the game would be exactly the same.",
    puzzleLabel: "A Sudoku puzzle",
    namesTitle: "Names: rows, columns, boxes, cells",
    namesP: [
      <>Rows are numbered 1–9 from top to bottom, columns 1–9 from left to right. A cell is named by its row and column: <S>r3c5</S> is the cell in row 3, column 5 (highlighted yellow). The Vietnamese pages write the same cell as H3C5.</>,
      <>Boxes are numbered 1–9 in reading order: box 1 top left, box 3 top right, box 9 bottom right. r3c5 is in box 2.</>,
      <>Rows, columns and boxes are all called <S>units</S>. The board has 27 units, and every cell belongs to exactly three — the blue outlines show the three units of r3c5.</>,
      <>Three boxes side by side form a <S>band</S> across or a <S>stack</S> down. Many techniques scan by band because its three boxes share the same three rows (or columns).</>,
    ],
    namesLabel: "Cell r3c5 with row 3, column 5 and box 2",
    seesTitle: "Cells that see each other",
    seesP: [
      <>Two cells <S>see each other</S> when they share a row, a column or a box. Two cells that see each other can never hold the same digit.</>,
      <>Every cell sees exactly 20 others: 8 in its row, 8 in its column and 4 more in its box. The board shades the 20 cells that r5c5 sees.</>,
      <>Most advanced eliminations end with the same sentence: “a cell that sees both of these cells cannot be that digit”. Training your eye to find the cells two cells both see is well worth the effort.</>,
    ],
    seesLabel: "The 20 cells that r5c5 sees",
    candsTitle: "Writing pencil marks",
    candsP1: <><S>Candidates</S> are the digits a cell can still take: those not already in its row, column or box. Players write them small inside the cell; these are called pencil marks.</>,
    keypad: "Where digits 1 to 9 go inside a cell",
    keypadText: "Each digit has a fixed spot in the cell, like a phone keypad: 1 top left, 5 in the middle, 9 bottom right. That way you recognise patterns from positions at a glance, without reading every digit.",
    candsP2: "The board alongside has every candidate written in. Early in a puzzle, many players only note a digit when it has exactly two places in a box (Snyder notation): fewer marks, but it still reveals hidden singles and locked candidates.",
    candsP3: "Once you move on to 2-step reasoning, write them all. After placing a digit, immediately erase it from the candidates of the 20 cells it sees.",
    candsLabel: "A board with every candidate written in",
    routineTitle: "A routine for solving a puzzle",
    routineLead: "This order goes from the cheapest techniques to the most expensive. Whenever you make progress, go back to step one.",
    steps: [
      { title: "Scan for hidden singles digit by digit", body: "For each digit 1 to 9, cast rays from its copies and look for a box, row or column with only one place for it. Start with digits that appear often." },
      { title: "Pick off nearly full cells and units", body: "A unit with one empty cell, or a cell whose row + column + box already hold 8 digits, can be filled right away. After each placement, look again at its row, column and box." },
      { title: "When stuck, write all candidates", body: "Write every possible digit in every empty cell. Do it carefully once: missing or extra candidates make later techniques give wrong results." },
      { title: "Look for locked structures", body: "Try locked candidates (pointing, claiming), then naked and hidden pairs and triples. Each elimination may open up a new hidden single — go back to step 1." },
      { title: "For hard puzzles, follow the links", body: "List strong links and bivalue cells, and look for X-Wings, XY-Wings, colouring and chains. After every elimination, return to the simplest techniques." },
    ],
    legendTitle: "Colour key for the example boards",
    next: "Next step",
    nextTitle: "Start with the see-it-fill-it techniques",
    nextCta: "Open 1-step reasoning",
  },
  vi: {
    title: "Cơ bản: luật chơi và cách ghi ứng viên",
    description: "Luật chơi Sudoku, cách gọi tên hàng, cột, khối, ô, cách ghi ứng viên bằng bút chì và quy trình giải một đề.",
    heading: "Luật chơi và cách nhìn bàn cờ",
    lead: (glossary: React.ReactNode) => <>Mọi kỹ thuật trong sổ tay đều dựng trên vài khái niệm dưới đây. Đọc một lần, sau đó bạn có thể quay lại khi gặp từ lạ, hoặc tra ở trang {glossary}.</>,
    glossary: "thuật ngữ",
    toc: "Mục lục trang",
    sections: { rules: "Luật chơi", names: "Tên gọi", sees: "Ô nhìn thấy nhau", cands: "Ghi ứng viên", routine: "Quy trình giải", legend: "Chú giải màu" },
    rulesTitle: "Luật chơi",
    rulesLead: "Điền các số từ 1 đến 9 vào 81 ô sao cho mỗi hàng, mỗi cột và mỗi khối 3×3 đều có đủ chín số, không số nào lặp lại.",
    rulesList: [
      <><S>Mỗi hàng</S> (9 ô nằm ngang) chứa đủ 1–9.</>,
      <><S>Mỗi cột</S> (9 ô nằm dọc) chứa đủ 1–9.</>,
      <><S>Mỗi khối</S> (vùng 3×3 viền đậm) chứa đủ 1–9.</>,
    ],
    rulesP1: "Đề Sudoku chuẩn có đúng một lời giải, và luôn giải được bằng suy luận mà không cần đoán. Các số in đậm trên bàn là số cho sẵn; bạn không được thay đổi chúng.",
    rulesP2: "Không có phép tính nào ở đây: các chữ số chỉ là chín ký hiệu khác nhau. Bạn có thể thay chúng bằng chín màu và trò chơi vẫn y như cũ.",
    puzzleLabel: "Một đề Sudoku",
    namesTitle: "Tên gọi: hàng, cột, khối, ô",
    namesP: [
      <>Hàng đánh số 1–9 từ trên xuống, cột đánh số 1–9 từ trái sang. Một ô được gọi bằng hàng và cột của nó: <S>H3C5</S> là ô ở hàng 3, cột 5 (tô vàng bên cạnh). Tài liệu tiếng Anh viết cùng ô này là r3c5.</>,
      <>Khối được đánh số 1–9 theo thứ tự đọc: khối 1 ở góc trên trái, khối 3 ở góc trên phải, khối 9 ở góc dưới phải. H3C5 thuộc khối 2.</>,
      <>Hàng, cột và khối được gọi chung là <S>đơn vị</S>. Bàn cờ có 27 đơn vị, và mỗi ô thuộc đúng ba đơn vị — viền xanh bên cạnh là ba đơn vị của H3C5.</>,
      <>Ba khối nằm cạnh nhau theo chiều ngang tạo thành một <S>băng ngang</S>, theo chiều dọc là một <S>băng dọc</S>. Nhiều kỹ thuật quét theo băng vì ba khối trong băng chia nhau ba hàng (hoặc ba cột).</>,
    ],
    namesLabel: "Ô H3C5 cùng hàng 3, cột 5 và khối 2",
    seesTitle: "Ô nhìn thấy nhau",
    seesP: [
      <>Hai ô <S>nhìn thấy nhau</S> khi chúng chung hàng, chung cột hoặc chung khối. Hai ô nhìn thấy nhau không bao giờ mang cùng một số.</>,
      <>Mỗi ô nhìn thấy đúng 20 ô khác: 8 ô cùng hàng, 8 ô cùng cột và 4 ô còn lại trong khối. Hình bên tô xanh 20 ô mà H5C5 nhìn thấy.</>,
      <>Hầu hết phép loại trừ nâng cao đều kết thúc bằng câu: “ô nào nhìn thấy cả hai ô này thì không thể là số đó”. Luyện mắt nhận ra vùng nhìn thấy chung của hai ô là kỹ năng rất đáng đầu tư.</>,
    ],
    seesLabel: "20 ô mà H5C5 nhìn thấy",
    candsTitle: "Ghi ứng viên bằng bút chì",
    candsP1: <><S>Ứng viên</S> của một ô là các số còn có thể điền vào đó: chưa có trong hàng, cột, khối của ô. Người chơi ghi chúng bằng chữ nhỏ trong ô, gọi là ghi chú bút chì.</>,
    keypad: "Vị trí ghi các số 1 đến 9 trong một ô",
    keypadText: "Mỗi số có chỗ cố định trong ô, giống bàn phím điện thoại: 1 ở góc trên trái, 5 ở giữa, 9 ở góc dưới phải. Nhờ vậy bạn nhận ra mẫu hình chỉ bằng liếc qua vị trí, không cần đọc từng số.",
    candsP2: "Bàn bên cạnh là một thế cờ đã ghi đủ ứng viên. Ở đầu ván, nhiều người chỉ ghi một số khi nó có đúng hai chỗ trong khối (cách ghi của Snyder): ít chữ hơn nhưng vẫn làm lộ ra số duy nhất và khoá ứng viên.",
    candsP3: "Khi đã sang suy luận 2 bước, hãy ghi đủ. Sau mỗi số vừa điền, xoá ngay số đó khỏi ứng viên của 20 ô nó nhìn thấy.",
    candsLabel: "Bàn cờ đã ghi đủ ứng viên",
    routineTitle: "Quy trình giải một đề",
    routineLead: "Thứ tự này đi từ kỹ thuật rẻ nhất tới đắt nhất. Hễ có tiến triển, quay lại bước đầu.",
    steps: [
      { title: "Quét số duy nhất theo từng số", body: "Lần lượt với các số 1 đến 9, chiếu tia từ những bản đã có và tìm khối, hàng, cột chỉ còn một chỗ cho số đó. Ưu tiên số xuất hiện nhiều trên bàn." },
      { title: "Nhặt các ô gần đầy", body: "Đơn vị còn một ô trống, hoặc ô mà hàng + cột + khối đã có đủ 8 số, điền ngay. Sau mỗi số vừa điền, nhìn lại hàng, cột, khối của nó." },
      { title: "Khi bế tắc, ghi đủ ứng viên", body: "Ghi mọi số còn có thể vào từng ô trống. Làm cẩn thận một lần: ứng viên thiếu hoặc thừa sẽ khiến các kỹ thuật sau cho kết quả sai." },
      { title: "Tìm cấu trúc bị khoá", body: "Thử khoá ứng viên (chỉ hướng, chiếm khối), rồi cặp lộ, cặp ẩn, bộ ba. Mỗi phép loại trừ có thể mở ra một số duy nhất mới — quay lại bước 1." },
      { title: "Với đề khó, lần theo liên kết", body: "Liệt kê liên kết mạnh và ô hai ứng viên, tìm X-Wing, XY-Wing, tô màu, chuỗi. Sau mỗi phép loại, lại quay về các kỹ thuật đơn giản nhất." },
    ],
    legendTitle: "Chú giải màu trên bàn cờ minh hoạ",
    next: "Bước tiếp theo",
    nextTitle: "Bắt đầu với các kỹ thuật nhìn là điền được",
    nextCta: "Mở Suy luận 1 bước",
  },
};

export const basicsMeta = (lang: Lang) => pageMeta(lang, (l) => href(l, "basics"), COPY[lang].title, COPY[lang].description);

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

const TWO_COL = "mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]";

export function BasicsPage({ lang }: { lang: Lang }) {
  const C = COPY[lang];
  const puzzle = WALKTHROUGH.puzzle;
  const R3C5 = 2 * 9 + 4;
  const R5C5 = 4 * 9 + 4;
  const candEx = EXAMPLES["pointing"];
  const cands = basicCandidates(parseGrid(candEx.grid));
  const toc: [string, string][] = [
    ["luat", C.sections.rules],
    ["ten-goi", C.sections.names],
    ["nhin-thay", C.sections.sees],
    ["ung-vien", C.sections.cands],
    ["quy-trinh", C.sections.routine],
    ["chu-giai", C.sections.legend],
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">{C.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-lg text-ink-2">
        {C.lead(
          <Link href={href(lang, "glossary")} className="font-medium text-pen">
            {C.glossary}
          </Link>,
        )}
      </p>

      <nav aria-label={C.toc} className="mt-8 flex flex-wrap gap-2 text-[15px]">
        {toc.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-rule bg-surface px-3 py-1 no-underline hover:border-ink-3">
            {label}
          </a>
        ))}
      </nav>

      <Section id="luat" title={C.rulesTitle}>
        <div className={TWO_COL}>
          <div className="text-ink-2">
            <p className="text-[19px] text-ink">{C.rulesLead}</p>
            <ul className="mt-6 grid gap-4">
              {C.rulesList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mt-6">{C.rulesP1}</p>
            <p className="mt-4">{C.rulesP2}</p>
          </div>
          <Board grid={puzzle} givens={puzzle} label={C.puzzleLabel} />
        </div>
      </Section>

      <Section id="ten-goi" title={C.namesTitle}>
        <div className={TWO_COL}>
          <div className="text-ink-2">
            {C.namesP.map((p, i) => (
              <p key={i} className={i ? "mt-4" : ""}>
                {p}
              </p>
            ))}
          </div>
          <Board grid={puzzle} givens={puzzle} frame={{ title: "", text: "", units: [2, 13, 19], cells: [[R3C5, "focus"]] }} label={C.namesLabel} />
        </div>
      </Section>

      <Section id="nhin-thay" title={C.seesTitle}>
        <div className={TWO_COL}>
          <div className="text-ink-2">
            {C.seesP.map((p, i) => (
              <p key={i} className={i ? "mt-4" : ""}>
                {p}
              </p>
            ))}
          </div>
          <Board
            grid={puzzle}
            givens={puzzle}
            frame={{ title: "", text: "", cells: [...PEERS[R5C5].map((c) => [c, "pattern"] as [number, Color]), [R5C5, "focus"]] }}
            label={C.seesLabel}
          />
        </div>
      </Section>

      <Section id="ung-vien" title={C.candsTitle}>
        <div className={TWO_COL}>
          <div className="text-ink-2">
            <p>{C.candsP1}</p>
            <div className="mt-6 flex items-center gap-6">
              <svg viewBox="0 0 96 96" className="legend-svg h-28 w-28 shrink-0" role="img" aria-label={C.keypad}>
                <rect x="1" y="1" width="94" height="94" rx="4" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
                {Array.from({ length: 9 }, (_, i) => (
                  <text key={i} x={16 + (i % 3) * 32} y={17 + Math.floor(i / 3) * 31} className="bd-cand" style={{ fontSize: 20 }}>
                    {i + 1}
                  </text>
                ))}
              </svg>
              <p>{C.keypadText}</p>
            </div>
            <p className="mt-6">{C.candsP2}</p>
            <p className="mt-4">{C.candsP3}</p>
          </div>
          <Board grid={candEx.grid} givens={candEx.puzzle} cands={cands} showCands label={C.candsLabel} />
        </div>
      </Section>

      <Section id="quy-trinh" title={C.routineTitle}>
        <p className="mt-4 max-w-[62ch] text-ink-2">{C.routineLead}</p>
        <ol className="mt-8 grid gap-0 border-l-2 border-rule">
          {C.steps.map((s, i) => (
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

      <Section id="chu-giai" title={C.legendTitle}>
        <div className="mt-6">
          <Legend lang={lang} />
        </div>
      </Section>

      <div className="mt-20 rounded-2xl border border-rule bg-surface p-6 sm:p-8" data-level={1}>
        <p className="flex items-center gap-2 font-semibold" style={{ color: "var(--lv)" }}>
          <LevelGlyph level={1} /> {C.next}
        </p>
        <p className="mt-2 font-display text-2xl font-bold">{C.nextTitle}</p>
        <Link href={levelHref(lang, 1)} className="mt-5 inline-flex h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper no-underline hover:opacity-90">
          {C.nextCta}
        </Link>
      </div>
    </div>
  );
}
