import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ListTodo, Map, BarChart3, AlertTriangle, Clock, Settings } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRole } = useStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/issues', label: 'Manage Issues', icon: ListTodo },
    { path: '/admin/map', label: 'Command Map', icon: Map },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/hotspots', label: 'Hotspots', icon: AlertTriangle },
    { path: '/admin/sla', label: 'SLA Tracking', icon: Clock },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-surface-base overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-brand-navy text-white flex flex-col p-6 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl font-bold text-white tracking-tight">Civic Admin</div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Admin Header */}
        <header className="sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-on-surface-variant hover:text-on-surface">
              <Menu size={24} />
            </button>
            <div className="hidden md:block font-bold text-lg text-brand-navy">Smart Bhopal Command Center</div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Dropdown */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-outline hover:text-brand-navy transition-colors">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white"></span>
              </button>
              
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-elevation-2 py-2 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <div className="font-semibold text-sm">Notifications</div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-slate-50 border-b border-outline-variant/50">
                      <div className="text-sm"><span className="font-semibold text-error">Critical:</span> Water main break in Zone 3</div>
                      <div className="text-xs text-outline mt-1">10 mins ago</div>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50">
                      <div className="text-sm"><span className="font-semibold text-warning">Escalated:</span> 15 pending issues &gt; 48hrs</div>
                      <div className="text-xs text-outline mt-1">1 hr ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded-full text-sm font-semibold text-brand-navy hover:bg-slate-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px]">A</div>
                <span className="hidden md:block">Admin User</span>
                <ChevronDown size={16} className="hidden md:block" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-elevation-2 py-1 z-50">
                  <Link to="/admin/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-slate-50">
                    <User size={16} /> Admin Profile
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

        {/* Router View */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
