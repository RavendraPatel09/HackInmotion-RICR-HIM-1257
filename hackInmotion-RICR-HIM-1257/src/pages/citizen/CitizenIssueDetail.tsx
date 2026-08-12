import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, MapPin, CheckCircle2, Wrench, AlertTriangle } from 'lucide-react';

export default function CitizenIssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { issues, updateIssue } = useStore();
  
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      const found = issues.find(i => i.id === id);
      setIssue(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id, issues]);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto page-enter">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/citizen/issues" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={24} /></Link>
          <div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="w-full h-64 bg-slate-200 rounded-2xl animate-pulse mb-6"></div>
        <div className="w-3/4 h-8 bg-slate-200 rounded animate-pulse mb-4"></div>
        <div className="w-1/2 h-6 bg-slate-200 rounded animate-pulse mb-8"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-[800px] mx-auto page-enter text-center py-20">
        <AlertTriangle size={64} className="mx-auto text-error mb-4" />
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Issue Not Found</h2>
        <p className="text-outline mb-8">The issue you are looking for does not exist or has been removed.</p>
        <Link to="/citizen/issues" className="inline-block px-6 py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
          Back to Issues
        </Link>
      </div>
    );
  }

  const handleVerify = () => {
    setActionLoading(true);
    setTimeout(() => {
      updateIssue(issue.id, { status: 'Verified' });
      setActionLoading(false);
    }, 800);
  };

  const handleReopen = () => {
    setActionLoading(true);
    setTimeout(() => {
      updateIssue(issue.id, { status: 'Reopened' });
      setActionLoading(false);
    }, 800);
  };

  const milestones = ['Reported', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved', 'Verified'];
  let currentIndex = 0;
  switch(issue.status) {
    case 'Under Review': currentIndex = 0; break;
    case 'Acknowledged': currentIndex = 1; break;
    case 'Reopened':
    case 'Assigned': currentIndex = 2; break;
    case 'In Progress': currentIndex = 3; break;
    case 'Resolved': currentIndex = 4; break;
    case 'Verified': currentIndex = 5; break;
  }
  if (issue.status === 'Resolved') currentIndex = 4;

  return (
    <div className="max-w-[800px] mx-auto pb-12 page-enter">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/citizen/issues" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-brand-navy"><ArrowLeft size={24} /></Link>
        <h2 className="headline-md m-0 text-brand-navy font-mono">{issue.id}</h2>
      </div>

      <div className="h-[250px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center mb-6 shadow-elevation-1">
        {issue.imageUrl ? (
          <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Evidence" />
        ) : (
          <div className="text-6xl opacity-20">📷</div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-lg text-xs font-semibold">
          Original Evidence
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">{issue.title}</h1>
      
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-outline-variant">
        <span className={`flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full border border-outline-variant`}>
          <span className={`w-2 h-2 rounded-full ${issue.status === 'Under Review' || issue.status === 'Resolved' || issue.status === 'Verified' ? 'bg-slate-400' : 'bg-warning animate-pulse'}`}></span>
          {issue.status}
        </span>
        <span className={`px-3 py-1 text-sm font-bold uppercase rounded-full ${issue.priority === 'High' ? 'bg-error/10 text-error' : issue.priority === 'Medium' ? 'bg-warning/10 text-warning-dark' : 'bg-slate-100 text-slate-600'}`}>
          {issue.priority} Priority
        </span>
        <span className="px-3 py-1 bg-surface-container-high text-brand-navy text-sm font-bold rounded-full">
          {issue.category}
        </span>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-bold text-brand-navy mb-2">Description</h3>
        <p className="text-outline whitespace-pre-wrap leading-relaxed">{issue.description || 'No description provided.'}</p>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-bold text-brand-navy mb-2">Location</h3>
        <div className="flex items-start gap-2 mb-4 text-outline font-medium">
          <MapPin size={20} className="shrink-0 mt-0.5 text-brand-navy" />
          <span>{issue.location}</span>
        </div>
        <div className="h-[140px] bg-slate-200 rounded-xl relative overflow-hidden border border-outline-variant map-preview-container shadow-inner">
          <div className="absolute w-4 h-4 rounded-full bg-error ring-4 ring-error/20 top-[50%] left-[50%]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Assigned To</div>
          <div className="font-semibold text-brand-navy">{issue.department || 'Municipal Corp - Gen. Services'}</div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Target SLA</div>
          <div className="font-semibold text-brand-navy">{issue.priority === 'High' ? '24 Hours' : '48 Hours'}</div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-bold text-brand-navy mb-6">Issue Lifecycle</h3>
        <div className="relative border-l-2 border-outline-variant ml-3 space-y-6">
          {milestones.map((m, idx) => {
            const isActive = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            
            let timeText = '';
            if (idx === 0) timeText = new Date(issue.reportedAt).toLocaleDateString();
            if (isActive && idx > 0) timeText = 'Recently';

            return (
              <div key={m} className={`relative pl-8 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${isActive ? 'bg-brand-green border-brand-green' : 'bg-surface-base border-outline-variant'} ${isCurrent ? 'ring-4 ring-brand-green/20' : ''}`}></div>
                <h4 className={`font-semibold ${isCurrent ? 'text-brand-navy' : isActive ? 'text-on-surface' : 'text-outline'}`}>{m}</h4>
                {timeText && <p className="text-xs text-outline font-medium mt-0.5">{timeText}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {issue.status === 'Resolved' && (
        <div className="bg-white rounded-2xl border-2 border-success overflow-hidden shadow-elevation-2 page-enter">
          <div className="bg-success/10 p-5 border-b border-success/20 flex items-center gap-3">
            <CheckCircle2 size={28} className="text-success" />
            <h3 className="text-xl font-bold text-success-dark m-0">Resolution Pending Verification</h3>
          </div>
          
          <div className="p-6">
            <div className="h-[160px] bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl relative overflow-hidden flex items-center justify-center mb-6">
              <Wrench size={48} className="text-white/20" />
              <div className="absolute bottom-3 left-3 bg-success text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                After Photo
              </div>
            </div>
            
            <p className="text-center font-bold text-brand-navy mb-6 text-lg">Was this issue actually fixed?</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleReopen}
                disabled={actionLoading}
                className="flex-1 py-3 border-2 border-error text-error font-semibold rounded-xl hover:bg-error/5 transition-colors disabled:opacity-50"
              >
                NO — Reopen
              </button>
              <button 
                onClick={handleVerify}
                disabled={actionLoading}
                className="flex-1 py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-elevation-1 disabled:opacity-50"
              >
                YES — Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
