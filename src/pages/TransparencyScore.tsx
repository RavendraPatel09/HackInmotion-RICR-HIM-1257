import React, { useEffect, useState } from 'react';
import { transparencyApi } from '../services/api';
import type { DepartmentTransparency } from '../types';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const TransparencyScore: React.FC = () => {
  const [transparencies, setTransparencies] = useState<DepartmentTransparency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransparency = async () => {
      try {
        const scoreboard = await transparencyApi.getScoreboard();
        setTransparencies(scoreboard);
      } catch (err) {
        console.error('Failed to load transparency scoreboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransparency();
  }, []);

  const avgCityScore = transparencies.length > 0
    ? Math.round(transparencies.reduce((acc, curr) => acc + curr.transparencyScore, 0) / transparencies.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 text-xs font-bold">Loading Transparency scoreboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Open Government Transparency Audit
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Municipal Transparency Scoreboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Public accountability index derived dynamically from active issue resolution rates, SLA adherence, and citizen verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center min-w-[200px] shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall City Index</p>
            <div className="text-4xl font-black text-emerald-400 mt-1">{avgCityScore}/100</div>
            <p className="text-[10px] text-emerald-300 mt-1 font-semibold">
              {avgCityScore >= 90 ? 'Grade A — High Accountability' : avgCityScore >= 75 ? 'Grade B — Good Standards' : 'Grade C — Under Review'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transparencies.map((dept) => (
          <motion.div
            key={dept.departmentId}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{dept.departmentName}</h3>
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-md ${
                  dept.grade === 'A'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-300'
                    : dept.grade === 'B'
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-300'
                    : dept.grade === 'C'
                    ? 'bg-amber-50 text-amber-600 border border-amber-300'
                    : 'bg-rose-50 text-rose-600 border border-rose-300'
                }`}
              >
                {dept.grade}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Transparency Score</span>
                <span className="text-indigo-600">{dept.transparencyScore}/100</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${dept.transparencyScore}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">"{dept.gradeDescription}"</p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Fix Rate</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{dept.resolutionRate}%</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Avg Fix Time</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{dept.avgResolutionHours}h</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Verified %</span>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{dept.verifiedPercentage}%</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">SLA Breach %</span>
                <p className="text-sm font-bold text-rose-600 mt-0.5">{dept.escalationRate}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
