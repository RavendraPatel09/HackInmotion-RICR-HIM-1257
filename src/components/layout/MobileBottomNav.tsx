import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, PlusCircle, ListTodo, Map, BarChart3, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { isCitizen, isAdmin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const isNavActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl transition-colors">
      {isCitizen && (
        <>
          <Link
            to="/citizen"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/citizen') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('home')}</span>
          </Link>
          <Link
            to="/citizen/report"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/citizen/report') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('reportIssue')}</span>
          </Link>
          <Link
            to="/citizen/issues"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/citizen/issues') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
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
              isNavActive('/admin') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/queue"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/admin/queue') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>Queue</span>
          </Link>
          <Link
            to="/admin/analytics"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isNavActive('/admin/analytics') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
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
          isNavActive('/map') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Map className="w-5 h-5" />
        <span>Map</span>
      </Link>

      <Link
        to="/transparency"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
          isNavActive('/transparency') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>Scores</span>
      </Link>
    </nav>
  );
};
