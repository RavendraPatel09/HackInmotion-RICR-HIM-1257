import type { Issue, User } from '../types';
import type { Language } from '../data/translations';
import { MOCK_INITIAL_ISSUES } from '../data/mockIssues';
import { processAllIssuesSLA } from './sla';
import { clearNotificationsFromStorage } from './notificationService';

const STORAGE_KEYS = {
  USER: 'cityfix_user',
  ISSUES: 'cityfix_issues',
  LANGUAGE: 'cityfix_language',
  THEME: 'cityfix_theme',
  INITIALIZED: 'cityfix_initialized',
};

export function getIssues(): Issue[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ISSUES);
    if (!raw) {
      return initializeDefaultIssues();
    }
    const parsed: Issue[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initializeDefaultIssues();
    }
    return processAllIssuesSLA(parsed);
  } catch (err) {
    console.error('Failed to parse localStorage issues, re-initializing:', err);
    return initializeDefaultIssues();
  }
}

export function saveIssues(issues: Issue[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  } catch (err) {
    console.error('Failed to save issues to localStorage:', err);
  }
}

export function addIssueToStorage(newIssue: Issue): Issue[] {
  const currentIssues = getIssues();
  const updated = [newIssue, ...currentIssues];
  saveIssues(updated);
  return updated;
}

export function updateIssueInStorage(updatedIssue: Issue): Issue[] {
  const currentIssues = getIssues();
  const updated = currentIssues.map((issue) =>
    issue.id === updatedIssue.id ? updatedIssue : issue
  );
  saveIssues(updated);
  return updated;
}

export function initializeDefaultIssues(): Issue[] {
  const processed = processAllIssuesSLA(MOCK_INITIAL_ISSUES);
  saveIssues(processed);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  return processed;
}

export function resetDemoData(): Issue[] {
  localStorage.removeItem(STORAGE_KEYS.ISSUES);
  clearNotificationsFromStorage();
  return initializeDefaultIssues();
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.name === 'Siddhi Rai') {
      user.name = 'Citizen User';
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    }
    return user;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save current user:', err);
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredLanguage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (raw === 'en' || raw === 'hi') return raw;
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (err) {
    console.error('Failed to save language preference:', err);
  }
}

// Data Export Utilities
export function exportIssuesCSV(issues: Issue[]): void {
  const headers = [
    'Tracking ID',
    'Title',
    'Category',
    'Department',
    'Status',
    'Priority',
    'Upvotes',
    'Address',
    'Reported By',
    'Reported At',
    'Escalated',
    'Assigned To',
  ];

  const rows = issues.map((i) => [
    `"${i.trackingId}"`,
    `"${i.title.replace(/"/g, '""')}"`,
    `"${i.category}"`,
    `"${i.department}"`,
    `"${i.status}"`,
    `"${i.priority}"`,
    i.upvotes,
    `"${i.address.replace(/"/g, '""')}"`,
    `"${i.reportedBy}"`,
    `"${i.reportedAt}"`,
    i.escalated ? 'TRUE' : 'FALSE',
    `"${i.assignedTo || 'Unassigned'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NagarSathi_Municipal_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportIssuesJSON(issues: Issue[]): void {
  const jsonContent = JSON.stringify(issues, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NagarSathi_Municipal_Export_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
