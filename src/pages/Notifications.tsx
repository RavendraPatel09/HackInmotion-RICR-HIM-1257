import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import { 
  Bell, Check, Trash2, Eye, EyeOff, AlertTriangle, 
  MapPin, ShieldAlert, CheckCircle, Info, MessageSquare, PlusCircle
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';
import { formatRelativeTime } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications, 
    deleteNotification 
  } = useNotifications();

  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterMode === 'unread') return !n.read;
    if (filterMode === 'read') return n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'sla_warning':
      case 'hotspot_alert':
        return <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />;
      case 'status_changed':
        return <Info className="w-4.5 h-4.5 text-blue-500" />;
      case 'upvote_received':
        return <MessageSquare className="w-4.5 h-4.5 text-[#053229] dark:text-[#0ca688]" />;
      case 'issue_resolved':
        return <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />;
      default:
        return <Bell className="w-4.5 h-4.5 text-[#73827D]" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-2 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#10201C] dark:text-[#f2f7f5] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#053229] dark:text-[#0ca688]" /> Notifications
          </h1>
          <p className="text-sm text-[#536761] dark:text-[#a3c4b9]">View logs and updates on reported civic problems and platform announcements.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { markAllAsRead(); showToast('All notifications marked as read', 'success'); }}
              className="px-3.5 py-1.5 border border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Mark All Read
            </button>
            <button 
              onClick={() => { clearNotifications(); showToast('All notifications cleared', 'info'); }}
              className="px-3.5 py-1.5 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}
      </div>

      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        {/* Filter Toggle pills */}
        <div className="flex items-center gap-2 border-b border-[#D6E2DE] dark:border-[#1e332f] pb-4">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filterMode === 'all' 
                ? 'bg-[#053229] text-white' 
                : 'bg-slate-50 dark:bg-[#152420] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filterMode === 'unread' 
                ? 'bg-[#053229] text-white' 
                : 'bg-slate-50 dark:bg-[#152420] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-100'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setFilterMode('read')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filterMode === 'read' 
                ? 'bg-[#053229] text-white' 
                : 'bg-slate-50 dark:bg-[#152420] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-100'
            }`}
          >
            Read ({notifications.filter(n => n.read).length})
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 shadow-2xs ${
                  notif.read 
                    ? 'bg-slate-50/40 dark:bg-slate-900/10 border-[#D6E2DE] dark:border-[#1e332f] opacity-80' 
                    : 'bg-[#E6F1EE]/20 dark:bg-[#142e2a]/10 border-[#053229]/20 dark:border-[#0ca688]/20 font-medium'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] shrink-0 shadow-xs">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-[#10201C] dark:text-[#f2f7f5]">{notif.title}</p>
                    <span className="text-[10px] text-[#73827D] dark:text-[#73948b] font-medium shrink-0">
                      {formatRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-[#536761] dark:text-[#a3c4b9] leading-relaxed">{notif.message}</p>
                  
                  {notif.trackingId && (
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-[#053229] dark:text-[#0ca688]">
                      <span>Tracking ID: {notif.trackingId}</span>
                      <span>&bull;</span>
                      <Link to="/reports" className="hover:underline flex items-center">
                        Track Ticket <PlusCircle className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 self-center">
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-1 text-[#053229] dark:text-[#0ca688] hover:bg-white dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-[#D6E2DE] transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => { deleteNotification(notif.id); showToast('Notification removed', 'info'); }}
                    className="p-1 text-rose-500 hover:bg-white dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-rose-100 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E6F1EE] dark:bg-[#142e2a] flex items-center justify-center mx-auto text-[#053229] dark:text-[#0ca688]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#10201C] dark:text-[#f2f7f5]">No notifications found</p>
                <p className="text-xs text-[#73827D] dark:text-[#73948b]">You have cleared all alerts or none match the selected filters.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
