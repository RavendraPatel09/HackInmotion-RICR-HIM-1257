const STORAGE_KEY = 'smart_bhopal_notifications';

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'SLA warning',
    title: 'SLA Warning: Issue BH-10198',
    message: 'Resolution for "Streetlight not working" is approaching its 48hr SLA deadline.',
    isRead: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    issueId: 'BH-10198'
  },
  {
    id: 'notif-2',
    type: 'Verification requested',
    title: 'Action Required: Verification',
    message: 'The municipal team has resolved BH-10200. Please verify if the issue was actually fixed.',
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    issueId: 'BH-10200'
  },
  {
    id: 'notif-3',
    type: 'Issue resolved',
    title: 'Issue Resolved',
    message: 'Good news! Your report BH-10211 "Garbage overflow" has been resolved.',
    isRead: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    issueId: 'BH-10211'
  },
  {
    id: 'notif-4',
    type: 'Issue in progress',
    title: 'Work Started',
    message: 'The PWD team is currently working on BH-10241.',
    isRead: true,
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    issueId: 'BH-10241'
  },
  {
    id: 'notif-5',
    type: 'Issue assigned',
    title: 'Issue Assigned',
    message: 'BH-10241 has been assigned to the PWD Roads Division.',
    isRead: true,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    issueId: 'BH-10241'
  },
  {
    id: 'notif-6',
    type: 'Issue acknowledged',
    title: 'Issue Acknowledged',
    message: 'The authorities have acknowledged your report BH-10241.',
    isRead: true,
    timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    issueId: 'BH-10241'
  },
  {
    id: 'notif-7',
    type: 'Issue submitted',
    title: 'Report Submitted Successfully',
    message: 'Thank you. Your report BH-10241 has been logged.',
    isRead: true,
    timestamp: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    issueId: 'BH-10241'
  },
  {
    id: 'notif-8',
    type: 'Issue reopened',
    title: 'Issue Reopened',
    message: 'You have successfully reopened BH-10155. The team has been notified.',
    isRead: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    issueId: 'BH-10155'
  },
  {
    id: 'notif-9',
    type: 'Duplicate detected',
    title: 'Duplicate Detected',
    message: 'We noticed a similar issue to your draft. You chose to support the existing issue.',
    isRead: true,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    issueId: 'BH-10088'
  }
];

function initStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async getNotifications() {
    initStorage();
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  },

  async getUnreadCount() {
    const notifs = await this.getNotifications();
    return notifs.filter(n => !n.isRead).length;
  },

  async markAsRead(id) {
    initStorage();
    await delay(200);
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
      notifs[index].isRead = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    }
    return notifs;
  },

  async markAllAsRead() {
    initStorage();
    await delay(400);
    let notifs = JSON.parse(localStorage.getItem(STORAGE_KEY));
    notifs = notifs.map(n => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    return notifs;
  },

  async addNotification(payload) {
    initStorage();
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: payload.type || 'System',
      title: payload.title,
      message: payload.message,
      isRead: false,
      timestamp: new Date().toISOString(),
      issueId: payload.issueId || null
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    
    // Dispatch a custom event so the UI can update the bell icon real-time
    window.dispatchEvent(new CustomEvent('notification-added'));
    return newNotif;
  }
};
