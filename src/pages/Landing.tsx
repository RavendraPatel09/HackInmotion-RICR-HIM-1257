import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import { CityMap } from '../components/map/CityMap';
import { showToast } from '../components/ui/Toast';
import {
  Zap,
  Map,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Users,
  FileCheck,
  ArrowUpRight,
  Activity,
  MapPin,
  ArrowRightLeft,
  Mail
} from 'lucide-react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  const { issues, upvoteIssue } = useIssues();
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [citySelection, setCitySelection] = useState<string>('Bhopal');

  useEffect(() => {
    // Dynamic city detection if logged in
    if (user?.settings?.city_preference) {
      setCitySelection(user.settings.city_preference);
    }
  }, [user]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Derive dynamic stats from Context
  const totalReportsCount = issues.length;
  const activeReportsCount = issues.filter((i) => i.status !== 'Resolved' && i.status !== 'Verified').length;
  const resolvedReportsCount = issues.filter((i) => i.status === 'Resolved' || i.status === 'Verified').length;
  const highPriorityCount = issues.filter((i) => i.priority === 'High' || i.priority === 'Critical').length;
  const verifiedCount = issues.filter((i) => i.status === 'Verified').length;

  // Recent issues from local storage context to populate activity feed
  const recentIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
      .slice(0, 3);
  }, [issues]);

  // Top upvoted community issues
  const communityIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
  }, [issues]);

  const handleCategoryClick = (catId: string) => {
    navigate(`/citizen/issues?category=${catId}`);
  };

  const handleCommunityUpvote = async (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please log in to upvote community issues.', 'warning');
      return;
    }
    await upvoteIssue(issueId, user.id);
  };

  const categories = [
    { id: 'roads', title: 'Roads & Potholes', icon: '🛣️', desc: 'Report waterlogged potholes, cracks, or damage', accent: 'border-blue-500/30 text-blue-400' },
    { id: 'lights', title: 'Street Lights', icon: '💡', desc: 'Unlit street lamps or broken posts on roads', accent: 'border-yellow-500/30 text-yellow-400' },
    { id: 'waste', title: 'Waste & Garbage', icon: '🗑️', desc: 'Overflowing dustbins, garbage dumps, or trash pileup', accent: 'border-emerald-500/30 text-emerald-400' },
    { id: 'water', title: 'Water Leakage', icon: '🚰', desc: 'Leaking water pipelines or public tap overflow', accent: 'border-cyan-500/30 text-cyan-400' },
    { id: 'traffic', title: 'Traffic & Parking', icon: '🚦', desc: 'Encroached spaces, illegal parking, or signal damage', accent: 'border-purple-500/30 text-purple-400' },
    { id: 'parks', title: 'Parks & Playgrounds', icon: '🌳', desc: 'Damaged benches, wild grass, or broken equipment', accent: 'border-green-500/30 text-green-400' },
    { id: 'infra', title: 'Public Infrastructure', icon: '🏢', desc: 'Damaged footpaths, municipal offices, or public toilets', accent: 'border-indigo-500/30 text-indigo-400' },
    { id: 'electricity', title: 'Electricity', icon: '⚡', desc: 'Hanging electric wires, transformer spark, or power poles', accent: 'border-amber-500/30 text-amber-400' },
    { id: 'transport', title: 'Public Transport', icon: '🚌', desc: 'Damaged bus shelters, metro facilities, or bus schedules', accent: 'border-blue-500/30 text-blue-400' },
    { id: 'health', title: 'Public Health', icon: '🏥', desc: 'Stagnant water breeding, mosquito sprays, open drains', accent: 'border-rose-500/30 text-rose-400' },
    { id: 'safety', title: 'Public Safety', icon: '👮', desc: 'Unsafe dark stretches, security camera failures, patrolling', accent: 'border-red-500/30 text-red-400' },
    { id: 'drainage', title: 'Drainage & Sewage', icon: '💧', desc: 'Choked gutters, overflowing manholes, or sewer damage', accent: 'border-teal-500/30 text-teal-400' },
    { id: 'air', title: 'Air Pollution', icon: '💨', desc: 'Industrial smoke venting, crop burning, or dust emissions', accent: 'border-slate-500/30 text-slate-400' },
    { id: 'noise', title: 'Noise Pollution', icon: '🔊', desc: 'Illegal loudspeaker usage, industrial noise after limits', accent: 'border-indigo-500/30 text-indigo-400' },
    { id: 'encroachment', title: 'Encroachment', icon: '🚧', desc: 'Street vendors blockage, footpaths occupied illegally', accent: 'border-orange-500/30 text-orange-400' },
    { id: 'other', title: 'Other Civic Issues', icon: '📝', desc: 'Any other local municipal complaints that need routing', accent: 'border-slate-500/30 text-slate-400' },
  ];

  return (
    <div ref={heroRef} className="w-full bg-[#050816] text-white min-h-screen py-8 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      
      {/* BACKGROUND DECORATIVE GRADIENTS */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-60 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
        
        {/* ======================================================
            1. HERO SECTION
            ====================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="gsap-reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-[#1F2E47] shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Together, building better cities for a better India.
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="gsap-reveal text-5xl sm:text-6xl font-black tracking-tight leading-[1.05]">
                YOUR CITY. <br />
                <span className="bg-gradient-to-r from-amber-500 via-white to-emerald-500 bg-clip-text text-transparent">
                  YOUR VOICE.
                </span>
              </h1>
              <p className="gsap-reveal text-lg font-bold text-slate-200">
                Report problems. Track progress. Make your community better.
              </p>
              <p className="gsap-reveal text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-semibold">
                NagarSathi connects citizens with civic departments to report local problems, track resolution progress and make public services more transparent.
              </p>
            </div>

            {/* CTAs */}
            <div className="gsap-reveal flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/citizen/report"
                className="relative group overflow-hidden px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-[0_4px_20px_rgba(79,70,229,0.35)] flex items-center justify-center gap-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Report an Issue</span>
              </Link>

              <Link
                to="/map"
                className="px-7 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-white font-extrabold text-xs border border-slate-800 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
              >
                <Map className="w-4 h-4 text-indigo-400" />
                <span>Explore City Map</span>
              </Link>

              <Link
                to="/citizen/issues"
                className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group ml-2"
              >
                <span>Track My Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="gsap-reveal text-[10px] text-slate-500 font-extrabold flex items-center gap-1.5 pt-2 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
              <span>Active Reports in {citySelection}: <strong className="text-slate-300 font-black">{activeReportsCount} complaints</strong></span>
            </p>
          </div>

          {/* Right Map Preview */}
          <div className="lg:col-span-5 gsap-reveal">
            <div className="h-[360px] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl relative bg-slate-900/40 backdrop-blur-md">
              <CityMap issues={issues} className="h-full w-full" zoom={11} />
              
              {/* Map Floating Indicator */}
              <div className="absolute bottom-4 left-4 z-[999] bg-[#101827]/90 border border-slate-800 p-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider space-y-1 shadow-lg">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Reported</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolved</div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            2. FEATURE ACTION CARDS
            ====================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -4, borderColor: '#4F46E5', boxShadow: '0 8px 30px rgba(79, 70, 229, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/citizen/report')}
            className="p-6 rounded-3xl bg-[#121B2B] border border-slate-800/80 cursor-pointer space-y-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-white">Report an Issue</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Tell the city what needs fixing. Add photos, location and details so the right department can act faster.
              </p>
            </div>
            <p className="text-[10px] text-indigo-400 font-extrabold flex items-center gap-1 group">
              Report Now <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, borderColor: '#F59E0B', boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/citizen/issues')}
            className="p-6 rounded-3xl bg-[#121B2B] border border-slate-800/80 cursor-pointer space-y-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-white">Track Your Report</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Follow your complaint from Reported &rarr; Acknowledged &rarr; In Progress &rarr; Resolved &rarr; Verified.
              </p>
            </div>
            <p className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1 group">
              Track Issue <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, borderColor: '#10B981', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/map')}
            className="p-6 rounded-3xl bg-[#121B2B] border border-slate-800/80 cursor-pointer space-y-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <Map className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-white">Explore City Map</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                See civic issues around your area and explore active complaints, locations and resolution status.
              </p>
            </div>
            <p className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1 group">
              Open Map <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </p>
          </motion.div>
        </section>

        {/* ======================================================
            3. CITY AT A GLANCE
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight">City at a Glance</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto font-semibold">
              A quick look at what's happening across your community in {citySelection}.
            </p>
            <div className="h-[2px] w-16 bg-gradient-to-r from-amber-500 via-white to-emerald-500 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Issues', val: totalReportsCount, color: 'text-white border-slate-800 bg-[#121B2B]' },
              { label: 'Resolved', val: resolvedReportsCount, color: 'text-emerald-450 border-emerald-950 bg-[#121B2B]' },
              { label: 'In Progress', val: activeReportsCount, color: 'text-amber-500 border-amber-950 bg-[#121B2B]' },
              { label: 'High Priority', val: highPriorityCount, color: 'text-rose-500 border-rose-950 bg-[#121B2B]' },
              { label: 'Verified Fixed', val: verifiedCount, color: 'text-cyan-400 border-cyan-950 bg-[#121B2B]' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border text-center space-y-1.5 shadow-md ${stat.color}`}
              >
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black font-mono">{stat.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================
            4. HOW NAGARSATHI WORKS
            ====================================================== */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#0B1220] border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-2 relative z-10">
            <h2 className="text-2xl font-black">How NagarSathi Works</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              From reporting a problem to verified resolution — everything stays visible.
            </p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { step: '01', title: 'REPORT', desc: 'Submit a civic issue with location, description and photo evidence.' },
              { step: '02', title: 'ROUTE', desc: 'NagarSathi routes the issue to the appropriate civic department.' },
              { step: '03', title: 'RESOLVE', desc: 'The responsible department works on the issue and updates its progress.' },
              { step: '04', title: 'VERIFY', desc: 'Citizens can verify the resolution before the complaint is considered closed.' },
            ].map((t, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-black text-base shadow-lg">
                  {t.step}
                </div>
                <h4 className="font-extrabold text-xs tracking-wider uppercase text-white">{t.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold px-2">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================
            5. WHAT CAN YOU REPORT
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">What Can You Report?</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              From roads and waste to water, safety and public infrastructure — raise issues that affect your community.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -3, borderColor: '#6366F1' }}
                onClick={() => handleCategoryClick(cat.id)}
                className="p-4 rounded-2xl bg-[#121B2B] border border-slate-800/60 cursor-pointer space-y-2.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl shrink-0">{cat.icon}</span>
                  <h4 className="font-extrabold text-xs text-white truncate">{cat.title}</h4>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
                <p className="text-[9px] text-indigo-400 font-extrabold flex items-center gap-0.5 mt-2">
                  Explore Reports <ArrowUpRight className="w-3 h-3" />
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ======================================================
            6. WHAT'S HAPPENING (RECENT GRIEVE FEED)
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">What's Happening in Your City?</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              See the latest civic reports logged and monitored dynamically across neighborhoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate('/citizen/issues')}
                  className="p-5 bg-[#121B2B] border border-slate-800/80 hover:border-indigo-500 rounded-2xl cursor-pointer transition-all duration-250 flex flex-col justify-between h-48 group shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900 px-2 py-0.5 rounded">
                        {issue.trackingId}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        issue.status === 'Resolved' || issue.status === 'Verified'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/30'
                          : 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/30'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-white line-clamp-1 group-hover:text-indigo-455 transition-colors">
                      {issue.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                      {issue.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-bold">
                    <span>{issue.address.split(',')[0]}</span>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Track <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-550 text-xs font-semibold bg-[#121B2B] rounded-3xl border border-slate-805">
                No active complaints filed.
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            7. COMMUNITY VOTING SECTION
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Problems Your Community Cares About</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              These issues have been identified as affecting multiple citizens. Upvote to boost their municipal routing priority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityIssues.length > 0 ? (
              communityIssues.map((issue) => {
                const hasVoted = user && issue.upvotedBy.includes(user.id);
                return (
                  <div
                    key={issue.id}
                    className="p-5 bg-[#121B2B] border border-slate-800/80 rounded-2xl flex flex-col justify-between h-52 shadow-lg space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 font-mono">{issue.address.split(',')[0]}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-black">
                          <Users className="w-3.5 h-3.5" /> {issue.upvotes} Votes
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-white line-clamp-1">{issue.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleCommunityUpvote(issue.id, e)}
                      className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border ${
                        hasVoted
                          ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900 hover:bg-indigo-950/50'
                          : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-500'
                      }`}
                    >
                      <PlusCircleIcon className="w-4 h-4" />
                      <span>{hasVoted ? 'Affected Too (Registered)' : 'I Have This Problem Too'}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-500 text-xs font-semibold">
                No active issues to upvote.
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            8. WHY NAGARSATHI?
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Why NagarSathi?</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              NagarSathi was created to make communication between citizens and civic departments clearer, faster and more transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'REPORT EASILY', desc: 'Track problems without visiting multiple offices. Fast GPS geo-tagging.', icon: <Zap className="w-5 h-5 text-indigo-400" /> },
              { title: 'TRACK PROGRESS', desc: 'Know what happens after submitting a complaint in real-time status chains.', icon: <Activity className="w-5 h-5 text-amber-500" /> },
              { title: 'SMART ROUTING', desc: 'Autoselect category mapping which matches complaints to department backends.', icon: <ArrowRightLeft className="w-5 h-5 text-emerald-400" /> },
              { title: 'PHOTO + LOCATION EVIDENCE', desc: 'Attach coordinates and images directly to reports to avoid municipal lookup confusion.', icon: <MapPin className="w-5 h-5 text-cyan-400" /> },
              { title: 'COMMUNITY VOICE', desc: 'Let collective priority voting push critical zone alerts directly to ward engineers.', icon: <Users className="w-5 h-5 text-rose-400" /> },
              { title: 'TRANSPARENT RESOLUTION', desc: 'Read supervisor logs, view resolution photos, and verify status changes directly.', icon: <FileCheck className="w-5 h-5 text-purple-400" /> },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#121B2B] border border-slate-800/80 space-y-3 shadow-md hover:border-slate-700/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                  {feat.icon}
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{feat.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================
            9. STORYTELLING: WHY WE CREATED NAGARSATHI
            ====================================================== */}
        <section className="bg-gradient-to-br from-slate-950 via-[#0B1220] to-indigo-950 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-slate-800 shadow-xl space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-500 text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NagarSathi Slogan &amp; Integrity</span>
            </div>

            <h3 className="text-3xl font-black">Why We Created NagarSathi</h3>
            
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold">
              Everyday civic problems — broken roads, overflowing garbage, leaking pipelines, damaged streetlights and unsafe public spaces — affect thousands of people. But reporting a problem is only the first step.
            </p>

            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold">
              NagarSathi was created to bridge the gap between citizens and civic departments by making reporting easier, tracking clearer and resolution more transparent.
            </p>

            <p className="text-sm font-black text-amber-400 italic">
              "Because a better city starts with a citizen who speaks up."
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-6 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              YOUR CITY. YOUR VOICE.
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:inline">
              Report it. Track it. Fix it.
            </span>
          </div>
        </section>

        {/* ======================================================
            10. SUGGESTIONS / FEEDBACK BANNER
            ====================================================== */}
        <section className="p-8 rounded-3xl bg-[#0B1220] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1 relative z-10">
            <h3 className="text-base font-black text-white">Have a suggestion?</h3>
            <p className="text-xs text-slate-400 font-semibold">Help us make NagarSathi better for your city. Report application bugs or share feedback.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md transition-colors"
            >
              Give Feedback
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-extrabold text-[10px] uppercase tracking-wider transition-colors"
            >
              Report a Bug
            </Link>
            <a
              href="mailto:contact@nagarsathi.gov"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 font-extrabold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> Contact Us
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

// Simple Icon fallback
const PlusCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);
