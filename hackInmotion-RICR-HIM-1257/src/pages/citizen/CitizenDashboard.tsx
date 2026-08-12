import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { PlusCircle, MapPin, FileText, CheckCircle2, ChevronRight, Droplet, Lightbulb, TreePine } from 'lucide-react';

export default function CitizenDashboard() {
  const { issues } = useStore();
  
  // Stats
  const inProgressCount = issues.filter(i => i.status === 'In Progress' || i.status === 'Under Review').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved' || i.status === 'Verified').length;
  
  const activeIssues = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Verified').slice(0, 3);

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
    <div className="page-enter max-w-[800px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-outline mb-1">Good morning 👋</p>
          <h2 className="headline-md text-brand-navy">Citizen</h2>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center text-xl font-bold shadow-elevation-1">
          C
        </div>
      </div>
      
      {/* Primary CTA */}
      <Link 
        to="/citizen/report" 
        className="w-full py-5 bg-brand-green text-white font-semibold rounded-2xl flex items-center justify-center gap-3 text-xl mb-8 shadow-elevation-2 hover:bg-emerald-700 transition hover:-translate-y-1"
      >
        <PlusCircle size={28} /> Report an Issue
      </Link>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-surface-container-lowest p-4 rounded-xl text-center shadow-elevation-1 border border-outline-variant">
          <div className="text-4xl font-bold text-brand-navy mb-1">{issues.length}</div>
          <div className="text-xs font-medium text-outline">My Reports</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl text-center shadow-elevation-1 border border-outline-variant">
          <div className="text-4xl font-bold text-warning mb-1">{inProgressCount}</div>
          <div className="text-xs font-medium text-outline">In Progress</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl text-center shadow-elevation-1 border border-outline-variant">
          <div className="text-4xl font-bold text-success mb-1">{resolvedCount}</div>
          <div className="text-xs font-medium text-outline">Resolved</div>
        </div>
        <div className="bg-brand-green/10 p-4 rounded-xl text-center border border-brand-green/20">
          <div className="text-4xl font-bold text-brand-green mb-1">+45</div>
          <div className="text-xs font-medium text-brand-green">Civic Impact Pts</div>
        </div>
      </div>

      {/* Active Reports List */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <h3 className="title-lg text-brand-navy">Active Reports</h3>
          <Link to="/citizen/issues" className="text-sm font-semibold text-brand-green hover:underline">View All</Link>
        </div>
        
        <div className="flex flex-col gap-3">
          {activeIssues.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-sm text-outline">No active reports.</div>
            </div>
          ) : (
            activeIssues.map(issue => (
              <Link 
                key={issue.id} 
                to={`/citizen/issues/${issue.id}`}
                className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex gap-4 items-center hover:border-brand-green transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                  {getCategoryIcon(issue.category)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-on-surface truncate">{issue.title}</div>
                  <div className="text-xs text-outline flex items-center gap-2 mt-1 truncate">
                    <span className="truncate max-w-[150px]">{issue.location}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 font-medium text-brand-navy">
                      <span className={`w-2 h-2 rounded-full ${issue.status === 'Under Review' ? 'bg-outline' : 'bg-warning animate-pulse'}`}></span>
                      {issue.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-outline group-hover:text-brand-green transition-colors" />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Nearby Issues */}
      <div className="mb-10">
        <h3 className="title-lg text-brand-navy mb-4">Nearby Issues</h3>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-elevation-1">
          <div className="h-[150px] bg-slate-200 relative map-preview-container">
            <div className="absolute w-4 h-4 rounded-full bg-brand-navy ring-4 ring-brand-navy/20 top-[50%] left-[50%] shadow-lg"></div>
            <div className="absolute w-4 h-4 rounded-full bg-warning ring-4 ring-warning/20 top-[30%] left-[70%] animate-pulse"></div>
          </div>
          <div className="p-4 flex justify-between items-center bg-white border-t border-outline-variant">
            <span className="text-sm text-outline font-medium">2 issues near you</span>
            <Link to="/citizen/map" className="text-sm font-semibold text-brand-green hover:underline">Open Map</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
