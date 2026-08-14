import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Issue } from '../../types';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../ui/Badge';
import { StatusStepper } from './StatusStepper';
import { formatRelativeTime } from '../../utils/dateUtils';
import { getDepartmentById } from '../../data/departments';
import { getSLACountdown } from '../../services/sla';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssuesContext';
import { showToast } from '../ui/Toast';
import {
  ThumbsUp,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  RefreshCw,
  Building2,
  UserCheck,
  Share2,
  Bookmark,
} from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  initiallyExpanded?: boolean;
  onAdminAction?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, initiallyExpanded = false, onAdminAction }) => {
  const { user, isAdmin } = useAuth();
  const { upvoteIssue, confirmResolution, reopenIssue } = useIssues();
  const [expanded, setExpanded] = useState<boolean>(initiallyExpanded);

  const dept = getDepartmentById(issue.department);
  const isUpvoted = user ? issue.upvotedBy.includes(user.id) : false;
  const slaInfo = getSLACountdown(issue.reportedAt);

  // Bookmark State
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nagarsathi_saved_issues');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.includes(issue.id);
      }
    } catch (e) {}
    return false;
  });

  // Track recently viewed issues when expanded
  useEffect(() => {
    if (expanded) {
      try {
        const recentsStr = localStorage.getItem('nagarsathi_recent_views') || '[]';
        let recents: string[] = JSON.parse(recentsStr);
        if (!Array.isArray(recents)) recents = [];

        // Remove duplicate and insert at front
        recents = recents.filter(id => id !== issue.id);
        recents.unshift(issue.id);
        // Limit to 5
        recents = recents.slice(0, 5);
        localStorage.setItem('nagarsathi_recent_views', JSON.stringify(recents));
      } catch (err) {}
    }
  }, [expanded, issue.id]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please log in to confirm this issue affects you too.', 'warning');
      return;
    }
    await upvoteIssue(issue.id, user.id);
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const savedStr = localStorage.getItem('nagarsathi_saved_issues') || '[]';
      let saved: string[] = JSON.parse(savedStr);
      if (!Array.isArray(saved)) saved = [];

      if (isSaved) {
        saved = saved.filter(id => id !== issue.id);
        setIsSaved(false);
        showToast('Issue removed from saved list.', 'info');
      } else {
        saved.push(issue.id);
        setIsSaved(true);
        showToast('Issue added to your saved list.', 'success');
      }
      localStorage.setItem('nagarsathi_saved_issues', JSON.stringify(saved));
    } catch (err) {
      showToast('Could not bookmark issue.', 'warning');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: `NagarSathi Report: ${issue.title}`,
          text: `Track civic issue ${issue.trackingId} on NagarSathi Smart City Platform.`,
          url: window.location.origin + `/citizen/issues?tracking=${issue.trackingId}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/citizen/issues?tracking=${issue.trackingId}`);
      showToast('Tracking link copied to clipboard!', 'info');
    }
  };

  const handleConfirmFixed = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmResolution(issue.id, user?.name || 'Citizen');
    showToast('Thank you! Issue status marked as Verified.', 'success');
  };

  const handleReopen = (e: React.MouseEvent) => {
    e.stopPropagation();
    reopenIssue(issue.id, user?.name || 'Citizen', 'Citizen indicated issue is still unresolved.');
    showToast('Issue reopened and escalated back to department queue.', 'warning');
  };

  const getPriorityExplanation = (p: string) => {
    if (issue.escalated) return 'Escalated: SLA timer exceeded';
    if (issue.upvotes >= 10) return 'High Priority: supported by 10+ citizens';
    switch (p) {
      case 'Critical': return 'Critical Priority: safety hazard';
      case 'High': return 'High Priority: high traffic area';
      case 'Medium': return 'Medium Priority: active queue';
      case 'Low':
      default:
        return 'Standard Priority';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group rounded-2xl border transition-all duration-150 shadow-sm overflow-hidden border-l-4 ${
        issue.category === 'roads' ? 'border-l-blue-500 bg-[#F4F9FF] border-blue-100 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)]' :
        issue.category === 'sanitation' ? 'border-l-emerald-500 bg-[#F5FDF7] border-emerald-100 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]' :
        issue.category === 'electricity' ? 'border-l-amber-500 bg-[#FFFDF4] border-amber-100 hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)]' :
        issue.category === 'water' ? 'border-l-cyan-500 bg-[#F2FEFF] border-cyan-100 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)]' :
        issue.category === 'public-property' ? 'border-l-purple-500 bg-[#FAF8FF] border-purple-100 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)]' :
        issue.category === 'drainage' ? 'border-l-indigo-500 bg-[#F2FDFB] border-teal-100 hover:shadow-[0_8px_30px_rgba(20,184,166,0.08)]' :
        'border-l-slate-400 bg-white border-slate-200'
      } ${
        issue.escalated
          ? '!border-l-rose-650 bg-[#FFF5F5] border-rose-150 shadow-rose-950/10'
          : 'hover:-translate-y-[2px] hover:shadow-md'
      }`}
    >
      {/* SLA Escalation or Countdown Header */}
      {issue.escalated ? (
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-1.5 flex items-center justify-between text-xs font-bold text-white tracking-wide">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-300 animate-bounce" />
            SLA ESCALATED — {slaInfo.label}
          </span>
          <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
            Critical Escalation
          </span>
        </div>
      ) : issue.status !== 'Resolved' && issue.status !== 'Verified' ? (
        <div className="bg-slate-100 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-650 border-b border-slate-200">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            72h Municipal SLA: <strong className="text-slate-900">{slaInfo.label}</strong>
          </span>
          {issue.assignedTo && (
            <span className="flex items-center gap-1 text-indigo-600 font-semibold truncate max-w-[180px]">
              <UserCheck className="w-3.5 h-3.5" /> Assigned: {issue.assignedTo.split('—')[0]}
            </span>
          )}
        </div>
      ) : null}

      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`p-1 rounded-lg hover:bg-slate-100 transition-colors ${
                isSaved ? 'text-indigo-650' : 'text-slate-400 hover:text-slate-600'
              }`}
              title={isSaved ? "Saved to Bookmarks" : "Save Issue"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="Share Issue"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {issue.trackingId}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
            {issue.title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-650 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {issue.photoUrl && (
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 max-h-48">
            <img
              src={issue.photoUrl}
              alt={issue.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 text-[11px] text-slate-200 font-medium">
              Photo Evidence Attached
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 border-t border-b border-slate-100 py-3">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-slate-700">{issue.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="text-slate-700 truncate">Dept: {dept.name}</span>
          </div>
        </div>

        {issue.status === 'Resolved' && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Department marked this issue as Resolved. Is it fixed?
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleConfirmFixed}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Yes, Confirm Fixed
              </button>
              <button
                onClick={handleReopen}
                className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/10 flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> No, Reopen Issue
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isUpvoted
                  ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-white' : ''}`} />
              <span>{isUpvoted ? "Confirmed" : `I have this problem too (${issue.upvotes})`}</span>
            </button>

            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatRelativeTime(issue.reportedAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onAdminAction && (
              <button
                onClick={() => onAdminAction(issue)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 text-xs font-semibold transition-colors"
              >
                Manage &amp; Assign
              </button>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            >
              <span>{expanded ? 'Hide Timeline' : 'View Timeline'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Info Details Section */}
        <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-semibold space-y-1">
          <div className="flex items-center justify-between">
            <span>Priority Justification:</span>
            <span className="text-slate-800 font-bold">{getPriorityExplanation(issue.priority)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Assigned Department:</span>
            <span className="text-slate-800 font-bold">{dept.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Last Status Update:</span>
            <span className="text-slate-800 font-bold">{formatRelativeTime(issue.statusHistory[issue.statusHistory.length - 1]?.timestamp)}</span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t border-slate-100"
            >
              <StatusStepper status={issue.status} statusHistory={issue.statusHistory} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
