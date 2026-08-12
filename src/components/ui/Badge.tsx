import React from 'react';
import type { IssueStatus, Priority, IssueCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';

export const StatusBadge: React.FC<{ status: IssueStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const styles: Record<IssueStatus, string> = {
    Reported: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Acknowledged: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Verified: 'bg-teal-500/15 text-teal-300 border-teal-500/30 font-semibold',
    Reopened: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
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
    Low: 'bg-slate-800 text-slate-300 border-slate-700',
    Medium: 'bg-sky-950/60 text-sky-300 border-sky-800/40',
    High: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    Critical: 'bg-rose-950/80 text-rose-300 border-rose-800/60 font-semibold animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider border ${
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60 ${className}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
};
