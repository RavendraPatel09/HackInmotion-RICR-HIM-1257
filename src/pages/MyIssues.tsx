import React, { useState, useMemo } from 'react';
import { useIssues } from '../context/IssuesContext';
import { IssueCard } from '../components/issues/IssueCard';
import type { IssueCategory } from '../types';
import { categoryList } from '../data/categories';
import { Search, ListTodo, AlertCircle, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const MyIssues: React.FC = () => {
  const { getFilteredIssues, issues } = useIssues();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const trackingParam = params.get('tracking') || '';
  const categoryParam = params.get('category') as IssueCategory | 'all' || 'all';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<IssueCategory | 'all'>(categoryParam);
  const [activeTab, setActiveTab] = useState<'all' | 'Reported' | 'in_progress' | 'resolved' | 'escalated'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'upvotes'>('newest');

  // Filter issues
  const filteredIssues = useMemo(() => {
    // If tracking parameter is present, show only that issue
    if (trackingParam) {
      return issues.filter(issue => issue.trackingId === trackingParam);
    }

    const rawFiltered = getFilteredIssues({ search, category, status: 'all', sortBy });
    return rawFiltered.filter((i) => {
      if (activeTab === 'Reported') return i.status === 'Reported';
      if (activeTab === 'in_progress') return i.status === 'In Progress' || i.status === 'Acknowledged';
      if (activeTab === 'resolved') return i.status === 'Resolved' || i.status === 'Verified';
      if (activeTab === 'escalated') return i.escalated === true;
      return true;
    });
  }, [getFilteredIssues, issues, search, category, activeTab, sortBy, trackingParam]);

  const clearTracking = () => {
    navigate('/reports');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#10201C] dark:text-[#f2f7f5] flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-[#053229] dark:text-[#0ca688]" /> 
            {trackingParam ? 'Tracking Issue' : 'City Issues Feed'}
          </h1>
          <p className="text-xs text-[#73827D] dark:text-[#a3c4b9] mt-1 font-semibold">
            {trackingParam 
              ? `Displaying specific details and resolution timeline for issue: ${trackingParam}`
              : 'Track real-time resolution status, upvote community reported issues, and audit active dispatches.'}
          </p>
        </div>
        
        {trackingParam && (
          <button 
            onClick={clearTracking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs font-bold transition-all border border-[#D6E2DE] dark:border-[#1e332f]"
          >
            <X className="w-4 h-4" /> Clear Filter
          </button>
        )}
      </div>

      {/* Show filters only if not tracking a single issue */}
      {!trackingParam && (
        <>
          {/* Tabs Filter Row */}
          <div className="flex items-center gap-1.5 border-b border-[#D6E2DE] dark:border-[#1e332f] overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: 'All Reports' },
              { id: 'Reported', label: 'Reported' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' },
              { id: 'escalated', label: 'Escalated ⚠️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-extrabold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-[#053229] dark:border-[#0ca688] text-[#053229] dark:text-[#0ca688]'
                    : 'border-transparent text-[#73827D] hover:text-[#10201C] dark:hover:text-[#f2f7f5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filters Strip */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by keywords or tracking ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#07483A]"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-slate-700 dark:text-[#a3c4b9] text-xs font-semibold focus:outline-none focus:border-[#07483A]"
              >
                <option value="all">All Categories</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#053229] dark:text-[#0ca688] text-xs font-extrabold focus:outline-none focus:border-[#07483A]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Highest SLA Priority</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>

          {/* Info summary */}
          <div className="flex items-center justify-between text-xs text-[#73827D] dark:text-[#a3c4b9] font-semibold px-1">
            <span>Showing {filteredIssues.length} issues</span>
            {search && <span className="font-extrabold text-[#053229]">Filtered by query: "{search}"</span>}
          </div>
        </>
      )}

      {/* Issues Grid */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              initiallyExpanded={!!trackingParam} 
            />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] text-center space-y-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-[#10201C] dark:text-[#f2f7f5]">
            {trackingParam ? 'Tracking ID Not Found' : 'No Issues Match Filters'}
          </h3>
          <p className="text-xs text-[#73827D] dark:text-[#a3c4b9] font-semibold">
            {trackingParam 
              ? 'We couldn\'t find any active report matching this tracking identifier.'
              : 'Try adjusting your search criteria, switching tabs, or clearing active filters.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setActiveTab('all');
              navigate('/reports');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-extrabold shadow-sm transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
