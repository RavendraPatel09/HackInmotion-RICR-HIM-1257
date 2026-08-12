import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Issue, IssueStatus } from '../../types';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { formatRelativeTime } from '../../utils/dateUtils';
import { ThumbsUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomMarkerIcon = (status: IssueStatus, escalated: boolean) => {
  let color = '#3B82F6';
  if (escalated) color = '#EF4444';
  else if (status === 'Acknowledged') color = '#6366F1';
  else if (status === 'In Progress') color = '#F59E0B';
  else if (status === 'Resolved' || status === 'Verified') color = '#10B981';
  else if (status === 'Reopened') color = '#F43F5E';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#0F172A" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -38],
  });
};

interface CityMapProps {
  issues: Issue[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  onUpvote?: (issueId: string) => void;
  className?: string;
}

export const CityMap: React.FC<CityMapProps> = ({
  issues,
  centerLat = 23.2332,
  centerLng = 77.4345,
  zoom = 12,
  className = 'h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800',
}) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'reported' | 'in_progress' | 'resolved' | 'high_priority' | 'escalated'>('all');

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filter === 'reported') return issue.status === 'Reported';
      if (filter === 'in_progress') return issue.status === 'In Progress' || issue.status === 'Acknowledged';
      if (filter === 'resolved') return issue.status === 'Resolved' || issue.status === 'Verified';
      if (filter === 'high_priority') return issue.priority === 'High' || issue.priority === 'Critical';
      if (filter === 'escalated') return issue.escalated;
      return true;
    });
  }, [issues, filter]);

  // Tile layer URL: Bright Carto Voyager for Light Mode, Dark Matter for Dark Mode
  const tileUrl = isDark
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="relative flex flex-col gap-3 w-full">
      <div className="flex flex-wrap items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium z-10 shadow-sm">
        <span className="text-slate-500 dark:text-slate-400 pl-2">Filter Map:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All ({issues.length})
        </button>
        <button
          onClick={() => setFilter('escalated')}
          className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-colors ${
            filter === 'escalated'
              ? 'bg-rose-600 text-white font-semibold'
              : 'bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
          Escalated ({issues.filter((i) => i.escalated).length})
        </button>
        <button
          onClick={() => setFilter('reported')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'reported'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Reported ({issues.filter((i) => i.status === 'Reported').length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'in_progress'
              ? 'bg-amber-600 text-white font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          In Progress ({issues.filter((i) => i.status === 'In Progress' || i.status === 'Acknowledged').length})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'resolved'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Resolved ({issues.filter((i) => i.status === 'Resolved' || i.status === 'Verified').length})
        </button>
      </div>

      <div className={className}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
          />
          {filteredIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.lat, issue.lng]}
              icon={createCustomMarkerIcon(issue.status, issue.escalated)}
            >
              <Popup className="cityfix-map-popup">
                <div className="p-1 max-w-xs space-y-2 text-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <CategoryBadge category={issue.category} />
                    <StatusBadge status={issue.status} />
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{issue.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{issue.address}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1 font-semibold text-indigo-700">
                      <ThumbsUp className="w-3.5 h-3.5" /> {issue.upvotes} Upvotes
                    </span>
                    <span>{formatRelativeTime(issue.reportedAt)}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <PriorityBadge priority={issue.priority} />
                    <button
                      onClick={() => navigate('/citizen/issues')}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                    >
                      View Issue <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
