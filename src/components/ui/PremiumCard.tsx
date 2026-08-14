import React from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'cyan' | 'indigo' | 'teal';

interface PremiumCardProps {
 children: React.ReactNode;
 variant?: CardVariant;
 hoverGlow?: boolean;
 clickable?: boolean;
 className?: string;
 onClick?: (e: React.MouseEvent) => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
 children,
 variant = 'default',
 hoverGlow = true,
 clickable = false,
 className = '',
 onClick,
}) => {
 const getVariantStyles = (v: CardVariant) => {
 switch (v) {
 case 'blue': // Roads
 return 'bg-[#F4F9FF] border-blue-150 hover:border-blue-400/80 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:ring-1 hover:ring-blue-500/10';
 case 'purple': // Public property
 return 'bg-[#FAF8FF] border-purple-150 hover:border-purple-400/80 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)] hover:ring-1 hover:ring-purple-500/10';
 case 'green': // Sanitation
 return 'bg-[#F5FDF7] border-emerald-150 hover:border-emerald-450 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] hover:ring-1 hover:ring-emerald-500/10';
 case 'amber': // Electricity
 return 'bg-[#FFFDF4] border-amber-150 hover:border-amber-400/80 hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] hover:ring-1 hover:ring-amber-500/10';
 case 'red': // Critical
 return 'bg-[#FFF5F5] border-rose-150 hover:border-rose-400 hover:shadow-[0_8px_30px_rgba(239,68,68,0.08)] hover:ring-1 hover:ring-rose-500/10';
 case 'cyan': // Water
 return 'bg-[#F2FEFF] border-cyan-150 hover:border-cyan-400 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)] hover:ring-1 hover:ring-cyan-500/10';
 case 'teal': // Drainage
 return 'bg-[#F2FDFB] border-teal-150 hover:border-teal-400 hover:shadow-[0_8px_30px_rgba(20,184,166,0.08)] hover:ring-1 hover:ring-teal-500/10';
 case 'indigo': // Community
 return 'bg-[#F7F8FF] border-indigo-150 hover:border-[#0B6652]/80 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] hover:ring-1 hover:ring-[#07483A]/10';
 case 'default':
 default:
 return 'bg-white border-slate-200/80 hover:border-[#B8CCC5] hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] hover:ring-1 hover:ring-[#07483A]/5';
 }
 };

 const interactiveStyles = clickable ? 'cursor-pointer select-none' : '';
 const transformStyles = hoverGlow 
 ? 'hover:-translate-y-1 shadow-sm hover:shadow-lg transition-all duration-300 ease-out' 
 : 'shadow-sm transition-all duration-200';

 return (
 <motion.div
 onClick={onClick}
 className={`rounded-2xl border ${getVariantStyles(variant)} ${transformStyles} ${interactiveStyles} ${className}`}
 >
 {children}
 </motion.div>
 );
};
