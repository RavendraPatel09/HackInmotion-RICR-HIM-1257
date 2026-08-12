import type { DepartmentId, DepartmentConfig } from '../types';

export const DEPARTMENTS: Record<DepartmentId, DepartmentConfig> = {
  'roads-infra': {
    id: 'roads-infra',
    name: 'Roads & Infrastructure',
    nameHi: 'सड़क एवं बुनियादी ढांचा विभाग',
    activeIssueCount: 0,
    avgResolutionTime: 48,
    transparencyScore: 88,
    grade: 'A',
  },
  'sanitation-dept': {
    id: 'sanitation-dept',
    name: 'Sanitation & Solid Waste',
    nameHi: 'स्वच्छता एवं ठोस अपशिष्ट विभाग',
    activeIssueCount: 0,
    avgResolutionTime: 24,
    transparencyScore: 92,
    grade: 'A',
  },
  'electricity-board': {
    id: 'electricity-board',
    name: 'Electricity & Street Lighting',
    nameHi: 'विद्युत एवं पथ प्रकाश विभाग',
    activeIssueCount: 0,
    avgResolutionTime: 18,
    transparencyScore: 94,
    grade: 'A',
  },
  'water-supply': {
    id: 'water-supply',
    name: 'Water Supply Department',
    nameHi: 'जल आपूर्ति विभाग',
    activeIssueCount: 0,
    avgResolutionTime: 36,
    transparencyScore: 85,
    grade: 'B',
  },
  'public-works': {
    id: 'public-works',
    name: 'Public Works Department',
    nameHi: 'लोक निर्माण विभाग',
    activeIssueCount: 0,
    avgResolutionTime: 60,
    transparencyScore: 78,
    grade: 'C',
  },
  'drainage-sewerage': {
    id: 'drainage-sewerage',
    name: 'Drainage & Sewerage',
    nameHi: 'जल निकासी एवं सीवरेज विभाग',
    activeIssueCount: 0,
    avgResolutionTime: 42,
    transparencyScore: 82,
    grade: 'B',
  },
};

export const getDepartmentById = (id: DepartmentId): DepartmentConfig => {
  return DEPARTMENTS[id] || DEPARTMENTS['roads-infra'];
};
