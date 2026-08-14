import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
 isOpen: boolean;
 title: string;
 description: string;
 confirmText?: string;
 cancelText?: string;
 variant?: 'danger' | 'primary' | 'success';
 onConfirm: () => void;
 onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
 isOpen,
 title,
 description,
 confirmText = 'Confirm',
 cancelText = 'Cancel',
 variant = 'primary',
 onConfirm,
 onClose,
}) => {
 if (!isOpen) return null;

 const variantStyles = {
 primary: 'bg-[#053229] hover:bg-[#07483A] text-white shadow-[#053229]/40',
 danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40',
 success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40',
 };

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="relative max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl"
 >
 <button
 onClick={onClose}
 className="absolute top-4 right-4 p-2 text-[#73827D] hover:text-white rounded-lg transition-colors"
 >
 <X className="w-5 h-5" />
 </button>

 <div className="flex items-start gap-4">
 <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-[#0B6652] shrink-0">
 <AlertCircle className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-lg font-semibold text-white">{title}</h3>
 <p className="mt-2 text-sm text-slate-300 leading-relaxed">{description}</p>
 </div>
 </div>

 <div className="mt-6 flex items-center justify-end gap-3">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
 >
 {cancelText}
 </button>
 <button
 onClick={() => {
 onConfirm();
 onClose();
 }}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg ${variantStyles[variant]}`}
 >
 {confirmText}
 </button>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};
