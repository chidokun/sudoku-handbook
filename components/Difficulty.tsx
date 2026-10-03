import { t, type Lang } from "@/lib/i18n";

export function Difficulty({ value, lang }: { value: number; lang: Lang }) {
  const label = t(lang).difficulty(value);
  return (
    <span className="inline-flex items-center gap-1" aria-label={label} title={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="inline-block h-2 w-2 rounded-[2px]"
          style={{ background: i < value ? "var(--ink)" : "var(--rule)" }}
        />
      ))}
    </span>
  );
}
