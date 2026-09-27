import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Fraud Alerts', path: '/alerts', icon: '🚨' },
    { name: 'Orders', path: '/orders', icon: '📦' },
    { name: 'Products', path: '/products', icon: '🏷️' },
  ];

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-brand-200 flex flex-col justify-between shrink-0 fixed left-0 top-0 bottom-0 z-30">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-brand-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-xl shrink-0">
              🛒
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-primary leading-tight">
                SmartCart
              </span>
              <div className="mt-1">
                <Badge
                  variant="default"
                  className="bg-brand-accent text-white hover:bg-brand-accent text-[10px] px-2 py-0.5 rounded-md"
                >
                  Admin Panel
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-text-primary font-medium'
                    : 'text-text-secondary hover:bg-brand-50'
                }`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User Info & Logout Button */}
      <div className="p-4 border-t border-brand-200 bg-white space-y-3">
        <div className="px-1">
          <p className="text-sm font-semibold text-text-primary truncate">
            {user?.name || 'Administrator'}
          </p>
          <p className="text-xs text-text-secondary capitalize truncate">
            {user?.role || 'Staff Admin'}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border-brand-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-text-secondary text-xs h-9 rounded-lg"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
