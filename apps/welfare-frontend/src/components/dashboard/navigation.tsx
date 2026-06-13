'use client';

import { usePathname } from 'next/navigation';

const navigationItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Socioeconomic Forms', href: '/socioeconomic-forms' },
  { label: 'Psychological Care', href: '/psychological-care' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-4 z-10 mx-auto flex max-w-7xl flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-campus-gold">
          SMART CAMPUS UCE
        </p>
        <p className="mt-1 text-sm font-semibold text-campus-navy">
          Student Welfare Portal
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === item.href
                ? 'bg-campus-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-campus-blue/10 hover:text-campus-blue'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
