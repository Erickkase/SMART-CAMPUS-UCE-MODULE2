import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SocioeconomicForms from './pages/SocioeconomicForms';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem('welfare_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const token = sessionStorage.getItem('welfare_token');

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="socioeconomic-forms" element={<SocioeconomicForms />} />
      </Route>
    </Routes>
  );
}
