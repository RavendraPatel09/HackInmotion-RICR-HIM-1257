import React from 'react';
import { motion } from 'framer-motion';
import type { IssueStatus, StatusHistoryItem } from '../../types';
import { CheckCircle2, Clock, RefreshCw, FileText } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';

interface StatusStepperProps {
  status: IssueStatus;
  statusHistory: StatusHistoryItem[];
}

const STEPS: IssueStatus[] = ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Verified'];

export const StatusStepper: React.FC<StatusStepperProps> = ({ status, statusHistory }) => {
  const isReopened = status === 'Reopened';
  const currentStepIndex = isReopened ? 2 : STEPS.indexOf(status);

  return (
    <div className="w-full py-4 px-2">
      {isReopened && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-rose-400 animate-spin" />
          <span>
            <strong>Issue Reopened:</strong> Citizen requested secondary inspection after initial resolution attempt.
          </span>
        </div>
      )}

      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex && !isReopened;
          const isCurrent = idx === currentStepIndex;
          const historyMatch = statusHistory.find((h) => h.status === step);

          return (
            <div key={step} className="relative z-10 flex flex-col items-center group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                  isCompleted
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40'
                    : isCurrent
                    ? 'bg-slate-900 border-amber-400 text-amber-400 ring-4 ring-amber-400/20'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </motion.div>

              <span
                className={`mt-2 text-[11px] font-semibold tracking-tight text-center ${
                  isCompleted ? 'text-indigo-300' : isCurrent ? 'text-amber-400 font-bold' : 'text-slate-500'
                }`}
              >
                {step}
              </span>

              {historyMatch && (
                <span className="text-[10px] text-slate-500 font-medium">
                  {formatRelativeTime(historyMatch.timestamp)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-indigo-400" /> Resolution Workflow History
        </h5>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {statusHistory.map((item, index) => (
            <div key={index} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-indigo-300">{item.status}</span>
                <span className="text-[10px] text-slate-400">{formatRelativeTime(item.timestamp)}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Updated by <strong className="text-slate-300">{item.updatedBy}</strong>
                {item.note && <span className="block mt-0.5 text-slate-300 italic">"{item.note}"</span>}
              </p>
              {item.photoUrl && (
                <a href={item.photoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
                  <img src={item.photoUrl} alt="Evidence" className="h-16 w-24 object-cover rounded-lg border border-slate-700" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
