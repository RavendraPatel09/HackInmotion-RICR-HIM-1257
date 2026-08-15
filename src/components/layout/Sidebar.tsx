import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
<<<<<<< HEAD
import logoImg from '../../assets/logo.png';
import {
  Home,
  PlusCircle,
  FileText,
  Map,
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
  onToggle?: () => void;
  onHide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, isHidden, onHide }) => {
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
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
          ${active 
            ? 'bg-[#E6F1EE] text-[#053229] border border-[#BFD5CE]' 
            : 'text-[#536761] hover:bg-[#F1F7F5] hover:text-[#053229] border border-transparent'
          }
          ${!isExpanded ? 'justify-center' : ''}
        `}
        title={!isExpanded ? label : undefined}
      >
        <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#053229]' : 'text-[#73827D]'}`} />
        {isExpanded && <span>{label}</span>}
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
          <Link to={isAdmin ? '/admin' : '/citizen'} className="flex items-center gap-2 group">
            <img src={logoImg} alt="NagarSathi Logo" className="w-8 h-8 object-contain rounded-full shadow-sm" />
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
=======
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  PlusCircle,
  MapPin,
  Map,
  FileCheck2,
  ListTodo,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  Bell,
  Users
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed, setIsOpen }) => {
  const { isAdmin, isCitizen } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  const isNavActive = (path: string) => location.pathname === path;

  // We group the navigation links logically based on user role
  const mainLinks = [
    { to: isAdmin ? '/admin' : '/citizen', label: t('navigation.home') || 'Home', icon: Home, show: true },
    { to: '/citizen/report', label: t('navigation.reportIssue') || 'Report Issue', icon: PlusCircle, show: isCitizen },
    { to: '/citizen/issues', label: t('navigation.myReports') || 'My Reports', icon: MapPin, show: isCitizen },
    { to: '/admin/queue', label: t('navigation.queue') || 'Queue', icon: ListTodo, show: isAdmin },
    { to: '/admin/analytics', label: t('navigation.analytics') || 'Analytics', icon: BarChart3, show: isAdmin },
  ].filter(l => l.show);

  const communityLinks = [
    { to: '/map', label: t('navigation.cityMap') || 'City Map', icon: Map, show: true },
    { to: '/transparency', label: t('navigation.transparency') || 'Transparency', icon: FileCheck2, show: true },
    { to: '/community', label: t('navigation.community') || 'Community', icon: Users, show: true },
    { to: '/notifications', label: t('navigation.notifications') || 'Notifications', icon: Bell, show: true },
  ].filter(l => l.show);

  const accountLinks = [
    { to: '/profile', label: t('navigation.profile') || 'Profile', icon: Settings, show: true },
    { to: '/help', label: t('navigation.helpSupport') || 'Help & Support', icon: HelpCircle, show: true },
  ].filter(l => l.show);

  const renderLinks = (links: typeof mainLinks) => (
    <ul className="space-y-1">
      {links.map((link, idx) => {
        const active = isNavActive(link.to);
        return (
          <li key={idx}>
            <Link
              to={link.to}
              onClick={() => setIsOpen(false)} // Close on mobile when clicked
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                active
                  ? 'bg-cf-primary-50 text-cf-primary-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <link.icon className={`w-5 h-5 ${active ? 'text-cf-primary-600' : 'text-slate-500'}`} />
              {!isCollapsed && <span className="text-sm">{link.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1050] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-[1100] h-screen bg-white border-r border-slate-200 transition-all duration-250 ease-in-out flex flex-col shadow-xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
      >
        <div className="flex items-center justify-between h-[var(--header-height)] px-4 border-b border-slate-100 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900">
                Nagar<span className="text-cf-primary-500">Sathi</span>
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto font-black text-lg tracking-tight text-cf-primary-500">N</div>
          )}
          <button 
            className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          <div>
            {!isCollapsed && <p className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Main</p>}
            {renderLinks(mainLinks)}
          </div>
          <div>
            {!isCollapsed && <p className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Community</p>}
            {renderLinks(communityLinks)}
          </div>
          <div>
            {!isCollapsed && <p className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>}
            {renderLinks(accountLinks)}
          </div>
        </div>
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
      </aside>
    </>
  );
};
