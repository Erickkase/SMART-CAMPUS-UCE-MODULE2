import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
