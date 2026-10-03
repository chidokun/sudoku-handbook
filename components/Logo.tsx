export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="27" height="27" rx="5" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2.2" />
      <rect x="19.5" y="1.5" width="9" height="9" fill="var(--t-focus)" />
      <path d="M10.5 2v26M19.5 2v26M2 10.5h26M2 19.5h26" stroke="var(--ink)" strokeWidth="1.2" opacity="0.45" />
      <rect x="1.5" y="1.5" width="27" height="27" rx="5" fill="none" stroke="var(--ink)" strokeWidth="2.2" />
      <path d="M22 6.5l1.6 1.6 3-3.3" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
