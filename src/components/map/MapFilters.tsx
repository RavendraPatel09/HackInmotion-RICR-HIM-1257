import React from 'react';
import { Search, X } from 'lucide-react';
import { INDIAN_LOCATIONS } from '../../data/locations';
import { categoryList } from '../../data/categories';
import type { IssueStatus, Priority } from '../../types';

export interface MapFilterState {
  search: string;
  state: string;
  city: string;
  category: string;
  status: string;
  severity: string;
}

interface MapFiltersProps {
  onFilterChange: (filters: MapFilterState) => void;
  filters: MapFilterState;
  issueCount: number;
}

export const MapFilters: React.FC<MapFiltersProps> = ({ onFilterChange, filters, issueCount }) => {
  const handleFilterChange = (key: keyof MapFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'state') {
      newFilters.city = '';
    }
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      state: '',
      city: '',
      category: '',
      status: '',
      severity: '',
    });
  };

  const states = Array.from(new Set(INDIAN_LOCATIONS.map(loc => loc.state))).sort();
  const citiesInState = filters.state 
    ? INDIAN_LOCATIONS.filter(loc => loc.state === filters.state).map(loc => loc.name).sort()
    : INDIAN_LOCATIONS.map(loc => loc.name).sort();

  const statuses: IssueStatus[] = ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Verified', 'Reopened'];
  const severities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="bg-white dark:bg-[#0e1714] rounded-xl shadow-sm border border-[#D6E2DE] dark:border-[#1e332f] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#10201C] dark:text-[#f2f7f5] text-sm">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-xs text-[#536761] dark:text-[#a3c4b9] hover:text-[#053229] dark:hover:text-[#0ca688] flex items-center gap-1 font-bold"
        >
          <X className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73827D] dark:text-[#73948b]" />
        <input 
          type="text"
          placeholder="Search locations, issues..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-lg text-xs focus:outline-none focus:border-[#053229] focus:ring-1 focus:ring-[#053229] text-[#10201C] dark:text-[#f2f7f5] placeholder-[#73827D]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select 
          value={filters.state}
          onChange={(e) => handleFilterChange('state', e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-lg text-xs focus:outline-none focus:border-[#053229] focus:ring-1 focus:ring-[#053229] text-[#10201C] dark:text-[#f2f7f5]"
        >
          <option value="">All States</option>
          {states.map(state => <option key={state} value={state}>{state}</option>)}
        </select>

        <select 
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-lg text-xs focus:outline-none focus:border-[#053229] focus:ring-1 focus:ring-[#053229] text-[#10201C] dark:text-[#f2f7f5]"
        >
          <option value="">All Cities</option>
          {citiesInState.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select 
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-lg text-xs focus:outline-none focus:border-[#053229] focus:ring-1 focus:ring-[#053229] text-[#10201C] dark:text-[#f2f7f5]"
        >
          <option value="">All Categories</option>
          {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
        </select>

        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-lg text-xs focus:outline-none focus:border-[#053229] focus:ring-1 focus:ring-[#053229] text-[#10201C] dark:text-[#f2f7f5]"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <select 
          value={filters.severity}
          onChange={(e) => handleFilterChange('severity', e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-lg text-xs focus:outline-none focus:border-[#053229] focus:ring-1 focus:ring-[#053229] text-[#10201C] dark:text-[#f2f7f5]"
        >
          <option value="">All Severities</option>
          {severities.map(severity => <option key={severity} value={severity}>{severity}</option>)}
        </select>
      </div>
    </div>
  );
};
