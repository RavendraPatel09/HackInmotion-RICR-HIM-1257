import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
 title: string;
 value: number;
 icon: LucideIcon;
 subtitle?: string;
 trend?: string;
 trendType?: 'positive' | 'negative' | 'neutral';
 color?: string;
 onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
 title,
 value,
 icon: Icon,
 subtitle,
 trend,
 trendType = 'neutral',
 color = 'indigo',
 onClick,
}) => {
 const colorGradients: Record<string, string> = {
 indigo: 'from-[#07483A]/10 to-blue-500/5 text-[#053229] border-[#07483A]/20',
 emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 border-emerald-500/20',
 amber: 'from-amber-500/10 to-orange-500/5 text-amber-600 border-amber-500/20',
 rose: 'from-rose-500/10 to-pink-500/5 text-rose-600 border-rose-500/20',
 cyan: 'from-cyan-500/10 to-sky-500/5 text-cyan-600 border-cyan-500/20',
 };

 const selectedClass = colorGradients[color] || colorGradients.indigo;

 return (
 <motion.div
 whileHover={{ y: -3, scale: 1.01 }}
 transition={{ duration: 0.2 }}
 onClick={onClick}
 className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-lg backdrop-blur-xl transition-all ${
 onClick ? 'cursor-pointer hover:border-slate-300 ' : ''
 }`}
 >
 <div className="flex items-center justify-between">
 <div>
 <p className="text-xs font-bold text-[#536761] uppercase tracking-wider">{title}</p>
 <div className="mt-2 flex items-baseline gap-2">
 <h3 className="text-2xl lg:text-3xl font-black text-[#10201C] tracking-tight">
 {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
 </h3>
 {trend && (
 <span
 className={`text-xs font-semibold ${
 trendType === 'positive'
 ? 'text-emerald-600 '
 : trendType === 'negative'
 ? 'text-rose-600 '
 : 'text-[#536761]'
 }`}
 >
 {trend}
 </span>
 )}
 </div>
 {subtitle && <p className="mt-1 text-xs text-[#536761] ">{subtitle}</p>}
 </div>
 <div className={`p-3.5 rounded-xl border bg-gradient-to-br ${selectedClass}`}>
 <Icon className="w-6 h-6" />
 </div>
 </div>
 </motion.div>
 );
};
