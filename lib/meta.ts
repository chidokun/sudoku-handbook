import type { Metadata } from "next";
import { LANGS, t, type Lang } from "@/lib/i18n";

/** Metadata một trang, kèm liên kết hreflang tới bản ngôn ngữ còn lại. */
export function pageMeta(lang: Lang, path: (l: Lang) => string, title: string | null, description?: string): Metadata {
  return {
    ...(title ? { title } : {}),
    description: description ?? t(lang).metaDescription,
    alternates: {
      canonical: path(lang),
      languages: { ...Object.fromEntries(LANGS.map((l) => [l, path(l)])), "x-default": path("en") },
    },
    openGraph: { locale: lang === "vi" ? "vi_VN" : "en_US" },
  };
}
