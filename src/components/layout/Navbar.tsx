import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../ui/NotificationCenter';
import { SearchModal } from '../ui/SearchModal';
import logoImg from '../../assets/logo.png';
import {
  LogOut,
  UserCheck,
  PlusCircle,
  Map,
  BarChart3,
  ListTodo,
  FileCheck2,
  ChevronDown,
  User as UserIcon,
  Search,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isCitizen, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const isNavActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getLinkStyle = (path: string, activeColorClass: string = 'bg-white text-indigo-650') => {
    const isActive = isNavActive(path);
    if (isLanding) {
      return `px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 ${
        isActive 
          ? 'bg-indigo-650 text-white shadow-sm' 
          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
      }`;
    }
    return `px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 ${
      isActive 
        ? `${activeColorClass} shadow-sm` 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
    }`;
  };

  const isLanding = location.pathname === '/';

  return (
    <>
      <header className={`sticky top-0 z-[1000] w-full border-b backdrop-blur-[18px] shadow-xs transition-colors ${
        isLanding 
          ? 'bg-[#080D1C]/80 border-slate-800/85 text-white' 
          : 'bg-white/78 border-slate-200/50 text-slate-900'
      }`}>
        {/* Desi Tricolor Minimal Top Strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
        
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={logoImg}
              alt="NagarSathi Logo"
              className="w-9 h-9 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <span className={`text-lg font-black tracking-tight block leading-tight ${isLanding ? 'text-white' : 'text-slate-900'}`}>
                Nagar<span className="text-indigo-500">Sathi</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                {isLanding ? "India's Civic Tech" : "Bhopal Smart City"}
              </span>
            </div>
          </Link>
 
           {/* Desktop Stable Links List */}
          <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-xl border ${
            isLanding 
              ? 'bg-slate-900/60 border-slate-800' 
              : 'bg-slate-100/70 border-slate-200/50'
          }`}>
            <Link to="/" className={getLinkStyle('/')}>
              Home
            </Link>

            {isCitizen && (
              <>
                <Link to="/report" className={getLinkStyle('/report', 'bg-indigo-600 text-white')}>
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  Report Issue
                </Link>
                <Link to="/reports" className={getLinkStyle('/reports')}>
                  My Issues
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className={getLinkStyle('/admin')}>
                  Dashboard
                </Link>
                <Link to="/admin/queue" className={getLinkStyle('/admin/queue')}>
                  <ListTodo className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                  Queue
                </Link>
                <Link to="/admin/analytics" className={getLinkStyle('/admin/analytics')}>
                  <BarChart3 className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  Analytics
                </Link>
              </>
            )}

            <Link to="/map" className={getLinkStyle('/map')}>
              <Map className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
              City Map
            </Link>

            <Link to="/transparency" className={getLinkStyle('/transparency', 'bg-white text-emerald-700')}>
              <FileCheck2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              Transparency
            </Link>
          </nav>

          {/* Right Action Icons & Profile Dropdown */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2 rounded-xl transition-colors ${
                isLanding 
                  ? 'text-slate-350 hover:text-white hover:bg-slate-800/40' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Smart Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-1.5 p-1 rounded-full transition-colors border ${
                    isLanding 
                      ? 'border-slate-800 hover:bg-slate-800/60' 
                      : 'border-slate-200/80 hover:bg-slate-150'
                  }`}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-500/20"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-550" />
                </button>

                {/* Dropdown Box with proper z-index */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 p-3 shadow-xl z-[1100] space-y-3">
                      <div className="p-2 border-b border-slate-100 space-y-1">
                        <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-650 border border-indigo-200">
                          {user?.role}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-semibold">
                        <button
                          onClick={() => {
                            switchRole();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber-500" /> Switch to {user?.role === 'admin' ? 'Citizen' : 'Admin'}
                        </button>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-indigo-500" /> View Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 rounded-xl text-left text-rose-650 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
