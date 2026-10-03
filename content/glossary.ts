import type { Lang } from "@/lib/sudoku/types";

export interface Term {
  term: string;
  /** Tên ở ngôn ngữ còn lại, để tra cứu. */
  alt: string;
  def: string;
  group: string;
}

const GLOSSARY_VI: Term[] = [
  { group: "Bàn cờ", term: "Ô", alt: "Cell", def: "Một trong 81 ô vuông của bàn cờ. Gọi tên theo hàng và cột: H3C5 là ô ở hàng 3, cột 5." },
  { group: "Bàn cờ", term: "Hàng", alt: "Row", def: "Chín ô nằm ngang, đánh số 1–9 từ trên xuống." },
  { group: "Bàn cờ", term: "Cột", alt: "Column", def: "Chín ô nằm dọc, đánh số 1–9 từ trái sang phải." },
  { group: "Bàn cờ", term: "Khối", alt: "Box · Block", def: "Vùng 3×3 được viền đậm, đánh số 1–9 theo thứ tự đọc: khối 1 ở góc trên trái, khối 9 ở góc dưới phải." },
  { group: "Bàn cờ", term: "Đơn vị", alt: "Unit · House", def: "Tên chung cho hàng, cột hoặc khối. Mỗi đơn vị phải chứa đủ các số 1–9, mỗi số đúng một lần. Bàn cờ có 27 đơn vị." },
  { group: "Bàn cờ", term: "Băng", alt: "Band · Stack", def: "Ba khối nằm cạnh nhau: băng ngang gồm ba khối cùng hàng khối, băng dọc gồm ba khối cùng cột khối. Quét theo băng giúp tìm số duy nhất nhanh hơn." },
  { group: "Bàn cờ", term: "Số cho sẵn", alt: "Given · Clue", def: "Các số có sẵn trong đề. Trên các bàn cờ minh hoạ, số cho sẵn in đậm màu mực; số đã điền viết tay màu xanh." },
  { group: "Bàn cờ", term: "Nhìn thấy nhau", alt: "Sees · Peer", def: "Hai ô nhìn thấy nhau khi chúng chung hàng, cột hoặc khối. Mỗi ô nhìn thấy đúng 20 ô khác, và hai ô nhìn thấy nhau không thể mang cùng một số." },
  { group: "Ghi chú", term: "Ứng viên", alt: "Candidate", def: "Một số còn có thể điền vào ô trống, tức là chưa xuất hiện trong hàng, cột, khối của ô và chưa bị loại bởi suy luận." },
  { group: "Ghi chú", term: "Ghi chú bút chì", alt: "Pencil marks", def: "Việc viết các ứng viên nhỏ trong ô. Cách ghi chuẩn: số d nằm ở vị trí thứ d của lưới 3×3 trong ô, giống bàn phím điện thoại." },
  { group: "Ghi chú", term: "Ô hai ứng viên", alt: "Bivalue cell", def: "Ô chỉ còn đúng hai ứng viên. Là nguyên liệu của cặp lộ, XY-Wing, W-Wing và chuỗi XY." },
  { group: "Ghi chú", term: "Loại trừ", alt: "Elimination", def: "Xoá một ứng viên khỏi một ô vì đã chứng minh được nó không thể là đáp án." },
  { group: "Ghi chú", term: "Điền số", alt: "Placement", def: "Viết đáp án vào một ô, sau khi chứng minh ô đó chỉ có thể nhận số này." },
  { group: "Suy luận", term: "Single", alt: "Single", def: "Tên chung cho các kỹ thuật điền trực tiếp: ô trống cuối cùng, số duy nhất (hidden single) và ô chỉ còn một số (naked single)." },
  { group: "Suy luận", term: "Khoá ứng viên", alt: "Locked candidates", def: "Khi mọi vị trí của một số trong đơn vị này đều nằm trong giao với đơn vị kia. Gồm chỉ hướng (pointing) và chiếm khối (claiming)." },
  { group: "Suy luận", term: "Bộ lộ, bộ ẩn", alt: "Naked / Hidden subset", def: "N ô chỉ chứa N số (lộ), hoặc N số chỉ nằm trong N ô (ẩn), trong cùng một đơn vị. Với N = 2, 3, 4 gọi là cặp, bộ ba, bộ bốn." },
  { group: "Suy luận", term: "Liên kết mạnh", alt: "Strong link", def: "Hai ứng viên mà ít nhất một phải đúng. Ví dụ: đơn vị chỉ có hai chỗ cho số d, hoặc ô chỉ có hai ứng viên. \"Không phải cái này thì là cái kia\"." },
  { group: "Suy luận", term: "Liên kết yếu", alt: "Weak link", def: "Hai ứng viên không thể cùng đúng. Ví dụ: cùng số d ở hai ô nhìn thấy nhau. \"Là cái này thì không phải cái kia\"." },
  { group: "Suy luận", term: "Cặp liên hợp", alt: "Conjugate pair", def: "Hai vị trí duy nhất của một số trong một đơn vị. Đây là dạng liên kết mạnh hay gặp nhất." },
  { group: "Suy luận", term: "Mẫu hình cá", alt: "Fish", def: "Họ kỹ thuật dựa trên N hàng và N cột của một số: X-Wing (2), Swordfish (3), Jellyfish (4)." },
  { group: "Suy luận", term: "Wing", alt: "Wing", def: "Mẫu hình gồm một ô trục và các càng: XY-Wing, XYZ-Wing, W-Wing. Luôn kết luận rằng một trong vài ô chắc chắn chứa số z." },
  { group: "Suy luận", term: "Chuỗi", alt: "Chain", def: "Dãy ứng viên nối bằng liên kết mạnh và yếu xen kẽ. Hai đầu chuỗi cho biết ít nhất một đầu là đúng." },
  { group: "Suy luận", term: "Mẫu hình chết", alt: "Deadly pattern", def: "Nhóm ô có thể hoán đổi số mà bàn cờ vẫn hợp lệ, khiến đề có nhiều lời giải. Các kỹ thuật duy nhất (Unique Rectangle, BUG) tìm cách tránh nó." },
  { group: "Suy luận", term: "Chuỗi ép", alt: "Forcing chain", def: "Thử lần lượt mọi khả năng của một ô hoặc đơn vị; nếu mọi nhánh cùng dẫn tới một kết luận, kết luận đó đúng." },
];

const GLOSSARY_EN: Term[] = [
  { group: "The board", term: "Cell", alt: "Ô", def: "One of the 81 squares on the board. Named by row and column: r3c5 is the cell in row 3, column 5." },
  { group: "The board", term: "Row", alt: "Hàng", def: "Nine cells across, numbered 1–9 from top to bottom." },
  { group: "The board", term: "Column", alt: "Cột", def: "Nine cells down, numbered 1–9 from left to right." },
  { group: "The board", term: "Box", alt: "Khối", def: "A 3×3 area with a thick border, numbered 1–9 in reading order: box 1 top left, box 9 bottom right. Also called a block." },
  { group: "The board", term: "Unit", alt: "Đơn vị", def: "A row, column or box. Each unit must contain the digits 1–9 exactly once. The board has 27 units. Also called a house." },
  { group: "The board", term: "Band and stack", alt: "Băng ngang, băng dọc", def: "Three boxes side by side: a band runs across, a stack runs down. Scanning by band or stack speeds up finding hidden singles." },
  { group: "The board", term: "Given", alt: "Số cho sẵn", def: "A digit printed in the puzzle. On the illustration boards, givens are bold ink; placed digits are handwritten in blue." },
  { group: "The board", term: "Sees (peer)", alt: "Nhìn thấy nhau", def: "Two cells see each other when they share a row, column or box. Each cell sees exactly 20 others, and two cells that see each other can never hold the same digit." },
  { group: "Notes", term: "Candidate", alt: "Ứng viên", def: "A digit that can still go in an empty cell: not yet in the cell's row, column or box, and not eliminated by reasoning." },
  { group: "Notes", term: "Pencil marks", alt: "Ghi chú bút chì", def: "Writing a cell's candidates in small digits. The usual layout puts digit d in position d of a 3×3 grid inside the cell, like a phone keypad." },
  { group: "Notes", term: "Bivalue cell", alt: "Ô hai ứng viên", def: "A cell with exactly two candidates left. The raw material of naked pairs, XY-Wings, W-Wings and XY-Chains." },
  { group: "Notes", term: "Elimination", alt: "Loại trừ", def: "Removing a candidate from a cell because it has been proven not to be the answer." },
  { group: "Notes", term: "Placement", alt: "Điền số", def: "Writing the answer in a cell after proving it can only take that digit." },
  { group: "Reasoning", term: "Single", alt: "Single", def: "The family of direct placements: full house, hidden single and naked single." },
  { group: "Reasoning", term: "Locked candidates", alt: "Khoá ứng viên", def: "When every place for a digit in one unit lies in its intersection with another unit. Includes pointing and claiming." },
  { group: "Reasoning", term: "Naked / hidden set", alt: "Bộ lộ, bộ ẩn", def: "N cells holding only N digits (naked), or N digits living in only N cells (hidden), within one unit. With N = 2, 3, 4: pair, triple, quad." },
  { group: "Reasoning", term: "Strong link", alt: "Liên kết mạnh", def: "Two candidates of which at least one must be true. For example: a unit with only two places for d, or a cell with only two candidates. \"If not this, then that.\"" },
  { group: "Reasoning", term: "Weak link", alt: "Liên kết yếu", def: "Two candidates that cannot both be true. For example: the same digit d in two cells that see each other. \"If this, then not that.\"" },
  { group: "Reasoning", term: "Conjugate pair", alt: "Cặp liên hợp", def: "The only two places for a digit in a unit. The most common kind of strong link." },
  { group: "Reasoning", term: "Fish", alt: "Mẫu hình cá", def: "The family of techniques based on N rows and N columns for one digit: X-Wing (2), Swordfish (3), Jellyfish (4)." },
  { group: "Reasoning", term: "Wing", alt: "Wing", def: "A pattern with a pivot cell and pincers: XY-Wing, XYZ-Wing, W-Wing. It always concludes that one of a few cells certainly holds z." },
  { group: "Reasoning", term: "Chain", alt: "Chuỗi", def: "A sequence of candidates joined by alternating strong and weak links. Its ends tell you that at least one end is true." },
  { group: "Reasoning", term: "Deadly pattern", alt: "Mẫu hình chết", def: "A group of cells whose digits could be swapped while the grid stays valid, giving the puzzle several solutions. Uniqueness techniques (Unique Rectangle, BUG) avoid it." },
  { group: "Reasoning", term: "Forcing chain", alt: "Chuỗi ép", def: "Try every option of a cell or unit in turn; if every branch leads to the same conclusion, that conclusion is true." },
];

export const getGlossary = (lang: Lang) => (lang === "vi" ? GLOSSARY_VI : GLOSSARY_EN);
