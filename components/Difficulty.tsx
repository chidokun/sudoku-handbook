export function Difficulty({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Độ khó ${value} trên 5`} title={`Độ khó ${value}/5`}>
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
