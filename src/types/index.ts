export type UserRole = 'citizen' | 'admin' | 'ward-officer';

export type IssueStatus =
  | 'Reported'
  | 'Acknowledged'
  | 'In Progress'
  | 'Resolved'
  | 'Verified'
  | 'Reopened';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueCategory =
  | 'roads'
  | 'sanitation'
  | 'electricity'
  | 'water'
  | 'public-property'
  | 'drainage';

export type DepartmentId =
  | 'roads-infra'
  | 'sanitation-dept'
  | 'electricity-board'
  | 'water-supply'
  | 'public-works'
  | 'drainage-sewerage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: DepartmentId;
  avatar?: string;
  wardId?: string;
  phone?: string;
  points?: number;
  badges?: string[];
  settings?: any;
}

export interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface SatisfactionRating {
  issueId: string;
  rating: number; // 1-5
  comment?: string;
  ratedBy: string;
  ratedAt: string;
}

export interface StatusHistoryItem {
  status: IssueStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
  photoUrl?: string;
}

export interface Issue {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  category: IssueCategory;
  department: DepartmentId;
  status: IssueStatus;
  priority: Priority;
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  wardId?: string;
  photoUrl?: string;
  resolutionPhotoUrl?: string;
  resolutionNotes?: string;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  upvotes: number;
  upvotedBy: string[];
  isDuplicateOf?: string;
  escalated: boolean;
  language: 'en' | 'hi';
  assignedTo?: string;
  assignedAt?: string;
  comments?: Comment[];
  satisfactionRating?: number;
  satisfactionComment?: string;
  isAnonymous?: boolean;
  city?: string;
  state?: string;
}

export interface Ward {
  id: string;
  name: string;
  nameHi: string;
  officerName: string;
  officerPhone: string;
  officerAvatar?: string;
  centerLat: number;
  centerLng: number;
  boundaryBox: { nLat: number; sLat: number; eLng: number; wLng: number };
  color: string;
}

export interface CivicBadge {
  id: string;
  label: string;
  icon: string;
  description: string;
  threshold: number; // points needed
}

export interface WardAnnouncement {
  id: string;
  wardId: string;
  title: string;
  body: string;
  createdAt: string;
  expiresAt?: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface CategoryConfig {
  id: IssueCategory;
  label: string;
  labelHi: string;
  iconName: string;
  department: DepartmentId;
  description: string;
  descriptionHi: string;
  color: string;
  bgGradient: string;
}

export interface DepartmentConfig {
  id: DepartmentId;
  name: string;
  nameHi: string;
  activeIssueCount: number;
  avgResolutionTime: number; // in hours
  transparencyScore: number; // 0 - 100
  grade: 'A' | 'B' | 'C' | 'D';
}

export interface IssueFilter {
  search?: string;
  category?: IssueCategory | 'all';
  status?: IssueStatus | 'all';
  department?: DepartmentId | 'all';
  priority?: Priority | 'all';
  wardId?: string | 'all';
  escalatedOnly?: boolean;
  sortBy?: 'newest' | 'oldest' | 'priority' | 'upvotes';
}

export interface HotspotZone {
  id: string;
  name: string;
  category: IssueCategory;
  reportCount: number;
  centerLat: number;
  centerLng: number;
  severity: Priority;
  trend: 'increasing' | 'stable' | 'decreasing' | 'rising';
}

export interface DepartmentTransparency {
  departmentId: DepartmentId;
  departmentName: string;
  totalIssues: number;
  resolvedIssues: number;
  verifiedIssues?: number;
  escalatedIssues?: number;
  resolutionRate: number; // percentage
  avgResolutionHours: number;
  transparencyScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  gradeDescription: string;
  escalationRate: number;
  verifiedPercentage: number;
  avgSatisfaction?: number;
}
