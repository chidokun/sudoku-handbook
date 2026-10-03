import Link from "next/link";
import { LEVELS } from "@/content/levels";
import { techniquesOfLevel } from "@/content/techniques";
import { LevelGlyph } from "./LevelGlyph";
import { LearnedMark } from "./Progress";

export function TechSidebar({ current }: { current?: string }) {
  return (
    <nav aria-label="Danh sách kỹ thuật" className="text-[14.5px]">
      {LEVELS.map((l) => (
        <div key={l.slug} data-level={l.level} className="mb-6">
          <Link
            href={`/suy-luan/${l.slug}`}
            className="mb-2 flex items-center gap-2 font-semibold no-underline"
            style={{ color: "var(--lv)" }}
          >
            <LevelGlyph level={l.level} />
            {l.title}
          </Link>
          <ul className="grid gap-0.5 border-l border-rule">
            {techniquesOfLevel(l.level).map((t) => {
              const on = t.slug === current;
              return (
                <li key={t.slug}>
                  <Link
                    href={`/ky-thuat/${t.slug}`}
                    aria-current={on ? "page" : undefined}
                    className={`-ml-px flex items-center justify-between gap-2 border-l-2 py-1 pl-3 pr-1 no-underline ${
                      on ? "font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"
                    }`}
                    style={on ? { borderColor: "var(--lv)" } : undefined}
                  >
                    <span>{t.name}</span>
                    <LearnedMark slug={t.slug} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
