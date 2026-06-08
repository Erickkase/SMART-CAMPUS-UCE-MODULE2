import { Navigation } from '@/components/dashboard/navigation';
import { ServiceStatusPanel } from '@/components/dashboard/service-status-panel';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { getServiceStatuses } from '@/lib/api/service-status';

export const dynamic = 'force-dynamic';

const summaryCards = [
  {
    title: 'Scholarship Requests',
    value: '128',
    description: 'Total scholarship requests registered for academic welfare review.',
    accent: 'blue' as const,
  },
  {
    title: 'Socioeconomic Forms',
    value: '94',
    description: 'Student socioeconomic forms available for support evaluation.',
    accent: 'navy' as const,
  },
  {
    title: 'Pending Reviews',
    value: '37',
    description: 'Cases waiting for administrative or welfare committee analysis.',
    accent: 'gold' as const,
  },
  {
    title: 'Approved Scholarships',
    value: '42',
    description: 'Scholarship requests approved and ready for follow-up actions.',
    accent: 'emerald' as const,
  },
];

export default async function DashboardPage() {
  const serviceStatuses = await getServiceStatuses();

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-12">
      <Navigation />

      <section className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-academic backdrop-blur md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-campus-gold">
                  Module 2 Dashboard
                </p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-campus-navy md:text-6xl">
                  Student Welfare and Support Module
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  A centralized academic dashboard for monitoring welfare services,
                  scholarship requests, socioeconomic assessments, and pending
                  student support reviews.
                </p>
              </div>

              <div className="rounded-3xl bg-campus-navy p-5 text-white shadow-lg">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
                  Current Sprint
                </p>
                <p className="mt-2 text-3xl font-black">18</p>
              </div>
            </div>
          </header>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </section>

          <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                  Academic Operations
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-campus-navy">
                  Module Navigation
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                CRUD screens will be added in future sprints. This dashboard is
                the entry point for visualizing service availability and module KPIs.
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ServiceStatusPanel services={serviceStatuses} />

          <section className="rounded-[1.75rem] border border-white/70 bg-campus-paper/90 p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
              Integration Scope
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
              <li>Scholarship API health endpoint connected.</li>
              <li>Socioeconomic API health endpoint connected.</li>
              <li>Summary metrics are placeholders for Sprint 18.</li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}
