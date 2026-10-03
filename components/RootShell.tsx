import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getGlossary } from "@/content/glossary";
import { getLevels } from "@/content/levels";
import { getTechniques } from "@/content/techniques";
import { body, display, hand } from "@/lib/fonts";
import { detectScript, href, levelHref, SITE_URL, t, techHref, type Lang } from "@/lib/i18n";
import { navItems } from "@/lib/nav";
import { slugify } from "@/lib/text";
import { LangSwitch } from "./LangSwitch";
import { LogoMark } from "./Logo";
import { MobileNav, NavLinks } from "./NavLinks";
import { SearchDialog, type SearchItem } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

const BASE_PATH = process.env.PAGES_BASE_PATH ?? "";
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function rootMetadata(lang: Lang): Metadata {
  const L = t(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: L.metaTitle, template: `%s · ${L.siteName}` },
    description: L.metaDescription,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1322" },
  ],
};

function searchItems(lang: Lang): SearchItem[] {
  const L = t(lang).search;
  const other: Lang = lang === "vi" ? "en" : "vi";
  const otherNames = Object.fromEntries(getTechniques(other).map((x) => [x.slug, `${x.name} ${x.alias}`]));
  return [
    ...getTechniques(lang).map((x) => ({
      href: techHref(lang, x.slug),
      title: x.name,
      sub: `${x.alias} — ${x.summary}`,
      kind: getLevels(lang)[x.level - 1].short,
      level: x.level,
      keywords: `${x.slug.replace(/-/g, " ")} ${otherNames[x.slug]}`,
    })),
    ...getLevels(lang).map((l) => ({ href: levelHref(lang, l.level), title: l.title, sub: l.tagline, kind: L.kindLevel, level: l.level })),
    ...navItems(lang)
      .filter((n) => n.key !== "techniques")
      .map((n) => ({ href: n.href, title: n.label, sub: "", kind: L.kindPage })),
    ...getGlossary(lang).map((g) => ({
      href: `${href(lang, "glossary")}#${slugify(g.term)}`,
      title: g.term,
      sub: `${g.alt} — ${g.def}`,
      kind: L.kindTerm,
    })),
  ];
}

export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const L = t(lang);
  return (
    <html lang={lang} className={`${body.variable} ${display.variable} ${hand.variable}`} suppressHydrationWarning>
      {/* App Router: <head> trong root layout là hợp lệ; quy tắc lint này dành cho Pages Router. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: detectScript(BASE_PATH) }} />
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
          {L.skip}
        </a>

        <header className="no-print sticky top-0 z-40 border-b border-rule bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md">
          <div className="relative mx-auto flex h-16 max-w-[1320px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
            <Link href={href(lang, "home")} className="flex items-center gap-2.5 no-underline">
              <LogoMark />
              <span className="hidden font-display text-[19px] font-bold tracking-tight min-[400px]:inline">{L.siteName}</span>
            </Link>
            <div className="ml-4 flex-1">
              <NavLinks lang={lang} />
            </div>
            <SearchDialog items={searchItems(lang)} lang={lang} />
            <LangSwitch lang={lang} />
            <ThemeToggle lang={lang} />
            <MobileNav lang={lang} />
          </div>
        </header>

        <main id="noi-dung" className="flex-1">
          {children}
        </main>

        <footer className="no-print mt-24 border-t border-rule">
          <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 text-sm text-ink-3 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="flex items-center gap-2 font-display text-base font-bold text-ink">
                <LogoMark className="h-6 w-6" /> {L.siteName}
              </p>
              <p className="mt-2 max-w-[46ch]">{L.footerAbout}</p>
              <p className="mt-2 max-w-[46ch]">
                {L.footerRefs}{" "}
                <a href="https://hodoku.sourceforge.net/en/techniques.php" target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-ink">
                  HoDoKu
                </a>{" "}
                {L.and}{" "}
                <a href="https://www.sudokuwiki.org/Strategy_Families" target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-ink">
                  SudokuWiki
                </a>
                .
              </p>
            </div>
            <div>
              <p className="font-semibold text-ink-2">{L.footerLevels}</p>
              <ul className="mt-2 grid gap-1.5">
                {getLevels(lang).map((l) => (
                  <li key={l.slug}>
                    <Link href={levelHref(lang, l.level)} className="no-underline hover:text-ink">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ink-2">{L.footerPages}</p>
              <ul className="mt-2 grid gap-1.5">
                {navItems(lang).map((n) => (
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
