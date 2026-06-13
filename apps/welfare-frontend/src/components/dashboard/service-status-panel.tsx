import type { ServiceStatus } from '@/lib/api/service-status';

interface ServiceStatusPanelProps {
  services: ServiceStatus[];
}

export function ServiceStatusPanel({ services }: ServiceStatusPanelProps) {
  return (
    <section className="rounded-[1.75rem] border border-campus-navy/10 bg-campus-navy p-7 text-white shadow-academic">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-campus-gold">
        Service Status
      </p>
      <h2 className="mt-3 text-2xl font-extrabold">
        Microservice health checks
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/65">
        Real-time availability based on each service <code>/health</code> endpoint.
      </p>

      <div className="mt-7 space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="rounded-2xl border border-white/10 bg-white/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">{service.name}</p>
                <p className="mt-1 text-xs text-white/60">GET {service.baseUrl}/health</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  service.isAvailable
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : 'bg-rose-400/20 text-rose-200'
                }`}
              >
                {service.isAvailable ? 'Healthy' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
