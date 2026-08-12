import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { FileText, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const { issues } = useStore();

  const total = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved' || i.status === 'Verified');
  const openIssues = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Verified');
  const criticalIssues = issues.filter(i => i.priority === 'High' && i.status !== 'Resolved');

  let totalSlaPass = 0;
  let totalResolutionHours = 0;
  
  resolvedIssues.forEach(i => {
    const reportedAt = new Date(i.reportedAt).getTime();
    const resolvedAt = Date.now() - (2 * 60 * 60 * 1000); // mock resolution 2h ago
    const hoursDiff = (resolvedAt - reportedAt) / (1000 * 60 * 60);
    const safeHours = Math.max(1, Math.abs(hoursDiff));
    totalResolutionHours += safeHours;
    const targetSla = i.priority === 'High' ? 24 : 48;
    if (safeHours <= targetSla) totalSlaPass++;
  });

  const slaPercent = resolvedIssues.length > 0 ? Math.round((totalSlaPass / resolvedIssues.length) * 100) : 100;
  const avgTime = resolvedIssues.length > 0 ? Math.round(totalResolutionHours / resolvedIssues.length) : 0;

  // Categories
  const catCounts: Record<string, number> = {};
  issues.forEach(i => {
    catCounts[i.category] = (catCounts[i.category] || 0) + 1;
  });
  const catMax = Math.max(...Object.values(catCounts), 1);

  // Departments
  const deptMap: Record<string, string> = {
    'Roads': 'PWD - Roads',
    'Infrastructure': 'PWD - Roads',
    'Sanitation': 'Solid Waste Mgmt',
    'Waste': 'Solid Waste Mgmt',
    'Electricity': 'Energy Board',
    'Water': 'Water Dept'
  };
  const deptCounts: Record<string, number> = {};
  issues.forEach(i => {
    const dept = deptMap[i.category] || 'General Services';
    if (i.status !== 'Resolved' && i.status !== 'Verified') {
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    }
  });
  const deptMax = Math.max(...Object.values(deptCounts), 1);

  // Hotspots
  const locCounts: Record<string, number> = {};
  issues.forEach(i => {
    const zone = i.location.split(',')[0].trim();
    locCounts[zone] = (locCounts[zone] || 0) + 1;
  });
  const sortedLocs = Object.entries(locCounts).sort((a,b) => b[1] - a[1]).slice(0, 2);

  // Recent
  const recentSorted = [...issues].sort((a,b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()).slice(0, 3);

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h2 className="headline-md text-brand-navy mb-1">Bhopal Civic Command Center</h2>
        <p className="body-md text-outline">Real-time overview of civic infrastructure and operations.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Total Issues</div>
          <div className="text-3xl font-bold font-mono text-brand-navy">{total}</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Open Issues</div>
          <div className="text-3xl font-bold font-mono text-warning">{openIssues.length}</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Resolved</div>
          <div className="text-3xl font-bold font-mono text-success">{resolvedIssues.length}</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Critical Issues</div>
          <div className="text-3xl font-bold font-mono text-error">{criticalIssues.length}</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-brand-green border-t border-r border-b border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">SLA Compliance</div>
          <div className="text-3xl font-bold font-mono text-brand-navy">{slaPercent}%</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-purple-500 border-t border-r border-b border-outline-variant shadow-elevation-1">
          <div className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Avg Resolution</div>
          <div className="text-3xl font-bold font-mono text-brand-navy">{avgTime}h</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Charts) */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1">
            <h3 className="title-md text-brand-navy mb-4">Category Distribution</h3>
            <div className="flex flex-col gap-3">
              {Object.keys(catCounts).length === 0 ? <div className="text-sm text-outline">No data</div> : 
                Object.entries(catCounts).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-navy rounded-full" style={{ width: `${(count / catMax) * 100}%` }}></div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1">
            <h3 className="title-md text-brand-navy mb-4">Department Workload</h3>
            <div className="flex flex-col gap-3">
              {Object.keys(deptCounts).length === 0 ? <div className="text-sm text-outline">No open workloads</div> : 
                Object.entries(deptCounts).map(([dept, count]) => (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{dept}</span>
                      <span className="font-bold text-error">{count} open</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-warning rounded-full" style={{ width: `${(count / deptMax) * 100}%` }}></div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Middle Column (Critical & Hotspots) */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-error/50 shadow-elevation-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -z-10"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="title-md text-error">Action Required</h3>
              <span className="px-2.5 py-0.5 bg-error text-white text-xs font-bold rounded-full">{criticalIssues.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {criticalIssues.length === 0 ? <div className="text-sm text-outline">No critical issues!</div> :
                criticalIssues.slice(0, 3).map(i => (
                  <div key={i.id} className="p-3 border-l-4 border-l-error bg-error/5 rounded-r-lg border border-transparent hover:border-error/20 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">{i.id}</span>
                      <span className="text-[10px] text-error font-bold uppercase">SLA Risk</span>
                    </div>
                    <div className="text-sm font-semibold text-brand-navy truncate">{i.title}</div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1">
            <h3 className="title-md text-brand-navy mb-4">Issue Hotspots</h3>
            <div className="h-[180px] bg-slate-200 rounded-xl mb-4 relative overflow-hidden border border-outline-variant map-preview-container">
              <div className="absolute w-4 h-4 rounded-full bg-error ring-8 ring-error/20 top-[30%] left-[40%]"></div>
              <div className="absolute w-4 h-4 rounded-full bg-warning ring-6 ring-warning/20 top-[60%] left-[70%]"></div>
              <div className="absolute w-4 h-4 rounded-full bg-brand-navy top-[50%] left-[20%]"></div>
            </div>
            <div className="text-sm text-outline font-medium flex items-center gap-2">
              <MapPin size={16} className="text-brand-navy" />
              {sortedLocs.length > 0 ? sortedLocs.map(([loc, count]) => `${loc} (${count})`).join(' • ') : 'No location data'}
            </div>
          </div>
        </div>

        {/* Right Column (Activity Feed) */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="title-md text-brand-navy">Recent Activity</h3>
              <Link to="/admin/issues" className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-brand-navy rounded-lg hover:bg-slate-200">View All</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {recentSorted.length === 0 ? <div className="text-sm text-outline">No activity</div> : 
                recentSorted.map(i => {
                  let colorClass = 'bg-brand-navy/15 text-brand-navy';
                  let icon = <FileText size={16} />;
                  
                  if (i.status === 'Resolved') {
                    colorClass = 'bg-success/15 text-success';
                    icon = <CheckCircle2 size={16} />;
                  } else if (i.priority === 'High') {
                    colorClass = 'bg-error/15 text-error';
                    icon = <AlertCircle size={16} />;
                  }

                  return (
                    <div key={i.id} className="flex gap-4 pb-4 border-b border-outline-variant/50 last:border-0 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-semibold text-brand-navy truncate">{i.id} logged</div>
                          <div className="text-xs text-outline whitespace-nowrap ml-2">
                            {new Date(i.reportedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <div className="text-xs text-outline truncate">{i.title}</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
