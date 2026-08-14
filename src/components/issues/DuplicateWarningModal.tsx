import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Issue } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { AlertTriangle, ThumbsUp, X, MapPin } from 'lucide-react';
import { formatDistance } from '../../utils/distance';

interface DuplicateWarningModalProps {
 isOpen: boolean;
 matchingIssue: Issue | undefined;
 distanceMeters: number | undefined;
 onUpvoteExisting: (issueId: string) => void;
 onSubmitAnyway: () => void;
 onClose: () => void;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
 isOpen,
 matchingIssue,
 distanceMeters = 0,
 onUpvoteExisting,
 onSubmitAnyway,
 onClose,
}) => {
 if (!isOpen || !matchingIssue) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="relative max-w-lg w-full rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl space-y-5"
 >
 <button
 onClick={onClose}
 className="absolute top-4 right-4 p-2 text-[#73827D] hover:text-white rounded-lg transition-colors"
 >
 <X className="w-5 h-5" />
 </button>

 <div className="flex items-center gap-3">
 <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
 <AlertTriangle className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-white">Similar Issue Reported Nearby!</h3>
 <p className="text-xs text-amber-300">
 Found an existing active report within {formatDistance(distanceMeters)}.
 </p>
 </div>
 </div>

 <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-mono text-[#73827D]">{matchingIssue.trackingId}</span>
 <StatusBadge status={matchingIssue.status} />
 </div>
 <h4 className="font-bold text-sm text-white">{matchingIssue.title}</h4>
 <p className="text-xs text-[#73827D] line-clamp-2">{matchingIssue.description}</p>
 
 <div className="flex items-center justify-between text-xs text-[#73827D] pt-2 border-t border-slate-900">
 <span className="flex items-center gap-1">
 <MapPin className="w-3.5 h-3.5 text-[#0B6652]" /> {matchingIssue.address}
 </span>
 <span className="font-bold text-[#0B6652] flex items-center gap-1">
 <ThumbsUp className="w-3.5 h-3.5" /> {matchingIssue.upvotes} Upvotes
 </span>
 </div>
 </div>

 <p className="text-xs text-slate-300 leading-relaxed">
 You can upvote this existing issue to boost its municipal priority, or submit your report as a new separate issue.
 </p>

 <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
 <button
 onClick={() => onUpvoteExisting(matchingIssue.id)}
 className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-[#053229] hover:bg-[#07483A] text-white text-xs font-bold transition-all shadow-lg shadow-[#053229]/30 flex items-center justify-center gap-2"
 >
 <ThumbsUp className="w-4 h-4" /> Upvote Existing Issue
 </button>
 <button
 onClick={onSubmitAnyway}
 className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
 >
 Submit as New Issue
 </button>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};
