import { MOCK_ISSUES } from './mockData.js';

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
    return newIssue;
  },
  
  async updateIssue(id, updateData) {
    initStorage();
    await delay(600);
    const issues = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) throw new Error("Issue not found");
    
    issues[index] = { ...issues[index], ...updateData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    return issues[index];
  }
};
