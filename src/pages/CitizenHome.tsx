import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { IssueCard } from '../components/issues/IssueCard';
import { CityMap } from '../components/map/CityMap';
import { getAllDepartmentTransparencies } from '../services/transparencyScore';
import {
  Zap,
  MapPin,
  CheckCircle2,
  ListTodo,
  Clock,
  ThumbsUp,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Camera,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CitizenHome: React.FC = () => {
  const { user } = useAuth();
  const { issues } = useIssues();
  const navigate = useNavigate();

  const [nearbyFilter, setNearbyFilter] = useState<'all' | 'high_priority' | 'in_progress' | 'resolved'>('all');

  const myIssues = issues.filter((i) => i.reportedBy === user?.name || i.upvotedBy.includes(user?.id || ''));
  const myResolved = myIssues.filter((i) => i.status === 'Resolved' || i.status === 'Verified');
  const myInProgress = myIssues.filter((i) => i.status === 'In Progress' || i.status === 'Acknowledged');
  const totalUpvotes = myIssues.reduce((acc, curr) => acc + curr.upvotes, 0);

  const recentReports = issues.slice(0, 4);

  const communityPriorityIssues = [...issues]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  const deptTransparencies = getAllDepartmentTransparencies(issues).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      {/* 1. Hero Section — Two Column Desktop Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Left Column — Headline & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F1EE] border border-[#B8CCC5] text-[#053229] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Civic Issue Resolution Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#10201C] tracking-tight leading-[1.1] flex flex-col gap-1.5">
            <span>Make your city better.</span>
            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#053229] font-serif italic">
              Hamara Shehar, Hamari Awaaz
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#536761] leading-relaxed font-medium max-w-xl">
            Report civic issues, track progress, and help your community get things fixed across India.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/report"
              className="px-7 py-3.5 rounded-2xl bg-[#053229] hover:bg-[#07483A] text-white font-extrabold text-sm shadow-xl shadow-[#053229]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              ＋ Report an Issue
            </Link>

            <Link
              to="/reports"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-850 font-extrabold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              View My Issues &rarr;
            </Link>
          </div>

          <p className="text-xs text-[#73827D] font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            Your report is automatically routed to the right department.
          </p>
        </motion.div>

        {/* Right Column — Product Visualization Map Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl overflow-hidden bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-2 shadow-2xl">
            <CityMap issues={issues.slice(0, 10)} className="h-[360px] w-full rounded-2xl overflow-hidden" />
            
            {/* Soft Glass Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 glass-modal p-3.5 rounded-2xl flex items-center justify-between text-xs border border-white/40 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-[#10201C]">Live Civic Reports Across India</span>
              </div>
              <span className="font-extrabold text-[#053229]">{issues.length} Live Pins</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Floating Quick Report Glass Card */}
      <section className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#053229]">
            Report in 10 Seconds
          </span>
          <h3 className="text-xl font-black text-[#10201C]">See something that needs fixing?</h3>
          <p className="text-xs text-[#73827D] flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#07483A]" /> GPS Location</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5 text-[#07483A]" /> Photo Upload</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[#07483A]" /> Fast Submission</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/report')}
          className="px-6 py-3 rounded-2xl bg-[#053229] hover:bg-[#07483A] text-white font-extrabold text-xs shadow-lg shadow-[#053229]/30 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          Start Quick Report &rarr;
        </button>
      </section>

      {/* 3. Horizontal Responsive Statistics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-5 text-center space-y-1">
          <ListTodo className="w-5 h-5 text-[#07483A] mx-auto" />
          <h3 className="text-3xl font-black text-[#10201C]">
            <AnimatedCounter value={myIssues.length} />
          </h3>
          <p className="text-xs font-bold text-[#73827D]">My Reports</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-5 text-center space-y-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
          <h3 className="text-3xl font-black text-emerald-600">
            <AnimatedCounter value={myResolved.length} />
          </h3>
          <p className="text-xs font-bold text-[#73827D]">Resolved</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-5 text-center space-y-1">
          <Clock className="w-5 h-5 text-amber-500 mx-auto" />
          <h3 className="text-3xl font-black text-amber-600">
            <AnimatedCounter value={myInProgress.length} />
          </h3>
          <p className="text-xs font-bold text-[#73827D]">In Progress</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-5 text-center space-y-1">
          <ThumbsUp className="w-5 h-5 text-cyan-500 mx-auto" />
          <h3 className="text-3xl font-black text-cyan-600">
            <AnimatedCounter value={totalUpvotes} />
          </h3>
          <p className="text-xs font-bold text-[#73827D]">Community Upvotes</p>
        </div>
      </section>

      {/* 4. Recent Reports Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#10201C]">Recent Reports</h2>
          <Link to="/reports" className="text-xs font-bold text-[#053229] hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentReports.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      {/* 5. Issues Near You (Map Visualization with Glass Chips) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#10201C] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#053229]" /> Issues Near You
          </h2>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'high_priority', 'in_progress', 'resolved'] as const).map((chip) => (
              <button
                key={chip}
                onClick={() => setNearbyFilter(chip)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                  nearbyFilter === chip
                    ? 'bg-[#053229] text-white shadow-md'
                    : 'bg-white rounded-2xl border border-[#D6E2DE] shadow-sm text-[#536761] hover:bg-slate-200'
                }`}
              >
                {chip.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <CityMap issues={issues} className="h-[450px] w-full rounded-3xl overflow-hidden bg-white border border-[#D6E2DE] shadow-sm shadow-xl" />
      </section>

      {/* 6. Community Priority Rankings (#1, #2, #3) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#10201C] flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" /> Community Priority Ranking
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityPriorityIssues.map((issue, idx) => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-6 space-y-4 relative overflow-hidden hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-500 font-mono">#{idx + 1}</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-extrabold flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" /> {issue.upvotes} Upvotes
                </span>
              </div>

              <h4 className="font-bold text-base text-[#10201C] line-clamp-1">{issue.title}</h4>
              <p className="text-xs text-[#73827D] line-clamp-2 leading-relaxed">{issue.description}</p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-[#73827D]">
                <span className="truncate max-w-[160px]">{issue.address}</span>
                <Link to="/reports" className="font-bold text-[#053229] hover:underline flex items-center gap-0.5">
                  Upvote <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Department Transparency Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#10201C] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" /> How is your city performing?
          </h2>
          <Link to="/transparency" className="text-xs font-bold text-[#053229] hover:underline flex items-center gap-1">
            View all scores <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deptTransparencies.map((dept) => (
            <div key={dept.departmentId} className="bg-white rounded-2xl border border-[#D6E2DE] shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#10201C]">{dept.departmentName}</h4>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 font-black flex items-center justify-center text-base border border-emerald-500/30">
                  {dept.grade}
                </span>
              </div>
              <div className="space-y-1 text-xs text-[#73827D]">
                <p><strong className="text-[#10201C]">{dept.resolutionRate}%</strong> resolution rate</p>
                <p>Average resolution time: <strong className="text-[#10201C]">{dept.avgResolutionHours} hours</strong></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Minimal Product Footer */}
      <footer className="pt-8 border-t border-slate-200 text-center space-y-3 text-xs text-[#73827D]">
        <div className="flex justify-center items-center gap-6 font-bold">
          <Link to="/report" className="hover:text-[#10201C]">Report Issue</Link>
          <Link to="/reports" className="hover:text-[#10201C]">My Issues</Link>
          <Link to="/map" className="hover:text-[#10201C]">City Map</Link>
          <Link to="/transparency" className="hover:text-[#10201C]">Transparency</Link>
        </div>
        <p className="text-[11px]">Building better cities, one report at a time. • NagarSathi Smart City Platform</p>
      </footer>
    </div>
  );
};
