import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Sparkles, User, MapPin, Wrench, AlertTriangle } from 'lucide-react';

export default function AdminIssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { issues, updateIssue } = useStore();
  
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = issues.find(i => i.id === id);
      setIssue(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id, issues]);

  if (loading) {
    return (
      <div className="page-enter">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/issues" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={24} /></Link>
          <div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="w-full h-[50vh] bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="page-enter text-center py-20">
        <AlertTriangle size={64} className="mx-auto text-error mb-4" />
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Issue Not Found</h2>
        <Link to="/admin/issues" className="inline-block px-6 py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-emerald-700 transition mt-4">
          Back to Queue
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    setActionLoading(true);
    setTimeout(() => {
      updateIssue(issue.id, { status: newStatus });
      setActionLoading(false);
    }, 800);
  };

  const getSlaInfo = () => {
    if (['Resolved', 'Verified', 'Closed'].includes(issue.status)) {
      return { text: 'SLA Met / Resolved', color: 'text-success' };
    }
    const reportedAt = new Date(issue.reportedAt).getTime();
    const hoursOpen = (Date.now() - reportedAt) / (1000 * 60 * 60);
    const limit = issue.priority === 'High' ? 24 : 48;
    const remaining = Math.round(limit - hoursOpen);
    
    if (hoursOpen > limit) return { text: `Breached (Overdue by ${Math.abs(remaining)}h)`, color: 'text-error' };
    if (hoursOpen > (limit * 0.75)) return { text: `At Risk (${remaining}h remaining)`, color: 'text-warning-dark' };
    return { text: `On Track (${remaining}h remaining)`, color: 'text-brand-navy' };
  };

  const slaInfo = getSlaInfo();
  
  const renderActionControl = () => {
    const s = issue.status;
    if (s === 'Reported' || s === 'Under Review') {
      return <button onClick={() => handleStatusUpdate('Acknowledged')} disabled={actionLoading} className="w-full py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">Acknowledge Issue</button>;
    } else if (s === 'Acknowledged') {
      return (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-brand-navy uppercase tracking-wider">Assign Department</label>
          <select className="w-full p-3 border border-outline-variant rounded-xl bg-surface-base outline-none focus:border-brand-navy mb-2">
            <option>PWD - Roads Division</option>
            <option>Solid Waste Management</option>
            <option>Electricity Board</option>
            <option>Water Department</option>
          </select>
          <button onClick={() => handleStatusUpdate('Assigned')} disabled={actionLoading} className="w-full py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">Assign</button>
        </div>
      );
    } else if (s === 'Assigned' || s === 'Reopened') {
      return <button onClick={() => handleStatusUpdate('In Progress')} disabled={actionLoading} className="w-full py-3 bg-brand-navy text-white font-semibold rounded-xl hover:bg-slate-800 transition disabled:opacity-50">Start Work</button>;
    } else if (s === 'In Progress') {
      return <button onClick={() => handleStatusUpdate('Resolved')} disabled={actionLoading} className="w-full py-3 bg-success text-white font-semibold rounded-xl hover:bg-emerald-600 transition disabled:opacity-50">Mark as Resolved</button>;
    } else if (s === 'Resolved') {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-outline font-medium">Awaiting citizen verification, or force verify.</p>
          <button onClick={() => handleStatusUpdate('Verified')} disabled={actionLoading} className="w-full py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">Force Verify</button>
        </div>
      );
    } else if (s === 'Verified') {
      return <button onClick={() => handleStatusUpdate('Closed')} disabled={actionLoading} className="w-full py-3 border border-outline-variant text-brand-navy font-semibold rounded-xl hover:bg-slate-50 transition disabled:opacity-50">Close Ticket</button>;
    } else if (s === 'Closed') {
      return <div className="w-full py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl text-center">Archived & Closed</div>;
    }
  };

  const milestones = ['Reported', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved', 'Verified'];
  let currentIndex = 0;
  switch(issue.status) {
    case 'Under Review': case 'Reported': currentIndex = 0; break;
    case 'Acknowledged': currentIndex = 1; break;
    case 'Reopened':
    case 'Assigned': currentIndex = 2; break;
    case 'In Progress': currentIndex = 3; break;
    case 'Resolved': currentIndex = 4; break;
    case 'Verified': case 'Closed': currentIndex = 5; break;
  }

  return (
    <div className="page-enter">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/issues" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-brand-navy"><ArrowLeft size={24} /></Link>
        <h2 className="text-2xl font-bold font-mono text-brand-navy">{issue.id}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div>
            <h1 className="text-3xl font-bold text-brand-navy mb-4">{issue.title}</h1>
            <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-outline-variant">
              <span className={`flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full border border-outline-variant`}>
                <span className={`w-2 h-2 rounded-full ${['Resolved', 'Verified', 'Closed'].includes(issue.status) ? 'bg-slate-400' : 'bg-warning animate-pulse'}`}></span>
                {issue.status}
              </span>
              <span className={`px-3 py-1 text-sm font-bold uppercase rounded-full ${issue.priority === 'High' ? 'bg-error/10 text-error' : issue.priority === 'Medium' ? 'bg-warning/10 text-warning-dark' : 'bg-slate-100 text-slate-600'}`}>
                {issue.priority} Priority
              </span>
              <span className="px-3 py-1 bg-surface-container-high text-brand-navy text-sm font-bold rounded-full">
                {issue.category}
              </span>
            </div>
          </div>

          <p className="text-outline whitespace-pre-wrap leading-relaxed">{issue.description || 'No description provided.'}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[200px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-elevation-1">
              {issue.imageUrl ? (
                <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Evidence" />
              ) : (
                <div className="text-6xl opacity-20">📷</div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                Citizen Evidence
              </div>
            </div>
            
            <div className="h-[200px] bg-slate-200 rounded-2xl relative overflow-hidden border border-outline-variant map-preview-container shadow-inner">
              <div className="absolute w-4 h-4 rounded-full bg-error ring-4 ring-error/20 top-[50%] left-[50%]"></div>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-navy shadow-sm">
                {issue.location}
              </div>
            </div>
          </div>

          {/* AI Context Analysis */}
          <div className="bg-purple-50/50 border border-purple-200 border-l-4 border-l-purple-500 rounded-2xl p-6 shadow-sm page-enter">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-purple-200/50">
              <Sparkles className="text-purple-500" size={24} />
              <h3 className="text-lg font-bold text-purple-700">AI Context Analysis</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Category Prediction</div>
                <div className="font-semibold text-brand-navy">{issue.category}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Confidence Score</div>
                <div className="font-semibold text-purple-600">94%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Recommended Priority</div>
                <div className={`font-semibold ${issue.priority === 'High' ? 'text-error' : 'text-brand-navy'}`}>{issue.priority}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Recommended Dept</div>
                <div className="font-semibold text-brand-navy truncate">{issue.department || 'PWD - Roads'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Duplicate Probability</div>
                <div className={`font-semibold ${issue.duplicateProbability && issue.duplicateProbability > 50 ? 'text-warning' : 'text-success'}`}>{issue.duplicateProbability || 12}%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Photo Evidence</div>
                <div className="font-semibold text-success">Likely Valid</div>
              </div>
            </div>
          </div>

          {currentIndex >= 4 && (
            <div className="border-2 border-success rounded-2xl overflow-hidden page-enter">
              <div className="bg-success/10 px-5 py-4 border-b border-success/20">
                <h3 className="text-lg font-bold text-success-dark">Resolution Details</h3>
              </div>
              <div className="p-5">
                <div className="h-[140px] bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl relative overflow-hidden flex items-center justify-center mb-4">
                  <Wrench size={48} className="text-white/20" />
                  <div className="absolute bottom-3 left-3 bg-success text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    After Photo (Simulated)
                  </div>
                </div>
                <p className="text-sm font-medium text-outline">Issue fixed successfully by field team.</p>
              </div>
            </div>
          )}

          <div className="mb-10 page-enter">
            <h3 className="text-lg font-bold text-brand-navy mb-6">Issue Lifecycle</h3>
            <div className="relative border-l-2 border-outline-variant ml-3 space-y-6">
              {milestones.map((m, idx) => {
                const isActive = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                
                return (
                  <div key={m} className={`relative pl-8 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 ${isActive ? 'bg-brand-navy border-brand-navy' : 'bg-surface-base border-outline-variant'} ${isCurrent ? 'ring-4 ring-brand-navy/20' : ''}`}></div>
                    <h4 className={`font-semibold ${isCurrent ? 'text-brand-navy' : isActive ? 'text-on-surface' : 'text-outline'}`}>{m}</h4>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Actions */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          
          <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-brand-navy shadow-elevation-1">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Action Control</h3>
            {renderActionControl()}
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1 flex flex-col gap-6">
            
            <div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Service Level Agreement</div>
              <div className={`font-bold text-lg mb-1 ${slaInfo.color}`}>{slaInfo.text}</div>
              <div className="text-xs text-outline font-medium">Target: {issue.priority === 'High' ? '24 Hours' : '48 Hours'}</div>
            </div>

            <div className="h-[1px] bg-outline-variant"></div>
            
            <div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Current Assignment</div>
              <div className="font-semibold text-brand-navy">
                {['Reported', 'Under Review', 'Acknowledged'].includes(issue.status) ? 'Unassigned' : (issue.department || 'General Municipal Services')}
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant"></div>

            <div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Reported By</div>
              <div className="font-semibold text-brand-navy flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center"><User size={12} className="text-slate-600"/></div>
                Citizen #{(issue.id as string).substring(3, 8)}
              </div>
              <div className="text-xs text-outline">{new Date(issue.reportedAt).toLocaleString()}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
