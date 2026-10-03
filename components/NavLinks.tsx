"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/nav";


function isActive(path: string, href: string) {
  if (href === "/ky-thuat") return path.startsWith("/ky-thuat") || path.startsWith("/suy-luan");
  return path.startsWith(href);
}

export function NavLinks() {
  const path = usePathname();
  return (
    <nav aria-label="Điều hướng chính" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {NAV.map((n) => {
          const on = isActive(path, n.href);
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

export function MobileNav() {
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
        aria-label={open ? "Đóng menu" : "Mở menu"}
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
        <nav id="mobile-nav" aria-label="Điều hướng chính" className="absolute inset-x-0 top-full border-b border-rule bg-surface px-4 py-3 shadow-lg">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpenPath(null)}
                  aria-current={isActive(path, n.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2.5 no-underline ${isActive(path, n.href) ? "bg-sunken font-semibold" : "text-ink-2"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
