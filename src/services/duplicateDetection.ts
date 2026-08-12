import type { Issue, IssueCategory } from '../types';
import { calculateDistanceMeters } from '../utils/distance';

export interface DuplicateCheckResult {
  isDuplicateFound: boolean;
  matchingIssue?: Issue;
  distanceMeters?: number;
}

export function findPotentialDuplicate(
  category: IssueCategory,
  lat: number,
  lng: number,
  existingIssues: Issue[]
): DuplicateCheckResult {
  const FourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (const issue of existingIssues) {
    if (issue.category !== category) continue;
    if (issue.status === 'Resolved' || issue.status === 'Verified') continue;

    const reportedTime = new Date(issue.reportedAt).getTime();
    if (now - reportedTime > FourteenDaysMs) continue;

    const distance = calculateDistanceMeters(lat, lng, issue.lat, issue.lng);
    if (distance <= 150) {
      return {
        isDuplicateFound: true,
        matchingIssue: issue,
        distanceMeters: distance,
      };
    }
  }

  return { isDuplicateFound: false };
}
