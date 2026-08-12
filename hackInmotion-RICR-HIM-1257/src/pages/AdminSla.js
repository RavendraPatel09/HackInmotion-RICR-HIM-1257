import { issueService } from '../services/issueService.js';
import { Icons } from '../utils/icons.js';

export function renderAdminSla() {
  return `
    <style>
      .sla-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }
      @media(min-width: 1024px) {
        .sla-grid { grid-template-columns: 1fr 1fr 1fr; }
      }
      
      .sla-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }
      
      .metric-card {
        padding: var(--spacing-md);
        background: var(--surface-container-lowest);
        border-radius: var(--radius-sm);
        border-left: 4px solid var(--outline-variant);
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      .metric-card.critical { border-left-color: var(--error); }
      .metric-card.risk { border-left-color: var(--warning); }
      .metric-card.track { border-left-color: var(--brand-navy); }
      
      .sla-time {
        font-size: 20px;
        font-weight: 800;
        font-family: monospace;
        letter-spacing: -0.5px;
      }
      .sla-time.critical { color: var(--error); }
      .sla-time.risk { color: var(--warning); }
      .sla-time.track { color: var(--brand-navy); }
    </style>

    <div class="mb-lg pb-xl page-enter" >
      <div class="mb-lg page-enter" >
        <h2 class="headline-md m-0">SLA Enforcement</h2>
        <p class="body-sm text-muted">Real-time service level agreement tracking for active issues.</p>
      </div>

      <div id="sla-loading" class="flex justify-center items-center" style="height: 200px;">
        <span class="status-dot active" style="transform: scale(2);"></span>
      </div>

      <div id="sla-content" class="sla-grid" style="display: none;">
        
        <!-- Breached -->
        <div class="card" style="padding: var(--spacing-md); background: rgba(220, 38, 38, 0.02); border-color: rgba(220, 38, 38, 0.2);">
          <div class="flex items-center gap-sm mb-md pb-sm" style="border-bottom: 1px solid rgba(220, 38, 38, 0.1);">
            <span style="font-size: 20px;">🚨</span>
            <h3 class="title-md m-0" style="color: var(--error);">Critical (Breached)</h3>
            <span class="badge badge-error ml-auto" id="count-critical">0</span>
          </div>
          <div class="sla-list" id="list-critical"></div>
        </div>

        <!-- At Risk -->
        <div class="card" style="padding: var(--spacing-md); background: rgba(217, 119, 6, 0.02); border-color: rgba(217, 119, 6, 0.2);">
          <div class="flex items-center gap-sm mb-md pb-sm" style="border-bottom: 1px solid rgba(217, 119, 6, 0.1);">
            <span style="font-size: 20px;">${Icons.warning}</span>
            <h3 class="title-md m-0" style="color: var(--warning);">At Risk (&lt; 25% Time)</h3>
            <span class="badge badge-warning ml-auto" id="count-risk">0</span>
          </div>
          <div class="sla-list" id="list-risk"></div>
        </div>

        <!-- On Track -->
        <div class="card" style="padding: var(--spacing-md);">
          <div class="flex items-center gap-sm mb-md pb-sm" style="border-bottom: 1px solid var(--outline-variant);">
            <span style="font-size: 20px;">${Icons.check}</span>
            <h3 class="title-md m-0">On Track</h3>
            <span class="badge badge-neutral ml-auto" id="count-track">0</span>
          </div>
          <div class="sla-list" id="list-track"></div>
        </div>

      </div>
    </div>
  `;
}

export async function initAdminSla() {
  const loading = document.getElementById('sla-loading');
  const content = document.getElementById('sla-content');
  if (!loading || !content) return;

  const getDept = (cat) => {
    if (['Roads', 'Infrastructure'].includes(cat)) return 'PWD';
    if (['Sanitation', 'Waste'].includes(cat)) return 'SWM';
    if (['Electricity'].includes(cat)) return 'EB';
    return 'GEN';
  };

  try {
    const issues = await issueService.getIssues();
    
    const lists = { critical: [], risk: [], track: [] };

    issues.forEach(issue => {
      // Ignore resolved/closed issues
      if (['Resolved', 'Verified', 'Closed'].includes(issue.status)) return;

      const reportedAt = new Date(issue.reportedAt).getTime();
      const hoursOpen = (Date.now() - reportedAt) / (1000 * 60 * 60);
      const limit = issue.priority === 'High' ? 24 : 48;
      const remaining = limit - hoursOpen;
      
      const item = { ...issue, remainingHours: remaining, limit };

      if (hoursOpen > limit) lists.critical.push(item);
      else if (hoursOpen > (limit * 0.75)) lists.risk.push(item);
      else lists.track.push(item);
    });

    // Sort by most urgent
    lists.critical.sort((a,b) => a.remainingHours - b.remainingHours);
    lists.risk.sort((a,b) => a.remainingHours - b.remainingHours);
    lists.track.sort((a,b) => a.remainingHours - b.remainingHours);

    loading.style.display = 'none';
    content.style.display = 'grid';

    document.getElementById('count-critical').textContent = lists.critical.length;
    document.getElementById('count-risk').textContent = lists.risk.length;
    document.getElementById('count-track').textContent = lists.track.length;

    const renderCard = (issue, type) => {
      const pClass = issue.priority === 'High' ? 'priority-high' : (issue.priority === 'Medium' ? 'priority-medium' : 'priority-low');
      
      let timeText = '';
      if (type === 'critical') timeText = \`-\${Math.abs(Math.round(issue.remainingHours))}h Overdue\`;
      else timeText = \`\${Math.round(issue.remainingHours)}h Left\`;

      return \`
        <div class="metric-card \${type}">
          <div class="flex justify-between items-start mb-sm">
            <a href="#/admin/issue/\${issue.id}" class="font-monospace font-weight-bold" style="color: var(--brand-navy); text-decoration: none;">\${issue.id}</a>
            <span class="priority-indicator \${pClass}">\${issue.priority}</span>
          </div>
          
          <div class="body-sm mb-md" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="\${issue.title}">
            \${issue.title}
          </div>
          
          <div class="flex justify-between items-end">
            <div>
              <div class="caption text-muted mb-xs uppercase">Assigned</div>
              <div class="caption font-weight-bold" style="color: var(--on-surface);">\${getDept(issue.category)} (\${issue.category})</div>
            </div>
            <div class="text-right">
              <div class="caption text-muted mb-xs uppercase">SLA Target (\${issue.limit}h)</div>
              <div class="sla-time \${type}">\${timeText}</div>
            </div>
          </div>
        </div>
      \`;
    };

    document.getElementById('list-critical').innerHTML = lists.critical.length > 0 
      ? lists.critical.map(i => renderCard(i, 'critical')).join('') 
      : '<div class="body-sm text-muted text-center p-md">No breached SLAs!</div>';

    document.getElementById('list-risk').innerHTML = lists.risk.length > 0 
      ? lists.risk.map(i => renderCard(i, 'risk')).join('') 
      : '<div class="body-sm text-muted text-center p-md">No issues at risk.</div>';

    document.getElementById('list-track').innerHTML = lists.track.length > 0 
      ? lists.track.map(i => renderCard(i, 'track')).join('') 
      : '<div class="body-sm text-muted text-center p-md">No active issues on track.</div>';

  } catch (e) {
    loading.innerHTML = '<div class="text-error">Failed to load SLA data.</div>';
    console.error(e);
  }
}
