import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import type { Issue, DepartmentId, IssueStatus } from '../types';
import { DEPARTMENTS } from '../data/departments';
import { IssueCard } from '../components/issues/IssueCard';
import { exportIssuesCSV, exportIssuesJSON, resetDemoData } from '../services/storage';
import { showToast } from '../components/ui/Toast';
import { ListTodo, AlertTriangle, X, Download, FileSpreadsheet, RotateCcw, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TEAM_LEADS: Record<string, string[]> = {
 'dept-roads': ['Prakash Verma — Rapid Patch Crew 1', 'Vikram Singh — Paving Supervisor'],
 'dept-sanitation': ['Sunita Rao — Sanitation Team Lead', 'Ramesh Kumar — Solid Waste Inspector'],
 'dept-electricity': ['Amit Sharma — High Voltage Ops', 'Deepak Joshi — Grid Lines Crew'],
 'dept-water': ['Rajesh Patel — Pipeline Response', 'Kavita Roy — Water Supply Lead'],
 'dept-public-works': ['Sanjay Mishra — Civil Structures', 'Alok Gupta — Infrastructure Ops'],
 'dept-drainage': ['Manish Tiwari — Drainage & Sewerage', 'Harish Chandra — Storm Drain Lead'],
};

export const AdminQueue: React.FC = () => {
 const { issues, advanceStatus, updateIssue, refreshIssues } = useIssues();
 const { user } = useAuth();

 const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>('all');
 const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>('all');
 const [escalatedOnly, setEscalatedOnly] = useState<boolean>(false);

 const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
 const [targetStatus, setTargetStatus] = useState<IssueStatus>('Acknowledged');
 const [assignedTeamLead, setAssignedTeamLead] = useState<string>('');
 const [resolutionNotes, setResolutionNotes] = useState<string>('');
 const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState<string>('');

 const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);

 const filteredQueue = issues.filter((issue) => {
 if (selectedDept !== 'all' && issue.department !== selectedDept) return false;
 if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
 if (escalatedOnly && !issue.escalated) return false;
 return true;
 });

 const sortedQueue = [...filteredQueue].sort((a, b) => {
 if (a.escalated !== b.escalated) return a.escalated ? -1 : 1;
 const pRank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
 if (pRank[b.priority] !== pRank[a.priority]) return pRank[b.priority] - pRank[a.priority];
 if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
 return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
 });

 const openAdvanceModal = (issue: Issue) => {
 setActiveIssue(issue);
 setResolutionNotes(issue.resolutionNotes || '');
 setResolutionPhotoUrl(issue.resolutionPhotoUrl || '');
 setAssignedTeamLead(issue.assignedTo || '');

 if (issue.status === 'Reported') setTargetStatus('Acknowledged');
 else if (issue.status === 'Acknowledged') setTargetStatus('In Progress');
 else if (issue.status === 'In Progress' || issue.status === 'Reopened') setTargetStatus('Resolved');
 else setTargetStatus('Verified');
 };

 const handleSaveStatusUpdate = (e: React.FormEvent) => {
 e.preventDefault();
 if (!activeIssue) return;

 if (targetStatus === 'Resolved' && !resolutionNotes.trim()) {
 showToast('Resolution notes are required when marking an issue as Resolved.', 'warning');
 return;
 }

 if (assignedTeamLead !== activeIssue.assignedTo) {
 updateIssue({
 ...activeIssue,
 assignedTo: assignedTeamLead || undefined,
 assignedAt: assignedTeamLead ? new Date().toISOString() : undefined,
 });
 }

 advanceStatus(
 activeIssue.id,
 targetStatus,
 user?.name || 'Administrator',
 resolutionNotes.trim() || undefined,
 resolutionPhotoUrl.trim() || undefined
 );

 showToast(`Issue ${activeIssue.trackingId} status updated to ${targetStatus}.`, 'success');
 setActiveIssue(null);
 };

 const handleExportCSV = () => {
 exportIssuesCSV(sortedQueue);
 showToast(`Exported ${sortedQueue.length} issues to CSV.`, 'success');
 };

 const handleExportJSON = () => {
 exportIssuesJSON(sortedQueue);
 showToast(`Exported ${sortedQueue.length} issues to JSON.`, 'success');
 };

 const handleConfirmResetDemo = () => {
 resetDemoData();
 refreshIssues();
 setResetModalOpen(false);
 showToast('Demo data reseeded and notifications reset safely.', 'success');
 };

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-[#10201C] flex items-center gap-3">
 <ListTodo className="w-8 h-8 text-amber-500" /> Municipal Department Queue
 </h1>
 <p className="text-xs text-[#536761] mt-1">
 Dispatch resolution teams, advance status, and log official municipal work notes.
 </p>
 </div>

 {/* Data Export & Reset Controls */}
 <div className="flex items-center gap-2 flex-wrap">
 <button
 onClick={handleExportCSV}
 className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#10201C] text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
 >
 <FileSpreadsheet className="w-4 h-4 text-emerald-600 " /> Export CSV
 </button>
 <button
 onClick={handleExportJSON}
 className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#10201C] text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
 >
 <Download className="w-4 h-4 text-[#053229] " /> Download JSON
 </button>
 <button
 onClick={() => setResetModalOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
 >
 <RotateCcw className="w-4 h-4 text-rose-500" /> Reset Demo
 </button>
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-md">
 <div className="flex flex-wrap items-center gap-3">
 <select
 value={selectedDept}
 onChange={(e) => setSelectedDept(e.target.value as any)}
 className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#10201C] text-xs font-semibold focus:outline-none focus:border-amber-500"
 >
 <option value="all">All Departments</option>
 {Object.values(DEPARTMENTS).map((d) => (
 <option key={d.id} value={d.id}>
 {d.name}
 </option>
 ))}
 </select>

 <select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value as any)}
 className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#10201C] text-xs font-semibold focus:outline-none focus:border-amber-500"
 >
 <option value="all">All Statuses</option>
 <option value="Reported">Reported</option>
 <option value="Acknowledged">Acknowledged</option>
 <option value="In Progress">In Progress</option>
 <option value="Resolved">Resolved</option>
 <option value="Reopened">Reopened</option>
 </select>
 </div>

 <button
 onClick={() => setEscalatedOnly(!escalatedOnly)}
 className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
 escalatedOnly
 ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
 : 'bg-slate-100 text-rose-600 border border-slate-200 hover:bg-slate-200 '
 }`}
 >
 <AlertTriangle className="w-4 h-4 text-rose-500" /> SLA Escalated Only ({issues.filter((i) => i.escalated).length})
 </button>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between text-xs text-[#536761] font-medium">
 <span>Queue count: {sortedQueue.length} issues</span>
 <span>Sorted by SLA Escalation &rarr; Priority &rarr; Upvotes</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {sortedQueue.map((issue) => (
 <IssueCard key={issue.id} issue={issue} onAdminAction={openAdvanceModal} />
 ))}
 </div>
 </div>

 {/* Admin Status & Team Assignment Modal */}
 <AnimatePresence>
 {activeIssue && (
 <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
 <motion.form
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 onSubmit={handleSaveStatusUpdate}
 className="relative max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5"
 >
 <button
 type="button"
 onClick={() => setActiveIssue(null)}
 className="absolute top-4 right-4 p-2 text-[#73827D] hover:text-[#536761] rounded-lg transition-colors"
 >
 <X className="w-5 h-5" />
 </button>

 <div className="space-y-1">
 <span className="text-xs font-mono font-bold text-amber-600 ">{activeIssue.trackingId}</span>
 <h3 className="text-lg font-bold text-[#10201C] ">Advance Status &amp; Assign Team</h3>
 <p className="text-xs text-[#536761] line-clamp-1">{activeIssue.title}</p>
 </div>

 <div className="space-y-2">
 <label className="block text-xs font-bold uppercase tracking-wider text-[#536761] ">
 Assign Field Response Team Lead
 </label>
 <select
 value={assignedTeamLead}
 onChange={(e) => setAssignedTeamLead(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#10201C] text-xs font-semibold focus:outline-none focus:border-amber-500"
 >
 <option value="">Unassigned (Awaiting Team Dispatch)</option>
 {(TEAM_LEADS[activeIssue.department] || []).map((lead) => (
 <option key={lead} value={lead}>
 {lead}
 </option>
 ))}
 </select>
 </div>

 <div className="space-y-2">
 <label className="block text-xs font-bold uppercase tracking-wider text-[#536761] ">
 Select Target Status
 </label>
 <select
 value={targetStatus}
 onChange={(e) => setTargetStatus(e.target.value as IssueStatus)}
 className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#10201C] text-sm font-semibold focus:outline-none focus:border-amber-500"
 >
 <option value="Acknowledged">Acknowledged</option>
 <option value="In Progress">In Progress</option>
 <option value="Resolved">Resolved (Requires Action Notes)</option>
 <option value="Verified">Verified</option>
 </select>
 </div>

 <div className="space-y-2">
 <label className="block text-xs font-bold uppercase tracking-wider text-[#536761] ">
 Resolution Notes / Action Taken {targetStatus === 'Resolved' && <span className="text-rose-500">*</span>}
 </label>
 <textarea
 rows={3}
 value={resolutionNotes}
 onChange={(e) => setResolutionNotes(e.target.value)}
 placeholder="Detail the repairs made, work order reference, or action taken..."
 className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#10201C] text-sm focus:outline-none focus:border-amber-500"
 />
 </div>

 <div className="space-y-2">
 <label className="block text-xs font-bold uppercase tracking-wider text-[#536761] ">
 Resolution Evidence Photo URL (Optional)
 </label>
 <input
 type="text"
 value={resolutionPhotoUrl}
 onChange={(e) => setResolutionPhotoUrl(e.target.value)}
 placeholder="https://images.unsplash.com/..."
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#10201C] text-xs focus:outline-none focus:border-amber-500"
 />
 </div>

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => setActiveIssue(null)}
 className="px-4 py-2 rounded-xl text-xs font-medium text-[#536761] hover:bg-slate-100 "
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
 >
 <UserCheck className="w-4 h-4" /> Save &amp; Dispatch
 </button>
 </div>
 </motion.form>
 </div>
 )}
 </AnimatePresence>

 {/* Safe Reset Demo Data Modal */}
 <AnimatePresence>
 {resetModalOpen && (
 <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="relative max-w-md w-full rounded-2xl bg-white border border-rose-500/30 p-6 shadow-2xl space-y-4"
 >
 <div className="flex items-center gap-3">
 <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
 <RotateCcw className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-[#10201C] ">Reset Demo Data?</h3>
 <p className="text-xs text-[#536761] ">
 This action will restore default Bhopal seed issues and clear notifications.
 </p>
 </div>
 </div>

 <p className="text-xs text-[#536761] leading-relaxed">
 Theme and language preferences will be preserved. Custom submitted reports during this session will be reset to initial demo state.
 </p>

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 onClick={() => setResetModalOpen(false)}
 className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536761] hover:bg-slate-100 "
 >
 Cancel
 </button>
 <button
 onClick={handleConfirmResetDemo}
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
 >
 Confirm Reset Demo Data
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
};
