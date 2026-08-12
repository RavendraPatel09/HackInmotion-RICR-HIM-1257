import { issueService } from '../services/issueService.js';
import { Icons } from '../utils/icons.js';

export function renderCitizenIssueDetail(id) {
  return `
    <div class="mb-lg pb-xl" id="issue-detail-container" >
      <!-- Skeleton Loading State -->
      <div id="issue-loading">
        <div class="flex items-center gap-md mb-lg page-enter" >
          <a href="#/citizen/issues" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
          <div class="skeleton skeleton-text" style="width: 120px; height: 24px;"></div>
        </div>
        <div class="skeleton" style="width: 100%; height: 200px; border-radius: var(--radius-md); margin-bottom: var(--spacing-md);"></div>
        <div class="skeleton skeleton-text" style="width: 80%; height: 32px; margin-bottom: var(--spacing-sm);"></div>
        <div class="skeleton skeleton-text" style="width: 40%; height: 24px; margin-bottom: var(--spacing-lg);"></div>
      </div>
      
      <!-- Populated via JS -->
      <div id="issue-content" style="display: none;"></div>
      <div style="height: 80px;"></div> <!-- Nav Spacer -->
    </div>
  `;
}

export async function initCitizenIssueDetail(id) {
  const container = document.getElementById('issue-content');
  const loading = document.getElementById('issue-loading');
  
  if (!container || !loading) return;

  const renderIssue = (issue) => {
    
    // Status Logic
    let statusClass = 'active';
    if (issue.status === 'Under Review' || issue.status === 'Reported') statusClass = 'inactive';
    if (issue.status === 'Resolved' || issue.status === 'Verified') statusClass = 'inactive'; // Though visually inactive color, it's green or gray
    
    // Priority Logic
    let priorityClass = 'priority-low';
    if (issue.priority === 'High') priorityClass = 'priority-high';
    if (issue.priority === 'Medium') priorityClass = 'priority-medium';

    // Timeline mapping
    const milestones = ['Reported', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved', 'Verified'];
    // Map current status to an index.
    // If Reopened, it drops back to 'Assigned' or 'In Progress' effectively.
    let currentIndex = 0; // default Reported
    switch(issue.status) {
      case 'Under Review': currentIndex = 0; break;
      case 'Acknowledged': currentIndex = 1; break;
      case 'Reopened':
      case 'Assigned': currentIndex = 2; break;
      case 'In Progress': currentIndex = 3; break;
      case 'Resolved': currentIndex = 4; break;
      case 'Verified': currentIndex = 5; break;
    }
    
    // Hack: If status is Resolved but it's an old mock data item, ensure it's at least 4.
    if (issue.status === 'Resolved') currentIndex = 4;

    const timelineHTML = milestones.map((m, idx) => {
      const isActive = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      
      let timeText = '';
      if (idx === 0) timeText = new Date(issue.reportedAt).toLocaleDateString();
      if (isActive && idx > 0) timeText = 'Recently';
      
      return `
        <div class="timeline-item ${isActive ? 'active' : ''}">
          <div class="timeline-content">
            <h4 style="font-weight: ${isCurrent ? '700' : '600'}; color: ${isCurrent ? 'var(--on-surface)' : (isActive ? 'var(--on-surface-variant)' : '#a1a1aa')}">${m}</h4>
            ${timeText ? `<p style="font-size: var(--font-size-caption); color: var(--on-surface-variant);">${timeText}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Evidence Template
    const evidencePlaceholder = `
      <div style="height: 200px; background: linear-gradient(135deg, #1e293b, #0f172a); position: relative; border-radius: var(--radius-md); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-sm);">
         ${issue.imageUrl 
           ? `<img src="${issue.imageUrl}" style="width:100%; height:100%; object-fit:cover;" />`
           : `<div style="color: rgba(255,255,255,0.2); font-size: 48px;">📷</div>`
         }
         <div style="position: absolute; bottom: 12px; left: 12px;">
           <span class="badge badge-neutral" style="background: rgba(0,0,0,0.6); color: white; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);">Original Evidence</span>
         </div>
      </div>
    `;

    // Map Template
    const mapPlaceholder = `
      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--outline-variant); height: 140px; position: relative;">
        <div style="height: 100%; background: #e2e8f0; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 15px 15px;">
          <div class="map-pin" style="top: 50%; left: 50%; animation: none;"></div>
        </div>
      </div>
    `;
    
    // SLA & Dept
    let dept = 'Municipal Corp - Gen. Services';
    if (issue.category === 'Roads') dept = 'PWD - Roads Division';
    if (issue.category === 'Sanitation') dept = 'Solid Waste Management';
    if (issue.category === 'Electricity') dept = 'Electricity Board (Zone 2)';
    
    const sla = issue.priority === 'High' ? '24 Hours' : '48 Hours';

    // Resolution Block
    let resolutionBlock = '';
    if (issue.status === 'Resolved') {
      resolutionBlock = `
        <div class="card" style="margin-top: var(--spacing-xl); border: 2px solid var(--success); padding: 0; overflow: hidden; ">
          <div style="background: color-mix(in srgb, var(--success) 10%, transparent); padding: var(--spacing-md); border-bottom: 1px solid var(--outline-variant);">
            <div class="flex items-center gap-sm">
              <span style="font-size: 24px;">${Icons.check}</span>
              <h3 class="title-lg m-0" style="color: var(--brand-green);">Resolution Pending Verification</h3>
            </div>
          </div>
          
          <div style="padding: var(--spacing-md);">
            <!-- Resolution Evidence -->
            <div style="height: 160px; background: linear-gradient(135deg, #0f766e, #042f2e); position: relative; border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: var(--spacing-md);">
               <div style="color: rgba(255,255,255,0.2); font-size: 48px;">${Icons.tools}</div>
               <div style="position: absolute; bottom: 8px; left: 8px;">
                 <span class="badge badge-success" style="background: rgba(0,0,0,0.6); border: none; backdrop-filter: blur(4px);">After Photo</span>
               </div>
            </div>
            
            <p class="body-md mb-lg font-weight-bold text-center page-enter" >Was this issue actually fixed?</p>
            
            <div class="flex gap-sm">
              <button class="btn btn-secondary" id="btn-reopen" style="flex: 1; justify-content: center; color: var(--error); border-color: var(--error);">
                NO — Reopen
              </button>
              <button class="btn btn-primary" id="btn-verify" style="flex: 1; justify-content: center;">
                YES — Verify
              </button>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Header -->
      <div class="flex items-center gap-md mb-lg page-enter" >
        <a href="#/citizen/issues" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
        <h2 class="title-lg m-0 font-monospace">${issue.id}</h2>
      </div>
      
      <!-- Visuals -->
      ${evidencePlaceholder}
      
      <!-- Title & Badges -->
      <h1 class="headline-sm mb-sm">${issue.title}</h1>
      <div class="flex items-center gap-sm flex-wrap mb-lg pb-md" style="border-bottom: 1px solid var(--outline-variant);">
        <span class="badge badge-neutral flex items-center gap-xs"><span class="status-dot ${statusClass}"></span> ${issue.status}</span>
        <span class="priority-indicator ${priorityClass}">${issue.priority || 'Medium'}</span>
        <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">${issue.category}</span>
      </div>

      <!-- Description -->
      <div class="mb-xl">
        <h3 class="title-md mb-xs">Description</h3>
        <p class="body-md text-muted" style="white-space: pre-wrap; line-height: 1.6;">${issue.description || 'No description provided.'}</p>
      </div>

      <!-- Location Map -->
      <div class="mb-xl">
        <h3 class="title-md mb-xs">Location</h3>
        <p class="body-md text-muted mb-sm">${Icons.location} ${issue.location}</p>
        ${mapPlaceholder}
      </div>

      <!-- Department & SLA -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);">
        <div class="card" style="padding: var(--spacing-md);">
          <div class="caption text-muted mb-xs">Assigned To</div>
          <div class="body-md" style="font-weight: 600;">${dept}</div>
        </div>
        <div class="card" style="padding: var(--spacing-md);">
          <div class="caption text-muted mb-xs">Target SLA</div>
          <div class="body-md" style="font-weight: 600;">${sla}</div>
        </div>
      </div>

      <!-- Lifecycle Timeline -->
      <div class="mb-xl">
        <h3 class="title-md mb-md">Issue Lifecycle</h3>
        <div class="timeline">
          ${timelineHTML}
        </div>
      </div>
      
      <!-- Resolution Verification Block -->
      ${resolutionBlock}
    `;

    // Attach Interactive Handlers if Resolved
    if (issue.status === 'Resolved') {
      const btnVerify = document.getElementById('btn-verify');
      const btnReopen = document.getElementById('btn-reopen');
      
      if (btnVerify) {
        btnVerify.addEventListener('click', async () => {
          btnVerify.disabled = true;
          btnVerify.innerHTML = '<span class="status-dot active"></span> Verifying...';
          try {
            const updated = await issueService.updateIssue(issue.id, { status: 'Verified' });
            renderIssue(updated);
          } catch(e) {
            console.error(e);
            btnVerify.disabled = false;
            btnVerify.innerHTML = 'YES — Verify';
          }
        });
      }
      
      if (btnReopen) {
        btnReopen.addEventListener('click', async () => {
          btnReopen.disabled = true;
          btnReopen.innerHTML = 'Reopening...';
          try {
            const updated = await issueService.updateIssue(issue.id, { status: 'Reopened' });
            renderIssue(updated);
          } catch(e) {
            console.error(e);
            btnReopen.disabled = false;
            btnReopen.innerHTML = 'NO — Reopen';
          }
        });
      }
    }
  };

  try {
    const issue = await issueService.getIssue(id);
    loading.style.display = 'none';
    container.style.display = 'block';
    renderIssue(issue);
  } catch (error) {
    loading.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = `
      <div class="empty-state" style="padding: var(--spacing-2xl) var(--spacing-md);">
        <div class="empty-state-icon" style="font-size: 32px; color: var(--error);">${Icons.x}</div>
        <h2 class="title-lg mb-xs">Issue Not Found</h2>
        <p class="body-md text-muted mb-lg page-enter" >The issue you are looking for does not exist or has been removed.</p>
        <a href="#/citizen/issues" class="btn btn-primary">Back to Issues</a>
      </div>
    `;
  }
}
