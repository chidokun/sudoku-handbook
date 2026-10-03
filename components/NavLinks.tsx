"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { isNavActive, navItems } from "@/lib/nav";

export function NavLinks({ lang }: { lang: Lang }) {
  const path = usePathname();
  return (
    <nav aria-label={t(lang).navLabel} className="hidden md:block">
      <ul className="flex items-center gap-1">
        {navItems(lang).map((n) => {
          const on = isNavActive(lang, n.key, path);
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-[15px] no-underline transition-colors ${
                  on ? "bg-sunken font-semibold text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNav({ lang }: { lang: Lang }) {
  const L = t(lang);
  const path = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // Đóng menu khi chuyển trang: menu chỉ mở cho đúng đường dẫn đã bấm.
  const open = openPath === path;
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpenPath(open ? null : path)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-sunken"
        aria-label={open ? L.closeMenu : L.openMenu}
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
          {open ? (
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open && (
        <nav id="mobile-nav" aria-label={L.navLabel} className="absolute inset-x-0 top-full border-b border-rule bg-surface px-4 py-3 shadow-lg">
          <ul className="grid gap-1">
            {navItems(lang).map((n) => {
              const on = isNavActive(lang, n.key, path);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpenPath(null)}
                    aria-current={on ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 no-underline ${on ? "bg-sunken font-semibold" : "text-ink-2"}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
