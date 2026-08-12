import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Issue, IssueStatus, IssueFilter } from '../types';
import {
  getIssues,
  saveIssues,
  addIssueToStorage,
  updateIssueInStorage,
} from '../services/storage';
import { addNotificationToStorage } from '../services/notificationService';

interface IssuesContextType {
  issues: Issue[];
  isLoading: boolean;
  addIssue: (newIssue: Issue) => void;
  updateIssue: (updatedIssue: Issue) => void;
  upvoteIssue: (issueId: string, userId: string) => boolean;
  advanceStatus: (
    issueId: string,
    nextStatus: IssueStatus,
    updatedBy: string,
    note?: string,
    resolutionPhotoUrl?: string
  ) => void;
  reopenIssue: (issueId: string, updatedBy: string, note?: string) => void;
  confirmResolution: (issueId: string, updatedBy: string) => void;
  refreshIssues: () => void;
  getFilteredIssues: (filter: IssueFilter) => Issue[];
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadIssues = useCallback(() => {
    setIsLoading(true);
    try {
      const loaded = getIssues();
      setIssues(loaded);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const addIssue = (newIssue: Issue) => {
    const updated = addIssueToStorage(newIssue);
    setIssues(updated);
    addNotificationToStorage(
      'Issue Report Created',
      `Your report ${newIssue.trackingId} (${newIssue.title}) has been submitted and auto-routed.`,
      'report_created',
      newIssue.id,
      newIssue.trackingId
    );
  };

  const updateIssue = (updatedIssue: Issue) => {
    const updated = updateIssueInStorage(updatedIssue);
    setIssues(updated);
  };

  const upvoteIssue = (issueId: string, userId: string): boolean => {
    let success = false;
    let targetTrackingId = '';
    setIssues((prevIssues) => {
      const target = prevIssues.find((i) => i.id === issueId);
      if (!target) return prevIssues;

      if (target.upvotedBy.includes(userId)) {
        return prevIssues;
      }

      success = true;
      targetTrackingId = target.trackingId;
      const updatedIssue: Issue = {
        ...target,
        upvotes: target.upvotes + 1,
        upvotedBy: [...target.upvotedBy, userId],
        updatedAt: new Date().toISOString(),
      };

      const nextList = prevIssues.map((i) => (i.id === issueId ? updatedIssue : i));
      saveIssues(nextList);
      return nextList;
    });

    if (success) {
      addNotificationToStorage(
        'Community Priority Boost',
        `Issue ${targetTrackingId} received an upvote from a citizen. Priority score updated.`,
        'upvote_received',
        issueId,
        targetTrackingId
      );
    }
    return success;
  };

  const advanceStatus = (
    issueId: string,
    nextStatus: IssueStatus,
    updatedBy: string,
    note?: string,
    resolutionPhotoUrl?: string
  ) => {
    let targetTrackingId = '';
    setIssues((prevIssues) => {
      const target = prevIssues.find((i) => i.id === issueId);
      if (!target) return prevIssues;

      targetTrackingId = target.trackingId;
      const nowISO = new Date().toISOString();

      const newHistoryItem = {
        status: nextStatus,
        timestamp: nowISO,
        updatedBy,
        note,
        photoUrl: resolutionPhotoUrl,
      };

      const updatedIssue: Issue = {
        ...target,
        status: nextStatus,
        updatedAt: nowISO,
        statusHistory: [...target.statusHistory, newHistoryItem],
        resolutionNotes: note || target.resolutionNotes,
        resolutionPhotoUrl: resolutionPhotoUrl || target.resolutionPhotoUrl,
        escalated: nextStatus === 'Resolved' || nextStatus === 'Verified' ? false : target.escalated,
      };

      const nextList = prevIssues.map((i) => (i.id === issueId ? updatedIssue : i));
      saveIssues(nextList);
      return nextList;
    });

    addNotificationToStorage(
      `Status Updated to ${nextStatus}`,
      `Report ${targetTrackingId} updated by ${updatedBy}. Current status: ${nextStatus}.`,
      nextStatus === 'Resolved' || nextStatus === 'Verified' ? 'issue_resolved' : 'status_changed',
      issueId,
      targetTrackingId
    );
  };

  const reopenIssue = (issueId: string, updatedBy: string, note?: string) => {
    advanceStatus(issueId, 'Reopened', updatedBy, note || 'Citizen indicated issue is not resolved.');
  };

  const confirmResolution = (issueId: string, updatedBy: string) => {
    advanceStatus(issueId, 'Verified', updatedBy, 'Citizen verified problem resolution.');
  };

  const refreshIssues = () => {
    loadIssues();
  };

  const getFilteredIssues = (filter: IssueFilter): Issue[] => {
    let result = [...issues];

    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.trackingId.toLowerCase().includes(q) ||
          i.address.toLowerCase().includes(q)
      );
    }

    if (filter.category && filter.category !== 'all') {
      result = result.filter((i) => i.category === filter.category);
    }

    if (filter.status && filter.status !== 'all') {
      result = result.filter((i) => i.status === filter.status);
    }

    if (filter.department && filter.department !== 'all') {
      result = result.filter((i) => i.department === filter.department);
    }

    if (filter.priority && filter.priority !== 'all') {
      result = result.filter((i) => i.priority === filter.priority);
    }

    if (filter.escalatedOnly) {
      result = result.filter((i) => i.escalated);
    }

    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
          break;
        case 'oldest':
          result.sort((a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime());
          break;
        case 'priority': {
          const pOrder: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          result.sort((a, b) => (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0));
          break;
        }
        case 'upvotes':
          result.sort((a, b) => b.upvotes - a.upvotes);
          break;
      }
    }

    return result;
  };

  return (
    <IssuesContext.Provider
      value={{
        issues,
        isLoading,
        addIssue,
        updateIssue,
        upvoteIssue,
        advanceStatus,
        reopenIssue,
        confirmResolution,
        refreshIssues,
        getFilteredIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};
