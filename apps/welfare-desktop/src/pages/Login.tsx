import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('admin@welfare.uce.edu.ec');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      sessionStorage.setItem('welfare_token', res.data.token);
      navigate('/');
    } catch {
      setError('Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[1.75rem] border border-white/70 bg-white/85 p-8 shadow-academic">
        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-campus-gold">
          SMART CAMPUS UCE
        </p>
        <h1 className="mt-3 text-center text-3xl font-black text-campus-navy">
          Welfare Desktop
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-campus-navy">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-campus-navy">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
              required
            />
          </label>

          {error && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-campus-blue disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
