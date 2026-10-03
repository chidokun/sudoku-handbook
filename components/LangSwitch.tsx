"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANG_STORAGE_KEY, LANGS, switchPath, t, type Lang } from "@/lib/i18n";

const LABEL: Record<Lang, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  vi: { short: "VI", name: "Tiếng Việt" },
};

/** Chuyển sang cùng trang ở ngôn ngữ kia và ghi nhớ lựa chọn để lần sau không bị tự chuyển. */
export function LangSwitch({ lang }: { lang: Lang }) {
  const path = usePathname();
  return (
    <div role="group" aria-label={t(lang).langLabel} className="flex h-9 items-center rounded-lg border border-rule bg-surface p-0.5 text-[13px] font-semibold">
      {LANGS.map((l) =>
        l === lang ? (
          <span key={l} aria-current="true" className="grid h-full place-items-center rounded-md bg-ink px-2 text-paper" title={LABEL[l].name}>
            {LABEL[l].short}
          </span>
        ) : (
          <Link
            key={l}
            href={switchPath(path, l)}
            hrefLang={l}
            lang={l}
            title={LABEL[l].name}
            onClick={() => {
              try {
                localStorage.setItem(LANG_STORAGE_KEY, l);
              } catch {}
            }}
            className="grid h-full place-items-center rounded-md px-2 text-ink-2 no-underline hover:text-ink"
          >
            {LABEL[l].short}
          </Link>
        ),
      )}
    </div>
  );
}
