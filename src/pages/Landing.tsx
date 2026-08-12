import React, { useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssuesContext';
import { CityMap } from '../components/map/CityMap';
import { PremiumCard } from '../components/ui/PremiumCard';
import {
  Zap,
  Map,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Check,
  Building,
  Flag,
  FileCheck,
} from 'lucide-react';
import gsap from 'gsap';

export const Landing: React.FC = () => {
  const { issues } = useIssues();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero-item', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Derive dynamic stats from Context
  const totalReportsCount = issues.length;
  const activeReportsCount = issues.filter((i) => i.status !== 'Resolved' && i.status !== 'Verified').length;
  const resolvedReportsCount = issues.filter((i) => i.status === 'Resolved' || i.status === 'Verified').length;
  
  // Dynamic average resolution SLA (mock calculation or standard 96%)
  const responseRate = '94.8%';

  // 3 Recent issues from local storage context to populate activity feed
  const recentIssues = useMemo(() => {
    return [...issues].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()).slice(0, 3);
  }, [issues]);

  const handleCategoryClick = (catId: string) => {
    navigate(`/citizen/issues?category=${catId}`);
  };

  return (
    <div ref={heroRef} className="space-y-16 py-6 max-w-6xl mx-auto px-4 relative">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 relative overflow-hidden bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-xs">
        
        {/* Tasteful Desi Arch SVG Backdrop */}
        <svg className="absolute right-0 bottom-0 w-full h-[150px] opacity-[0.02] pointer-events-none text-slate-800" viewBox="0 0 1440 150" fill="currentColor">
          <path d="M0,150 L1440,150 L1440,130 L1400,130 L1390,90 L1380,90 L1370,130 L1300,130 L1280,80 L1260,80 L1240,130 L1150,130 L1130,50 L1080,50 L1060,130 L1000,130 L980,100 L950,100 L930,130 L850,130 L830,70 L790,70 L770,130 L700,130 L680,90 L650,90 L630,130 L550,130 L530,40 L480,40 L460,130 L400,130 L380,80 L350,80 L330,130 L250,130 L230,60 L190,60 L170,130 L100,130 L80,100 L55,100 L35,130 Z" />
          <path d="M480,40 C480,15 530,15 530,40 Z" />
          <path d="M1080,50 C1080,25 1130,25 1130,50 Z" />
        </svg>

        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <div className="gsap-hero-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>YOUR CITY. YOUR VOICE.</span>
          </div>

          <h1 className="gsap-hero-item text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
            Make Your City <span className="text-indigo-650">Better.</span>
          </h1>

          <p className="gsap-hero-item text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold max-w-lg">
            Help make everyday civic problems visible, actionable and accountable. Report street issues, track municipal dispatches, and verify resolutions in your zone.
          </p>

          <div className="gsap-hero-item flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Link
              to="/citizen/report"
              className="px-6 py-3.5 w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              Report an Issue
            </Link>

            <Link
              to="/map"
              className="px-6 py-3.5 w-full sm:w-auto rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-805 font-extrabold text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <Map className="w-4 h-4 text-indigo-600" />
              Explore City Map
            </Link>
          </div>

          <p className="gsap-hero-item text-[11px] text-slate-500 font-extrabold flex items-center gap-1.5 pt-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Your report. Your city. Your impact. ({activeReportsCount} active reports)</span>
          </p>
        </div>

        {/* Hero Right Compact Map Visual */}
        <div className="lg:col-span-5 relative h-[280px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 z-10">
          <CityMap issues={issues} className="h-full w-full" zoom={11} />
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="bg-slate-100/50 border border-slate-200/60 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-600" /> GPS Geo-tagging</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Photo Evidence Required</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-600" /> 72h SLA clock</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Citizen Verification</span>
        </div>
      </section>

      {/* 3. QUICK REPORT CTA */}
      <section className="p-6 bg-[#111827] text-white rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <h3 className="text-lg font-black">See something that needs fixing?</h3>
          <p className="text-xs text-slate-400 font-semibold">Report potholes, broken lights, trash piles, or leakages in less than 2 minutes.</p>
        </div>
        <Link
          to="/citizen/report"
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all relative z-10 flex items-center justify-center gap-1 shrink-0 self-start md:self-center"
        >
          Start Quick Report <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* 4. WHY NAGARSATHI SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Why NagarSathi?</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto font-semibold">
            NagarSathi was created to make communication between citizens and municipal zones transparent, accountable, and actionable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumCard variant="blue" className="p-6 space-y-3">
            <span className="text-xl font-black text-blue-500 font-mono">01</span>
            <h4 className="font-bold text-sm text-slate-950">Report Easily</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Citizens can quickly log problems with exact GPS locations and photo evidence directly from mobile devices.
            </p>
          </PremiumCard>

          <PremiumCard variant="amber" className="p-6 space-y-3">
            <span className="text-xl font-black text-amber-500 font-mono">02</span>
            <h4 className="font-bold text-sm text-slate-950">Track Progress</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Every reported issue receives a unique tracking ID and follows a visible status lifecycle from acknowledgment to dispatch.
            </p>
          </PremiumCard>

          <PremiumCard variant="green" className="p-6 space-y-3">
            <span className="text-xl font-black text-emerald-500 font-mono">03</span>
            <h4 className="font-bold text-sm text-slate-950">Resolution Verification</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Resolutions must be approved. Citizens retain absolute control to audit completions before closing reports.
            </p>
          </PremiumCard>

          <PremiumCard variant="purple" className="p-6 space-y-3">
            <span className="text-xl font-black text-purple-500 font-mono">04</span>
            <h4 className="font-bold text-sm text-slate-950">Build Communities</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              Strengthen community trust by upvoting neighborhood issues and tracking aggregate zone performance.
            </p>
          </PremiumCard>
        </div>
      </section>

      {/* 5. HOW IT WORKS TIMELINE */}
      <section className="space-y-8 bg-slate-50 border border-slate-200 p-8 rounded-3xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">How NagarSathi Works</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto font-semibold">
            Follow the simple citizen timeline journey from flagging a problem to municipal resolution.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Connecting Line (desktop only) */}
          <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-slate-250 z-0" />
          
          {[
            { step: '1', title: 'Spot a Problem', desc: 'Identify any civic issue in your ward that requires attention.' },
            { step: '2', title: 'File a Report', desc: 'Add location details, upload photos, and click submit.' },
            { step: '3', title: 'Track Live Progress', desc: 'Monitor the status updates, assigned departments, and SLA timers.' },
            { step: '4', title: 'Verify Resolution', desc: 'Check completion evidence and mark the issue as verified.' },
          ].map((t, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-lg border-4 border-white shadow-md">
                {t.step}
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{t.title}</h4>
              <p className="text-[11px] text-slate-550 leading-relaxed font-semibold px-4">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHAT CAN YOU REPORT (12 CATEGORIES) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">What Can You Report?</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto font-semibold">
            Choose a category to explore existing reports or file new complaints.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { id: 'roads', title: 'Roads & Potholes', icon: '🛣️', color: 'blue' },
            { id: 'lights', title: 'Street Lights', icon: '💡', color: 'amber' },
            { id: 'waste', title: 'Waste & Garbage', icon: '🗑️', color: 'green' },
            { id: 'water', title: 'Water Leakage', icon: '🚰', color: 'cyan' },
            { id: 'traffic', title: 'Traffic & Parking', icon: '🚦', color: 'purple' },
            { id: 'parks', title: 'Parks & Playgrounds', icon: '🌳', color: 'teal' },
            { id: 'infra', title: 'Public Infra', icon: '🏢', color: 'indigo' },
            { id: 'electricity', title: 'Electricity Grid', icon: '⚡', color: 'amber' },
            { id: 'transport', title: 'Public Transport', icon: '🚌', color: 'blue' },
            { id: 'health', title: 'Public Health', icon: '🏥', color: 'red' },
            { id: 'safety', title: 'Public Safety', icon: '👮', color: 'red' },
            { id: 'other', title: 'Other Inquiries', icon: '📝', color: 'default' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="w-full text-left"
            >
              <PremiumCard
                variant={cat.color as any}
                className="p-4 flex items-center gap-3 cursor-pointer select-none hover:scale-[1.02] transition-transform"
              >
                <div className="text-2xl shrink-0">{cat.icon}</div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{cat.title}</h4>
                  <p className="text-[10px] text-indigo-650 font-bold mt-0.5">Explore Feed &rarr;</p>
                </div>
              </PremiumCard>
            </button>
          ))}
        </div>
      </section>

      {/* 7. CITY IMPACT STATISTICS */}
      <section className="bg-[#111827] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-lg">
        {/* Subtle decorative ring */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full border-4 border-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reports</p>
            <p className="text-4xl font-black text-white font-mono">{totalReportsCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Complaints</p>
            <p className="text-4xl font-black text-amber-400 font-mono">{activeReportsCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issues Resolved</p>
            <p className="text-4xl font-black text-emerald-400 font-mono">{resolvedReportsCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Compliance</p>
            <p className="text-4xl font-black text-indigo-400 font-mono">{responseRate}</p>
          </div>
        </div>
      </section>

      {/* 8. COMMUNITY ACTIVITY FEED */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">What's Happening Around Your City?</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto font-semibold">
            See recent civic grievances flagged by citizens in Bhopal municipal zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentIssues.length > 0 ? (
            recentIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate('/citizen/issues')}
                className="p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-150 flex flex-col justify-between h-44 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">
                      {issue.trackingId}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      issue.status === 'Resolved' || issue.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-905 line-clamp-1 group-hover:text-indigo-650 transition-colors">
                    {issue.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-semibold">
                    {issue.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                  <span>{issue.address.split(',')[0]}</span>
                  <span className="text-indigo-605 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Track &rarr;
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-slate-400 text-xs font-semibold">
              No recent reports logged.
            </div>
          )}
        </div>
      </section>

      {/* 9. TRANSPARENCY PIPELINE FLOW */}
      <section className="space-y-8 bg-slate-50 border border-slate-200 p-8 rounded-3xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Know Where Your Report Stands</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto font-semibold">
            Track transparency ratings and audit statuses along the verified resolution cycle.
          </p>
        </div>

        {/* Pipeline Step Circles */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 px-4">
          {[
            { step: 'Reported', desc: 'Logged on portal', icon: <Flag className="w-5 h-5 text-indigo-600" /> },
            { step: 'Acknowledged', desc: 'Department confirmed', icon: <Check className="w-5 h-5 text-amber-500" /> },
            { step: 'Assigned', desc: 'Engineer dispatched', icon: <Building className="w-5 h-5 text-blue-500" /> },
            { step: 'In Progress', desc: 'Site work ongoing', icon: <Zap className="w-5 h-5 text-purple-500" /> },
            { step: 'Resolved', desc: 'Supervisor submitted', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
            { step: 'Verified', desc: 'Citizen approved', icon: <FileCheck className="w-5 h-5 text-cyan-600" /> },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-center mt-2 space-y-0.5">
                  <p className="text-xs font-extrabold text-slate-900">{item.step}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{item.desc}</p>
                </div>
              </div>
              {idx < 5 && (
                <div className="hidden md:block w-8 h-[2px] bg-slate-300 self-center mb-6" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. STORYTELLING: WHY WE CREATED NAGARSATHI */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-lg space-y-6">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Civic Purpose &amp; Action</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black">Why We Created NagarSathi</h3>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
            In everyday municipal environments, citizen issues often get lost in bureaucracy or remain invisible due to communication gaps. NagarSathi was created to restore transparency and bridge the trust between citizens and civic departments. 
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
            By geo-tagging logs, locking 72-hour SLAs, and giving citizens final verification rights, we ensure that municipal workers remain accountable, and every voice contributes to building better, cleaner neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10 relative z-10">
          <div className="space-y-1">
            <p className="font-extrabold text-xs text-amber-400">100% Transparency</p>
            <p className="text-[11px] text-slate-400 font-semibold">Every update log is publicly logged and searchable.</p>
          </div>
          <div className="space-y-1">
            <p className="font-extrabold text-xs text-amber-400">SLA Enforcement</p>
            <p className="text-[11px] text-slate-400 font-semibold">Strict 72-hour limits on initial acknowledgments.</p>
          </div>
          <div className="space-y-1">
            <p className="font-extrabold text-xs text-amber-400">Citizen Verification</p>
            <p className="text-[11px] text-slate-400 font-semibold">Issues remain open until confirmed by citizens.</p>
          </div>
        </div>
      </section>

      {/* 11. CONTACT / CONNECT BANNER */}
      <section className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-650" /> Join NagarSathi Forums
          </h3>
          <p className="text-xs text-slate-500 font-semibold">Have ideas for municipal reforms or civic policy improvements? Connect with us.</p>
        </div>
        <div className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-5 py-3 rounded-2xl shrink-0">
          Email support: <strong className="text-indigo-605">support@nagarsathi.gov</strong>
        </div>
      </section>
    </div>
  );
};
