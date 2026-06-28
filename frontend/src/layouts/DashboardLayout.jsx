import { Outlet, NavLink, Link } from 'react-router-dom';
import { Logo } from '../icons/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-2.5 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-sage-600 text-paper' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
  }`;

const DashboardLayout = ({ navItems, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-paper-dim">
      <aside className="hidden md:flex w-64 flex-col border-r border-ink/8 bg-paper px-4 py-6">
        <Link to="/" className="px-2 mb-8">
          <Logo markClassName="h-7 w-7" />
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon size={17} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink/8 pt-4 mt-4">
          <p className="px-2 text-sm font-semibold text-ink truncate">{user?.name}</p>
          <p className="px-2 text-xs text-mist truncate mb-2">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/5"
          >
            <LogOut size={17} strokeWidth={1.8} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-ink/8 bg-paper px-4 h-14">
          <Link to="/"><Logo markClassName="h-7 w-7" /></Link>
          <button onClick={handleLogout} className="text-sm text-ink/70">Log out</button>
        </header>

        <div className="border-b border-ink/8 bg-paper px-4 sm:px-6 py-5">
          <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
        </div>

        <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-ink/8 bg-paper px-4 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium ${
                  isActive ? 'bg-sage-600 text-paper' : 'text-ink/70'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
