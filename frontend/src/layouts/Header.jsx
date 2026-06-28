import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Store } from 'lucide-react';
import { Logo } from '../icons/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import LocationPicker from '../components/LocationPicker.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-ink' : 'text-mist hover:text-ink'
  }`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const totalItems = useCart().totalItems();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor' : '/account/orders';

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="RentEase home">
          <Logo markClassName="h-8 w-8" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 shrink-0">
          <NavLink to="/catalog" className={navLinkClass}>
            Browse all
          </NavLink>
          <NavLink to="/catalog?category=furniture" className={navLinkClass}>
            Furniture
          </NavLink>
          <NavLink to="/catalog?category=appliances" className={navLinkClass}>
            Appliances
          </NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>
            How it works
          </NavLink>
        </nav>

        <LocationPicker className="hidden sm:block shrink-0" />

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-ink/5"
            aria-label="Cart"
          >
            <ShoppingCart size={20} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-semibold text-ink">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-paper font-display text-sm font-semibold"
                aria-label="Account menu"
              >
                {user.name?.[0]?.toUpperCase() || <User size={16} />}
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 card p-1.5 animate-fade-up"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-ink/8">
                    <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                    <p className="text-xs text-mist truncate">{user.email}</p>
                  </div>
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-2 rounded px-3 py-2 text-sm text-ink hover:bg-ink/5"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {user.role === 'vendor' ? <Store size={16} /> : <LayoutDashboard size={16} />}
                    {user.role === 'admin' ? 'Admin dashboard' : user.role === 'vendor' ? 'Vendor dashboard' : 'My rentals'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-ink hover:bg-ink/5"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-ink/5"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-ink/8 px-4 py-3 space-y-1 animate-fade-up">
          <div className="sm:hidden pb-2 mb-1 border-b border-ink/8">
            <LocationPicker />
          </div>
          <Link to="/catalog" className="block py-2 text-sm font-medium text-ink" onClick={() => setMenuOpen(false)}>
            Browse all
          </Link>
          <Link to="/catalog?category=furniture" className="block py-2 text-sm font-medium text-ink" onClick={() => setMenuOpen(false)}>
            Furniture
          </Link>
          <Link to="/catalog?category=appliances" className="block py-2 text-sm font-medium text-ink" onClick={() => setMenuOpen(false)}>
            Appliances
          </Link>
          <Link to="/how-it-works" className="block py-2 text-sm font-medium text-ink" onClick={() => setMenuOpen(false)}>
            How it works
          </Link>
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-outline flex-1" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="btn-primary flex-1" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
