export function SectionCard({ title, children, eyebrow }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-humata">{eyebrow}</p> : null}
      <h2 className="mb-4 text-2xl font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
