import { NavLink, Outlet } from 'react-router-dom';
import { Package, Wrench, UserCircle } from 'lucide-react';

const tabs = [
  { to: '/account/orders', label: 'My rentals', icon: Package },
  { to: '/account/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/account/profile', label: 'Profile', icon: UserCircle },
];

const AccountLayout = () => (
  <div className="container-page py-8">
    <h1 className="font-display text-2xl font-semibold text-ink mb-6">Your account</h1>
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'bg-sage-600 text-paper' : 'text-ink/70 hover:bg-ink/5'
              }`
            }
          >
            <tab.icon size={16} strokeWidth={1.8} />
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  </div>
);

export default AccountLayout;
