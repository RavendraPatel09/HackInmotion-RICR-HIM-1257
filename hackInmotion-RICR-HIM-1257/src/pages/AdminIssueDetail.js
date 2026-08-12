import { issueService } from '../services/issueService.js';
import { Icons } from '../utils/icons.js';

export function renderAdminIssueDetail(id) {
  return `
    <style>
      .admin-detail-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }
      @media(min-width: 1024px) {
        .admin-detail-grid { grid-template-columns: 2fr 1fr; }
      }
      
      .ai-panel {
        background: linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.02));
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-left: 4px solid #8b5cf6;
      }
    </style>

    <div class="mb-lg pb-xl" id="admin-issue-container" >
      <!-- Loading State -->
      <div id="admin-issue-loading" class="flex justify-center items-center" style="height: 300px;">
        <span class="status-dot active" style="transform: scale(2);"></span>
      </div>
      
      <!-- Content Injected via JS -->
      <div id="admin-issue-content" style="display: none;"></div>
      
      <div style="height: 80px;"></div>
    </div>
  `;
}

export async function initAdminIssueDetail(id) {
  const container = document.getElementById('admin-issue-content');
  const loading = document.getElementById('admin-issue-loading');
  if (!container || !loading) return;

  const getDept = (cat) => {
    if (['Roads', 'Infrastructure'].includes(cat)) return 'PWD - Roads Division';
    if (['Sanitation', 'Waste'].includes(cat)) return 'Solid Waste Management';
    if (['Electricity'].includes(cat)) return 'Electricity Board';
    return 'General Municipal Services';
  };

  const getSlaInfo = (issue) => {
    if (issue.status === 'Resolved' || issue.status === 'Verified' || issue.status === 'Closed') {
      return { text: 'SLA Met / Resolved', color: 'var(--success)' };
    }
    const reportedAt = new Date(issue.reportedAt).getTime();
    const hoursOpen = (Date.now() - reportedAt) / (1000 * 60 * 60);
    const limit = issue.priority === 'High' ? 24 : 48;
    const remaining = Math.round(limit - hoursOpen);
    
    if (hoursOpen > limit) return { text: \`Breached (Overdue by \${Math.abs(remaining)}h)\`, color: 'var(--error)' };
    if (hoursOpen > (limit * 0.75)) return { text: \`At Risk (\${remaining}h remaining)\`, color: 'var(--warning)' };
    return { text: \`On Track (\${remaining}h remaining)\`, color: 'var(--brand-navy)' };
  };

  const renderView = (issue) => {
    
    // Status Logic
    let statusClass = 'active';
    if (['Resolved', 'Verified', 'Closed'].includes(issue.status)) statusClass = 'inactive';
    
    let pClass = 'priority-low';
    if (issue.priority === 'High') pClass = 'priority-high';
    if (issue.priority === 'Medium') pClass = 'priority-medium';

    // --- Action Control Center Logic ---
    let actionHtml = '';
    const s = issue.status;
    
    if (s === 'Reported' || s === 'Under Review') {
      actionHtml = \`
        <button class="btn btn-primary w-full" id="btn-ack" style="justify-content: center;">Acknowledge Issue</button>
      \`;
    } else if (s === 'Acknowledged') {
      actionHtml = \`
        <div class="flex flex-column gap-xs">
          <label class="caption font-weight-bold">Assign Department</label>
          <select id="select-dept" class="select mb-xs">
            <option value="PWD - Roads Division">PWD - Roads Division</option>
            <option value="Solid Waste Management">Solid Waste Management</option>
            <option value="Electricity Board">Electricity Board</option>
            <option value="Water Department">Water Department</option>
          </select>
          <button class="btn btn-primary w-full" id="btn-assign" style="justify-content: center;">Assign</button>
        </div>
      \`;
    } else if (s === 'Assigned' || s === 'Reopened') {
      actionHtml = \`
        <button class="btn btn-primary w-full" id="btn-start" style="justify-content: center;">Start Work</button>
      \`;
    } else if (s === 'In Progress') {
      actionHtml = \`
        <button class="btn btn-success w-full" id="btn-resolve" style="justify-content: center;">Mark as Resolved</button>
      \`;
    } else if (s === 'Resolved') {
      actionHtml = \`
        <p class="caption text-muted mb-xs">Awaiting citizen verification, or force verify.</p>
        <button class="btn btn-primary w-full" id="btn-verify" style="justify-content: center;">Force Verify</button>
      \`;
    } else if (s === 'Verified') {
      actionHtml = \`
        <button class="btn btn-secondary w-full" id="btn-close" style="justify-content: center;">Close Ticket</button>
      \`;
    } else if (s === 'Closed') {
      actionHtml = \`
        <div class="badge badge-neutral w-full" style="justify-content: center; padding: var(--spacing-sm);">Archived & Closed</div>
      \`;
    }

    // --- Timeline Logic ---
    const milestones = ['Reported', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved', 'Verified'];
    let currentIndex = 0;
    switch(s) {
      case 'Under Review': case 'Reported': currentIndex = 0; break;
      case 'Acknowledged': currentIndex = 1; break;
      case 'Reopened':
      case 'Assigned': currentIndex = 2; break;
      case 'In Progress': currentIndex = 3; break;
      case 'Resolved': currentIndex = 4; break;
      case 'Verified': case 'Closed': currentIndex = 5; break;
    }
    const timelineHTML = milestones.map((m, idx) => {
      const isActive = idx <= currentIndex;
      return \`
        <div class="timeline-item \${isActive ? 'active' : ''}">
          <div class="timeline-content">
            <h4 style="font-weight: \${idx === currentIndex ? '700' : '600'}; color: \${isActive ? 'var(--on-surface)' : '#a1a1aa'}">\${m}</h4>
          </div>
        </div>
      \`;
    }).join('');

    // --- Resolution Logic ---
    let resolutionHtml = '';
    if (currentIndex >= 4) {
      resolutionHtml = \`
        <div class="card mb-lg" style="border: 2px solid var(--success);">
          <div class="title-md mb-sm" style="color: var(--brand-green);">Resolution Details</div>
          <div style="height: 120px; background: linear-gradient(135deg, #0f766e, #042f2e); position: relative; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-sm);">
             <div style="color: rgba(255,255,255,0.2); font-size: 48px;">${Icons.tools}</div>
             <span class="badge badge-success" style="position: absolute; bottom: 8px; left: 8px;">After Photo (Simulated)</span>
          </div>
          <p class="body-sm text-muted m-0">Issue fixed successfully by field team.</p>
        </div>
      \`;
    }

    const slaInfo = getSlaInfo(issue);
    const recDept = getDept(issue.category);

    container.innerHTML = \`
      <!-- Header -->
      <div class="flex items-center gap-md mb-md">
        <a href="#/admin/issues" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
        <h2 class="headline-sm m-0 font-monospace">\${issue.id}</h2>
      </div>
      
      <div class="admin-detail-grid">
        
        <!-- LEFT COLUMN: Content -->
        <div>
          <!-- Title & Meta -->
          <h1 class="title-lg mb-sm">\${issue.title}</h1>
          <div class="flex items-center gap-sm flex-wrap mb-lg pb-md" style="border-bottom: 1px solid var(--outline-variant);">
            <span class="badge badge-neutral flex items-center gap-xs"><span class="status-dot \${statusClass}"></span> \${s}</span>
            <span class="priority-indicator \${pClass}">\${issue.priority || 'Medium'}</span>
            <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">\${issue.category}</span>
          </div>

          <!-- Description -->
          <p class="body-md text-muted mb-lg" style="white-space: pre-wrap; line-height: 1.6;">\${issue.description || 'No description provided.'}</p>

          <!-- Evidence & Map Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg);">
            <!-- Evidence -->
            <div style="height: 200px; background: linear-gradient(135deg, #1e293b, #0f172a); position: relative; border-radius: var(--radius-md); overflow: hidden; display: flex; align-items: center; justify-content: center;">
              \${issue.imageUrl 
                ? \`<img src="\${issue.imageUrl}" style="width:100%; height:100%; object-fit:cover;" />\`
                : \`<div style="color: rgba(255,255,255,0.2); font-size: 48px;">📷</div>\`
              }
              <div style="position: absolute; bottom: 8px; left: 8px;">
                <span class="badge badge-neutral" style="background: rgba(0,0,0,0.6); color: white; border: 1px solid rgba(255,255,255,0.2);">Citizen Evidence</span>
              </div>
            </div>
            <!-- Map -->
            <div class="card" style="padding: 0; overflow: hidden; height: 200px; position: relative;">
              <div style="height: 100%; background: #e2e8f0; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 15px 15px;">
                <div class="map-pin" style="top: 50%; left: 50%; animation: none;"></div>
              </div>
              <div class="caption text-muted" style="position: absolute; bottom: 8px; left: 8px; background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 4px;">\${issue.location}</div>
            </div>
          </div>

          <!-- AI Analysis Panel -->
          <div class="card ai-panel mb-lg" style="padding: var(--spacing-md);">
            <div class="flex items-center gap-sm mb-md pb-sm" style="border-bottom: 1px solid rgba(139, 92, 246, 0.2);">
              <span style="font-size: 20px;">${Icons.sparkles}</span>
              <h3 class="title-md m-0" style="color: #8b5cf6;">AI Context Analysis</h3>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md) var(--spacing-sm);">
              <div>
                <div class="caption text-muted mb-xs uppercase">Category Prediction</div>
                <div class="body-md font-weight-bold">\${issue.category}</div>
              </div>
              <div>
                <div class="caption text-muted mb-xs uppercase">Confidence Score</div>
                <div class="body-md font-weight-bold" style="color: #8b5cf6;">94%</div>
              </div>
              
              <div>
                <div class="caption text-muted mb-xs uppercase">Recommended Priority</div>
                <div class="body-md font-weight-bold">\${issue.priority}</div>
              </div>
              <div>
                <div class="caption text-muted mb-xs uppercase">Recommended Dept</div>
                <div class="body-md font-weight-bold">\${recDept}</div>
              </div>

              <div>
                <div class="caption text-muted mb-xs uppercase">Duplicate Probability</div>
                <div class="body-md font-weight-bold" style="color: var(--success);">12% (Low)</div>
              </div>
              <div>
                <div class="caption text-muted mb-xs uppercase">Photo Evidence</div>
                <div class="body-md font-weight-bold" style="color: var(--success);">Likely Valid</div>
              </div>
            </div>
          </div>
          
          <!-- Resolution Block (Hidden until resolved) -->
          \${resolutionHtml}
          
          <!-- Timeline -->
          <div class="mb-lg page-enter" >
            <h3 class="title-md mb-md">Issue Lifecycle</h3>
            <div class="timeline">
              \${timelineHTML}
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Meta & Actions -->
        <div>
          <!-- Action Control Center -->
          <div class="card mb-lg" style="padding: var(--spacing-md); border-color: var(--brand-navy); position: sticky; top: var(--spacing-lg);">
            <h3 class="title-md mb-md">Action Control</h3>
            \${actionHtml}
          </div>

          <!-- SLA Tracker -->
          <div class="card mb-md" style="padding: var(--spacing-md);">
            <div class="caption text-muted mb-xs uppercase">Service Level Agreement</div>
            <div class="body-md font-weight-bold" style="color: \${slaInfo.color};">\${slaInfo.text}</div>
            <div class="caption text-muted mt-xs">Target: \${issue.priority === 'High' ? '24 Hours' : '48 Hours'}</div>
          </div>

          <!-- Assignment & Citizen Info -->
          <div class="card mb-md" style="padding: var(--spacing-md);">
            <div class="caption text-muted mb-xs uppercase">Current Assignment</div>
            <div class="body-md font-weight-bold mb-md">\${s === 'Reported' || s === 'Under Review' || s === 'Acknowledged' ? 'Unassigned' : recDept}</div>
            
            <div class="caption text-muted mb-xs uppercase">Reported By</div>
            <div class="body-md font-weight-bold flex items-center gap-sm">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; font-size: 12px;">${Icons.user}</div>
              Citizen #\${issue.userId.substring(0, 5)}
            </div>
            <div class="caption text-muted mt-xs">\${new Date(issue.reportedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    \`;

    // --- Attach Event Listeners ---
    
    const bindAction = (btnId, nextStatus) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', async () => {
          btn.disabled = true;
          btn.innerHTML = 'Updating...';
          try {
            const updated = await issueService.updateIssue(issue.id, { status: nextStatus });
            renderView(updated);
          } catch(e) {
            console.error(e);
            btn.disabled = false;
            btn.innerHTML = 'Error';
          }
        });
      }
    };

    bindAction('btn-ack', 'Acknowledged');
    bindAction('btn-assign', 'Assigned');
    bindAction('btn-start', 'In Progress');
    bindAction('btn-resolve', 'Resolved');
    bindAction('btn-verify', 'Verified');
    bindAction('btn-close', 'Closed');
  };

  try {
    const issue = await issueService.getIssue(id);
    loading.style.display = 'none';
    container.style.display = 'block';
    renderView(issue);
  } catch (error) {
    loading.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = \`
      <div class="empty-state page-enter" >
        <div class="empty-state-icon text-error" style="font-size: 32px;">${Icons.x}</div>
        <h2 class="title-lg">Issue Not Found</h2>
        <a href="#/admin/issues" class="btn btn-primary mt-md">Back to Queue</a>
      </div>
    \`;
  }
}
