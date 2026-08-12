import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationsContext';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateUtils';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  Building2,
  Sparkles,
  Info,
  X,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredList = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const handleNotificationClick = (id: string, issueId?: string) => {
    markAsRead(id);
    setIsOpen(false);
    if (issueId) {
      navigate('/citizen/issues');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sla_warning':
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'issue_resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'upvote_received':
        return <ThumbsUp className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'department_assigned':
        return <Building2 className="w-4 h-4 text-cyan-500 shrink-0" />;
      case 'report_created':
        return <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="notification-dropdown-panel fixed md:absolute right-4 left-4 md:left-auto md:right-0 mt-2 max-w-md md:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-[1100]"
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-[11px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Actions Bar */}
            <div className="p-2.5 bg-slate-100/50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                    filter === 'unread'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unread
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Read all
                </button>
                <button
                  onClick={clearNotifications}
                  className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Notification List Container */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.issueId)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-indigo-50/30 hover:bg-indigo-50/50'
                    }`}
                  >
                    <div className="mt-0.5">{getTypeIcon(n.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {formatRelativeTime(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">You're all caught up!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
