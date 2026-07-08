import { useNavigate } from 'react-router-dom';

const CARDS = [
  {
    title: 'Socioeconomic Forms',
    desc: 'Gestionar formularios socioeconómicos de estudiantes',
    path: '/socioeconomic-forms',
    accent: 'gold',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-campus-gold">
        Welfare Module
      </p>
      <h1 className="mt-2 text-3xl font-black text-campus-navy">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">
        Selecciona un módulo para gestionar
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <button
            key={card.path}
            type="button"
            onClick={() => navigate(card.path)}
            className="group rounded-[1.75rem] border border-white/70 bg-white/85 p-6 text-left shadow-academic transition hover:shadow-lg"
          >
            <p
              className={`text-xs font-bold uppercase tracking-[0.24em] ${
                card.accent === 'gold' ? 'text-campus-gold' : 'text-campus-blue'
              }`}
            >
              {card.accent === 'gold' ? 'Service' : 'Module'}
            </p>
            <h2 className="mt-2 text-xl font-black text-campus-navy">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
