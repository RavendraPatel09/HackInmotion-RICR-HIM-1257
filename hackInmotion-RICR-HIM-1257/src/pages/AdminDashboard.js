import { issueService } from '../services/issueService.js';
import { Icons } from '../utils/icons.js';

export function renderAdminDashboard() {
  return `
    <style>
      .metric-card {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        background: var(--surface-container-lowest);
        border: 1px solid var(--outline-variant);
        box-shadow: var(--elevation-1);
      }
      .admin-kpi-value {
        font-size: clamp(24px, 3vw, 32px);
        font-weight: 700;
        margin: var(--spacing-xs) 0;
        font-family: monospace;
      }
      
      .css-bar {
        height: 8px;
        border-radius: 4px;
        background: var(--surface-container-high);
        overflow: hidden;
        margin-top: 4px;
      }
      .css-bar-fill {
        height: 100%;
        border-radius: 4px;
      }

      /* Responsive Grids */
      .dashboard-kpi-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Mobile: 2 cols */
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
      }
      @media (min-width: 768px) {
        .dashboard-kpi-grid { grid-template-columns: repeat(3, 1fr); }
      }
      @media (min-width: 1024px) {
        .dashboard-kpi-grid { grid-template-columns: repeat(6, 1fr); }
      }

      .dashboard-layout-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
      }
      .dashboard-split-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }
      @media (min-width: 768px) {
        .dashboard-split-grid { grid-template-columns: 1fr 1fr; }
      }
    </style>

    <div class="mb-lg pb-xl page-enter" >
      <div class="mb-xl">
        <h2 class="headline-md m-0" style="color: var(--brand-navy);">Bhopal Civic Command Center</h2>
        <p class="body-md text-muted">Real-time overview of civic infrastructure and operations.</p>
      </div>

      <!-- KPI Grid -->
      <div class="dashboard-kpi-grid">
        <div class="metric-card metric-card--accent">
          <div class="caption text-muted font-weight-bold uppercase">Total Issues</div>
          <div class="admin-kpi-value" id="kpi-total">-</div>
        </div>
        <div class="metric-card metric-card--warning">
          <div class="caption text-muted font-weight-bold uppercase">Open Issues</div>
          <div class="admin-kpi-value" id="kpi-open" style="color: var(--warning);">-</div>
        </div>
        <div class="metric-card metric-card--success">
          <div class="caption text-muted font-weight-bold uppercase">Resolved</div>
          <div class="admin-kpi-value" id="kpi-resolved" style="color: var(--success);">-</div>
        </div>
        <div class="metric-card metric-card--error">
          <div class="caption text-muted font-weight-bold uppercase">Critical Issues</div>
          <div class="admin-kpi-value" id="kpi-critical" style="color: var(--error);">-</div>
        </div>
        <div class="metric-card" style="border-left: 4px solid var(--brand-green);">
          <div class="caption text-muted font-weight-bold uppercase">SLA Compliance</div>
          <div class="admin-kpi-value" id="kpi-sla">-</div>
        </div>
        <div class="metric-card" style="border-left: 4px solid #8b5cf6;">
          <div class="caption text-muted font-weight-bold uppercase">Avg Resolution</div>
          <div class="admin-kpi-value" id="kpi-avg-time">-</div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="dashboard-layout-grid">
        
        <!-- Desktop Grid Split -->
        <div class="dashboard-split-grid">
          
          <!-- Category Distribution -->
          <div class="card" style="padding: var(--spacing-md);">
            <h3 class="title-md mb-md">Category Distribution</h3>
            <div id="chart-categories" class="flex flex-column gap-sm">
               <!-- Injected via JS -->
            </div>
          </div>

          <!-- Department Performance -->
          <div class="card" style="padding: var(--spacing-md);">
            <h3 class="title-md mb-md">Department Workload</h3>
            <div id="chart-departments" class="flex flex-column gap-sm">
               <!-- Injected via JS -->
            </div>
          </div>

        <div class="dashboard-split-grid">
          
          <!-- Critical Issues -->
          <div class="card" style="padding: var(--spacing-md); border-color: var(--error);">
            <div class="flex justify-between items-center mb-md">
              <h3 class="title-md m-0" style="color: var(--error);">Action Required (Critical)</h3>
              <span class="badge badge-error" id="critical-count-badge">0</span>
            </div>
            <div id="list-critical" class="flex flex-column gap-sm">
               <!-- Injected via JS -->
            </div>
          </div>

          <!-- Hotspot Preview -->
          <div class="card" style="padding: var(--spacing-md);">
            <h3 class="title-md mb-md">Issue Hotspots</h3>
            <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--outline-variant); height: 180px; position: relative; margin-bottom: var(--spacing-sm);">
              <div style="height: 100%; background: #e2e8f0; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 15px 15px;">
                <div class="map-pin" style="top: 30%; left: 40%; background: var(--error); box-shadow: 0 0 0 8px rgba(220,38,38,0.2);"></div>
                <div class="map-pin" style="top: 60%; left: 70%; background: var(--warning); box-shadow: 0 0 0 6px rgba(217,119,6,0.2);"></div>
                <div class="map-pin" style="top: 50%; left: 20%; background: var(--brand-navy);"></div>
              </div>
            </div>
            <div id="list-hotspots" class="body-sm text-muted">
               <!-- Injected via JS -->
            </div>
          </div>

        </div>

        <!-- Recent Activity -->
        <div class="card" style="padding: var(--spacing-md);">
          <div class="flex justify-between items-center mb-md">
            <h3 class="title-md m-0">Recent Activity Feed</h3>
            <a href="#/admin/issues" class="btn btn-secondary" style="padding: var(--spacing-xs) var(--spacing-sm);">View All Queue</a>
          </div>
          <div id="list-recent" class="flex flex-column gap-md">
             <!-- Injected via JS -->
          </div>
        </div>

      </div>

    </div>
  `;
}

export async function initAdminDashboard() {
  try {
    const issues = await issueService.getIssues();
    
    // --- 1. Compute KPIs ---
    const total = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'Resolved' || i.status === 'Verified');
    const openIssues = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Verified');
    const criticalIssues = issues.filter(i => i.priority === 'High' && i.status !== 'Resolved');
    
    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-open').textContent = openIssues.length;
    document.getElementById('kpi-resolved').textContent = resolvedIssues.length;
    document.getElementById('kpi-critical').textContent = criticalIssues.length;
    document.getElementById('critical-count-badge').textContent = criticalIssues.length;

    // SLA & Avg Resolution (Mock math derived from actual mock data timestamps)
    let totalSlaPass = 0;
    let totalResolutionHours = 0;
    
    resolvedIssues.forEach(i => {
      // Since it's a mock frontend without actual resolution timestamps, 
      // we'll pretend they were resolved 2 hours ago from now for math purposes.
      const reportedAt = new Date(i.reportedAt).getTime();
      const resolvedAt = Date.now() - (2 * 60 * 60 * 1000); 
      
      const hoursDiff = (resolvedAt - reportedAt) / (1000 * 60 * 60);
      const safeHours = Math.max(1, Math.abs(hoursDiff)); // Prevent negatives if time math is weird
      
      totalResolutionHours += safeHours;
      
      const targetSla = i.priority === 'High' ? 24 : 48;
      if (safeHours <= targetSla) totalSlaPass++;
    });

    if (resolvedIssues.length > 0) {
      const slaPercent = Math.round((totalSlaPass / resolvedIssues.length) * 100);
      document.getElementById('kpi-sla').textContent = \`\${slaPercent}%\`;
      
      const avgTime = Math.round(totalResolutionHours / resolvedIssues.length);
      document.getElementById('kpi-avg-time').textContent = \`\${avgTime}h\`;
    } else {
      document.getElementById('kpi-sla').textContent = '100%';
      document.getElementById('kpi-avg-time').textContent = '0h';
    }

    // --- 2. Category Distribution ---
    const catCounts = {};
    issues.forEach(i => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    });
    
    let catHtml = '';
    const catMax = Math.max(...Object.values(catCounts), 1);
    for (const [cat, count] of Object.entries(catCounts)) {
      const pct = (count / catMax) * 100;
      catHtml += \`
        <div>
          <div class="flex justify-between caption mb-xs">
            <span>\${cat}</span>
            <span class="font-weight-bold">\${count}</span>
          </div>
          <div class="css-bar"><div class="css-bar-fill" style="width: \${pct}%; background: var(--brand-navy);"></div></div>
        </div>
      \`;
    }
    document.getElementById('chart-categories').innerHTML = catHtml || '<div class="caption text-muted">No data</div>';

    // --- 3. Department Performance (Mapping categories to Depts) ---
    const deptMap = {
      'Roads': 'PWD - Roads',
      'Infrastructure': 'PWD - Roads',
      'Sanitation': 'Solid Waste Mgmt',
      'Waste': 'Solid Waste Mgmt',
      'Electricity': 'Energy Board',
      'Water': 'Water Dept'
    };
    const deptCounts = {};
    issues.forEach(i => {
      const dept = deptMap[i.category] || 'General Services';
      if (i.status !== 'Resolved' && i.status !== 'Verified') {
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      }
    });

    let deptHtml = '';
    const deptMax = Math.max(...Object.values(deptCounts), 1);
    for (const [dept, count] of Object.entries(deptCounts)) {
      const pct = (count / deptMax) * 100;
      deptHtml += \`
        <div>
          <div class="flex justify-between caption mb-xs">
            <span>\${dept}</span>
            <span class="font-weight-bold text-error">\${count} open</span>
          </div>
          <div class="css-bar"><div class="css-bar-fill" style="width: \${pct}%; background: var(--warning);"></div></div>
        </div>
      \`;
    }
    document.getElementById('chart-departments').innerHTML = deptHtml || '<div class="caption text-muted">No open workloads</div>';

    // --- 4. Critical Issues List ---
    let critHtml = '';
    criticalIssues.slice(0, 3).forEach(i => {
      critHtml += \`
        <div class="card" style="padding: var(--spacing-sm); border-left: 3px solid var(--error); cursor: pointer;" onclick="window.location.hash='#/admin/issue/\${i.id}'">
          <div class="flex justify-between items-center mb-xs">
            <span class="badge badge-neutral">\${i.id}</span>
            <span class="caption text-error font-weight-bold">SLA Risk</span>
          </div>
          <div class="body-sm font-weight-bold">\${i.title}</div>
        </div>
      \`;
    });
    document.getElementById('list-critical').innerHTML = critHtml || '<div class="caption text-muted">No critical issues!</div>';

    // --- 5. Hotspots ---
    const locCounts = {};
    issues.forEach(i => {
      // Extract main zone for mock grouping (e.g. "MP Nagar Zone 1, Bhopal" -> "MP Nagar")
      const zone = i.location.split(',')[0].trim();
      locCounts[zone] = (locCounts[zone] || 0) + 1;
    });
    const sortedLocs = Object.entries(locCounts).sort((a,b) => b[1] - a[1]).slice(0, 2);
    let locHtml = sortedLocs.map(([loc, count]) => \`${Icons.location} \${loc} (\${count} reports)\`).join(' • ');
    document.getElementById('list-hotspots').innerHTML = locHtml || 'No location data.';

    // --- 6. Recent Activity ---
    let recentHtml = '';
    const recentSorted = [...issues].sort((a,b) => new Date(b.reportedAt) - new Date(a.reportedAt)).slice(0, 3);
    
    recentSorted.forEach(i => {
      let color = 'var(--brand-navy)';
      if (i.status === 'Resolved') color = 'var(--success)';
      if (i.priority === 'High') color = 'var(--error)';

      recentHtml += \`
        <div class="flex gap-md items-start" style="padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--outline-variant);">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: color-mix(in srgb, \${color} 15%, transparent); display: flex; align-items: center; justify-content: center; font-size: 16px;">
            📄
          </div>
          <div style="flex: 1;">
            <div class="flex justify-between mb-xs">
              <div class="body-md font-weight-bold">\${i.id} logged (\${i.category})</div>
              <div class="caption text-muted">\${new Date(i.reportedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            </div>
            <div class="caption text-muted" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">\${i.title}</div>
          </div>
        </div>
      \`;
    });
    document.getElementById('list-recent').innerHTML = recentHtml || '<div class="caption">No activity</div>';

  } catch (e) {
    console.error("Failed to render admin dashboard", e);
  }
}
