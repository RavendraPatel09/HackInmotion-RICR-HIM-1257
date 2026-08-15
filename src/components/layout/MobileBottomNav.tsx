import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, PlusCircle, ListTodo, Map, BarChart3, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { isCitizen, isAdmin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

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

  return (
<<<<<<< HEAD
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#D6E2DE] px-4 py-2 flex items-center justify-around shadow-2xl transition-colors">
=======
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-2xl transition-colors">
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
      {isCitizen && (
        <>
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
              isNavActive('/') ? 'text-[#053229]' : 'text-[#73827D]'
=======
              isNavActive('/citizen') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('navigation.home') || 'Home'}</span>
          </Link>
          <Link
            to="/report"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
              isNavActive('/report') ? 'text-[#053229]' : 'text-[#73827D]'
=======
              isNavActive('/citizen/report') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('navigation.reportIssue') || 'Report'}</span>
          </Link>
          <Link
            to="/reports"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
              isNavActive('/reports') ? 'text-[#053229]' : 'text-[#73827D]'
=======
              isNavActive('/citizen/issues') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>{t('navigation.myReports') || 'Issues'}</span>
          </Link>
        </>
      )}

      {isAdmin && (
        <>
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
              isNavActive('/admin') ? 'text-[#053229]' : 'text-[#73827D]'
=======
              isNavActive('/admin') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/queue"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
              isNavActive('/admin/queue') ? 'text-[#053229]' : 'text-[#73827D]'
=======
              isNavActive('/admin/queue') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>Queue</span>
          </Link>
          <Link
            to="/admin/analytics"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
              isNavActive('/admin/analytics') ? 'text-[#053229]' : 'text-[#73827D]'
=======
              isNavActive('/admin/analytics') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
        </>
      )}

      <Link
        to="/map"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
          isNavActive('/map') ? 'text-[#053229]' : 'text-[#73827D]'
=======
          isNavActive('/map') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
        }`}
      >
        <Map className="w-5 h-5" />
        <span>Map</span>
      </Link>

      <Link
        to="/transparency"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
<<<<<<< HEAD
          isNavActive('/transparency') ? 'text-emerald-700' : 'text-[#73827D]'
=======
          isNavActive('/transparency') ? 'text-cf-primary-600' : 'text-slate-500'
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>Scores</span>
      </Link>
    </nav>
  );
};
