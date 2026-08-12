export function renderBlankPage(title, description) {
  return `
    <div class="mb-lg">
      <h2 class="headline-md">${title}</h2>
      <p class="body-md text-muted">${description}</p>
    </div>
    
    <div class="empty-state">
      <div class="empty-state-icon">🏗️</div>
      <div class="empty-state-title">Page Under Construction</div>
      <div class="empty-state-desc">This is a placeholder page to demonstrate layout consistency.</div>
    </div>
  `;
}
