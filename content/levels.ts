import type { Level } from "@/lib/sudoku/types";

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

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    slug: "1-buoc",
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
    slug: "2-buoc",
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
    slug: "n-buoc",
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

export const LEVEL_BY_SLUG = Object.fromEntries(LEVELS.map((l) => [l.slug, l])) as Record<string, LevelInfo>;
export const levelInfo = (level: Level) => LEVELS[level - 1];
