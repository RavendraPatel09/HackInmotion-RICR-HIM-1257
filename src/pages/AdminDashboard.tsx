import React from 'react';
import { useIssues } from '../context/IssuesContext';
import { StatCard } from '../components/ui/StatCard';
import { IssueCard } from '../components/issues/IssueCard';
import { DEPARTMENTS } from '../data/departments';
import {
  ListTodo,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { issues } = useIssues();

  const openIssues = issues.filter((i) => i.status !== 'Resolved' && i.status !== 'Verified');
  const escalatedIssues = issues.filter((i) => i.escalated);
  const inProgressIssues = issues.filter((i) => i.status === 'In Progress' || i.status === 'Acknowledged');
  const resolvedIssues = issues.filter((i) => i.status === 'Resolved' || i.status === 'Verified');
  const needsAttentionIssues = issues.filter((i) => i.escalated || i.priority === 'Critical' || i.priority === 'High');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* 1. Admin Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-extrabold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> Bhopal Smart City Operations
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Good morning, Admin.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Here's what needs your attention today in the municipal queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/queue"
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ListTodo className="w-4 h-4" /> Open Work Queue
          </Link>
        </div>
      </div>

      {/* 2. Large KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Issues"
          value={openIssues.length}
          icon={ListTodo}
          color="indigo"
          subtitle="Awaiting resolution"
        />
        <StatCard
          title="Escalated"
          value={escalatedIssues.length}
          icon={AlertTriangle}
          color="rose"
          subtitle="Unresolved > 72 hours"
          trend={`${escalatedIssues.length} Critical`}
          trendType="negative"
        />
        <StatCard
          title="In Progress"
          value={inProgressIssues.length}
          icon={Clock}
          color="amber"
          subtitle="Dispatched to field teams"
        />
        <StatCard
          title="Resolved"
          value={resolvedIssues.length}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Fixed & Verified"
        />
      </div>

      {/* 3. Needs Attention Section (Highest Priority) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500 animate-pulse" /> Needs Attention ({needsAttentionIssues.length})
          </h2>
          <Link to="/admin/queue" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            Review All Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {needsAttentionIssues.slice(0, 4).map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      {/* 4. Department Workload Overview Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Department Workload Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(DEPARTMENTS).map((dept) => {
            const deptIssues = issues.filter((i) => i.department === dept.id);
            const openDept = deptIssues.filter((i) => i.status !== 'Resolved' && i.status !== 'Verified').length;
            const escDept = deptIssues.filter((i) => i.escalated).length;
            const resRate = deptIssues.length > 0 ? Math.round(((deptIssues.length - openDept) / deptIssues.length) * 100) : 100;

            return (
              <div key={dept.id} className="glass-card p-6 rounded-3xl space-y-4 shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{dept.name}</h3>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    SLA: {dept.avgResolutionTime}h
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex justify-between">
                    <span>Active Issues:</span>
                    <strong className="text-slate-900 dark:text-white">{openDept} / {deptIssues.length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Escalations:</span>
                    <strong className={escDept > 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'}>
                      {escDept}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fix Rate:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{resRate}%</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${resRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
