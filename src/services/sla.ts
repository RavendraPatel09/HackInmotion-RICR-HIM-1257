import type { Issue } from '../types';

export const SLA_THRESHOLD_HOURS = 72;

export function checkAndApplySLAEscalation(issue: Issue): Issue {
  if (issue.status === 'Resolved' || issue.status === 'Verified') {
    return { ...issue, escalated: false };
  }

  const reportedTime = new Date(issue.reportedAt).getTime();
  const currentTime = new Date().getTime();
  const elapsedHours = (currentTime - reportedTime) / (1000 * 60 * 60);

  if (elapsedHours > SLA_THRESHOLD_HOURS) {
    return {
      ...issue,
      escalated: true,
      priority: issue.priority === 'Low' || issue.priority === 'Medium' ? 'High' : issue.priority,
    };
  }

  return issue;
}

export function processAllIssuesSLA(issues: Issue[]): Issue[] {
  return issues.map(checkAndApplySLAEscalation);
}

export interface SLACountdownResult {
  isOverdue: boolean;
  label: string;
  hoursRemaining: number;
  hoursOverdue: number;
}

export function getSLACountdown(reportedAt: string): SLACountdownResult {
  const reportedTime = new Date(reportedAt).getTime();
  const currentTime = new Date().getTime();
  const elapsedHours = Math.max(0, (currentTime - reportedTime) / (1000 * 60 * 60));

  if (elapsedHours >= SLA_THRESHOLD_HOURS) {
    const hoursOverdue = Math.round(elapsedHours - SLA_THRESHOLD_HOURS);
    return {
      isOverdue: true,
      label: `SLA exceeded by ${hoursOverdue}h`,
      hoursRemaining: 0,
      hoursOverdue,
    };
  }

  const hoursRemaining = Math.round(SLA_THRESHOLD_HOURS - elapsedHours);
  return {
    isOverdue: false,
    label: `${hoursRemaining}h remaining`,
    hoursRemaining,
    hoursOverdue: 0,
  };
}
