import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import {
  Home,
  PlusCircle,
  FileText,
  Map,
  MapPin,
  ShieldCheck,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  isHidden: boolean;
  onToggle: () => void;
  onHide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, isHidden, onToggle, onHide }) => {
  const { user, isCitizen, isAdmin } = useAuth();
  const location = useLocation();

  if (isHidden) return null;

  const isNavActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/citizen';
    }
    if (path === '/report') {
      return location.pathname === '/report' || location.pathname === '/citizen/report';
    }
    if (path === '/reports') {
      return location.pathname === '/reports' || location.pathname === '/citizen/issues';
    }
    return location.pathname === path;
  };

  const renderNavItem = (path: string, label: string, Icon: React.ElementType) => {
    const active = isNavActive(path);
    return (
      <Link
        key={path}
        to={path}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-250 font-semibold text-sm
          ${active 
            ? 'bg-[#E6F1EE] text-[#053229] border border-[#BFD5CE] shadow-2xs font-extrabold translate-x-1' 
            : 'text-[#536761] hover:bg-[#F1F7F5] hover:text-[#053229] border border-transparent'
          }
          ${!isExpanded ? 'justify-center !translate-x-0' : ''}
        `}
        title={!isExpanded ? label : undefined}
      >
        <Icon className={`w-5 h-5 shrink-0 transition-transform duration-250 ${active ? 'text-[#053229] scale-[1.05]' : 'text-[#73827D] group-hover:scale-[1.08] group-hover:text-[#053229]'}`} />
        {isExpanded && <span className="transition-transform duration-250 group-hover:translate-x-0.5">{label}</span>}
      </Link>
    );
  };

  const citizenNav = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/report', label: 'Report Issue', icon: PlusCircle },
    { path: '/reports', label: 'My Reports', icon: FileText },
  ];

  const adminNav = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/queue', label: 'Queue', icon: ListTodo },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const sharedNav = [
    { path: '/map', label: 'City Map', icon: Map },
    { path: '/transparency', label: 'Transparency', icon: ShieldCheck },
  ];

  const secondaryNav = [
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  const sidebarWidth = isExpanded ? 'w-64' : 'w-[72px]';

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity ${isHidden ? 'hidden' : 'block'}`}
        onClick={onHide}
      />
      
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#FFFFFF] border-r border-[#D6E2DE] flex flex-col transition-all duration-300 ease-in-out ${sidebarWidth} ${isHidden ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}
      >
        {/* Top Brand Logo */}
        <div className={`flex items-center h-[68px] px-4 border-b border-[#D6E2DE] shrink-0 ${!isExpanded ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="NagarSathi Logo" className="w-8 h-8 object-contain rounded-full shadow-sm animate-fade-in-up" />
            {isExpanded && (
              <span className="text-lg font-black tracking-tight text-[#10201C]">
                Nagar<span className="text-[#053229]">Sathi</span>
              </span>
            )}
          </Link>
          {isExpanded && (
            <button className="md:hidden p-1.5 text-[#536761] hover:bg-[#F5F8F7] rounded-md" onClick={onHide}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <nav className="space-y-1">
            {isCitizen && citizenNav.map(nav => renderNavItem(nav.path, nav.label, nav.icon))}
            {isAdmin && adminNav.map(nav => renderNavItem(nav.path, nav.label, nav.icon))}
            <div className="my-2 border-t border-[#D6E2DE]/50" />
            {sharedNav.map(nav => renderNavItem(nav.path, nav.label, nav.icon))}
          </nav>
          
          <div>
            {isExpanded && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#73827D]">
                Preferences
              </p>
            )}
            <nav className="space-y-1">
              {secondaryNav.map(nav => renderNavItem(nav.path, nav.label, nav.icon))}
            </nav>
          </div>
        </div>

        {/* Bottom Profile Area */}
        {user && (
          <div className="p-3 border-t border-[#D6E2DE] shrink-0">
            <div className={`flex items-center gap-3 ${!isExpanded ? 'justify-center' : ''} p-2 rounded-xl bg-[#F5F8F7] border border-[#D6E2DE]`}>
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#B8CCC5]"
              />
              {isExpanded && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-[#10201C] truncate">{user.name}</p>
                  <span className="inline-block px-1.5 py-0.5 mt-0.5 rounded text-[9px] font-extrabold uppercase bg-[#053229] text-white tracking-wider">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
