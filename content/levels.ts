import type { Lang, Level } from "@/lib/sudoku/types";

export interface LevelInfo {
  level: Level;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  intro: string[];
  when: string;
  mindset: { q: string; a: string }[];
}

const LEVELS_VI: LevelInfo[] = [
  {
    level: 1,
    slug: "1-step",
    title: "Suy luận 1 bước",
    short: "1 bước",
    tagline: "Nhìn là điền được",
    intro: [
      "Ở tầng này, mỗi kết luận chỉ cần một bước quan sát: bạn nhìn các số đã có và thấy ngay một ô chỉ nhận được một số, hoặc một số chỉ còn một chỗ để đặt. Không cần ghi chú, không cần giả định.",
      "Có hai câu hỏi để hỏi bàn cờ. Nhìn từ ô: \"ô này nhận được số nào?\". Nhìn từ số: \"số này đặt được ở đâu trong đơn vị?\". Phần lớn đề dễ và trung bình được giải trọn chỉ bằng bốn kỹ thuật dưới đây.",
    ],
    when: "Luôn là thứ đầu tiên bạn tìm, và là thứ bạn quay lại sau mỗi phép loại trừ ở các tầng cao hơn.",
    mindset: [
      { q: "Số này đặt ở đâu?", a: "Chọn một số, quét tia từ các bản sao của nó để tìm chỗ trống duy nhất trong khối, hàng hoặc cột." },
      { q: "Ô này là số mấy?", a: "Chọn một ô, gom các số trong hàng, cột, khối của nó. Thiếu đúng một số là xong." },
    ],
  },
  {
    level: 2,
    slug: "2-step",
    title: "Suy luận 2 bước",
    short: "2 bước",
    tagline: "Loại trước, điền sau",
    intro: [
      "Khi không còn ô nào điền ngay được, bạn cần một bước trung gian: chứng minh rằng một số không thể nằm ở vài ô nào đó. Bước thứ nhất là tìm một cấu trúc bị khoá — một số bị giam trong giao của khối và hàng, hoặc một nhóm số chiếm trọn một nhóm ô. Bước thứ hai là dùng phép loại trừ đó để mở ra một bước điền số mới.",
      "Từ tầng này trở đi, hãy ghi ứng viên (ghi chú bút chì) cho mọi ô trống. Các mẫu hình ở đây chỉ lộ ra khi bạn nhìn thấy đầy đủ các khả năng của từng ô.",
    ],
    when: "Khi đã quét hết số duy nhất và ô chỉ còn một số mà bàn cờ vẫn đứng yên.",
    mindset: [
      { q: "Số này bị giam ở đâu?", a: "Nếu một số trong khối chỉ nằm trên một hàng (hoặc ngược lại), nó chiếm chỗ của hàng đó: khoá ứng viên." },
      { q: "Nhóm ô nào đã bị chiếm?", a: "N ô chỉ chứa N số (bộ lộ), hoặc N số chỉ nằm trong N ô (bộ ẩn): các số ấy không thể xuất hiện ở chỗ khác." },
    ],
  },
  {
    level: 3,
    slug: "n-step",
    title: "Suy luận N bước",
    short: "N bước",
    tagline: "Chuỗi lập luận nối tiếp",
    intro: [
      "Các đề khó đòi hỏi lập luận dài hơn: \"nếu ô A là x thì ô B không thể là y, vậy ô C phải là y, vậy…\". Các kỹ thuật ở tầng này là những chuỗi suy luận đã được đóng gói thành mẫu hình dễ nhận ra: cá (X-Wing, Swordfish), cánh (XY-Wing, W-Wing), chuỗi và tô màu, cùng các mẹo dựa vào tính duy nhất của lời giải.",
      "Tất cả đều dựng từ hai loại liên kết. Liên kết mạnh: trong một đơn vị, số d chỉ có đúng hai chỗ — nếu chỗ này không phải d thì chỗ kia chắc chắn là d. Liên kết yếu: hai ứng viên không thể cùng đúng — nếu cái này đúng thì cái kia sai. Một chuỗi suy luận hợp lệ luôn xen kẽ \"không phải… thì là…\" (mạnh) và \"là… thì không phải…\" (yếu).",
      "Khi mọi mẫu hình đều cạn, người chơi dùng chuỗi ép (forcing chain): thử lần lượt từng khả năng của một ô và theo dõi hệ quả; nếu mọi nhánh cùng dẫn tới một kết luận, kết luận đó đúng. Đây vẫn là suy luận, không phải đoán mò.",
    ],
    when: "Khi các kỹ thuật 2 bước không còn loại được gì, thường chỉ ở đề khó và rất khó.",
    mindset: [
      { q: "Liên kết mạnh ở đâu?", a: "Liệt kê các đơn vị chỉ còn hai chỗ cho một số, và các ô chỉ còn hai ứng viên. Đó là nguyên liệu của mọi chuỗi." },
      { q: "Đầu này sai thì đầu kia sao?", a: "Đi dọc chuỗi từ một giả định. Nếu hai đầu buộc một trong hai phải đúng, ô nhìn thấy cả hai đầu bị loại." },
    ],
  },
];

const LEVELS_EN: LevelInfo[] = [
  {
    level: 1,
    slug: "1-step",
    title: "1-step reasoning",
    short: "1 step",
    tagline: "See it, fill it",
    intro: [
      "At this level every conclusion takes a single observation: you look at the digits already placed and see that a cell can take only one digit, or that a digit has only one place left. No notes, no assumptions.",
      "There are two questions to ask the board. From the cell: \"which digits can go here?\". From the digit: \"where can this digit go in the unit?\". Most easy and medium puzzles are solved with just the four techniques below.",
    ],
    when: "Always the first thing to look for, and the thing to return to after every elimination at the higher levels.",
    mindset: [
      { q: "Where does this digit go?", a: "Pick a digit, cast rays from its copies, and find the only empty spot in a box, row or column." },
      { q: "Which digit is this cell?", a: "Pick a cell and collect the digits in its row, column and box. If exactly one is missing, you are done." },
    ],
  },
  {
    level: 2,
    slug: "2-step",
    title: "2-step reasoning",
    short: "2 steps",
    tagline: "Eliminate first, then fill",
    intro: [
      "When no cell can be filled directly, you need an intermediate step: prove that a digit cannot be in certain cells. Step one is finding a locked structure — a digit trapped in the intersection of a box and a line, or a group of digits that takes over a group of cells. Step two is using that elimination to open up a new placement.",
      "From this level on, write in the candidates (pencil marks) for every empty cell. These patterns only show up when you can see every possibility of every cell.",
    ],
    when: "When you have exhausted hidden and naked singles and the board still won't move.",
    mindset: [
      { q: "Where is this digit trapped?", a: "If a digit in a box lies on only one line (or the reverse), it claims that line: locked candidates." },
      { q: "Which cells are already taken?", a: "N cells holding only N digits (naked set), or N digits living in only N cells (hidden set): those digits cannot appear anywhere else." },
    ],
  },
  {
    level: 3,
    slug: "n-step",
    title: "N-step reasoning",
    short: "N steps",
    tagline: "Chains of deductions",
    intro: [
      "Hard puzzles need longer arguments: \"if cell A is x then cell B cannot be y, so cell C must be y, so…\". The techniques at this level are such chains packaged into recognisable patterns: fish (X-Wing, Swordfish), wings (XY-Wing, W-Wing), chains and colouring, plus tricks based on the uniqueness of the solution.",
      "All of them are built from two kinds of link. A strong link: in a unit, digit d has exactly two places — if one is not d, the other certainly is. A weak link: two candidates cannot both be true — if one is true, the other is false. A valid chain always alternates \"if not… then…\" (strong) and \"if… then not…\" (weak).",
      "When every pattern has run out, players use forcing chains: try each option of a cell in turn and follow the consequences; if every branch leads to the same conclusion, that conclusion is true. It is still logic, not guessing.",
    ],
    when: "When the 2-step techniques can no longer eliminate anything — usually only in hard and very hard puzzles.",
    mindset: [
      { q: "Where are the strong links?", a: "List the units with only two places for a digit, and the cells with only two candidates. They are the raw material of every chain." },
      { q: "If this end is false, what about the other?", a: "Walk the chain from one assumption. If the two ends force one of them to be true, a cell that sees both ends is eliminated." },
    ],
  },
];

export const getLevels = (lang: Lang) => (lang === "vi" ? LEVELS_VI : LEVELS_EN);
export const levelInfo = (lang: Lang, level: Level) => getLevels(lang)[level - 1];
export const levelBySlug = (lang: Lang, slug: string) => getLevels(lang).find((l) => l.slug === slug);
