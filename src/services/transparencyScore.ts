import type { Issue, DepartmentId, DepartmentTransparency } from '../types';
import { DEPARTMENTS } from '../data/departments';

export function calculateDepartmentTransparency(
  departmentId: DepartmentId,
  issues: Issue[]
): DepartmentTransparency {
  const deptConfig = DEPARTMENTS[departmentId];
  const deptIssues = issues.filter((i) => i.department === departmentId);
  const totalIssues = deptIssues.length;

  if (totalIssues === 0) {
    return {
      departmentId,
      departmentName: deptConfig.name,
      totalIssues: 0,
      resolvedIssues: 0,
      resolutionRate: 100,
      avgResolutionHours: 24,
      escalationRate: 0,
      verifiedPercentage: 100,
      transparencyScore: 95,
      grade: 'A',
      gradeDescription: 'Excellent compliance with zero active complaints.',
    };
  }

  const resolvedIssues = deptIssues.filter(
    (i) => i.status === 'Resolved' || i.status === 'Verified'
  );
  const verifiedIssues = deptIssues.filter((i) => i.status === 'Verified');
  const escalatedIssues = deptIssues.filter((i) => i.escalated);

  const resolutionRate = Math.round((resolvedIssues.length / totalIssues) * 100);
  const verifiedPercentage =
    resolvedIssues.length > 0
      ? Math.round((verifiedIssues.length / resolvedIssues.length) * 100)
      : 100;
  const escalationRate = Math.round((escalatedIssues.length / totalIssues) * 100);

  let totalHours = 0;
  let resolvedCountWithTime = 0;

  resolvedIssues.forEach((issue) => {
    const reported = new Date(issue.reportedAt).getTime();
    const resolvedItem = issue.statusHistory.find((h) => h.status === 'Resolved' || h.status === 'Verified');
    if (resolvedItem) {
      const resolvedTime = new Date(resolvedItem.timestamp).getTime();
      totalHours += Math.max(1, (resolvedTime - reported) / (1000 * 3600));
      resolvedCountWithTime++;
    }
  });

  const avgResolutionHours =
    resolvedCountWithTime > 0 ? Math.round(totalHours / resolvedCountWithTime) : deptConfig.avgResolutionTime;

  const resolutionComponent = resolutionRate * 0.4;
  const escalationComponent = Math.max(0, 100 - escalationRate * 2.5) * 0.3;
  const verifiedComponent = verifiedPercentage * 0.2;
  const timeComponent = Math.max(0, 100 - (avgResolutionHours / 72) * 100) * 0.1;

  const rawScore = Math.round(resolutionComponent + escalationComponent + verifiedComponent + timeComponent);
  const transparencyScore = Math.min(99, Math.max(45, rawScore));

  let grade: 'A' | 'B' | 'C' | 'D' = 'A';
  let gradeDescription = 'Strong resolution performance with low escalation rate.';

  if (transparencyScore >= 88) {
    grade = 'A';
    gradeDescription = 'Outstanding municipal performance. High verification & fast SLA resolution.';
  } else if (transparencyScore >= 78) {
    grade = 'B';
    gradeDescription = 'Good responsiveness. Minor SLA delays on complex infrastructure work.';
  } else if (transparencyScore >= 68) {
    grade = 'C';
    gradeDescription = 'Moderate backlog. Escalation rate requires department management intervention.';
  } else {
    grade = 'D';
    gradeDescription = 'Critical resolution bottlenecks. High SLA escalation rate detected.';
  }

  return {
    departmentId,
    departmentName: deptConfig.name,
    totalIssues,
    resolvedIssues: resolvedIssues.length,
    resolutionRate,
    avgResolutionHours,
    escalationRate,
    verifiedPercentage,
    transparencyScore,
    grade,
    gradeDescription,
  };
}

export function getAllDepartmentTransparencies(issues: Issue[]): DepartmentTransparency[] {
  const departmentIds: DepartmentId[] = [
    'roads-infra',
    'sanitation-dept',
    'electricity-board',
    'water-supply',
    'public-works',
    'drainage-sewerage',
  ];

  return departmentIds.map((id) => calculateDepartmentTransparency(id, issues));
}
