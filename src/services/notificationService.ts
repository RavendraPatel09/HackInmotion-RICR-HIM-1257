export type NotificationType =
  | 'report_created'
  | 'department_assigned'
  | 'status_changed'
  | 'issue_resolved'
  | 'issue_reopened'
  | 'sla_warning'
  | 'upvote_received'
  | 'hotspot_alert';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  issueId?: string;
  trackingId?: string;
}

const STORAGE_KEY = 'cityfix_notifications';

const INITIAL_MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'SLA Escalation Alert',
    message: 'Report CFX-2026-3B19 (Garbage Dump Overflow) has exceeded 72 hours SLA threshold.',
    type: 'sla_warning',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    issueId: 'iss-bpl-02',
    trackingId: 'CFX-2026-3B19',
  },
  {
    id: 'notif-02',
    title: 'Work Order Dispatched',
    message: 'Roads & Infrastructure team dispatched cold-mix asphalt batch for CFX-2026-8A72.',
    type: 'status_changed',
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    read: false,
    issueId: 'iss-bpl-01',
    trackingId: 'CFX-2026-8A72',
  },
  {
    id: 'notif-03',
    title: 'Community Priority Boost',
    message: 'Your report CFX-2026-8A72 received 34 upvotes from citizens in MP Nagar.',
    type: 'upvote_received',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    read: true,
    issueId: 'iss-bpl-01',
    trackingId: 'CFX-2026-8A72',
  },
  {
    id: 'notif-04',
    title: 'Issue Verification Completed',
    message: 'Citizen confirmed resolution for CFX-2026-4E12 (Shahpura Sewage Drain Overflow).',
    type: 'issue_resolved',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    issueId: 'iss-bpl-06',
    trackingId: 'CFX-2026-4E12',
  },
];

export function getNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
      return INITIAL_MOCK_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_NOTIFICATIONS;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
    return INITIAL_MOCK_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}

export function addNotificationToStorage(
  title: string,
  message: string,
  type: NotificationType,
  issueId?: string,
  trackingId?: string
): AppNotification[] {
  const current = getNotifications();
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    issueId,
    trackingId,
  };

  const updated = [newNotif, ...current];
  saveNotifications(updated);
  return updated;
}

export function markNotificationAsRead(id: string): AppNotification[] {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
  return updated;
}

export function markAllNotificationsAsRead(): AppNotification[] {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
}

export function clearNotificationsFromStorage(): AppNotification[] {
  saveNotifications([]);
  return [];
}
