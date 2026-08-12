import React from 'react';
import { useIssues } from '../context/IssuesContext';
import { CityMap } from '../components/map/CityMap';
import { Map } from 'lucide-react';

export const CityMapPage: React.FC = () => {
  const { issues } = useIssues();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Map className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /> Interactive City Issue Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time GIS spatial view of municipal complaints across Bhopal Smart City zones.
          </p>
        </div>
      </div>

      <CityMap issues={issues} className="h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800" />
    </div>
  );
};
