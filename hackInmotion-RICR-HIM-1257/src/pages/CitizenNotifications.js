import { notificationService } from '../services/notificationService.js';

export function renderCitizenNotifications() {
  return `
    <div class="mb-lg pb-xl">
      <div class="flex items-center justify-between mb-lg">
        <div class="flex items-center gap-md">
          <a href="#/citizen" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
          <h2 class="headline-md m-0">Notifications</h2>
        </div>
        <button class="btn btn-secondary" id="btn-mark-all" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-size-caption);">Mark all as read</button>
      </div>

      <!-- Notifications List -->
      <div id="notifications-list" class="flex flex-column gap-sm">
        <!-- Skeleton Loaders -->
        <div class="card flex gap-md items-start" style="padding: var(--spacing-md);">
          <div class="skeleton" style="width: 40px; height: 40px; border-radius: 50%;"></div>
          <div style="flex: 1;">
            <div class="skeleton skeleton-text" style="width: 50%; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text" style="width: 90%; margin-bottom: 4px;"></div>
            <div class="skeleton skeleton-text" style="width: 30%;"></div>
          </div>
        </div>
      </div>
      
      <div style="height: 80px;"></div>
    </div>
  `;
}

export async function initCitizenNotifications() {
  const listContainer = document.getElementById('notifications-list');
  const btnMarkAll = document.getElementById('btn-mark-all');

  const getIconForType = (type) => {
    switch(type) {
      case 'Issue submitted': return '✅';
      case 'Issue acknowledged': return '👀';
      case 'Issue assigned': return '👤';
      case 'Issue in progress': return '🚧';
      case 'Issue resolved': return '🎉';
      case 'Verification requested': return '❓';
      case 'Issue reopened': return '🔄';
      case 'Duplicate detected': return '⚠️';
      case 'SLA warning': return '⏳';
      default: return '🔔';
    }
  };

  const getColorForType = (type) => {
    switch(type) {
      case 'Issue resolved': return 'var(--success)';
      case 'SLA warning': return 'var(--error)';
      case 'Verification requested':
      case 'Duplicate detected': return 'var(--warning)';
      case 'Issue in progress': return 'var(--brand-green)';
      default: return 'var(--brand-navy)';
    }
  };

  const renderList = (notifs) => {
    if (notifs.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" style="font-size: 32px;">📭</div>
          <div class="body-md text-muted">You have no notifications.</div>
        </div>
      `;
      btnMarkAll.style.display = 'none';
      return;
    }

    const unreadCount = notifs.filter(n => !n.isRead).length;
    btnMarkAll.disabled = unreadCount === 0;

    listContainer.innerHTML = notifs.map(n => {
      const icon = getIconForType(n.type);
      const color = getColorForType(n.type);
      
      const unreadBadge = !n.isRead ? `<span class="status-dot active" style="margin-right: 8px;"></span>` : '';
      const bgStyle = !n.isRead ? `background: var(--surface-container-low); border-left: 4px solid ${color}; border-top-left-radius: 0; border-bottom-left-radius: 0;` : '';

      return `
        <div class="card notif-card flex gap-md items-start" style="padding: var(--spacing-md); cursor: pointer; transition: background 0.2s; ${bgStyle}" data-id="${n.id}" data-issue="${n.issueId}">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: color-mix(in srgb, ${color} 15%, transparent); display: flex; align-items: center; justify-content: center; font-size: 20px;">
            ${icon}
          </div>
          <div style="flex: 1;">
            <div class="flex items-center justify-between mb-xs">
              <h4 class="title-md m-0 flex items-center" style="font-weight: ${!n.isRead ? '700' : '600'};">
                ${unreadBadge}${n.title}
              </h4>
              <span class="caption text-muted" style="white-space: nowrap;">
                ${new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <p class="body-md text-muted m-0" style="color: ${!n.isRead ? 'var(--on-surface)' : 'var(--on-surface-variant)'};">${n.message}</p>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    document.querySelectorAll('.notif-card').forEach(card => {
      card.addEventListener('click', async () => {
        const id = card.getAttribute('data-id');
        const issueId = card.getAttribute('data-issue');
        
        // Mark as read in background
        await notificationService.markAsRead(id);
        
        // Navigate to the relevant issue
        if (issueId) {
          window.location.hash = `#/citizen/issue/${issueId}`;
        }
      });
    });
  };

  try {
    const notifs = await notificationService.getNotifications();
    renderList(notifs);
  } catch (e) {
    listContainer.innerHTML = '<div class="body-md text-error">Failed to load notifications.</div>';
  }

  btnMarkAll.addEventListener('click', async () => {
    btnMarkAll.innerHTML = 'Marking...';
    btnMarkAll.disabled = true;
    try {
      const updated = await notificationService.markAllAsRead();
      renderList(updated);
      btnMarkAll.innerHTML = 'Mark all as read';
    } catch (e) {
      btnMarkAll.innerHTML = 'Error';
    }
  });
}
