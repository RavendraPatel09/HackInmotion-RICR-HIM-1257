import React, { useState, useMemo } from 'react';
import { useIssues } from '../context/IssuesContext';
import { IssueCard } from '../components/issues/IssueCard';
import type { IssueCategory } from '../types';
import { categoryList } from '../data/categories';
import { Search, ListTodo, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const MyIssues: React.FC = () => {
  const { getFilteredIssues } = useIssues();
  const location = useLocation();

  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<IssueCategory | 'all'>(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('category') as any) || 'all';
  });
  const [activeTab, setActiveTab] = useState<'all' | 'Reported' | 'in_progress' | 'resolved' | 'escalated'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'upvotes'>('newest');

  // Filter logic including statuses & escalation tabs
  const filteredIssues = useMemo(() => {
    const rawFiltered = getFilteredIssues({ search, category, status: 'all', sortBy });
    return rawFiltered.filter((i) => {
      if (activeTab === 'Reported') return i.status === 'Reported';
      if (activeTab === 'in_progress') return i.status === 'In Progress' || i.status === 'Acknowledged';
      if (activeTab === 'resolved') return i.status === 'Resolved' || i.status === 'Verified';
      if (activeTab === 'escalated') return i.escalated === true;
      return true;
    });
  }, [getFilteredIssues, search, category, activeTab, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-indigo-600" /> City Issues Feed
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Track real-time resolution status, upvote community reported issues, and audit active dispatches.
          </p>
        </div>
      </div>

      {/* Tabs Filter Row */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-hide">
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
                ? 'border-indigo-650 text-indigo-650'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords or tracking ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25"
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
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-indigo-600 text-xs font-extrabold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest SLA Priority</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Info summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>Showing {filteredIssues.length} issues</span>
        {search && <span className="font-extrabold text-indigo-600">Filtered by query: "{search}"</span>}
      </div>

      {/* Issues Grid */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900">No Issues Match Filters</h3>
          <p className="text-xs text-slate-500 font-semibold">Try adjusting your search criteria, switching tabs, or clearing active filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setActiveTab('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-605 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-sm transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
