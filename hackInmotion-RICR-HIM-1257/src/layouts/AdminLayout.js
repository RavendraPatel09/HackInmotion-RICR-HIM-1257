export function renderAdminLayout(contentHtml, activeRoute = '/admin') {
  return `
    <div class="app-shell admin-shell">
      
      <!-- Desktop Sidebar -->
      <aside class="sidebar" id="admin-sidebar">
        <div class="flex justify-between items-center mb-lg page-enter" >
          <div class="sidebar-logo" style="margin-bottom: 0;">Civic Admin</div>
          <button class="btn-icon md:hidden" id="close-sidebar-btn" style="color: white;">✕</button>
        </div>
        
        <nav class="sidebar-nav">
          <a href="#/admin" class="sidebar-link ${activeRoute === '/admin' ? 'active' : ''}">Dashboard</a>
          <a href="#/admin/issues" class="sidebar-link ${activeRoute === '/admin/issues' ? 'active' : ''}">Manage Issues</a>
          <a href="#/admin/map" class="sidebar-link ${activeRoute === '/admin/map' ? 'active' : ''}">Command Map</a>
          <a href="#/admin/analytics" class="sidebar-link ${activeRoute === '/admin/analytics' ? 'active' : ''}">Analytics</a>
          <a href="#/admin/hotspots" class="sidebar-link ${activeRoute === '/admin/hotspots' ? 'active' : ''}">Hotspots</a>
          <a href="#/admin/sla" class="sidebar-link ${activeRoute === '/admin/sla' ? 'active' : ''}">SLA Tracking</a>
          <a href="#/admin/settings" class="sidebar-link ${activeRoute === '/admin/settings' ? 'active' : ''}">Settings</a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <div style="flex-grow: 1; display: flex; flex-direction: column; width: 100%; overflow-x: hidden;">
        
        <!-- Admin Header -->
        <header class="topbar">
          <div class="flex items-center gap-md">
            <!-- Hamburger for Mobile Nav -->
            <button class="btn-icon md:hidden" id="open-sidebar-btn" style="background: transparent; border: none; font-size: 20px;">☰</button>
            <div class="hidden md:block font-weight-bold">Smart Bhopal Command Center</div>
          </div>

          <div class="flex items-center gap-md">
            <!-- Notification Entry -->
            <div class="dropdown">
              <button class="btn-icon" style="position: relative; background: transparent; border: none;">
                🔔
                <span class="status-dot active" style="position: absolute; top: 4px; right: 4px; background-color: var(--error);"></span>
              </button>
              <div class="dropdown-menu" style="width: 300px; right: 0;">
                <div class="dropdown-item"><strong>Critical:</strong> Water main break in Zone 3</div>
                <div class="dropdown-item"><strong>Escalated:</strong> 15 pending issues > 48hrs</div>
              </div>
            </div>

            <!-- Profile Menu -->
            <div class="dropdown">
              <div class="flex items-center gap-sm cursor-pointer" style="padding: 4px 8px; border-radius: var(--radius-pill); border: 1px solid var(--outline-variant);">
                <div style="width: 24px; height: 24px; background: var(--brand-navy); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">A</div>
                <span class="label-md hidden md:block">Admin User ▼</span>
              </div>
              <div class="dropdown-menu">
                <a href="#/admin/profile" class="dropdown-item">Admin Profile</a>
                <div style="height: 1px; background: var(--outline-variant); margin: 4px 0;"></div>
                <a href="#/" class="dropdown-item" style="color: var(--error);">Logout</a>
              </div>
            </div>
          </div>
        </header>

        <!-- Router View -->
        <main class="main-content" style="padding-bottom: 0;">
          <div class="page-content" id="router-view" style="max-width: 1200px;">
            ${contentHtml}
          </div>
        </main>
      </div>
      
      <!-- Mobile Sidebar Overlay -->
      <div class="drawer-overlay" id="mobile-sidebar-overlay" style="z-index: 100;"></div>
    </div>
  `;
}

// Export initialization logic for the admin sidebar toggle
export function initAdminLayout() {
  const openBtn = document.getElementById('open-sidebar-btn');
  const closeBtn = document.getElementById('close-sidebar-btn');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('mobile-sidebar-overlay');

  if (openBtn && sidebar && overlay) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-active');
      overlay.classList.add('active');
    });
  }

  if (closeBtn && sidebar && overlay) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-active');
      overlay.classList.remove('active');
    });
  }
}
