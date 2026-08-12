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
    indigo: 'from-indigo-500/10 to-blue-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-600 dark:text-rose-400 border-rose-500/20',
    cyan: 'from-cyan-500/10 to-sky-500/5 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  };

  const selectedClass = colorGradients[color] || colorGradients.indigo;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 p-5 shadow-lg dark:shadow-xl backdrop-blur-xl transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trendType === 'positive'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : trendType === 'negative'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-xl border bg-gradient-to-br ${selectedClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
