import React from 'react';
import type { IssueStatus, Priority, IssueCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';

export const StatusBadge: React.FC<{ status: IssueStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const styles: Record<IssueStatus, string> = {
<<<<<<< HEAD
    Reported: 'bg-[#EEF2F1] text-[#40534D] border-[#D6E2DE]',
    Acknowledged: 'bg-[#FFF4D9] text-[#8A6419] border-[#F5DFA0]',
    'In Progress': 'bg-[#E7F0F8] text-[#245B7A] border-[#B3D4E8]',
    Resolved: 'bg-[#E5F4EC] text-[#17623F] border-[#A8DBC2]',
    Verified: 'bg-[#E8F1EE] text-[#245A4C] border-[#BFD5CE]',
    Reopened: 'bg-[#FEE8E8] text-[#C94B4B] border-[#F5B8B8]',
=======
    Reported: 'status-reported',
    Acknowledged: 'status-acknowledged',
    'In Progress': 'status-in-progress',
    Resolved: 'status-resolved',
    Verified: 'status-verified',
    Reopened: 'status-reopened',
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
        styles[status] || styles.Reported
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority; className?: string }> = ({
  priority,
  className = '',
}) => {
  const styles: Record<Priority, string> = {
<<<<<<< HEAD
    Low: 'bg-[#F1F7F5] text-[#536761] border-[#D6E2DE]',
    Medium: 'bg-[#E7F0F8] text-[#245B7A] border-[#B3D4E8]',
    High: 'bg-[#FFF4D9] text-[#8A6419] border-[#F5DFA0]',
    Critical: 'bg-[#FEE8E8] text-[#C94B4B] border-[#F5B8B8] font-semibold',
=======
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
    Medium: 'bg-cf-primary-50 text-cf-primary-600 border-cf-primary-200',
    High: 'bg-cf-warning-bg text-cf-warning border-cf-warning-light',
    Critical: 'bg-cf-danger-bg text-cf-danger border-cf-danger-light font-bold',
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
        styles[priority] || styles.Medium
      } ${className}`}
    >
      {priority}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: IssueCategory; className?: string }> = ({
  category,
  className = '',
}) => {
  const cfg = CATEGORIES[category] || CATEGORIES.roads;
  return (
    <span
<<<<<<< HEAD
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white text-[#10201C] border border-[#D6E2DE] ${className}`}
=======
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 ${className}`}
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
};
