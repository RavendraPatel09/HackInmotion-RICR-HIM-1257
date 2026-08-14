import React, { useState, useMemo } from 'react';
import { useIssues } from '../context/IssuesContext';
import { CityMap } from '../components/map/CityMap';
import { MapFilters, type MapFilterState } from '../components/map/MapFilters';
import { INDIAN_LOCATIONS } from '../data/locations';
import { Map, AlertTriangle } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { formatRelativeTime } from '../utils/dateUtils';

export const CityMapPage: React.FC = () => {
  const { issues } = useIssues();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState<MapFilterState>({
    search: '',
    state: '',
    city: '',
    category: '',
    status: '',
    severity: '',
  });

  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number, zoom: number}>({
    lat: 22.5937,
    lng: 78.9629,
    zoom: 5
  });

  const handleFilterChange = (newFilters: MapFilterState) => {
    setFilters(newFilters);
    if (newFilters.city) {
      const cityData = INDIAN_LOCATIONS.find(loc => loc.name === newFilters.city);
      if (cityData) {
        setMapCenter({ lat: cityData.lat, lng: cityData.lng, zoom: 12 });
      }
    } else if (newFilters.state) {
      const citiesInState = INDIAN_LOCATIONS.filter(loc => loc.state === newFilters.state);
      if (citiesInState.length > 0) {
        setMapCenter({ lat: citiesInState[0].lat, lng: citiesInState[0].lng, zoom: 6 });
      }
    } else {
      setMapCenter({ lat: 22.5937, lng: 78.9629, zoom: 5 });
    }
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filters.search && !issue.title.toLowerCase().includes(filters.search.toLowerCase()) && !issue.address.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.state && issue.state !== filters.state) return false;
      if (filters.city && issue.city !== filters.city) return false;
      if (filters.category && issue.category !== filters.category) return false;
      if (filters.status && issue.status !== filters.status) return false;
      if (filters.severity && issue.priority !== filters.severity) return false;
      return true;
    });
  }, [issues, filters]);

  const handleCardClick = (lat: number, lng: number) => {
    setMapCenter({ lat, lng, zoom: 16 });
    if (window.innerWidth < 1024) {
      setViewMode('map');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-black text-[#10201C] dark:text-[#f2f7f5] flex items-center gap-3">
          <Map className="w-7 h-7 text-[#053229] dark:text-[#0ca688]" /> Interactive Civic Map
        </h1>
        <p className="text-xs text-[#536761] dark:text-[#a3c4b9] mt-0.5">
          Real-time community-reported grievances across Indian metropolitan sectors.
        </p>
        
        <div className="mt-3 flex flex-wrap gap-4 text-xs bg-[#F1F7F5] dark:bg-[#152420]/50 p-3 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f]">
          <div className="flex flex-col">
            <span className="text-[#536761] dark:text-[#a3c4b9]">Reports Tracked</span>
            <span className="font-bold text-[#10201C] dark:text-[#f2f7f5] text-base">{issues.length} Live</span>
          </div>
          <div className="w-px bg-[#D6E2DE] dark:bg-[#1e332f] hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[#536761] dark:text-[#a3c4b9]">Issues Resolved</span>
            <span className="font-bold text-[#16845B] dark:text-emerald-450 text-base">
              {issues.filter(i => i.status === 'Resolved' || i.status === 'Verified').length}
            </span>
          </div>
          <div className="w-px bg-[#D6E2DE] dark:bg-[#1e332f] hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[#536761] dark:text-[#a3c4b9]">Escalations (SLA Breached)</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 text-base">
              {issues.filter(i => i.escalated).length} Active
            </span>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex bg-[#F1F7F5] dark:bg-[#152420] p-1 rounded-lg mb-3 self-start border border-[#D6E2DE] dark:border-[#1e332f]">
        <button 
          className={`px-4 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-[#0e1714] text-[#053229] dark:text-[#0ca688] shadow-xs' : 'text-[#536761] dark:text-[#a3c4b9]'}`}
          onClick={() => setViewMode('map')}
        >
          Map
        </button>
        <button 
          className={`px-4 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#0e1714] text-[#053229] dark:text-[#0ca688] shadow-xs' : 'text-[#536761] dark:text-[#a3c4b9]'}`}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        {/* Left Panel - List & Filters */}
        <div className={`w-full lg:w-[35%] max-w-md xl:max-w-lg flex flex-col gap-3 overflow-hidden ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          <MapFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            issueCount={filteredIssues.length} 
          />
          
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">
              Showing {filteredIssues.length} reports
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-6">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-xl">
                <AlertTriangle className="w-10 h-10 text-[#73827D] mx-auto mb-3" />
                <p className="text-[#536761] dark:text-[#a3c4b9] text-xs font-semibold">No issues found matching your filters.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div 
                  key={issue.id}
                  onClick={() => handleCardClick(issue.lat, issue.lng)}
                  className="bg-white dark:bg-[#0e1714] p-4 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] hover:border-[#B8CCC5] dark:hover:border-[#2e4d46] cursor-pointer transition-colors shadow-2xs"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-bold text-[#10201C] dark:text-[#f2f7f5] text-xs line-clamp-1">{issue.title}</h4>
                    <StatusBadge status={issue.status} />
                  </div>
                  <p className="text-[11px] text-[#536761] dark:text-[#a3c4b9] mb-3 line-clamp-1">
                    {issue.city && issue.state ? `${issue.city}, ${issue.state} - ` : ''}{issue.address}
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <PriorityBadge priority={issue.priority} />
                    <div className="flex items-center gap-3 text-[#73827D]">
                      <span>{issue.upvotes} votes</span>
                      <span>{formatRelativeTime(issue.reportedAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className={`w-full lg:flex-1 h-full min-h-[450px] rounded-2xl overflow-hidden border border-[#D6E2DE] dark:border-[#1e332f] shadow-sm relative ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          <CityMap 
            issues={filteredIssues}
            centerLat={mapCenter.lat}
            centerLng={mapCenter.lng}
            zoom={mapCenter.zoom}
          />
        </div>
      </div>
    </div>
  );
};
export default CityMapPage;
