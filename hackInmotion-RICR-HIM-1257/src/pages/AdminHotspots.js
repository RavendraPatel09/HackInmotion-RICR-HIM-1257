import { issueService } from '../services/issueService.js';

export function renderAdminHotspots() {
  return `
    <div class="mb-lg pb-xl" style="animation: fadeIn 0.4s ease;">
      <div class="flex items-center justify-between mb-lg">
        <div>
          <h2 class="headline-md m-0">Civic Hotspots</h2>
          <p class="body-sm text-muted">Identify recurring issue clusters and systemic failures.</p>
        </div>
        <button class="btn btn-secondary" onclick="window.location.hash='#/admin/map'">View on Map</button>
      </div>

      <!-- Loading State -->
      <div id="hotspots-loading" class="flex justify-center items-center" style="height: 200px;">
        <span class="status-dot active" style="transform: scale(2);"></span>
      </div>

      <!-- Hotspots Content -->
      <div id="hotspots-content" style="display: none;">
        <div class="card table-responsive" style="padding: 0;">
          <table class="w-full text-left" style="border-collapse: collapse;">
            <thead style="background: var(--surface-container-low);">
              <tr>
                <th class="caption text-muted uppercase p-md">Location / Ward</th>
                <th class="caption text-muted uppercase p-md">Recurring Category</th>
                <th class="caption text-muted uppercase p-md">Issue Count</th>
                <th class="caption text-muted uppercase p-md">Severity</th>
                <th class="caption text-muted uppercase p-md">Trend (30d)</th>
                <th class="caption text-muted uppercase p-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="hotspots-tbody">
              <!-- Injected via JS -->
            </tbody>
          </table>
        </div>
        
        <div id="hotspots-empty" class="empty-state" style="display: none;">
          <div class="empty-state-icon" style="font-size: 32px;">🌟</div>
          <div class="title-md">No Hotspots Detected</div>
          <div class="body-sm text-muted">Issue density is currently below the threshold.</div>
        </div>
      </div>
    </div>
  `;
}

export async function initAdminHotspots() {
  const loading = document.getElementById('hotspots-loading');
  const content = document.getElementById('hotspots-content');
  const tbody = document.getElementById('hotspots-tbody');
  const empty = document.getElementById('hotspots-empty');

  if (!loading || !content) return;

  const getWard = (loc) => loc.split(',')[0].trim().substring(0, 20);

  // Deterministic mock trend
  const getTrend = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const val = (Math.abs(hash) % 40) - 10; // -10 to +30
    if (val > 0) return { text: \`+\${val}%\`, color: 'var(--error)', icon: '↑' };
    if (val < 0) return { text: \`\${val}%\`, color: 'var(--success)', icon: '↓' };
    return { text: '0%', color: 'var(--text-muted)', icon: '→' };
  };

  try {
    const issues = await issueService.getIssues();
    
    // Group logic
    const clusterMap = {};
    issues.forEach(i => {
      // Only count unresolved issues for current hotspots
      if (['Resolved', 'Verified', 'Closed'].includes(i.status)) return;
      
      const ward = getWard(i.location);
      const key = \`\${ward}||\${i.category}\`;
      
      if (!clusterMap[key]) {
        clusterMap[key] = {
          location: ward,
          category: i.category,
          count: 0,
          hasHighPriority: false
        };
      }
      
      clusterMap[key].count++;
      if (i.priority === 'High') clusterMap[key].hasHighPriority = true;
    });

    const hotspots = Object.values(clusterMap)
      .filter(c => c.count >= 2)
      .sort((a,b) => b.count - a.count);

    loading.style.display = 'none';
    content.style.display = 'block';

    if (hotspots.length === 0) {
      document.querySelector('.card').style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    tbody.innerHTML = hotspots.map(h => {
      const trend = getTrend(h.location + h.category);
      const sevClass = h.hasHighPriority ? 'priority-high' : 'priority-medium';
      const sevText = h.hasHighPriority ? 'Critical' : 'Elevated';
      
      return \`
        <tr style="border-bottom: 1px solid var(--outline-variant);">
          <td class="p-md font-weight-bold" style="color: var(--on-surface);">\${h.location}</td>
          <td class="p-md"><span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">\${h.category}</span></td>
          <td class="p-md">
            <div class="flex items-center gap-xs">
              <span style="font-size: 16px; font-weight: 800; color: \${h.count >= 5 ? 'var(--error)' : 'var(--warning)'};">\${h.count}</span>
              <span class="caption text-muted">Active</span>
            </div>
          </td>
          <td class="p-md"><span class="priority-indicator \${sevClass}">\${sevText}</span></td>
          <td class="p-md font-weight-bold" style="color: \${trend.color};">\${trend.icon} \${trend.text}</td>
          <td class="p-md text-right">
            <a href="#/admin/issues" class="btn btn-secondary" style="padding: 4px 12px; font-size: 12px;">Investigate</a>
          </td>
        </tr>
      \`;
    }).join('');

  } catch (e) {
    loading.innerHTML = '<div class="text-error">Failed to load hotspot data.</div>';
    console.error(e);
  }
}
