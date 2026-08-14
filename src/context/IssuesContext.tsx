import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Issue, IssueStatus, IssueFilter } from '../types';
import { reportsApi } from '../services/api';
import { showToast } from '../components/ui/Toast';

interface IssuesContextType {
  issues: Issue[];
  isLoading: boolean;
  addIssue: (newIssue: any) => Promise<void>;
  updateIssue: (updatedIssue: Issue) => Promise<void>;
  upvoteIssue: (issueId: string, userId: string) => Promise<boolean>;
  advanceStatus: (
    issueId: string,
    nextStatus: IssueStatus,
    updatedBy: string,
    note?: string,
    resolutionPhotoUrl?: string
  ) => Promise<void>;
  reopenIssue: (issueId: string, updatedBy: string, note?: string) => Promise<void>;
  confirmResolution: (issueId: string, updatedBy: string) => Promise<void>;
  refreshIssues: () => void;
  getFilteredIssues: (filter: IssueFilter) => Issue[];
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await reportsApi.list();
      setIssues(loaded);
    } catch (err) {
      console.error('Failed to load issues from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const addIssue = async (newIssue: any) => {
    setIsLoading(true);
    try {
      const payload = {
        title: newIssue.title,
        description: newIssue.description,
        category: newIssue.category,
        priority: newIssue.priority,
        lat: newIssue.lat,
        lng: newIssue.lng,
        address: newIssue.address,
        state: newIssue.state || 'Madhya Pradesh',
        district: newIssue.district || 'Bhopal District',
        city: newIssue.city || 'Bhopal',
        wardId: newIssue.wardId,
        wardName: newIssue.wardName,
        photoUrl: newIssue.photoUrl,
        isAnonymous: newIssue.isAnonymous || false
      };
      
      const created = await reportsApi.create(payload);
      showToast(`Report ${created.trackingId} created successfully!`, 'success');
      await loadIssues();
    } catch (err: any) {
      showToast(err.message || 'Failed to file report', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssue = async (updatedIssue: Issue) => {
    try {
      await reportsApi.updateStatus(
        updatedIssue.id,
        updatedIssue.status,
        updatedIssue.resolutionNotes,
        updatedIssue.resolutionPhotoUrl
      );
      await loadIssues();
    } catch (err: any) {
      showToast(err.message || 'Failed to update issue', 'error');
    }
  };

  const upvoteIssue = async (issueId: string, userId: string): Promise<boolean> => {
    try {
      const report = issues.find((i) => i.id === issueId);
      if (!report) return false;

      if (report.upvotedBy.includes(userId)) {
        // Unvote if already voted
        await reportsApi.unvote(issueId);
        showToast('Upvote removed', 'info');
      } else {
        await reportsApi.vote(issueId);
        showToast('Upvoted successfully!', 'success');
      }
      await loadIssues();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to cast upvote', 'error');
      return false;
    }
  };

  const advanceStatus = async (
    issueId: string,
    nextStatus: IssueStatus,
    _updatedBy: string,
    note?: string,
    resolutionPhotoUrl?: string
  ) => {
    try {
      await reportsApi.updateStatus(issueId, nextStatus, note, resolutionPhotoUrl);
      showToast(`Status updated to ${nextStatus}`, 'success');
      await loadIssues();
    } catch (err: any) {
      showToast(err.message || 'Failed to change status', 'error');
    }
  };

  const reopenIssue = async (issueId: string, _updatedBy: string, note?: string) => {
    await advanceStatus(issueId, 'Reopened', _updatedBy, note || 'Citizen indicated issue is not resolved.');
  };

  const confirmResolution = async (issueId: string, _updatedBy: string) => {
    await advanceStatus(issueId, 'Verified', _updatedBy, 'Citizen verified problem resolution.');
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
