import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, Home, PlusCircle, MapPin, ChevronDown, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function CitizenLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, setRole } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const navItems = [
    { path: '/citizen', label: 'Dashboard', icon: Home },
    { path: '/citizen/report', label: 'Report', icon: PlusCircle },
    { path: '/citizen/issues', label: 'Track', icon: MapPin },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      
      {/* Citizen Header & Desktop Nav */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant px-4 md:px-8 py-3 flex justify-between items-center shadow-elevation-1">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-brand-navy">Smart Bhopal</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`font-semibold pb-1 border-b-2 transition-colors ${location.pathname === item.path ? 'border-brand-green text-brand-green' : 'border-transparent text-outline hover:text-on-surface'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Entry */}
          <Link to="/citizen/notifications" className="relative p-2 text-outline hover:text-brand-navy transition-colors">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white"></span>
            )}
          </Link>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-brand-navy hover:bg-slate-200 transition-colors"
            >
              Rajesh K. <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-elevation-2 py-1 z-50">
                <Link to="/citizen/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-slate-50">
                  <User size={16} /> My Profile
                </Link>
                <Link to="/citizen/impact" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-slate-50">
                  <MapPin size={16} /> My Civic Impact
                </Link>
                <div className="h-[1px] bg-outline-variant my-1"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/5 text-left">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-20 md:pb-0">
        <div className="max-w-[1200px] mx-auto w-full p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_12px_rgba(15,39,64,0.05)] z-50 flex justify-around py-2 pb-safe">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${location.pathname === item.path ? 'text-brand-green' : 'text-outline'}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
