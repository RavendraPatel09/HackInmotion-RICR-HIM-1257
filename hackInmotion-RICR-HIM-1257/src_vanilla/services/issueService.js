import { MOCK_ISSUES } from './mockData.js';
import { notificationService } from './notificationService.js';

const STORAGE_KEY = 'smart_bhopal_issues';

// Initialize storage with mock data if empty
function initStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ISSUES));
  }
}

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const issueService = {
  
  async getIssues() {
    initStorage();
    await delay(600); // Simulate network
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  },
  
  async getIssue(id) {
    initStorage();
    await delay(400);
    const issues = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const issue = issues.find(i => i.id === id);
    if (!issue) throw new Error("Issue not found");
    return issue;
  },
  
  async createIssue(data) {
    initStorage();
    await delay(800);
    const issues = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const newId = `BH-${10000 + Math.floor(Math.random() * 9000)}`;
    const newIssue = {
      ...data,
      id: newId,
      status: "Under Review",
      reportedAt: new Date().toISOString()
    };
    issues.unshift(newIssue);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    
    // Trigger Notification
    notificationService.addNotification({
      type: 'Issue submitted',
      title: 'Report Submitted Successfully',
      message: `Thank you. Your report ${newId} has been logged and is under review.`,
      issueId: newId
    });
    
    return newIssue;
  },
  
  async updateIssue(id, updateData) {
    initStorage();
    await delay(600);
    const issues = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) throw new Error("Issue not found");
    
    const oldStatus = issues[index].status;
    issues[index] = { ...issues[index], ...updateData };
    const newStatus = issues[index].status;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    
    // Handle Notification Triggers based on state transitions
    if (oldStatus !== newStatus) {
      if (newStatus === 'Acknowledged') {
        notificationService.addNotification({
          type: 'Issue acknowledged',
          title: 'Issue Acknowledged',
          message: `The authorities have acknowledged your report ${id}.`,
          issueId: id
        });
      } else if (newStatus === 'Assigned') {
        notificationService.addNotification({
          type: 'Issue assigned',
          title: 'Issue Assigned',
          message: `${id} has been assigned to the relevant department.`,
          issueId: id
        });
      } else if (newStatus === 'In Progress') {
        notificationService.addNotification({
          type: 'Issue in progress',
          title: 'Work Started',
          message: `The team is currently working on resolving ${id}.`,
          issueId: id
        });
      } else if (newStatus === 'Resolved') {
        notificationService.addNotification({
          type: 'Verification requested',
          title: 'Action Required: Verification',
          message: `The municipal team has marked ${id} as resolved. Please verify if the issue was actually fixed.`,
          issueId: id
        });
      } else if (newStatus === 'Verified') {
        notificationService.addNotification({
          type: 'Issue resolved',
          title: 'Issue Verified & Resolved',
          message: `Good news! Your report ${id} has been fully resolved and verified.`,
          issueId: id
        });
      } else if (newStatus === 'Closed') {
        notificationService.addNotification({
          type: 'System',
          title: 'Ticket Closed',
          message: `Ticket ${id} has been archived and closed.`,
          issueId: id
        });
      }
    }
    
    return issues[index];
  }
};
