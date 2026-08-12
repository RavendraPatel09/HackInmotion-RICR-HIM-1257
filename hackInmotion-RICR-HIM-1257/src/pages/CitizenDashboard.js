import { issueService } from '../services/issueService.js';
import { authService } from '../services/authService.js';

export function renderCitizenDashboard() {
  // Return the skeleton structure immediately, data will be injected via initCitizenDashboard
  return `
    <div class="mb-lg">
      <div class="flex justify-between items-center mb-md">
        <div>
          <p class="body-md text-muted mb-xs">Good morning 👋</p>
          <h2 class="headline-md" id="dashboard-user-name">Citizen</h2>
        </div>
        <!-- Profile Avatar Placeholder -->
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--surface-base); display: flex; align-items: center; justify-content: center; font-size: 20px;" id="dashboard-avatar">
          👤
        </div>
      </div>
      
      <!-- Primary CTA (Mobile First focus) -->
      <a href="#/citizen/report" class="btn btn-primary" style="width: 100%; padding: var(--spacing-lg); font-size: var(--font-size-title-md); margin-bottom: var(--spacing-xl); justify-content: center; box-shadow: var(--elevation-2);">
        <span style="font-size: 24px;">+</span> Report an Issue
      </a>
      
      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);">
        <div class="card" style="padding: var(--spacing-md); text-align: center;">
          <div class="display-sm" style="color: var(--brand-navy);" id="stat-total">-</div>
          <div class="caption text-muted">My Reports</div>
        </div>
        <div class="card" style="padding: var(--spacing-md); text-align: center;">
          <div class="display-sm" style="color: var(--warning);" id="stat-progress">-</div>
          <div class="caption text-muted">In Progress</div>
        </div>
        <div class="card" style="padding: var(--spacing-md); text-align: center;">
          <div class="display-sm" style="color: var(--success);" id="stat-resolved">-</div>
          <div class="caption text-muted">Resolved</div>
        </div>
        <div class="card" style="padding: var(--spacing-md); text-align: center;">
          <div class="display-sm" style="color: var(--brand-green);">+45</div>
          <div class="caption text-muted">Civic Impact Pts</div>
        </div>
      </div>

      <!-- Active Reports List -->
      <div class="mb-xl">
        <div class="flex justify-between items-end mb-sm">
          <h3 class="title-lg">Active Reports</h3>
          <a href="#/citizen/track" class="body-md" style="color: var(--brand-green); font-weight: 600;">View All</a>
        </div>
        <div id="active-reports-container" class="flex flex-column gap-sm">
          <!-- Skeleton Loader -->
          <div class="issue-card">
            <div class="skeleton" style="width: 48px; height: 48px; border-radius: var(--radius-sm);"></div>
            <div class="issue-card-content" style="width: 100%;">
              <div class="skeleton skeleton-text" style="width: 60%; margin-bottom: 4px;"></div>
              <div class="skeleton skeleton-text" style="width: 40%;"></div>
            </div>
          </div>
          <div class="issue-card">
            <div class="skeleton" style="width: 48px; height: 48px; border-radius: var(--radius-sm);"></div>
            <div class="issue-card-content" style="width: 100%;">
              <div class="skeleton skeleton-text" style="width: 70%; margin-bottom: 4px;"></div>
              <div class="skeleton skeleton-text" style="width: 30%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nearby Issues -->
      <div class="mb-xl">
        <h3 class="title-lg mb-sm">Nearby Issues</h3>
        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--outline-variant);">
           <div style="height: 150px; background: #e2e8f0; position: relative; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 10px 10px;">
              <div class="map-pin" style="top: 50%; left: 50%;"></div>
              <div class="map-pin" style="top: 30%; left: 70%; background: var(--warning); box-shadow: 0 0 0 4px color-mix(in srgb, var(--warning) 20%, transparent);"></div>
           </div>
           <div style="padding: var(--spacing-sm) var(--spacing-md); background: var(--surface-container-lowest); border-top: 1px solid var(--outline-variant);" class="flex justify-between items-center">
             <span class="body-md text-muted">2 issues near you</span>
             <a href="#/" class="body-md" style="color: var(--brand-green); font-weight: 600;">Open Map</a>
           </div>
        </div>
      </div>

      <!-- Recent Activity Timeline -->
      <div>
        <h3 class="title-lg mb-sm">Recent Activity</h3>
        <div class="timeline" id="recent-activity-container">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  `;
}

export async function initCitizenDashboard() {
  try {
    // 1. Fetch user data
    const user = authService.getCurrentUser() || { name: 'Citizen' };
    const nameEl = document.getElementById('dashboard-user-name');
    const avatarEl = document.getElementById('dashboard-avatar');
    
    if (nameEl) nameEl.textContent = user.name;
    if (avatarEl && user.name) {
      avatarEl.textContent = user.name.charAt(0).toUpperCase();
      avatarEl.style.color = 'white';
      avatarEl.style.backgroundColor = 'var(--brand-green)';
    }

    // 2. Fetch issues data
    const issues = await issueService.getIssues();
    
    // Simulate these are the citizen's reports (for mock purposes, we take all)
    const myIssues = issues;
    
    const inProgressCount = myIssues.filter(i => i.status === 'In Progress' || i.status === 'Under Review').length;
    const resolvedCount = myIssues.filter(i => i.status === 'Resolved').length;

    // Update Stats
    const totalEl = document.getElementById('stat-total');
    const progEl = document.getElementById('stat-progress');
    const resEl = document.getElementById('stat-resolved');
    
    if (totalEl) totalEl.textContent = myIssues.length;
    if (progEl) progEl.textContent = inProgressCount;
    if (resEl) resEl.textContent = resolvedCount;

    // 3. Render Active Reports
    const activeReportsContainer = document.getElementById('active-reports-container');
    if (activeReportsContainer) {
      const activeIssues = myIssues.filter(i => i.status !== 'Resolved').slice(0, 3);
      
      if (activeIssues.length === 0) {
        activeReportsContainer.innerHTML = `
          <div class="empty-state" style="padding: var(--spacing-xl) var(--spacing-md);">
            <div class="empty-state-icon" style="font-size: 24px; margin-bottom: 8px;">🎉</div>
            <div class="body-md text-muted">No active reports.</div>
          </div>
        `;
      } else {
        activeReportsContainer.innerHTML = activeIssues.map(issue => {
          let statusClass = 'active';
          if (issue.status === 'Under Review') statusClass = 'inactive';
          if (issue.status === 'Resolved') statusClass = 'inactive'; // Though filtered out

          let icon = '📝';
          if (issue.category === 'Infrastructure') icon = '🛣️';
          if (issue.category === 'Sanitation') icon = '🗑️';
          if (issue.category === 'Electricity') icon = '💡';
          if (issue.category === 'Water Supply') icon = '💧';

          return `
            <div class="issue-card" onclick="window.location.hash='#/citizen/track'">
              <div class="issue-card-icon" style="font-size: 20px;">${icon}</div>
              <div class="issue-card-content">
                <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${issue.title}</div>
                <div class="issue-card-meta">
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">${issue.location}</span>
                  <span class="flex items-center"><span class="status-dot ${statusClass}"></span> ${issue.status}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Render Recent Activity Timeline
    const timelineContainer = document.getElementById('recent-activity-container');
    if (timelineContainer) {
      // Create mock activity based on the issues
      let activities = [];
      myIssues.forEach(issue => {
        activities.push({
          title: `Report Submitted: ${issue.title}`,
          time: new Date(issue.reportedAt).toLocaleDateString() + ' ' + new Date(issue.reportedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isActive: issue.status === 'Under Review'
        });
        if (issue.status === 'In Progress' || issue.status === 'Resolved') {
           activities.push({
             title: `Work Started: ${issue.title}`,
             time: 'Recently',
             isActive: issue.status === 'In Progress'
           });
        }
        if (issue.status === 'Resolved') {
           activities.push({
             title: `Resolved: ${issue.title}`,
             time: 'Recently',
             isActive: true
           });
        }
      });
      
      // Take latest 3
      activities = activities.reverse().slice(0, 3);
      
      if (activities.length === 0) {
        timelineContainer.innerHTML = `<div class="body-md text-muted" style="margin-left: 20px;">No recent activity.</div>`;
      } else {
        timelineContainer.innerHTML = activities.map(act => `
          <div class="timeline-item ${act.isActive ? 'active' : ''}">
            <div class="timeline-content">
              <h4>${act.title}</h4>
              <p>${act.time}</p>
            </div>
          </div>
        `).join('');
      }
    }

  } catch (error) {
    console.error("Failed to load dashboard data", error);
  }
}
