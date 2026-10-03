import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque, Caveat } from "next/font/google";
import Link from "next/link";
import { GLOSSARY } from "@/content/glossary";
import { LEVELS } from "@/content/levels";
import { TECHNIQUES } from "@/content/techniques";
import { LogoMark } from "@/components/Logo";
import { MobileNav, NavLinks } from "@/components/NavLinks";
import { NAV } from "@/lib/nav";
import { SearchDialog, type SearchItem } from "@/components/SearchDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { slugify } from "@/lib/text";
import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  axes: ["opsz", "wdth"],
});

const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: {
    default: "Sổ tay Sudoku — giải bằng suy luận, không đoán",
    template: "%s · Sổ tay Sudoku",
  },
  description:
    "Hướng dẫn giải Sudoku bằng tiếng Việt: luật chơi, cách ghi ứng viên và 21 kỹ thuật suy luận từ 1 bước đến N bước, mỗi kỹ thuật có ví dụ thật minh hoạ từng bước.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1322" },
  ],
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

function searchItems(): SearchItem[] {
  return [
    ...TECHNIQUES.map((t) => ({
      href: `/ky-thuat/${t.slug}`,
      title: t.name,
      sub: `${t.alias} — ${t.summary}`,
      kind: `${LEVELS[t.level - 1].short}`,
      level: t.level,
      keywords: t.slug.replace(/-/g, " "),
    })),
    ...LEVELS.map((l) => ({ href: `/suy-luan/${l.slug}`, title: l.title, sub: l.tagline, kind: "Tầng", level: l.level })),
    { href: "/co-ban", title: "Cơ bản: luật chơi và cách ghi ứng viên", sub: "Hàng, cột, khối, tên ô, ghi chú bút chì", kind: "Trang" },
    { href: "/giai-mau", title: "Giải mẫu một đề từ đầu đến cuối", sub: "Từng bước, kèm kỹ thuật được dùng", kind: "Trang" },
    { href: "/tom-tat", title: "Bảng tóm tắt", sub: "Mọi kỹ thuật trên một trang, có thể in", kind: "Trang" },
    { href: "/thuat-ngu", title: "Thuật ngữ", sub: "Giải thích các từ dùng trong sổ tay", kind: "Trang" },
    ...GLOSSARY.map((g) => ({ href: `/thuat-ngu#${slugify(g.term)}`, title: g.term, sub: `${g.en} — ${g.def}`, kind: "Thuật ngữ" })),
  ];
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${body.variable} ${display.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Hoạ tiết dùng chung cho mọi bàn cờ */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--t-blocked)" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--hatch)" strokeWidth="2.4" />
            </pattern>
            <marker id="ray-head" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="2.3" markerHeight="2.3" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="var(--ray)" />
            </marker>
          </defs>
        </svg>

        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Bỏ qua điều hướng
        </a>

        <header className="no-print sticky top-0 z-40 border-b border-rule bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md">
          <div className="relative mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <LogoMark />
              <span className="font-display text-[19px] font-bold tracking-tight">Sổ tay Sudoku</span>
            </Link>
            <div className="ml-4 flex-1">
              <NavLinks />
            </div>
            <SearchDialog items={searchItems()} />
            <ThemeToggle />
            <MobileNav />
          </div>
        </header>

        <main id="noi-dung" className="flex-1">
          {children}
        </main>

        <footer className="no-print mt-24 border-t border-rule">
          <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 text-sm text-ink-3 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="flex items-center gap-2 font-display text-base font-bold text-ink">
                <LogoMark className="h-6 w-6" /> Sổ tay Sudoku
              </p>
              <p className="mt-2 max-w-[46ch]">
                Mọi ví dụ trong sổ tay được lấy từ đề thật có lời giải duy nhất, và mỗi bước suy luận đã được máy kiểm chứng với lời giải đó.
              </p>
              <p className="mt-2 max-w-[46ch]">
                Tài liệu tham khảo:{" "}
                <a href="https://hodoku.sourceforge.net/en/techniques.php" target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-ink">
                  HoDoKu
                </a>{" "}
                và{" "}
                <a href="https://www.sudokuwiki.org/Strategy_Families" target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-ink">
                  SudokuWiki
                </a>
                .
              </p>
            </div>
            <div>
              <p className="font-semibold text-ink-2">Ba tầng suy luận</p>
              <ul className="mt-2 grid gap-1.5">
                {LEVELS.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/suy-luan/${l.slug}`} className="no-underline hover:text-ink">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ink-2">Trang</p>
              <ul className="mt-2 grid gap-1.5">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="no-underline hover:text-ink">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
