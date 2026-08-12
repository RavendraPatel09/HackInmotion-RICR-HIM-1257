import { issueService } from '../services/issueService.js';

export function renderCitizenImpact() {
  return `
    <div class="mb-lg pb-xl" style="animation: fadeIn 0.4s ease;">
      <div class="flex items-center gap-md mb-lg">
        <a href="#/citizen" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
        <h2 class="headline-md m-0">My Civic Impact</h2>
      </div>

      <!-- Hero Impact Score -->
      <div class="card mb-xl" style="background: linear-gradient(135deg, var(--brand-navy), #0f172a); color: white; padding: var(--spacing-xl); text-align: center; border: none;">
        <div class="label-md mb-xs" style="color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px;">Overall Civic Impact Score</div>
        <div class="display-lg mb-sm" style="color: var(--brand-green); font-weight: 700; font-family: monospace;">845</div>
        <div class="body-md" style="color: rgba(255,255,255,0.9);">You are in the <strong>Top 5%</strong> of contributors in your ward.</div>
      </div>

      <!-- Stats Grid -->
      <h3 class="title-lg mb-md">Impact Metrics</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);">
        <div class="card" style="padding: var(--spacing-md);">
          <div class="display-sm" style="color: var(--brand-navy);">12</div>
          <div class="caption text-muted">Reports Submitted</div>
        </div>
        <div class="card" style="padding: var(--spacing-md);">
          <div class="display-sm" style="color: var(--success);">9</div>
          <div class="caption text-muted">Issues Resolved</div>
        </div>
        <div class="card" style="padding: var(--spacing-md);">
          <div class="display-sm" style="color: var(--warning);">4</div>
          <div class="caption text-muted">Issues Supported</div>
        </div>
        <div class="card" style="padding: var(--spacing-md);">
          <div class="display-sm" style="color: var(--brand-green);">~4.2k</div>
          <div class="caption text-muted">People Impacted</div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="mb-xl">
        <div class="flex justify-between items-end mb-md">
          <h3 class="title-lg m-0">Civic Contributions</h3>
          <span class="caption text-muted">3 Unlocked</span>
        </div>
        
        <div class="flex flex-column gap-sm">
          
          <div class="card flex gap-md items-center" style="padding: var(--spacing-md); border-left: 4px solid var(--brand-navy);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-sm); background: var(--surface-base); display: flex; align-items: center; justify-content: center; font-size: 24px;">
              👁️
            </div>
            <div style="flex: 1;">
              <div class="title-md m-0">Early Identifier</div>
              <div class="body-sm text-muted">Reported 5 critical issues before any other citizen.</div>
            </div>
            <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">Unlocked</span>
          </div>

          <div class="card flex gap-md items-center" style="padding: var(--spacing-md); border-left: 4px solid var(--success);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-sm); background: var(--surface-base); display: flex; align-items: center; justify-content: center; font-size: 24px;">
              ⏱️
            </div>
            <div style="flex: 1;">
              <div class="title-md m-0">Resolution Catalyst</div>
              <div class="body-sm text-muted">3 of your reports were resolved within the 48-hour SLA.</div>
            </div>
            <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">Unlocked</span>
          </div>

          <div class="card flex gap-md items-center" style="padding: var(--spacing-md); border-left: 4px solid var(--warning);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-sm); background: var(--surface-base); display: flex; align-items: center; justify-content: center; font-size: 24px;">
              🤝
            </div>
            <div style="flex: 1;">
              <div class="title-md m-0">Civic Supporter</div>
              <div class="body-sm text-muted">Supported 4 duplicate issues, prioritizing resources efficiently.</div>
            </div>
            <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">Unlocked</span>
          </div>

          <!-- Locked Milestone -->
          <div class="card flex gap-md items-center" style="padding: var(--spacing-md); border: 1px dashed var(--outline-variant); opacity: 0.6; background: transparent;">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-sm); background: transparent; border: 1px solid var(--outline-variant); display: flex; align-items: center; justify-content: center; font-size: 24px; filter: grayscale(1);">
              ⭐
            </div>
            <div style="flex: 1;">
              <div class="title-md m-0" style="color: var(--on-surface-variant);">Community Leader</div>
              <div class="body-sm text-muted">Verify 10 resolved issues in your local ward. (2/10)</div>
            </div>
            <span class="caption text-muted font-weight-bold">Locked</span>
          </div>

        </div>
      </div>

      <div style="height: 80px;"></div>
    </div>
  `;
}

export async function initCitizenImpact() {
  // Since we are strictly enforcing a professional, non-childish design,
  // there are no animations here other than the entry fade. The data is hardcoded mock data for demonstration,
  // but we can parse issueService here if we wanted to make it dynamic.
}
