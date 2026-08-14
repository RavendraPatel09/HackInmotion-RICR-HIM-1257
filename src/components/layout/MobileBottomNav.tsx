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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#D6E2DE] px-4 py-2 flex items-center justify-around shadow-2xl transition-colors">
      {isCitizen && (
        <>
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/') ? 'text-[#053229]' : 'text-[#73827D]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('home')}</span>
          </Link>
          <Link
            to="/report"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/report') ? 'text-[#053229]' : 'text-[#73827D]'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('reportIssue')}</span>
          </Link>
          <Link
            to="/reports"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/reports') ? 'text-[#053229]' : 'text-[#73827D]'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>{t('myIssues')}</span>
          </Link>
        </>
      )}

      {isAdmin && (
        <>
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/admin') ? 'text-[#053229]' : 'text-[#73827D]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/queue"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/admin/queue') ? 'text-[#053229]' : 'text-[#73827D]'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>Queue</span>
          </Link>
          <Link
            to="/admin/analytics"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/admin/analytics') ? 'text-[#053229]' : 'text-[#73827D]'
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
          isNavActive('/map') ? 'text-[#053229]' : 'text-[#73827D]'
        }`}
      >
        <Map className="w-5 h-5" />
        <span>Map</span>
      </Link>

      <Link
        to="/transparency"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
          isNavActive('/transparency') ? 'text-emerald-700' : 'text-[#73827D]'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>Scores</span>
      </Link>
    </nav>
  );
};
