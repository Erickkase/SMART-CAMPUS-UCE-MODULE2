interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  accent: 'blue' | 'gold' | 'emerald' | 'navy';
}

const accentStyles = {
  blue: 'bg-campus-blue/10 text-campus-blue',
  gold: 'bg-campus-gold/15 text-amber-700',
  emerald: 'bg-emerald-500/10 text-emerald-700',
  navy: 'bg-campus-navy/10 text-campus-navy',
};

export function SummaryCard({ title, value, description, accent }: SummaryCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-academic">
      <div className={`mb-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${accentStyles[accent]}`}>
        Module KPI
      </div>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-campus-navy">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
