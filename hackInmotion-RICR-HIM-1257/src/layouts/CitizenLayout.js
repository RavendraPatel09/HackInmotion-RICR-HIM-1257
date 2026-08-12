export function renderCitizenLayout(contentHtml, activeRoute = '/citizen') {
  return `
    <div class="app-shell" style="flex-direction: column;">
      
      <!-- Citizen Header & Desktop Nav -->
      <header class="topbar">
        <div class="flex items-center gap-lg">
          <div class="sidebar-logo" style="margin-bottom: 0;">Smart Bhopal</div>
          
          <!-- Desktop Navigation -->
          <nav class="hidden md:flex gap-md">
            <a href="#/citizen" class="tab-item ${activeRoute === '/citizen' ? 'active' : ''}">Dashboard</a>
            <a href="#/citizen/report" class="tab-item ${activeRoute === '/citizen/report' ? 'active' : ''}">Report</a>
            <a href="#/citizen/track" class="tab-item ${activeRoute === '/citizen/track' ? 'active' : ''}">Track</a>
          </nav>
        </div>

        <div class="flex items-center gap-md">
          <!-- Notification Entry -->
          <div class="dropdown">
            <button class="btn-icon" style="position: relative; background: transparent; border: none;">
              🔔
              <span class="status-dot active" style="position: absolute; top: 4px; right: 4px;"></span>
            </button>
            <div class="dropdown-menu" style="width: 250px; right: 0;">
              <div class="dropdown-item"><strong>Issue BH-10241</strong> updated</div>
              <div class="dropdown-item">New civic poll available</div>
            </div>
          </div>

          <!-- Profile Menu -->
          <div class="dropdown">
            <button class="btn btn-secondary" style="border-radius: var(--radius-pill); padding: var(--spacing-xs) var(--spacing-md);">
              Rajesh K. ▼
            </button>
            <div class="dropdown-menu">
              <a href="#/citizen/profile" class="dropdown-item">My Profile</a>
              <a href="#/citizen/settings" class="dropdown-item">Settings</a>
              <div style="height: 1px; background: var(--outline-variant); margin: 4px 0;"></div>
              <a href="#/" class="dropdown-item" style="color: var(--error);">Logout</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="page-content" id="router-view">
          ${contentHtml}
        </div>
      </main>

      <!-- Mobile Navigation -->
      <nav class="mobile-nav">
        <a href="#/citizen" class="mobile-nav-item ${activeRoute === '/citizen' ? 'active' : ''}">
          <span style="font-size: 20px;">🏠</span>
          <span>Home</span>
        </a>
        <a href="#/citizen/report" class="mobile-nav-item ${activeRoute === '/citizen/report' ? 'active' : ''}">
          <span style="font-size: 20px;">+</span>
          <span>Report</span>
        </a>
        <a href="#/citizen/track" class="mobile-nav-item ${activeRoute === '/citizen/track' ? 'active' : ''}">
          <span style="font-size: 20px;">📍</span>
          <span>Track</span>
        </a>
      </nav>
    </div>
  `;
}
