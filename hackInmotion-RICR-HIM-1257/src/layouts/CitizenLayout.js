import { notificationService } from '../services/notificationService.js';

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
          <a href="#/citizen/notifications" class="btn-icon" style="position: relative; background: transparent; border: none; text-decoration: none;">
            🔔
            <span class="status-dot active" id="citizen-nav-notif-dot" style="position: absolute; top: 4px; right: 4px; display: none;"></span>
          </a>

          <!-- Profile Menu -->
          <div class="dropdown">
            <button class="btn btn-secondary" style="border-radius: var(--radius-pill); padding: var(--spacing-xs) var(--spacing-md);">
              Rajesh K. ▼
            </button>
            <div class="dropdown-menu">
              <a href="#/citizen/profile" class="dropdown-item">My Profile</a>
              <a href="#/citizen/impact" class="dropdown-item">My Civic Impact</a>
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

export async function initCitizenLayout() {
  const dot = document.getElementById('citizen-nav-notif-dot');
  if (dot) {
    try {
      const unreadCount = await notificationService.getUnreadCount();
      if (unreadCount > 0) {
        dot.style.display = 'block';
      } else {
        dot.style.display = 'none';
      }
    } catch (e) {
      console.error(e);
    }
  }
}
