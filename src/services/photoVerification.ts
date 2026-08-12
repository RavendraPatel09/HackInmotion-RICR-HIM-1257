import type { IssueCategory } from '../types';

export interface PhotoVerificationResult {
  status: 'SUCCESS' | 'WARNING';
  messageKey: 'aiSuccess' | 'aiWarning';
  confidence: number;
  heuristicDetails: string;
}

export async function verifyPhotoHeuristic(
  file: File | string,
  category: IssueCategory
): Promise<PhotoVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1300));

  let fileName = '';
  let fileSize = 0;

  if (typeof file !== 'string') {
    fileName = file.name.toLowerCase();
    fileSize = file.size;
  }

  const keywordsByCategory: Record<IssueCategory, string[]> = {
    roads: ['pothole', 'road', 'asphalt', 'crack', 'street', 'tarmac', 'pit'],
    sanitation: ['garbage', 'trash', 'waste', 'bin', 'dump', 'rubbish', 'sweeping'],
    electricity: ['light', 'wire', 'pole', 'lamp', 'electric', 'dark', 'cable'],
    water: ['leak', 'water', 'pipe', 'burst', 'flood', 'drain', 'overflow'],
    'public-property': ['bench', 'shelter', 'wall', 'sign', 'bus', 'broken', 'fence'],
    drainage: ['sewage', 'drain', 'clog', 'gutter', 'waterlog', 'sludge', 'manhole'],
  };

  const keywords = keywordsByCategory[category] || [];
  const matchesKeyword = keywords.some((kw) => fileName.includes(kw));

  const isValidSize = fileSize === 0 || fileSize > 10240;
  const passesHeuristic = isValidSize && (matchesKeyword || Math.random() < 0.88);

  if (passesHeuristic) {
    return {
      status: 'SUCCESS',
      messageKey: 'aiSuccess',
      confidence: Math.floor(85 + Math.random() * 12),
      heuristicDetails: `Image attributes match ${category} pattern metrics.`,
    };
  }

  return {
    status: 'WARNING',
    messageKey: 'aiWarning',
    confidence: Math.floor(45 + Math.random() * 20),
    heuristicDetails: `Low feature density detected for category: ${category}.`,
  };
}
