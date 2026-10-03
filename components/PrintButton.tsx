"use client";

import { t, type Lang } from "@/lib/i18n";

export function PrintButton({ lang }: { lang: Lang }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex h-10 items-center gap-2 rounded-lg border border-rule bg-surface px-4 text-sm font-medium hover:border-ink-3"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
        <path d="M5 8V2.5h10V8M5 14.5H3.5v-6h13v6H15M5.5 12h9v5.5h-9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      {t(lang).print}
    </button>
  );
}
