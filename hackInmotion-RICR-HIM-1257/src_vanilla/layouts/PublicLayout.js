export function renderPublicLayout(contentHtml) {
  return `
    <div class="app-shell" style="flex-direction: column;">
      <!-- Public Header & Navigation -->
      <header class="topbar" style="border-bottom: 1px solid var(--outline-variant); box-shadow: none;">
        <div class="flex items-center gap-md">
          <div class="sidebar-logo" style="margin-bottom: 0;">Smart Bhopal</div>
          <nav class="hidden md:flex gap-md" style="margin-left: var(--spacing-xl);">
            <a href="#/" class="tab-item active">Home</a>
            <a href="#/" class="tab-item">About</a>
            <a href="#/" class="tab-item">Services</a>
          </nav>
        </div>
        <div class="flex gap-sm items-center">
          <a href="#/login" class="btn btn-secondary">Login</a>
          <a href="#/register" class="btn btn-primary">Sign Up</a>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content" style="padding-bottom: 0;">
        <div class="page-content" id="router-view" style="flex-grow: 1;">
          ${contentHtml}
        </div>
      </main>

      <!-- Public Footer -->
      <footer style="background-color: var(--surface-base); padding: var(--spacing-2xl) var(--spacing-lg); margin-top: auto; border-top: 1px solid var(--outline-variant);">
        <div class="container flex justify-between items-center" style="max-width: 1200px;">
          <div>
            <div class="headline-md mb-sm">Smart Bhopal Civic Connect</div>
            <p class="body-md text-muted">Empowering citizens for a better city.</p>
          </div>
          <div class="flex gap-md">
            <a href="#/" class="body-md">Privacy Policy</a>
            <a href="#/" class="body-md">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}
