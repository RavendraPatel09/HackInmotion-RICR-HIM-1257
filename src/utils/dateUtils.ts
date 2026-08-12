/**
 * Date utility helpers for relative formatting and SLA calculations.
 */

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}

export function getHoursSince(isoString: string): number {
  try {
    const date = new Date(isoString);
    const now = new Date();
    return Math.max(0, (now.getTime() - date.getTime()) / (1000 * 60 * 60));
  } catch {
    return 0;
  }
}

export function isSLABreached(reportedAtISO: string, status: string, thresholdHours: number = 72): boolean {
  if (status === 'Resolved' || status === 'Verified') {
    return false;
  }
  return getHoursSince(reportedAtISO) > thresholdHours;
}
