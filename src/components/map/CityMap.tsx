import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Issue, IssueStatus } from '../../types';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../ui/Badge';
import { formatRelativeTime } from '../../utils/dateUtils';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapLegend } from './MapLegend';

const getStatusColor = (status: IssueStatus, escalated: boolean) => {
  if (escalated) return '#C94B4B'; // Red
  switch (status) {
    case 'Reported': return '#73827D'; // Gray-green
    case 'Acknowledged': return '#C78A20'; // Amber
    case 'In Progress': return '#2878A8'; // Blue
    case 'Resolved': return '#16845B'; // Green
    case 'Verified': return '#053229'; // Peacock Green
    case 'Reopened': return '#C94B4B'; // Red
    default: return '#73827D';
  }
};

const createCustomMarkerIcon = (status: IssueStatus, escalated: boolean) => {
  const color = getStatusColor(status, escalated);
  const pulseClass = escalated ? 'animate-pulse' : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42" class="${pulseClass}">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker bg-transparent border-none',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -38],
  });
};

const createClusterIcon = (count: number, color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${count}</div>`,
    className: 'cluster-icon bg-transparent border-none',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function clusterMarkers(issues: Issue[], zoom: number) {
  if (zoom >= 8) return issues.map(i => ({ type: 'marker' as const, issue: i }));
  
  const gridSize = zoom < 5 ? 3 : zoom < 7 ? 1 : 0.5;
  const clusters: Map<string, Issue[]> = new Map();
  
  issues.forEach(issue => {
    const key = `${Math.floor(issue.lat / gridSize)}_${Math.floor(issue.lng / gridSize)}`;
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key)!.push(issue);
  });
  
  return Array.from(clusters.entries()).map(([key, items]) => {
    if (items.length === 1) return { type: 'marker' as const, issue: items[0] };
    const avgLat = items.reduce((sum, i) => sum + i.lat, 0) / items.length;
    const avgLng = items.reduce((sum, i) => sum + i.lng, 0) / items.length;
    return { type: 'cluster' as const, lat: avgLat, lng: avgLng, count: items.length, issues: items };
  });
}

const MapEvents = ({ setZoom }: { setZoom: (z: number) => void }) => {
  useMapEvents({
    zoomend: (e) => {
      setZoom(e.target.getZoom());
    },
  });
  return null;
};

const MapCenterController = ({ centerLat, centerLng }: { centerLat: number, centerLng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (centerLat && centerLng) {
      map.setView([centerLat, centerLng], map.getZoom(), {
        animate: true,
      });
    }
  }, [centerLat, centerLng, map]);
  return null;
};

interface CityMapProps {
  issues: Issue[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  className?: string;
}

class MapErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F1F7F5] rounded-2xl border border-[#D6E2DE] p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-[#C78A20] mb-4" />
          <h3 className="text-[#10201C] font-bold text-lg mb-2">Map unavailable</h3>
          <p className="text-[#536761] text-sm mb-4">We couldn't load the interactive map.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-[#053229] text-white rounded-lg font-medium hover:bg-[#07483A]"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CityMap: React.FC<CityMapProps> = ({
  issues,
  centerLat = 22.5937,
  centerLng = 78.9629,
  zoom = 5,
  className = 'h-full w-full relative',
}) => {
  const navigate = useNavigate();
  const [currentZoom, setCurrentZoom] = useState(zoom);

  const clusteredItems = useMemo(() => {
    return clusterMarkers(issues, currentZoom);
  }, [issues, currentZoom]);

  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className={className}>
      <MapErrorBoundary>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <MapEvents setZoom={setCurrentZoom} />
          <MapCenterController centerLat={centerLat} centerLng={centerLng} />
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={tileUrl}
          />
          {clusteredItems.map((item, idx) => {
            if (item.type === 'marker') {
              const { issue } = item;
              return (
                <Marker
                  key={issue.id}
                  position={[issue.lat, issue.lng]}
                  icon={createCustomMarkerIcon(issue.status, issue.escalated)}
                >
                  <Popup className="cityfix-map-popup">
                    <div className="p-1 max-w-xs space-y-2 text-[#10201C] min-w-[240px]">
                      <div className="flex items-center justify-between gap-2">
                        <CategoryBadge category={issue.category} />
                        <StatusBadge status={issue.status} />
                      </div>

                      <h4 className="font-bold text-sm text-[#10201C] leading-snug">{issue.title}</h4>
                      <p className="text-xs text-[#536761] line-clamp-2">{issue.address}</p>
                      {issue.city && issue.state && (
                        <p className="text-xs text-[#536761]">{issue.city}, {issue.state}</p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-[#73827D] pt-1 border-t border-[#D6E2DE]">
                        <PriorityBadge priority={issue.priority} />
                        <span>{formatRelativeTime(issue.reportedAt)}</span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => navigate('/citizen/issues')}
                          className="w-full py-1.5 bg-[#053229] hover:bg-[#07483A] text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          View Report <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            } else {
              // Cluster
              // Determine majority status or fallback to dominant color logic
              const statusCounts = item.issues.reduce((acc, issue) => {
                acc[issue.status] = (acc[issue.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              
              let majorityStatus = 'Reported' as IssueStatus;
              let maxCount = 0;
              for (const [status, count] of Object.entries(statusCounts)) {
                if (count > maxCount) {
                  maxCount = count;
                  majorityStatus = status as IssueStatus;
                }
              }

              const hasEscalated = item.issues.some(i => i.escalated);
              const clusterColor = getStatusColor(majorityStatus, hasEscalated);

              return (
                <Marker
                  key={`cluster-${idx}`}
                  position={[item.lat, item.lng]}
                  icon={createClusterIcon(item.count, clusterColor)}
                />
              );
            }
          })}
        </MapContainer>
        <MapLegend />
      </MapErrorBoundary>
    </div>
  );
};
