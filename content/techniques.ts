import type { Lang, Level } from "@/lib/sudoku/types";
import { TECH_EN } from "./techniques.en";

/** Phần chữ của một kỹ thuật, dịch theo ngôn ngữ. */
export interface TechniqueText {
  name: string;
  alias: string;
  summary: string;
  rule: string;
  idea: string[];
  spot: string[];
  pitfalls: string[];
}

export interface Technique extends TechniqueText {
  slug: string;
  level: Level;
  difficulty: 1 | 2 | 3 | 4 | 5;
  related: string[];
}

/** Bản tiếng Việt (gốc). Bản tiếng Anh nằm trong techniques.en.ts. */
const TECHNIQUES_VI: Technique[] = [
  // ============ Suy luận 1 bước ============
  {
    slug: "full-house",
    level: 1,
    name: "Ô trống cuối cùng",
    alias: "Full House",
    difficulty: 1,
    summary: "Một hàng, cột hoặc khối chỉ còn một ô trống: điền số còn thiếu vào đó.",
    rule: "Đơn vị đã có 8 số → ô trống còn lại nhận số thứ 9.",
    idea: [
      "Mỗi hàng, cột và khối phải chứa đủ chín số từ 1 đến 9, mỗi số đúng một lần. Khi một đơn vị đã có tám số, số còn thiếu chỉ có một chỗ để đi: ô trống duy nhất.",
      "Đây là kỹ thuật đơn giản nhất nhưng lại hay bị bỏ sót khi bạn mải nhìn chỗ khác. Mỗi lần vừa điền một số, hãy liếc lại hàng, cột và khối của ô đó xem có đơn vị nào vừa đầy tới 8/9 không.",
    ],
    spot: [
      "Đếm ô trống của từng hàng, cột, khối — đơn vị nào còn đúng 1 ô là mục tiêu.",
      "Để ý các đơn vị vừa được điền thêm số: chúng dễ chạm mốc 8/9 nhất.",
      "Tìm số thiếu bằng cách đếm từ 1 đến 9, hoặc lấy 45 trừ tổng các số đã có.",
    ],
    pitfalls: ["Đếm vội dễ nhầm số thiếu — kiểm tra lại bằng tổng 45 nếu không chắc."],
    related: ["hidden-single-box", "naked-single"],
  },
  {
    slug: "hidden-single-box",
    level: 1,
    name: "Số duy nhất trong khối",
    alias: "Hidden Single (khối) · quét chéo",
    difficulty: 1,
    summary: "Chọn một số và một khối, chiếu tia từ các số giống nó để tìm ô duy nhất còn nhận được số đó.",
    rule: "Trong một khối, số d chỉ còn một ô không bị chặn → ô đó là d.",
    idea: [
      "Hãy đổi câu hỏi từ \"ô này là số mấy?\" sang \"số 5 của khối này nằm ở đâu?\". Mỗi khối bắt buộc có một số 5, và mỗi số 5 đã có trên bàn cờ chặn toàn bộ hàng và cột của nó. Ta gọi đó là tia.",
      "Chiếu tia từ mọi số 5 lên khối đang xét. Ô trống nằm trên tia và ô đã có số đều bị loại. Nếu chỉ còn lại một ô, số 5 của khối phải nằm ở đó — kể cả khi xét riêng ô ấy vẫn còn nhiều khả năng khác.",
      "Đây là kỹ thuật người chơi dùng nhiều nhất, và thường là cách tìm số nhanh nhất ở đầu ván.",
    ],
    spot: [
      "Bắt đầu với số xuất hiện nhiều nhất trên bàn: nó chiếu nhiều tia nhất.",
      "Quét theo băng: ba khối nằm ngang chung ba hàng. Nếu hai khối đã có số d, khối thứ ba chỉ còn một hàng cho d.",
      "Khối có ít ô trống thường cho kết quả nhanh.",
    ],
    pitfalls: [
      "Quên rằng ô đã có số cũng không nhận được d.",
      "Chỉ quét theo hàng mà quên cột, hoặc ngược lại.",
    ],
    related: ["hidden-single-line", "pointing"],
  },
  {
    slug: "hidden-single-line",
    level: 1,
    name: "Số duy nhất trong hàng, cột",
    alias: "Hidden Single (hàng/cột)",
    difficulty: 1,
    summary: "Trong một hàng hoặc cột, một số chỉ còn đúng một ô có thể đặt.",
    rule: "Trong một hàng (cột), số d chỉ còn một ô hợp lệ → ô đó là d.",
    idea: [
      "Cùng ý tưởng với số duy nhất trong khối, nhưng đơn vị đang xét là một hàng hoặc một cột. Với mỗi ô trống trong hàng, hỏi hai câu: cột của ô này đã có d chưa? Khối của ô này đã có d chưa? Có thì ô bị chặn.",
      "Kỹ thuật này khó thấy hơn một chút vì các tia chặn đến từ hai hướng: theo cột (vuông góc với hàng) và theo khối. Nó đặc biệt hữu ích khi hàng hoặc cột chỉ còn 3–4 ô trống.",
    ],
    spot: [
      "Chọn hàng hoặc cột có ít ô trống, liệt kê các số còn thiếu rồi thử từng số.",
      "Với mỗi số còn thiếu, đánh dấu ô nào bị cột hoặc khối chặn.",
    ],
    pitfalls: ["Chỉ kiểm tra cột mà quên khối: một số d nằm cùng khối cũng chặn ô."],
    related: ["hidden-single-box", "naked-single"],
  },
  {
    slug: "naked-single",
    level: 1,
    name: "Ô chỉ còn một số",
    alias: "Naked Single",
    difficulty: 2,
    summary: "Một ô nhìn thấy đủ 8 số khác nhau trong hàng, cột và khối của nó, nên chỉ còn một khả năng.",
    rule: "Hàng + cột + khối của một ô chứa 8 số khác nhau → ô đó là số thứ 9.",
    idea: [
      "Kỹ thuật này nhìn từ phía ô. Mỗi ô \"nhìn thấy\" 20 ô khác: 8 ô trong hàng, 8 ô trong cột và 4 ô còn lại trong khối. Gom các số trong những ô đó lại; nếu đủ 8 số khác nhau thì số còn thiếu chính là đáp án.",
      "Khi đã ghi ứng viên cho mọi ô, ô chỉ còn một số hiện ra rất rõ: đó là ô chỉ còn đúng một ứng viên. Khi chưa ghi, bạn phải tự đếm, nên kỹ thuật này thường được dùng sau khi các kỹ thuật số duy nhất đã cạn.",
    ],
    spot: [
      "Ưu tiên những ô nằm ở giao của một hàng và một cột đều đông số.",
      "Khi đã ghi ứng viên: tìm ô chỉ có một số nhỏ.",
    ],
    pitfalls: ["Đếm trùng một số hai lần (ví dụ số 4 có cả trong hàng lẫn trong khối) rồi tưởng đã đủ 8."],
    related: ["full-house", "naked-pair"],
  },

  // ============ Suy luận 2 bước ============
  {
    slug: "pointing",
    level: 2,
    name: "Khoá ứng viên: chỉ hướng",
    alias: "Pointing · Locked Candidates 1",
    difficulty: 2,
    summary: "Trong một khối, số d chỉ nằm trên một hàng (hoặc cột), nên d bị loại khỏi phần còn lại của hàng (cột) đó.",
    rule: "Khối K có d chỉ trên hàng H → loại d khỏi hàng H bên ngoài khối K.",
    idea: [
      "Mỗi khối phải có một số d. Nếu mọi vị trí có thể của d trong khối đều nằm trên cùng một hàng, ta chưa biết d ở ô nào, nhưng biết chắc nó nằm trên hàng đó, bên trong khối.",
      "Hàng ấy chỉ được có một số d — và số d đó đã được \"đặt chỗ\" trong khối. Vì vậy mọi ô khác của hàng, bên ngoài khối, không thể là d. Các ứng viên trong khối như đang chỉ ra ngoài theo một hướng, xoá d trên đường đi.",
    ],
    spot: [
      "Khi quét số duy nhất trong khối mà còn 2–3 ô, xem chúng có thẳng hàng không.",
      "Hay xuất hiện khi một khối chỉ còn trống ở một hàng hoặc một cột.",
    ],
    pitfalls: [
      "Nhầm chiều: chỉ hướng loại d trên hàng bên ngoài khối, không loại gì trong khối.",
      "Các ô ứng viên phải nằm trên đúng một hàng; hai ô ở hai hàng khác nhau thì không áp dụng.",
    ],
    related: ["claiming", "hidden-single-box"],
  },
  {
    slug: "claiming",
    level: 2,
    name: "Khoá ứng viên: chiếm khối",
    alias: "Claiming · Box/Line Reduction",
    difficulty: 2,
    summary: "Trong một hàng (cột), số d chỉ nằm trong một khối, nên d bị loại khỏi các ô khác của khối đó.",
    rule: "Hàng H có d chỉ trong khối K → loại d khỏi khối K bên ngoài hàng H.",
    idea: [
      "Đây là chiều ngược lại của chỉ hướng. Hàng phải có một số d; nếu mọi vị trí của d trong hàng đều rơi vào cùng một khối, số d của hàng nằm trong khối đó.",
      "Khối cũng chỉ có một số d, và nó đã bị hàng \"chiếm\". Vì vậy mọi ô khác trong khối, không thuộc hàng đó, không thể là d.",
    ],
    spot: [
      "Nhìn các hàng, cột có ít ô trống: nếu các ô còn nhận được d chỉ nằm trong một đoạn ba ô, hãy thử chiếm khối.",
      "Mỗi giao giữa khối và hàng (cột) đều có thể dùng một trong hai chiều: chỉ hướng hoặc chiếm khối.",
    ],
    pitfalls: ["Nhầm với chỉ hướng: chỉ hướng xuất phát từ khối, chiếm khối xuất phát từ hàng hoặc cột."],
    related: ["pointing", "hidden-single-line"],
  },
  {
    slug: "naked-pair",
    level: 2,
    name: "Cặp lộ",
    alias: "Naked Pair",
    difficulty: 2,
    summary: "Hai ô cùng đơn vị chỉ có cùng hai ứng viên, nên hai số đó bị loại khỏi các ô khác của đơn vị.",
    rule: "Hai ô cùng đơn vị chỉ có {x, y} → loại x, y khỏi các ô còn lại của đơn vị.",
    idea: [
      "Nếu hai ô trong một hàng đều chỉ có thể là 3 hoặc 7, thì một ô là 3 và ô kia là 7. Ta chưa biết thứ tự, nhưng chắc chắn số 3 và số 7 của hàng đã được đặt chỗ ở hai ô đó.",
      "Do đó mọi ô khác trong hàng không thể là 3 hay 7. Nếu hai ô còn nằm cùng khối, ta loại được trong cả khối.",
    ],
    spot: [
      "Tìm các ô chỉ có hai ứng viên, rồi so với các ô cùng hàng, cột, khối.",
      "Hai ô phải có chính xác cùng hai ứng viên: {3, 7} và {3, 7}, không phải {3, 7} và {3, 8}.",
    ],
    pitfalls: [
      "Hai ô không cùng đơn vị (chỉ nằm gần nhau) thì không tạo thành cặp lộ.",
      "Ghi thiếu ứng viên sẽ sinh ra cặp lộ giả. Hãy ghi ứng viên đầy đủ trước khi tìm cặp.",
    ],
    related: ["hidden-pair", "naked-triple"],
  },
  {
    slug: "hidden-pair",
    level: 2,
    name: "Cặp ẩn",
    alias: "Hidden Pair",
    difficulty: 3,
    summary: "Hai số chỉ có thể nằm ở cùng hai ô trong một đơn vị, nên hai ô đó bị xoá mọi ứng viên khác.",
    rule: "Trong một đơn vị, x và y chỉ có mặt ở hai ô A, B → A, B chỉ còn {x, y}.",
    idea: [
      "Cặp ẩn nhìn từ phía số thay vì phía ô. Nếu trong một cột, số 2 chỉ có thể ở hai ô A và B, và số 6 cũng chỉ có thể ở đúng hai ô đó, thì A và B phải là 2 và 6 theo một thứ tự nào đó.",
      "Hai ô này đã bị 2 và 6 chiếm, nên mọi ứng viên khác trong A và B đều bị loại. Nó gọi là cặp ẩn vì các ứng viên thừa che mất nó; sau khi dọn, cặp ẩn trở thành cặp lộ.",
    ],
    spot: [
      "Với mỗi đơn vị, đếm xem mỗi số còn bao nhiêu chỗ. Hai số cùng có đúng hai chỗ, và trùng chỗ nhau, là một cặp ẩn.",
      "Thường gặp trong đơn vị còn nhiều ô trống, nơi cặp lộ khó xuất hiện.",
    ],
    pitfalls: ["Cả hai số phải có đúng hai chỗ và trùng nhau; một số có ba chỗ thì không áp dụng được."],
    related: ["naked-pair", "hidden-triple"],
  },
  {
    slug: "naked-triple",
    level: 2,
    name: "Bộ ba lộ",
    alias: "Naked Triple",
    difficulty: 3,
    summary: "Ba ô cùng đơn vị chỉ dùng chung ba ứng viên, nên ba số đó bị loại khỏi các ô khác của đơn vị.",
    rule: "Ba ô cùng đơn vị có hợp ứng viên = {x, y, z} → loại x, y, z khỏi phần còn lại.",
    idea: [
      "Mở rộng của cặp lộ: ba ô, ba số. Ba số x, y, z phải lấp đầy ba ô này, nên không còn chỗ cho chúng ở phần còn lại của đơn vị.",
      "Điểm dễ nhầm: không ô nào cần có đủ ba ứng viên. {1, 4}, {4, 8}, {1, 8} vẫn là một bộ ba lộ hợp lệ, vì gộp lại chỉ có ba số 1, 4, 8.",
      "Quy tắc tổng quát: N ô cùng đơn vị mà gộp ứng viên lại được đúng N số thì N số đó bị khoá trong N ô. Với N = 4 ta có bộ bốn lộ (Naked Quad), rất hiếm gặp.",
    ],
    spot: [
      "Tìm các ô có 2–3 ứng viên trong cùng đơn vị và thử gộp theo nhóm ba.",
      "Đơn vị còn nhiều ô trống nhưng có vài ô \"nghèo\" ứng viên là nơi đáng tìm.",
    ],
    pitfalls: ["Gộp ra bốn số cho ba ô thì không phải bộ ba lộ.", "Ba ô phải cùng một đơn vị."],
    related: ["naked-pair", "hidden-triple"],
  },
  {
    slug: "hidden-triple",
    level: 2,
    name: "Bộ ba ẩn",
    alias: "Hidden Triple",
    difficulty: 3,
    summary: "Ba số chỉ xuất hiện trong cùng ba ô của một đơn vị, nên ba ô đó bị xoá mọi ứng viên khác.",
    rule: "Trong một đơn vị, x, y, z chỉ nằm trong 3 ô → 3 ô đó chỉ còn {x, y, z}.",
    idea: [
      "Mở rộng của cặp ẩn: ba số cần ba chỗ, và chỉ có ba ô chứa chúng. Vậy ba ô đó thuộc về ba số này; mọi ứng viên khác trong ba ô bị loại.",
      "Không cần mỗi số có mặt ở cả ba ô, chỉ cần mọi vị trí của ba số gói gọn trong ba ô.",
      "Bộ ẩn và bộ lộ luôn đi đôi: trong một đơn vị có k ô trống, một bộ ẩn n ô tương ứng với một bộ lộ k − n ô ở phần còn lại. Hãy tìm loại có kích thước nhỏ hơn.",
    ],
    spot: [
      "Đếm số chỗ của từng số trong đơn vị; chọn các số có 2–3 chỗ và thử gộp theo nhóm ba.",
      "Đây là kỹ thuật khó nhìn nhất ở tầng này — hãy dùng khi các cách khác đã cạn.",
    ],
    pitfalls: ["Đưa nhầm một số có bốn chỗ vào bộ ba."],
    related: ["hidden-pair", "naked-triple"],
  },

  // ============ Suy luận N bước ============
  {
    slug: "x-wing",
    level: 3,
    name: "X-Wing",
    alias: "X-Wing · cá 2×2",
    difficulty: 3,
    summary: "Số d ở hai hàng chỉ nằm trên cùng hai cột, nên d bị loại khỏi các ô khác của hai cột đó.",
    rule: "Hai hàng có d chỉ ở cùng hai cột → loại d khỏi hai cột đó ở mọi hàng khác (đổi vai hàng ↔ cột cũng đúng).",
    idea: [
      "Chọn một số d. Nếu trong hàng A, d chỉ có hai chỗ, và trong hàng B, d cũng chỉ có hai chỗ nằm trên đúng hai cột ấy, thì bốn ô tạo thành bốn góc một hình chữ nhật.",
      "Mỗi hàng cần một số d, và hai số này phải ở hai cột khác nhau. Chỉ có hai cách: theo đường chéo này hoặc đường chéo kia — hình chữ X. Cách nào thì mỗi cột cũng đã nhận d từ hàng A hoặc hàng B, nên các ô khác trong hai cột không thể là d.",
      "Có thể đổi vai hàng và cột: hai cột có d chỉ nằm trên cùng hai hàng thì loại d khỏi hai hàng đó.",
    ],
    spot: [
      "Với từng số, liệt kê các hàng (hoặc cột) chỉ còn đúng hai chỗ cho số đó.",
      "Hai hàng như vậy có cùng cặp cột là một X-Wing.",
    ],
    pitfalls: [
      "Loại nhầm hướng: khi hai đơn vị gốc là hàng thì loại theo cột, và ngược lại.",
      "Bốn góc không cần nằm ở bốn khối khác nhau.",
    ],
    related: ["swordfish", "skyscraper"],
  },
  {
    slug: "skyscraper",
    level: 3,
    name: "Toà nhà chọc trời",
    alias: "Skyscraper",
    difficulty: 3,
    summary: "Hai liên kết mạnh song song có chung chân, nên ô nhìn thấy cả hai đỉnh không thể là d.",
    rule: "Hai hàng mỗi hàng chỉ có 2 chỗ cho d, hai đầu thẳng cột → loại d ở ô nhìn thấy cả hai đầu còn lại.",
    idea: [
      "Hình dung hai toà nhà đứng cạnh nhau. Trong hai hàng (hoặc hai cột), số d chỉ có đúng hai chỗ — mỗi hàng là một liên kết mạnh. Hai đầu \"chân\" nằm cùng một cột, hai đầu \"đỉnh\" thì lệch nhau.",
      "Hai chân cùng cột nên không thể cùng là d; ít nhất một chân không phải d, và khi đó đỉnh cùng hàng với nó phải là d. Kết luận: ít nhất một trong hai đỉnh là d, nên ô nào nhìn thấy cả hai đỉnh đều bị loại d.",
      "Toà nhà chọc trời là một X-Wing bị lệch: nếu hai đỉnh cũng thẳng cột, ta có X-Wing.",
    ],
    spot: ["Tìm các hàng (cột) chỉ có hai chỗ cho d, rồi ghép hai hàng có một đầu thẳng cột với nhau."],
    pitfalls: ["Loại ở ô nhìn thấy hai chân thay vì hai đỉnh."],
    related: ["x-wing", "two-string-kite", "simple-coloring"],
  },
  {
    slug: "two-string-kite",
    level: 3,
    name: "Cánh diều hai dây",
    alias: "2-String Kite",
    difficulty: 3,
    summary: "Một liên kết mạnh trên hàng và một trên cột, nối nhau trong một khối.",
    rule: "Hàng và cột mỗi đơn vị chỉ có 2 chỗ cho d, hai đầu chung khối → loại d ở ô nhìn thấy cả hai đầu còn lại.",
    idea: [
      "Trong một hàng, d chỉ có hai chỗ; trong một cột, d cũng chỉ có hai chỗ. Một đầu của hàng và một đầu của cột nằm cùng một khối (nhưng là hai ô khác nhau). Đó là nút thắt của cánh diều.",
      "Hai ô ở nút thắt nhìn thấy nhau nên không cùng là d. Ô nào không phải d thì đầu dây bên kia của nó là d. Vậy ít nhất một trong hai đầu dây tự do là d, và ô ở giao hàng – cột của hai đầu này bị loại d.",
    ],
    spot: ["Với mỗi số, tìm một hàng và một cột chỉ có hai chỗ, mỗi bên có một đầu rơi vào cùng một khối."],
    pitfalls: ["Hai đầu ở nút thắt phải là hai ô khác nhau."],
    related: ["skyscraper", "simple-coloring"],
  },
  {
    slug: "xy-wing",
    level: 3,
    name: "XY-Wing",
    alias: "XY-Wing · Y-Wing",
    difficulty: 3,
    summary: "Ô trục {x, y} nhìn thấy hai càng {x, z} và {y, z}, nên ô nhìn thấy cả hai càng không thể là z.",
    rule: "Trục {x, y}, càng {x, z} và {y, z} → loại z ở ô nhìn thấy cả hai càng.",
    idea: [
      "Chỉ dùng ô hai ứng viên. Ô trục có {x, y}; nó nhìn thấy càng thứ nhất {x, z} và càng thứ hai {y, z}.",
      "Trục là x thì càng thứ nhất mất x, thành z. Trục là y thì càng thứ hai thành z. Không có khả năng thứ ba, nên chắc chắn một càng là z. Ô nào nhìn thấy cả hai càng đều không thể là z.",
      "Đây là chuỗi suy luận ba bước đầu tiên mà nhiều người học: giả định → hệ quả → hệ quả, được đóng gói thành một mẫu hình nhìn là thấy.",
    ],
    spot: [
      "Đánh dấu các ô hai ứng viên. Chọn một ô làm trục, tìm hai ô nó nhìn thấy mà mỗi ô chung đúng một số với trục và chung số thứ ba z với nhau.",
    ],
    pitfalls: ["Hai càng không cần nhìn thấy nhau, nhưng đều phải nhìn thấy trục.", "Chỉ loại z, không loại x hay y."],
    related: ["xyz-wing", "w-wing", "xy-chain"],
  },
  {
    slug: "xyz-wing",
    level: 3,
    name: "XYZ-Wing",
    alias: "XYZ-Wing",
    difficulty: 4,
    summary: "Giống XY-Wing nhưng ô trục có ba ứng viên {x, y, z}; chỉ loại z ở ô nhìn thấy cả ba ô.",
    rule: "Trục {x, y, z}, càng {x, z} và {y, z} → loại z ở ô nhìn thấy trục và cả hai càng.",
    idea: [
      "Trục có thêm z. Trục là x thì càng một là z; trục là y thì càng hai là z; trục là z thì chính nó là z. Vậy z nằm ở một trong ba ô.",
      "Ô bị loại phải nhìn thấy cả ba ô, nên vùng loại hẹp hơn XY-Wing — thường là ô nằm cùng khối với trục và cùng hàng (cột) với một càng.",
    ],
    spot: [
      "Tìm ô ba ứng viên, rồi tìm hai ô hai ứng viên nó nhìn thấy, là tập con của nó và chung nhau đúng số z.",
    ],
    pitfalls: ["Loại ở ô chỉ nhìn thấy hai càng là sai: ô đó phải nhìn thấy cả trục."],
    related: ["xy-wing", "w-wing"],
  },
  {
    slug: "w-wing",
    level: 3,
    name: "W-Wing",
    alias: "W-Wing",
    difficulty: 4,
    summary: "Hai ô cùng cặp {x, y} ở xa nhau được nối bởi một liên kết mạnh của x, nên ô nhìn thấy cả hai ô không thể là y.",
    rule: "Hai ô {x, y} + liên kết mạnh của x nối hai ô → loại y ở ô nhìn thấy cả hai ô {x, y}.",
    idea: [
      "Hai ô có cùng hai ứng viên {x, y} nhưng không nhìn thấy nhau. Nếu có một đơn vị mà x chỉ có hai chỗ L1, L2, với L1 nhìn thấy ô thứ nhất và L2 nhìn thấy ô thứ hai, ta có một cây cầu nối.",
      "Giả sử ô thứ nhất không phải y → nó là x → L1 không là x → L2 là x → ô thứ hai không là x → ô thứ hai là y. Vậy luôn có ít nhất một trong hai ô là y.",
    ],
    spot: ["Tìm hai ô hai ứng viên giống hệt nhau ở xa nhau, rồi tìm liên kết mạnh của một trong hai số để nối chúng."],
    pitfalls: ["Cầu nối phải là liên kết mạnh: đơn vị chỉ có đúng hai chỗ cho x."],
    related: ["xy-wing", "xy-chain"],
  },
  {
    slug: "swordfish",
    level: 3,
    name: "Swordfish",
    alias: "Swordfish · cá 3×3",
    difficulty: 4,
    summary: "X-Wing mở rộng lên ba hàng và ba cột.",
    rule: "Ba hàng có d chỉ nằm trong cùng ba cột → loại d khỏi ba cột đó ở các hàng khác.",
    idea: [
      "Khi ba hàng cần ba số d, và mọi vị trí của d trong ba hàng đó chỉ rơi vào ba cột, thì mỗi cột sẽ nhận đúng một số d từ ba hàng này. Các ô khác của ba cột không còn chỗ cho d.",
      "Không cần mỗi hàng có đủ ba vị trí; mỗi hàng có 2 hoặc 3 chỗ là được, miễn gộp lại chỉ dùng ba cột.",
      "Mở rộng tiếp lên bốn hàng, bốn cột gọi là Jellyfish (con sứa), rất hiếm gặp. X-Wing, Swordfish và Jellyfish được gọi chung là các mẫu hình cá.",
    ],
    spot: [
      "Liệt kê các hàng có d ở 2–3 chỗ, tìm ba hàng mà gộp các cột lại chỉ có ba cột.",
      "Tìm theo hàng không thấy thì hãy tìm theo cột.",
    ],
    pitfalls: ["Hàng có d ở bốn chỗ không tham gia được.", "Chỉ loại trên ba cột phủ, không loại trên ba hàng gốc."],
    related: ["x-wing"],
  },
  {
    slug: "simple-coloring",
    level: 3,
    name: "Tô màu đơn",
    alias: "Simple Coloring",
    difficulty: 4,
    summary: "Nối các liên kết mạnh của một số thành chuỗi và tô hai màu xen kẽ: đúng một trong hai màu là đáp án.",
    rule: "Ô thấy cả hai màu → loại d. Hai ô cùng màu thấy nhau → màu đó sai.",
    idea: [
      "Chọn số d. Mỗi đơn vị chỉ có hai chỗ cho d cho ta một liên kết mạnh: đúng một trong hai ô là d. Các liên kết nối vào nhau thành chuỗi.",
      "Tô màu xen kẽ dọc chuỗi: xanh, cam, xanh, cam… Vì mỗi liên kết có đúng một đầu là d, nên hoặc mọi ô xanh là d, hoặc mọi ô cam là d.",
      "Có hai quy tắc. Bẫy: ô ngoài chuỗi nhìn thấy cả ô xanh lẫn ô cam thì dù màu nào đúng, nó cũng thấy một số d — loại. Mâu thuẫn: hai ô cùng màu nhìn thấy nhau thì màu đó không thể đúng — loại d khỏi mọi ô màu đó, và mọi ô màu kia là d.",
      "Toà nhà chọc trời và cánh diều hai dây thực chất là những chuỗi tô màu ngắn.",
    ],
    spot: ["Chọn số có nhiều liên kết mạnh, dùng bút hai màu tô trực tiếp trên giấy."],
    pitfalls: [
      "Chỉ nối bằng liên kết mạnh. Nối nhầm hai ô chỉ nhìn thấy nhau (liên kết yếu) sẽ cho kết luận sai.",
    ],
    related: ["skyscraper", "two-string-kite", "xy-chain"],
  },
  {
    slug: "unique-rectangle",
    level: 3,
    name: "Hình chữ nhật duy nhất",
    alias: "Unique Rectangle",
    difficulty: 4,
    summary: "Tránh mẫu hình khiến đề có hai lời giải: góc thứ tư không được chỉ còn {x, y}.",
    rule: "3 góc hình chữ nhật (2 hàng, 2 cột, 2 khối) chỉ có {x, y} → loại x, y ở góc thứ tư.",
    idea: [
      "Xét bốn ô ở bốn góc một hình chữ nhật trải trên đúng hai hàng, hai cột và hai khối. Nếu cả bốn ô chỉ có {x, y}, bạn có thể đổi x ↔ y ở bốn ô mà mọi hàng, cột, khối vẫn hợp lệ — đề sẽ có hai lời giải. Đó gọi là mẫu hình chết.",
      "Đề Sudoku chuẩn luôn có đúng một lời giải. Vì vậy nếu ba góc đã chỉ còn {x, y}, góc thứ tư buộc phải là một số khác: loại x và y khỏi nó.",
      "Kỹ thuật này dựa trên giả thiết đề có lời giải duy nhất. Chỉ dùng với đề từ nguồn đáng tin cậy.",
    ],
    spot: [
      "Tìm hai ô cùng cặp {x, y} trên một hàng, nằm ở hai khối khác nhau; xem hai ô tương ứng ở một hàng khác có khép thành hình chữ nhật không.",
    ],
    pitfalls: [
      "Bốn ô phải nằm trong đúng hai khối. Trải trên bốn khối thì việc hoán đổi làm hỏng khối, không có mẫu hình chết.",
      "Cả bốn ô đều phải là ô trống, không phải số cho sẵn.",
    ],
    related: ["bug-plus-one"],
  },
  {
    slug: "bug-plus-one",
    level: 3,
    name: "BUG+1",
    alias: "Bivalue Universal Grave + 1",
    difficulty: 4,
    summary: "Mọi ô trống chỉ còn hai ứng viên trừ một ô có ba: ô đó nhận số xuất hiện ba lần trong các đơn vị của nó.",
    rule: "Mọi ô có 2 ứng viên, riêng 1 ô có 3 → ô đó = số xuất hiện 3 lần trong hàng, cột, khối của nó.",
    idea: [
      "BUG là trạng thái mọi ô trống có đúng hai ứng viên và mọi số xuất hiện đúng hai lần trong mỗi đơn vị. Trạng thái này không bao giờ cho đúng một lời giải.",
      "Khi bàn cờ chỉ cách BUG đúng một ứng viên — một ô có ba, mọi ô khác có hai — thì ứng viên thừa ấy chính là đáp án của ô, vì nếu không ta sẽ rơi vào BUG. Ứng viên thừa dễ nhận ra: nó xuất hiện ba lần trong hàng, cột và khối của ô.",
    ],
    spot: [
      "Hay xuất hiện ở cuối các đề khó, khi bàn cờ gần như toàn ô hai ứng viên.",
      "Đếm ứng viên trong hàng của ô ba ứng viên: số nào xuất hiện ba lần là đáp án.",
    ],
    pitfalls: ["Chỉ áp dụng khi đúng một ô có ba ứng viên và mọi ô trống khác đều có đúng hai."],
    related: ["unique-rectangle"],
  },
  {
    slug: "xy-chain",
    level: 3,
    name: "Chuỗi XY",
    alias: "XY-Chain",
    difficulty: 5,
    summary: "Chuỗi các ô hai ứng viên nối nhau; nếu hai đầu cùng chứa z, ô nhìn thấy cả hai đầu không thể là z.",
    rule: "Chuỗi ô hai ứng viên có hai đầu cùng chứa z → loại z ở ô nhìn thấy cả hai đầu.",
    idea: [
      "Mỗi ô hai ứng viên là một công tắc: không phải số này thì là số kia. Nối các ô nhìn thấy nhau và có chung một số, ta được một chuỗi lan truyền.",
      "Giả sử ô đầu không phải z → nó là số còn lại a → ô kế tiếp (có a) không là a → nó là số còn lại b → … → ô cuối là z. Vậy nếu đầu này không là z thì đầu kia là z: ít nhất một đầu là z.",
      "XY-Wing chính là chuỗi XY dài ba ô. Chuỗi dài hơn mạnh hơn nhưng khó tìm hơn; hãy bắt đầu từ các ô hai ứng viên nhìn thấy ô bạn muốn loại.",
    ],
    spot: ["Vẽ các ô hai ứng viên ra giấy, nối các ô nhìn thấy nhau và có chung số.", "Chọn z là số có mặt ở hai đầu và đi thử từ một đầu."],
    pitfalls: ["Mỗi mắt xích phải đi đúng hướng: số \"ra\" của ô trước phải là số \"vào\" của ô sau."],
    related: ["xy-wing", "w-wing", "simple-coloring"],
  },
];

const TECHNIQUES_EN: Technique[] = TECHNIQUES_VI.map((t) => ({ ...t, ...TECH_EN[t.slug] }));

export const getTechniques = (lang: Lang) => (lang === "vi" ? TECHNIQUES_VI : TECHNIQUES_EN);

export const TECH_SLUGS = TECHNIQUES_VI.map((t) => t.slug);

export const getTechnique = (lang: Lang, slug: string) => getTechniques(lang).find((t) => t.slug === slug);

export const techniquesOfLevel = (lang: Lang, level: Level) => getTechniques(lang).filter((t) => t.level === level);

export function neighbors(lang: Lang, slug: string) {
  const list = getTechniques(lang);
  const i = list.findIndex((t) => t.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}
