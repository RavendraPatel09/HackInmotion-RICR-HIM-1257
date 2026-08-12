import { Icons } from '../utils/icons.js';
export function renderDuplicateDetectionPanel(matchData) {
  if (!matchData) return '';

  return `
    <div class="duplicate-detection-panel" id="duplicate-panel" >
      <div class="card" style="border: 2px solid var(--warning); padding: 0; overflow: hidden;">
        
        <div style="background: color-mix(in srgb, var(--warning) 10%, transparent); padding: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm); border-bottom: 1px solid var(--outline-variant);">
          <span style="font-size: 24px;">${Icons.warning}</span>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #8a5a00;">Possible Duplicate Detected</div>
            <div class="caption" style="color: #8a5a00;">${matchData.similarity}% similarity to your draft</div>
          </div>
        </div>

        <div style="padding: var(--spacing-md);">
          <div class="issue-card" style="margin-bottom: var(--spacing-md); cursor: default;">
            <div class="issue-card-icon" style="background: var(--surface-base);">📝</div>
            <div class="issue-card-content">
              <div class="flex justify-between items-center">
                <span class="badge badge-neutral mb-xs">${matchData.issue.id}</span>
                <span class="caption text-muted">${matchData.timeAgo}</span>
              </div>
              <div style="font-weight: 600;">${matchData.issue.title}</div>
              <div class="issue-card-meta">
                <span>${Icons.location} ${matchData.distance}</span>
                <span class="flex items-center"><span class="status-dot inactive"></span> ${matchData.issue.status}</span>
              </div>
            </div>
          </div>

          <p class="body-md text-muted mb-lg text-center page-enter" >
            If this is the same issue, you can support it to boost its priority instead of filing a duplicate.
          </p>

          <div class="flex flex-column gap-sm">
            <button class="btn btn-primary" id="btn-support-duplicate" style="width: 100%; justify-content: center;">
              👍 Support Existing Issue
            </button>
            <div class="flex gap-sm">
              <button class="btn btn-secondary" id="btn-view-duplicate" style="flex: 1; justify-content: center;">
                View Details
              </button>
              <button class="btn btn-secondary" id="btn-report-separately" style="flex: 1; justify-content: center; border-color: transparent; color: var(--on-surface-variant);">
                Report Separately
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
