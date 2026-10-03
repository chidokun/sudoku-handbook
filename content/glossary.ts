export interface Term {
  term: string;
  en: string;
  def: string;
  group: "Bàn cờ" | "Ghi chú" | "Suy luận";
}

export const GLOSSARY: Term[] = [
  { group: "Bàn cờ", term: "Ô", en: "Cell", def: "Một trong 81 ô vuông của bàn cờ. Gọi tên theo hàng và cột: H3C5 là ô ở hàng 3, cột 5." },
  { group: "Bàn cờ", term: "Hàng", en: "Row", def: "Chín ô nằm ngang, đánh số 1–9 từ trên xuống." },
  { group: "Bàn cờ", term: "Cột", en: "Column", def: "Chín ô nằm dọc, đánh số 1–9 từ trái sang phải." },
  { group: "Bàn cờ", term: "Khối", en: "Box · Block", def: "Vùng 3×3 được viền đậm, đánh số 1–9 theo thứ tự đọc: khối 1 ở góc trên trái, khối 9 ở góc dưới phải." },
  { group: "Bàn cờ", term: "Đơn vị", en: "Unit · House", def: "Tên chung cho hàng, cột hoặc khối. Mỗi đơn vị phải chứa đủ các số 1–9, mỗi số đúng một lần. Bàn cờ có 27 đơn vị." },
  { group: "Bàn cờ", term: "Băng", en: "Band · Stack", def: "Ba khối nằm cạnh nhau: băng ngang gồm ba khối cùng hàng khối, băng dọc gồm ba khối cùng cột khối. Quét theo băng giúp tìm số duy nhất nhanh hơn." },
  { group: "Bàn cờ", term: "Số cho sẵn", en: "Given · Clue", def: "Các số có sẵn trong đề. Trên các bàn cờ minh hoạ, số cho sẵn in đậm màu mực; số đã điền viết tay màu xanh." },
  { group: "Bàn cờ", term: "Nhìn thấy nhau", en: "Sees · Peer", def: "Hai ô nhìn thấy nhau khi chúng chung hàng, cột hoặc khối. Mỗi ô nhìn thấy đúng 20 ô khác, và hai ô nhìn thấy nhau không thể mang cùng một số." },
  { group: "Ghi chú", term: "Ứng viên", en: "Candidate", def: "Một số còn có thể điền vào ô trống, tức là chưa xuất hiện trong hàng, cột, khối của ô và chưa bị loại bởi suy luận." },
  { group: "Ghi chú", term: "Ghi chú bút chì", en: "Pencil marks", def: "Việc viết các ứng viên nhỏ trong ô. Cách ghi chuẩn: số d nằm ở vị trí thứ d của lưới 3×3 trong ô, giống bàn phím điện thoại." },
  { group: "Ghi chú", term: "Ô hai ứng viên", en: "Bivalue cell", def: "Ô chỉ còn đúng hai ứng viên. Là nguyên liệu của cặp lộ, XY-Wing, W-Wing và chuỗi XY." },
  { group: "Ghi chú", term: "Loại trừ", en: "Elimination", def: "Xoá một ứng viên khỏi một ô vì đã chứng minh được nó không thể là đáp án." },
  { group: "Ghi chú", term: "Điền số", en: "Placement", def: "Viết đáp án vào một ô, sau khi chứng minh ô đó chỉ có thể nhận số này." },
  { group: "Suy luận", term: "Single", en: "Single", def: "Tên chung cho các kỹ thuật điền trực tiếp: ô trống cuối cùng, số duy nhất (hidden single) và ô chỉ còn một số (naked single)." },
  { group: "Suy luận", term: "Khoá ứng viên", en: "Locked candidates", def: "Khi mọi vị trí của một số trong đơn vị này đều nằm trong giao với đơn vị kia. Gồm chỉ hướng (pointing) và chiếm khối (claiming)." },
  { group: "Suy luận", term: "Bộ lộ, bộ ẩn", en: "Naked / Hidden subset", def: "N ô chỉ chứa N số (lộ), hoặc N số chỉ nằm trong N ô (ẩn), trong cùng một đơn vị. Với N = 2, 3, 4 gọi là cặp, bộ ba, bộ bốn." },
  { group: "Suy luận", term: "Liên kết mạnh", en: "Strong link", def: "Hai ứng viên mà ít nhất một phải đúng. Ví dụ: đơn vị chỉ có hai chỗ cho số d, hoặc ô chỉ có hai ứng viên. \"Không phải cái này thì là cái kia\"." },
  { group: "Suy luận", term: "Liên kết yếu", en: "Weak link", def: "Hai ứng viên không thể cùng đúng. Ví dụ: cùng số d ở hai ô nhìn thấy nhau. \"Là cái này thì không phải cái kia\"." },
  { group: "Suy luận", term: "Cặp liên hợp", en: "Conjugate pair", def: "Hai vị trí duy nhất của một số trong một đơn vị. Đây là dạng liên kết mạnh hay gặp nhất." },
  { group: "Suy luận", term: "Mẫu hình cá", en: "Fish", def: "Họ kỹ thuật dựa trên N hàng và N cột của một số: X-Wing (2), Swordfish (3), Jellyfish (4)." },
  { group: "Suy luận", term: "Wing", en: "Wing", def: "Mẫu hình gồm một ô trục và các càng: XY-Wing, XYZ-Wing, W-Wing. Luôn kết luận rằng một trong vài ô chắc chắn chứa số z." },
  { group: "Suy luận", term: "Chuỗi", en: "Chain", def: "Dãy ứng viên nối bằng liên kết mạnh và yếu xen kẽ. Hai đầu chuỗi cho biết ít nhất một đầu là đúng." },
  { group: "Suy luận", term: "Mẫu hình chết", en: "Deadly pattern", def: "Nhóm ô có thể hoán đổi số mà bàn cờ vẫn hợp lệ, khiến đề có nhiều lời giải. Các kỹ thuật duy nhất (Unique Rectangle, BUG) tìm cách tránh nó." },
  { group: "Suy luận", term: "Chuỗi ép", en: "Forcing chain", def: "Thử lần lượt mọi khả năng của một ô hoặc đơn vị; nếu mọi nhánh cùng dẫn tới một kết luận, kết luận đó đúng." },
];
