import { useState } from 'react';
import { Leaf, ShoppingCart, Menu, X, User, LogOut, Package, Calendar } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { count } = useCart();
  const { user, profile, signOut } = useAuth();
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop Plants', to: '/shop' },
    { label: 'Gardener Services', to: '/services' },
    { label: 'About', to: '/about' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-forest-100 bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600 text-white">
            <Leaf size={22} />
          </div>
          <span className="font-display text-xl font-semibold text-forest-800">
            GreenNest
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-100 hover:text-forest-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest-700 transition-colors hover:bg-forest-100"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sand-400 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-10 items-center gap-2 rounded-full bg-forest-100 px-3 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-200"
              >
                <User size={18} />
                <span className="max-w-24 truncate">
                  {profile?.full_name || user.email}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-forest-100">
                  <button
                    onClick={() => { navigate('/account'); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50"
                  >
                    <Package size={16} /> My Orders
                  </button>
                  <button
                    onClick={() => { navigate('/account'); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50"
                  >
                    <Calendar size={16} /> My Bookings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 border-t border-forest-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-100"
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary !px-5 !py-2">
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest-700 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-forest-100 bg-cream md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-forest-700 hover:bg-forest-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-forest-100" />
            {user ? (
              <>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-forest-700 hover:bg-forest-100">
                  My Account
                </Link>
                <button onClick={handleSignOut} className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 py-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1">Sign In</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary flex-1">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
