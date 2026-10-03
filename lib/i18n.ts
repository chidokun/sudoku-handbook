import type { Lang, Level } from "@/lib/sudoku/types";

export type { Lang };
export const LANGS: Lang[] = ["en", "vi"];
export const DEFAULT_LANG: Lang = "en";
export const LANG_STORAGE_KEY = "sudoku-handbook:lang";
export const SITE_URL = "https://sudoku.nguyentuan.dev";

// ---------- Routes ----------
// Mọi đường dẫn dùng slug tiếng Anh; bản tiếng Việt chỉ thêm tiền tố /vi.

export type RouteKey = "home" | "basics" | "techniques" | "levels" | "walkthrough" | "cheatSheet" | "glossary";

const SEGMENT: Record<Exclude<RouteKey, "home">, string> = {
  basics: "basics",
  techniques: "techniques",
  levels: "levels",
  walkthrough: "walkthrough",
  cheatSheet: "cheat-sheet",
  glossary: "glossary",
};

export const LEVEL_SLUG: Record<Level, string> = { 1: "1-step", 2: "2-step", 3: "n-step" };

const prefix = (lang: Lang) => (lang === "vi" ? "/vi" : "");

/** Internal path (without basePath), always with a trailing slash. */
export function href(lang: Lang, key: RouteKey, param?: string): string {
  if (key === "home") return `${prefix(lang)}/`;
  return `${prefix(lang)}/${SEGMENT[key]}/${param ? `${param}/` : ""}`;
}

export const levelHref = (lang: Lang, level: Level) => href(lang, "levels", LEVEL_SLUG[level]);
export const techHref = (lang: Lang, slug: string) => href(lang, "techniques", slug);

export const langOfPath = (pathname: string): Lang => (/^\/vi(\/|$)/.test(pathname) ? "vi" : "en");

/** The same page in the other language: add or drop the /vi prefix. `pathname` excludes the basePath. */
export function switchPath(pathname: string, to: Lang): string {
  const rest = langOfPath(pathname) === "vi" ? pathname.replace(/^\/vi/, "") || "/" : pathname;
  const path = rest.endsWith("/") ? rest : `${rest}/`;
  return `${prefix(to)}${path}`;
}

/**
 * Runs in <head> before first paint. If the visitor's preferred language differs from the page's,
 * it jumps to the same page in that language. Preference = the language the visitor last picked
 * in the switcher; otherwise it is guessed from browser languages and time zone (a static site has
 * no server to read the IP location). Crawlers are never redirected.
 */
export function detectScript(basePath: string): string {
  return `(function(){try{
var B=${JSON.stringify(basePath)},K=${JSON.stringify(LANG_STORAGE_KEY)};
if(navigator.webdriver||/bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent))return;
var p=location.pathname;if(B&&p.indexOf(B)===0)p=p.slice(B.length)||"/";
var isVi=/^\\/vi(\\/|$)/.test(p),cur=isVi?"vi":"en";
var want=null;try{want=localStorage.getItem(K)}catch(e){}
if(want!=="en"&&want!=="vi"){
var L=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""],vi=false;
for(var i=0;i<L.length;i++)if(/^vi\\b/i.test(L[i]))vi=true;
if(!vi){var z="";try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}if(z==="Asia/Ho_Chi_Minh"||z==="Asia/Saigon")vi=true}
want=vi?"vi":"en"}
if(want===cur)return;
var rest=isVi?(p.replace(/^\\/vi/,"")||"/"):p;
location.replace(B+(want==="vi"?"/vi":"")+rest+location.search+location.hash);
}catch(e){}})()`;
}

// ---------- UI dictionary ----------

const en = {
  siteName: "Sudoku Handbook",
  metaTitle: "Sudoku Handbook — solve by logic, not guessing",
  metaDescription:
    "A guide to solving Sudoku: rules, pencil marks and 21 logical techniques from 1-step to N-step reasoning, each with a real worked example you can step through.",
  skip: "Skip to content",
  nav: { basics: "Basics", techniques: "Techniques", walkthrough: "Walkthrough", cheatSheet: "Cheat sheet", glossary: "Glossary" },
  navLabel: "Main navigation",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  themeToDark: "Switch to dark mode",
  themeToLight: "Switch to light mode",
  langLabel: "Language",
  footerAbout:
    "Every example in this handbook comes from a real puzzle with a unique solution, and every deduction has been checked by machine against that solution.",
  footerRefs: "References:",
  footerLevels: "Three levels of reasoning",
  footerPages: "Pages",
  and: "and",
  search: {
    button: "Search techniques",
    label: "Search the handbook",
    placeholder: "Type a technique, e.g. naked pair, x-wing…",
    empty: (q: string) => `No results for “${q}”. Try a Vietnamese name, such as “cặp lộ”.`,
    keyword: "Keyword",
    kindPage: "Page",
    kindLevel: "Level",
    kindTerm: "Glossary",
  },
  player: {
    steps: "Reasoning steps",
    exampleLabel: (n: number, t: string) => `Worked example, step ${n}: ${t}`,
    prev: "Previous step",
    next: "Next step",
    restart: "Start over",
    showCands: "Show candidates",
    carried: "The candidates on this board were already reduced by earlier eliminations in this puzzle's solution.",
    tallySeen: (d: number) => `${d}: present`,
    tallyMissing: (d: number) => `${d}: missing`,
  },
  hero: { replay: "Replay", label: (t: string) => `Illustration: ${t}` },
  progress: {
    mark: "Mark as understood",
    done: "Understood",
    saved: "Your progress is saved in this browser.",
    count: (d: number, n: number) => `Understood ${d}/${n}`,
  },
  difficulty: (v: number) => `Difficulty ${v} of 5`,
  difficultyWord: "Difficulty",
  thumb: (t: string) => `Thumbnail: ${t}`,
  print: "Print the cheat sheet",
  legend: [
    "Given digit",
    "Digit placed by reasoning",
    "Cell being studied, or just solved",
    "Cells that make up the pattern",
    "Blocking digit: blocks its row, column and box",
    "Blocked cell: cannot take the digit in question",
    "Eliminated candidate",
    "Two mutually exclusive options (blue or orange)",
    "Blocking ray: the direction a blocking digit rules out",
    "Dotted line: the eliminated cell sees this pattern cell",
    "Strong link: if not this cell, then that one",
    "Weak link: if this cell, then not that one",
  ],
  walk: {
    puzzle: "The puzzle",
    givens: (n: number) => `${n} givens. Press “Next step” or use the arrow keys to walk through the solution.`,
    stepOf: (i: number, n: number) => `Step ${i}/${n}`,
    autoCands: "This step eliminates candidates, so the board shows pencil marks automatically.",
    done: "Solved",
    doneText: "Every cell was filled by reasoning, without a single guess.",
    always: "Always show candidates",
    pick: "Choose a step",
    list: "List of steps",
    placed: (cell: string, d: number) => `${cell} = ${d}`,
    removed: (n: number) => `${n} eliminated`,
    label: (i: number) => `Walkthrough, step ${i}`,
  },
  notFound: { title: "Page not found", body: "The link may have changed. Go to the technique list or use the search at the top." },
  boardLabel: "Sudoku board",
};

export type Dict = typeof en;

const vi: Dict = {
  siteName: "Sổ tay Sudoku",
  metaTitle: "Sổ tay Sudoku — giải bằng suy luận, không đoán",
  metaDescription:
    "Hướng dẫn giải Sudoku bằng tiếng Việt: luật chơi, cách ghi ứng viên và 21 kỹ thuật suy luận từ 1 bước đến N bước, mỗi kỹ thuật có ví dụ thật minh hoạ từng bước.",
  skip: "Bỏ qua điều hướng",
  nav: { basics: "Cơ bản", techniques: "Kỹ thuật", walkthrough: "Giải mẫu", cheatSheet: "Tóm tắt", glossary: "Thuật ngữ" },
  navLabel: "Điều hướng chính",
  openMenu: "Mở menu",
  closeMenu: "Đóng menu",
  themeToDark: "Chuyển sang nền tối",
  themeToLight: "Chuyển sang nền sáng",
  langLabel: "Ngôn ngữ",
  footerAbout:
    "Mọi ví dụ trong sổ tay được lấy từ đề thật có lời giải duy nhất, và mỗi bước suy luận đã được máy kiểm chứng với lời giải đó.",
  footerRefs: "Tài liệu tham khảo:",
  footerLevels: "Ba tầng suy luận",
  footerPages: "Trang",
  and: "và",
  search: {
    button: "Tìm kỹ thuật",
    label: "Tìm trong sổ tay",
    placeholder: "Gõ tên kỹ thuật, ví dụ: cap lo, x-wing…",
    empty: (q: string) => `Không có kết quả cho “${q}”. Thử tên tiếng Anh, như “naked pair”.`,
    keyword: "Từ khoá",
    kindPage: "Trang",
    kindLevel: "Tầng",
    kindTerm: "Thuật ngữ",
  },
  player: {
    steps: "Các bước suy luận",
    exampleLabel: (n: number, t: string) => `Ví dụ minh hoạ, bước ${n}: ${t}`,
    prev: "Bước trước",
    next: "Bước tiếp",
    restart: "Xem lại từ đầu",
    showCands: "Hiện ứng viên",
    carried: "Ứng viên trên bàn đã được rút gọn bởi các bước loại trừ trước đó trong lời giải của đề này.",
    tallySeen: (d: number) => `${d}: đã có`,
    tallyMissing: (d: number) => `${d}: còn thiếu`,
  },
  hero: { replay: "Phát lại", label: (t: string) => `Minh hoạ: ${t}` },
  progress: {
    mark: "Đánh dấu đã hiểu",
    done: "Đã hiểu kỹ thuật này",
    saved: "Tiến độ được lưu trong trình duyệt của bạn.",
    count: (d: number, n: number) => `Đã hiểu ${d}/${n}`,
  },
  difficulty: (v: number) => `Độ khó ${v} trên 5`,
  difficultyWord: "Độ khó",
  thumb: (t: string) => `Hình thu nhỏ: ${t}`,
  print: "In bảng tóm tắt",
  legend: [
    "Số cho sẵn trong đề",
    "Số đã điền bằng suy luận",
    "Ô đang xét hoặc ô vừa kết luận",
    "Các ô tạo nên mẫu hình",
    "Ô gây chặn: số này chặn hàng, cột, khối của nó",
    "Ô bị chặn, không nhận được số đang xét",
    "Ứng viên bị loại",
    "Hai khả năng loại trừ nhau (xanh hoặc cam)",
    "Tia chặn: hướng mà số gây chặn loại trừ",
    "Đường chấm: ô bị loại nhìn thấy ô này của mẫu hình",
    "Liên kết mạnh: không phải ô này thì là ô kia",
    "Liên kết yếu: là ô này thì không phải ô kia",
  ],
  walk: {
    puzzle: "Đề bài",
    givens: (n: number) => `${n} số cho sẵn. Bấm “Bước tiếp” hoặc dùng phím mũi tên để đi qua lời giải.`,
    stepOf: (i: number, n: number) => `Bước ${i}/${n}`,
    autoCands: "Bước này loại ứng viên nên bàn cờ tự hiện ghi chú bút chì.",
    done: "Hoàn thành",
    doneText: "Mọi ô đã được điền bằng suy luận, không cần đoán một lần nào.",
    always: "Luôn hiện ứng viên",
    pick: "Chọn bước",
    list: "Danh sách các bước",
    placed: (cell: string, d: number) => `${cell} = ${d}`,
    removed: (n: number) => `loại ${n} ứng viên`,
    label: (i: number) => `Giải mẫu, bước ${i}`,
  },
  notFound: { title: "Không tìm thấy trang này", body: "Đường dẫn có thể đã đổi. Hãy về danh sách kỹ thuật hoặc dùng ô tìm kiếm ở đầu trang." },
  boardLabel: "Bàn cờ Sudoku",
};

export const UI: Record<Lang, Dict> = { en, vi };
export const t = (lang: Lang): Dict => UI[lang];
