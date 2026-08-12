import { issueService } from '../services/issueService.js';

export function renderCitizenIssues() {
  return `
    <div class="mb-lg">
      <div class="flex items-center gap-md mb-lg">
        <a href="#/citizen" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
        <h2 class="headline-md m-0">My Issues</h2>
      </div>

      <!-- Controls: Search, Filter, Sort -->
      <div class="flex flex-column gap-sm mb-lg">
        <div class="input-group" style="margin-bottom: 0;">
          <input type="text" id="issues-search" class="input" placeholder="Search by ID, title, or location..." />
        </div>
        <div class="flex gap-sm">
          <select id="issues-filter" class="select" style="flex: 1;">
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Supply">Water Supply</option>
          </select>
          <select id="issues-sort" class="select" style="flex: 1;">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs" id="issues-tabs" style="margin-bottom: var(--spacing-lg);">
        <div class="tab-item active" data-status="All">All</div>
        <div class="tab-item" data-status="Active">Active</div>
        <div class="tab-item" data-status="Resolved">Resolved</div>
        <div class="tab-item" data-status="Reopened">Reopened</div>
      </div>

      <!-- Issues List -->
      <div id="issues-list" class="flex flex-column gap-md">
        <!-- Skeleton Loader -->
        <div class="issue-card">
          <div class="skeleton" style="width: 48px; height: 48px; border-radius: var(--radius-sm);"></div>
          <div class="issue-card-content" style="width: 100%;">
            <div class="skeleton skeleton-text" style="width: 30%; margin-bottom: 4px;"></div>
            <div class="skeleton skeleton-text" style="width: 80%; margin-bottom: 4px;"></div>
            <div class="skeleton skeleton-text" style="width: 50%;"></div>
          </div>
        </div>
      </div>
      
      <div style="height: 80px;"></div> <!-- Mobile nav spacer -->
    </div>
  `;
}

export async function initCitizenIssues() {
  let allIssues = [];
  let currentTab = 'All';
  let currentSearch = '';
  let currentFilter = 'All';
  let currentSort = 'newest';

  const listContainer = document.getElementById('issues-list');

  const renderList = () => {
    let filtered = [...allIssues];

    // Apply Tab (Status)
    if (currentTab !== 'All') {
      if (currentTab === 'Active') {
        filtered = filtered.filter(i => i.status !== 'Resolved');
      } else {
        filtered = filtered.filter(i => i.status === currentTab);
      }
    }

    // Apply Category Filter
    if (currentFilter !== 'All') {
      filtered = filtered.filter(i => i.category === currentFilter);
    }

    // Apply Search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(i => 
        (i.id && i.id.toLowerCase().includes(q)) ||
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.location && i.location.toLowerCase().includes(q))
      );
    }

    // Apply Sort
    filtered.sort((a, b) => {
      if (currentSort === 'newest') return new Date(b.reportedAt) - new Date(a.reportedAt);
      if (currentSort === 'oldest') return new Date(a.reportedAt) - new Date(b.reportedAt);
      if (currentSort === 'priority') {
        const pMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      return 0;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state" style="padding: var(--spacing-2xl) var(--spacing-md);">
          <div class="empty-state-icon" style="font-size: 32px; margin-bottom: 8px;">📄</div>
          <div class="empty-state-title">No issues found</div>
          <div class="body-md text-muted">Try adjusting your filters or search.</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(issue => {
      // Determine styles based on issue data
      let statusClass = 'active';
      if (issue.status === 'Under Review') statusClass = 'inactive';
      if (issue.status === 'Resolved') statusClass = 'inactive';
      
      let priorityClass = 'priority-low';
      if (issue.priority === 'High') priorityClass = 'priority-high';
      if (issue.priority === 'Medium') priorityClass = 'priority-medium';

      let icon = '📝';
      if (issue.category === 'Roads' || issue.category === 'Infrastructure') icon = '🛣️';
      if (issue.category === 'Sanitation' || issue.category === 'Waste') icon = '🗑️';
      if (issue.category === 'Electricity') icon = '💡';
      if (issue.category === 'Water' || issue.category === 'Water Supply') icon = '💧';
      
      // Calculate progress (mock)
      let progress = 10; // Under Review
      if (issue.status === 'In Progress') progress = 50;
      if (issue.status === 'Resolved') progress = 100;

      const dateStr = new Date(issue.reportedAt).toLocaleDateString();

      // Using the exact existing .issue-card structure, injecting new data gracefully
      return `
        <div class="issue-card" onclick="window.location.hash='#/citizen/issue/${issue.id}'">
          <div class="issue-card-icon" style="font-size: 24px;">${icon}</div>
          <div class="issue-card-content">
            <!-- Top meta: ID & Date -->
            <div class="flex justify-between items-center mb-xs">
              <span class="badge badge-neutral" style="font-family: monospace;">${issue.id}</span>
              <span class="caption text-muted">${dateStr}</span>
            </div>
            
            <!-- Title -->
            <div style="font-weight: 700; color: var(--on-surface); margin-bottom: 2px;">${issue.title}</div>
            
            <!-- Mid meta: Category & Priority -->
            <div class="flex justify-between items-center mb-xs">
              <span class="caption" style="color: var(--brand-navy); font-weight: 600;">${issue.category}</span>
              <span class="priority-indicator ${priorityClass}">${issue.priority || 'Medium'}</span>
            </div>

            <!-- Existing meta layout: Location & Status -->
            <div class="issue-card-meta mb-sm">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">📍 ${issue.location}</span>
              <span class="flex items-center"><span class="status-dot ${statusClass}"></span> ${issue.status}</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  try {
    allIssues = await issueService.getIssues();
    renderList();
  } catch (e) {
    console.error("Failed to load issues", e);
    listContainer.innerHTML = `<div class="error-state"><div class="empty-state-title">Failed to load issues</div></div>`;
  }

  // --- Event Listeners ---
  const searchInput = document.getElementById('issues-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderList();
    });
  }

  const filterSelect = document.getElementById('issues-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderList();
    });
  }

  const sortSelect = document.getElementById('issues-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderList();
    });
  }

  const tabs = document.querySelectorAll('#issues-tabs .tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-status');
      renderList();
    });
  });
}
