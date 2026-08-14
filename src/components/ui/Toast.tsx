import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
 id: string;
 type: 'success' | 'warning' | 'info' | 'error';
 message: string;
}

let toastListeners: Array<(toast: ToastMessage) => void> = [];

export function showToast(message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') {
 const newToast: ToastMessage = {
 id: `toast-${Date.now()}-${Math.random()}`,
 type,
 message,
 };
 toastListeners.forEach((listener) => listener(newToast));
}

export const ToastContainer: React.FC = () => {
 const [toasts, setToasts] = useState<ToastMessage[]>([]);

 useEffect(() => {
 const handleNewToast = (toast: ToastMessage) => {
 setToasts((prev) => [...prev, toast]);
 setTimeout(() => {
 setToasts((prev) => prev.filter((t) => t.id !== toast.id));
 }, 4000);
 };

 toastListeners.push(handleNewToast);
 return () => {
 toastListeners = toastListeners.filter((l) => l !== handleNewToast);
 };
 }, []);

 const removeToast = (id: string) => {
 setToasts((prev) => prev.filter((t) => t.id !== id));
 };

 return (
 <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
 <AnimatePresence>
 {toasts.map((toast) => (
 <motion.div
 key={toast.id}
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md text-sm font-medium ${
 toast.type === 'success'
 ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/40'
 : toast.type === 'warning'
 ? 'bg-amber-950/90 border-amber-500/30 text-amber-200 shadow-amber-950/40'
 : toast.type === 'error'
 ? 'bg-rose-950/90 border-rose-500/30 text-rose-200 shadow-rose-950/40'
 : 'bg-slate-900/90 border-slate-700/40 text-slate-200 shadow-slate-950/40'
 }`}
 >
 <div className="flex items-center gap-3">
 {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
 {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
 {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
 {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
 <span>{toast.message}</span>
 </div>
 <button
 onClick={() => removeToast(toast.id)}
 className="p-1 hover:bg-white/10 rounded-lg transition-colors"
 >
 <X className="w-4 h-4 text-[#73827D]" />
 </button>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 );
};
