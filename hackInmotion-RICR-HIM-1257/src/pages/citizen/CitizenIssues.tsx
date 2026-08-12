import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Search, Filter, MapPin, ChevronRight, FileText, CheckCircle2, AlertTriangle, Droplet, Lightbulb, TreePine } from 'lucide-react';
import { useState } from 'react';

export default function CitizenIssues() {
  const { issues } = useStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Resolved'>('All');
  const [search, setSearch] = useState('');

  const filteredIssues = issues.filter(issue => {
    if (filter === 'Active' && (issue.status === 'Resolved' || issue.status === 'Verified')) return false;
    if (filter === 'Resolved' && (issue.status !== 'Resolved' && issue.status !== 'Verified')) return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase()) && !issue.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return <MapPin size={20} />;
      case 'Sanitation': return <FileText size={20} />;
      case 'Electricity': return <Lightbulb size={20} />;
      case 'Water Supply': return <Droplet size={20} />;
      case 'Public Parks': return <TreePine size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="max-w-[800px] mx-auto page-enter">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/citizen" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-brand-navy"><ArrowLeft size={24} /></Link>
        <h2 className="headline-md m-0 text-brand-navy">My Reports</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Search by ID or title..." 
            className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-brand-green outline-none transition-colors shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-surface-container-lowest border border-outline-variant rounded-xl p-1 shadow-sm shrink-0 overflow-x-auto hide-scrollbar">
          {(['All', 'Active', 'Resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${filter === f ? 'bg-brand-navy text-white' : 'text-outline hover:text-brand-navy hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant text-center shadow-elevation-1">
            <div className="text-4xl mb-4 text-outline flex justify-center"><Filter size={48} /></div>
            <h3 className="text-lg font-semibold text-brand-navy mb-2">No reports found</h3>
            <p className="text-sm text-outline">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredIssues.map(issue => {
            const isResolved = issue.status === 'Resolved' || issue.status === 'Verified';
            
            return (
              <Link 
                key={issue.id} 
                to={`/citizen/issues/${issue.id}`}
                className="bg-surface-container-lowest p-4 md:p-5 rounded-2xl border border-outline-variant flex flex-col md:flex-row gap-4 items-start md:items-center hover:border-brand-green transition-colors group shadow-sm hover:shadow-elevation-1"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isResolved ? 'bg-success/10 text-success' : 'bg-brand-navy/10 text-brand-navy'}`}>
                  {isResolved ? <CheckCircle2 size={24} /> : getCategoryIcon(issue.category)}
                </div>
                
                <div className="flex-grow min-w-0 w-full">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <div className="font-semibold text-brand-navy truncate">{issue.title}</div>
                    <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">{issue.id}</div>
                  </div>
                  
                  <div className="text-xs text-outline flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 max-w-[200px] truncate"><MapPin size={12} className="shrink-0"/> <span className="truncate">{issue.location}</span></span>
                    <span className="hidden md:inline">&bull;</span>
                    <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-outline-variant/50 md:border-0">
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${isResolved ? 'bg-success/10 text-success' : issue.status === 'Under Review' ? 'bg-slate-100 text-slate-600' : 'bg-warning/10 text-warning-dark'}`}>
                    {!isResolved && <span className={`w-1.5 h-1.5 rounded-full ${issue.status !== 'Under Review' ? 'bg-warning animate-pulse' : 'bg-slate-400'}`}></span>}
                    {issue.status}
                  </span>
                  <ChevronRight className="text-outline group-hover:text-brand-green transition-colors" size={20} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
