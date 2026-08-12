import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Search, Filter, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AdminIssues() {
  const { issues } = useStore();
  
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Open' | 'Resolved'>('All');
  const [search, setSearch] = useState('');

  const filteredIssues = issues.filter(issue => {
    if (filter === 'Critical' && issue.priority !== 'High') return false;
    if (filter === 'Open' && (issue.status === 'Resolved' || issue.status === 'Verified')) return false;
    if (filter === 'Resolved' && (issue.status !== 'Resolved' && issue.status !== 'Verified')) return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase()) && !issue.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h2 className="headline-md text-brand-navy mb-1">Manage Issues</h2>
        <p className="body-md text-outline">Review, assign, and resolve civic complaints.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-elevation-1 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-outline-variant flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Search ID, title, or location..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl focus:border-brand-navy outline-none transition-colors shadow-sm text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex bg-white border border-outline-variant rounded-xl p-1 shadow-sm shrink-0 w-full md:w-auto overflow-x-auto">
            {(['All', 'Open', 'Critical', 'Resolved'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${filter === f ? 'bg-brand-navy text-white' : 'text-outline hover:text-brand-navy hover:bg-slate-50'}`}
              >
                {f} {f === 'Critical' && <AlertTriangle size={14} className="inline ml-1 -mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-outline-variant bg-white text-xs font-bold text-outline uppercase tracking-wider">
          <div className="col-span-2">ID & Date</div>
          <div className="col-span-4">Issue Details</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* List */}
        <div className="divide-y divide-outline-variant/50">
          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center">
              <Filter size={48} className="mx-auto text-outline/50 mb-4" />
              <div className="text-brand-navy font-semibold">No issues found</div>
              <div className="text-sm text-outline">Try adjusting your filters</div>
            </div>
          ) : (
            filteredIssues.map(issue => {
              const isResolved = issue.status === 'Resolved' || issue.status === 'Verified';
              
              return (
                <Link 
                  key={issue.id}
                  to={`/admin/issues/${issue.id}`}
                  className={`block md:grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-slate-50 transition-colors group ${issue.priority === 'High' && !isResolved ? 'border-l-4 border-l-error' : 'border-l-4 border-l-transparent'}`}
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded mb-1">{issue.id}</div>
                        <div className="text-xs text-outline">{new Date(issue.reportedAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${issue.priority === 'High' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-600'}`}>
                        {issue.priority}
                      </span>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-brand-navy text-sm mb-1">{issue.title}</div>
                      <div className="text-xs text-outline">{issue.location}</div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-outline-variant/30">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${isResolved ? 'bg-success/10 text-success' : issue.status === 'Under Review' ? 'bg-slate-100 text-slate-600' : 'bg-warning/10 text-warning-dark'}`}>
                        {issue.status}
                      </span>
                      <div className="text-brand-green font-semibold text-xs flex items-center">View <ChevronRight size={16} /></div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block col-span-2">
                    <div className="font-mono text-sm font-bold text-brand-navy">{issue.id}</div>
                    <div className="text-xs text-outline">{new Date(issue.reportedAt).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="hidden md:block col-span-4">
                    <div className="font-semibold text-brand-navy text-sm truncate pr-4">{issue.title}</div>
                    <div className="text-xs text-outline truncate pr-4">{issue.location}</div>
                  </div>
                  
                  <div className="hidden md:block col-span-2">
                    <div className="text-sm text-brand-navy truncate pr-2">{issue.department || '-'}</div>
                    <div className="text-[10px] text-outline uppercase">{issue.category}</div>
                  </div>
                  
                  <div className="hidden md:block col-span-1">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${issue.priority === 'High' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-600'}`}>
                      {issue.priority}
                    </span>
                  </div>
                  
                  <div className="hidden md:block col-span-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${isResolved ? 'bg-success/10 text-success' : issue.status === 'Under Review' ? 'bg-slate-100 text-slate-600' : 'bg-warning/10 text-warning-dark'}`}>
                      {!isResolved && <span className={`w-1.5 h-1.5 rounded-full ${issue.status !== 'Under Review' ? 'bg-warning animate-pulse' : 'bg-slate-400'}`}></span>}
                      {issue.status}
                    </span>
                  </div>
                  
                  <div className="hidden md:flex col-span-1 justify-end text-outline group-hover:text-brand-green transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
