import { useLocation, useNavigate } from 'react-router-dom';

const LINKS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Socioeconomic Forms', path: '/socioeconomic-forms' },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('welfare_token');
    navigate('/login');
  };

  return (
    <aside className="flex w-64 flex-col bg-campus-navy text-white">
      <div className="px-6 pb-4 pt-8">
        <h1 className="text-lg font-black tracking-tight">Welfare Desktop</h1>
        <p className="mt-1 text-xs text-white/60">SMART CAMPUS UCE</p>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active = location.pathname === link.path;
          return (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
