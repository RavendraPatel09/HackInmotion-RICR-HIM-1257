import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useNotifications } from '../context/NotificationsContext';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { StatusPieChart } from '../components/charts/StatusPieChart';
import { ResolutionTimeChart } from '../components/charts/ResolutionTimeChart';
import { TrendsLineChart } from '../components/charts/TrendsLineChart';
import { detectHotspotZones } from '../services/hotspotDetection';
import { showToast } from '../components/ui/Toast';
import { BarChart3, BellRing, MapPin, Zap } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { issues } = useIssues();
  const { notify } = useNotifications();
  const hotspots = detectHotspotZones(issues);

  const [notifiedHotspots, setNotifiedHotspots] = useState<string[]>([]);

  const handleNotifyDepartment = (hotspotId: string, hotspotName: string, category: string) => {
    setNotifiedHotspots((prev) => [...prev, hotspotId]);
    notify(
      'Predictive Hotspot Alert Triggered',
      `Department dispatch team notified for recurring ${category.toUpperCase()} cluster at ${hotspotName}.`,
      'hotspot_alert'
    );
    showToast(`Department notification queued for priority team at ${hotspotName}.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /> Municipal Analytics &amp; Hotspots
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time charts derived directly from active issue state with predictive spatial clustering.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-100 dark:via-slate-900 to-slate-200 dark:to-slate-950 border border-amber-500/30 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" /> Spatial Clustering Engine
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Predictive Hotspot Zones</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Zones with &ge; 3 recurring issues within ~300 meters requiring preventive municipal action.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotspots.map((hs) => {
            const isNotified = notifiedHotspots.includes(hs.id);
            return (
              <div key={hs.id} className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-amber-500/30 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-[180px]">{hs.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20">
                    {hs.severity} Priority
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-900 dark:text-white">{hs.reportCount} reports</strong> within 300m radius
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Category: <span className="text-amber-600 dark:text-amber-300 font-semibold uppercase">{hs.category}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Trend: <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase">{hs.trend}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleNotifyDepartment(hs.id, hs.name, hs.category)}
                  disabled={isNotified}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                    isNotified
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  }`}
                >
                  <BellRing className="w-4 h-4" /> {isNotified ? 'Department Notified ✓' : 'Notify Department'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Issues by Category</h3>
          <CategoryBarChart issues={issues} />
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Issue Status Distribution</h3>
          <StatusPieChart issues={issues} />
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Average Resolution Time (Hours)</h3>
          <ResolutionTimeChart issues={issues} />
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reporting Volume Trends</h3>
          <TrendsLineChart issues={issues} />
        </div>
      </div>
    </div>
  );
};
