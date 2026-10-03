import { href, t, type Lang, type RouteKey } from "@/lib/i18n";

const KEYS: Exclude<RouteKey, "home" | "levels">[] = ["basics", "techniques", "walkthrough", "cheatSheet", "glossary"];

export function navItems(lang: Lang) {
  const L = t(lang);
  return KEYS.map((key) => ({ key, href: href(lang, key), label: L.nav[key] }));
}

/** Mục "Kỹ thuật" sáng cả khi đang ở trang tầng suy luận. */
export function isNavActive(lang: Lang, key: RouteKey, pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (key === "techniques") return path.startsWith(href(lang, "techniques")) || path.startsWith(href(lang, "levels"));
  return path.startsWith(href(lang, key));
}
