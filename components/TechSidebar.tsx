import Link from "next/link";
import { getLevels } from "@/content/levels";
import { techniquesOfLevel } from "@/content/techniques";
import { levelHref, techHref, type Lang } from "@/lib/i18n";
import { LevelGlyph } from "./LevelGlyph";
import { LearnedMark } from "./Progress";

export function TechSidebar({ current, lang }: { current?: string; lang: Lang }) {
  return (
    <nav aria-label={lang === "vi" ? "Danh sách kỹ thuật" : "Technique list"} className="text-[14.5px]">
      {getLevels(lang).map((l) => (
        <div key={l.slug} data-level={l.level} className="mb-6">
          <Link href={levelHref(lang, l.level)} className="mb-2 flex items-center gap-2 font-semibold no-underline" style={{ color: "var(--lv)" }}>
            <LevelGlyph level={l.level} />
            {l.title}
          </Link>
          <ul className="grid gap-0.5 border-l border-rule">
            {techniquesOfLevel(lang, l.level).map((tech) => {
              const on = tech.slug === current;
              return (
                <li key={tech.slug}>
                  <Link
                    href={techHref(lang, tech.slug)}
                    aria-current={on ? "page" : undefined}
                    className={`-ml-px flex items-center justify-between gap-2 border-l-2 py-1 pl-3 pr-1 no-underline ${
                      on ? "font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"
                    }`}
                    style={on ? { borderColor: "var(--lv)" } : undefined}
                  >
                    <span>{tech.name}</span>
                    <LearnedMark slug={tech.slug} lang={lang} />
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
