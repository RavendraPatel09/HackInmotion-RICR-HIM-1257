import { issueService } from '../services/issueService.js';
import { Icons } from '../utils/icons.js';

export function renderAdminIssues() {
  return `
    <style>
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
      }
      
      /* Responsive Table Setup */
      .desktop-view { display: none; }
      .mobile-view { display: block; }
      
      @media(min-width: 1024px) {
        .desktop-view { display: block; }
        .mobile-view { display: none; }
        .filters-grid { grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; }
      }

      /* Table Styles */
      .admin-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--surface-container-lowest);
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--elevation-1);
      }
      .admin-table th {
        background: var(--surface-container-low);
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: left;
        font-weight: 600;
        font-size: var(--font-size-caption);
        color: var(--on-surface-variant);
        text-transform: uppercase;
        border-bottom: 1px solid var(--outline-variant);
      }
      .admin-table td {
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--outline-variant);
        font-size: var(--font-size-body-sm);
      }
      .admin-table tr:last-child td { border-bottom: none; }
      .admin-table tr:hover { background: var(--surface-container-lowest-hover, #f8fafc); }
      
      .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
      }
    </style>

    <div class="mb-lg pb-xl page-enter" >
      <div class="flex items-center justify-between mb-lg page-enter" >
        <div>
          <h2 class="headline-md m-0">Issue Management</h2>
          <p class="body-sm text-muted">Global queue of civic complaints</p>
        </div>
        <button class="btn btn-primary" onclick="alert('Export functionality not implemented in frontend mock.')">Export CSV</button>
      </div>

      <!-- Filters -->
      <div class="card mb-lg" style="padding: var(--spacing-md);">
        <div class="filters-grid">
          <input type="text" id="filter-search" class="input" placeholder="Search ID, Title, Location..." />
          <select id="filter-status" class="select">
            <option value="">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Verified">Verified</option>
          </select>
          <select id="filter-category" class="select">
            <option value="">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Waste">Waste</option>
          </select>
          <select id="filter-priority" class="select">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select id="filter-dept" class="select">
            <option value="">All Departments</option>
            <option value="PWD">PWD (Roads/Infra)</option>
            <option value="SWM">Solid Waste Mgmt</option>
            <option value="EB">Electricity Board</option>
          </select>
          <select id="filter-date" class="select">
            <option value="">Any Date</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div id="issues-loading" class="flex justify-center items-center" style="height: 200px;">
        <span class="status-dot active" style="transform: scale(2);"></span>
      </div>

      <!-- Desktop Table View -->
      <div class="desktop-view" style="display: none;" id="desktop-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>Category</th>
              <th>Location</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>SLA</th>
              <th>Reported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="desktop-tbody">
            <!-- Injected via JS -->
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards View -->
      <div class="mobile-view flex flex-column gap-md" style="display: none;" id="mobile-container">
        <!-- Injected via JS -->
      </div>
      
      <!-- Empty State -->
      <div id="empty-state" class="empty-state" style="display: none;">
        <div class="empty-state-icon" style="font-size: 32px;">🔍</div>
        <div class="title-md">No issues found</div>
        <div class="body-sm text-muted">Try adjusting your filters</div>
      </div>

    </div>
  `;
}

export async function initAdminIssues() {
  const tbody = document.getElementById('desktop-tbody');
  const mobContainer = document.getElementById('mobile-container');
  const loading = document.getElementById('issues-loading');
  const desktopContainer = document.getElementById('desktop-container');
  const emptyState = document.getElementById('empty-state');
  
  let allIssues = [];

  // Helper mapping
  const getDept = (cat) => {
    if (['Roads', 'Infrastructure'].includes(cat)) return 'PWD';
    if (['Sanitation', 'Waste'].includes(cat)) return 'SWM';
    if (['Electricity'].includes(cat)) return 'EB';
    return 'General';
  };

  const getSlaStatus = (issue) => {
    if (issue.status === 'Resolved' || issue.status === 'Verified') {
      return '<span class="badge badge-success">Met</span>';
    }
    const reportedAt = new Date(issue.reportedAt).getTime();
    const hoursOpen = (Date.now() - reportedAt) / (1000 * 60 * 60);
    const limit = issue.priority === 'High' ? 24 : 48;
    
    if (hoursOpen > limit) return '<span class="badge badge-error">Breached</span>';
    if (hoursOpen > (limit * 0.75)) return '<span class="badge badge-warning">At Risk</span>';
    return '<span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">On Track</span>';
  };

  const renderIssues = () => {
    // 1. Get filter values
    const search = document.getElementById('filter-search').value.toLowerCase();
    const status = document.getElementById('filter-status').value;
    const category = document.getElementById('filter-category').value;
    const priority = document.getElementById('filter-priority').value;
    const dept = document.getElementById('filter-dept').value;
    const dateFilter = document.getElementById('filter-date').value;

    // 2. Filter array
    let filtered = allIssues.filter(i => {
      // Search (ID, Title, Location)
      if (search) {
        const str = `${i.id} ${i.title} ${i.location}`.toLowerCase();
        if (!str.includes(search)) return false;
      }
      
      // Selects
      if (status && i.status !== status) return false;
      if (category && i.category !== category) return false;
      if (priority && i.priority !== priority) return false;
      if (dept && getDept(i.category) !== dept) return false;
      
      // Date mock logic
      if (dateFilter) {
        const rDate = new Date(i.reportedAt);
        const now = new Date();
        const diffMs = now - rDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        if (dateFilter === 'today' && diffDays > 1) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
      }
      
      return true;
    });

    // 3. Render
    loading.style.display = 'none';
    
    if (filtered.length === 0) {
      desktopContainer.style.display = 'none';
      mobContainer.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    
    // Force CSS classes to apply by clearing inline display block logic for containers, 
    // relying purely on the media queries via the class names
    desktopContainer.style.display = ''; 
    mobContainer.style.display = '';

    // Render Desktop
    tbody.innerHTML = filtered.map(i => {
      let statusDot = 'active';
      if (i.status === 'Resolved' || i.status === 'Verified') statusDot = 'inactive';
      
      let pClass = 'priority-low';
      if (i.priority === 'High') pClass = 'priority-high';
      if (i.priority === 'Medium') pClass = 'priority-medium';

      return `
        <tr>
          <td class="font-monospace font-weight-bold">${i.id}</td>
          <td>
            <div class="font-weight-bold truncate" title="${i.title}">${i.title}</div>
          </td>
          <td>${i.category}</td>
          <td><div class="truncate text-muted" title="${i.location}">${i.location}</div></td>
          <td>${getDept(i.category)}</td>
          <td><span class="priority-indicator ${pClass}">${i.priority}</span></td>
          <td><span class="flex items-center gap-xs"><span class="status-dot ${statusDot}"></span> ${i.status}</span></td>
          <td>${getSlaStatus(i)}</td>
          <td class="text-muted">${new Date(i.reportedAt).toLocaleDateString()}</td>
          <td>
            <a href="#/admin/issue/${i.id}" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">View</a>
          </td>
        </tr>
      `;
    }).join('');

    // Render Mobile
    mobContainer.innerHTML = filtered.map(i => {
      let statusDot = 'active';
      if (i.status === 'Resolved' || i.status === 'Verified') statusDot = 'inactive';
      
      let pClass = 'priority-low';
      if (i.priority === 'High') pClass = 'priority-high';
      if (i.priority === 'Medium') pClass = 'priority-medium';

      return `
        <div class="card" style="padding: var(--spacing-md);" onclick="window.location.hash='#/admin/issue/${i.id}'">
          <div class="flex justify-between items-center mb-sm">
            <span class="badge badge-neutral font-monospace">${i.id}</span>
            <span class="flex items-center gap-xs caption"><span class="status-dot ${statusDot}"></span> ${i.status}</span>
          </div>
          <h3 class="title-md mb-xs">${i.title}</h3>
          <div class="body-sm text-muted mb-sm truncate">${Icons.location} ${i.location}</div>
          
          <div class="flex flex-wrap gap-xs mb-md">
            <span class="priority-indicator ${pClass}">${i.priority}</span>
            <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;">${i.category}</span>
            ${getSlaStatus(i)}
          </div>
          
          <div class="flex justify-between items-center" style="border-top: 1px solid var(--outline-variant); padding-top: var(--spacing-sm); margin-top: var(--spacing-xs);">
            <div class="caption text-muted">${new Date(i.reportedAt).toLocaleDateString()}</div>
            <div class="caption font-weight-bold" style="color: var(--brand-navy);">${getDept(i.category)}</div>
          </div>
        </div>
      `;
    }).join('');
  };

  try {
    allIssues = await issueService.getIssues();
    // Default sort: newest first
    allIssues.sort((a,b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    renderIssues();
  } catch (e) {
    loading.innerHTML = '<div class="text-error">Failed to load issues.</div>';
  }

  // Bind filters
  const inputs = ['filter-search', 'filter-status', 'filter-category', 'filter-priority', 'filter-dept', 'filter-date'];
  inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', renderIssues);
    document.getElementById(id).addEventListener('change', renderIssues);
  });
}
