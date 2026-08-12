import { Icons } from '../utils/icons.js';
export function renderBlankPage(title, description) {
  return `
    <div class="mb-lg page-enter" >
      <h2 class="headline-md">${title}</h2>
      <p class="body-md text-muted">${description}</p>
    </div>
    
    <div class="empty-state page-enter" >
      <div class="empty-state-icon page-enter" >${Icons.building}</div>
      <div class="empty-state-title page-enter" >Page Under Construction</div>
      <div class="empty-state-desc page-enter" >This is a placeholder page to demonstrate layout consistency.</div>
    </div>
  `;
}
