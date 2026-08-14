import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import { CityMap } from '../components/map/CityMap';
import { showToast } from '../components/ui/Toast';
import { INDIAN_LOCATIONS, type CityInfo } from '../data/locations';
import {
  Zap,
  Map,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Users,
  ArrowUpRight,
  MapPin,
  Mail,
  Sun,
  CloudRain,
  Flame,
  Wind,
  Calendar,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

export const Landing: React.FC = () => {
  const { issues, upvoteIssue } = useIssues();
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  // India-Wide Location States
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [activeCity, setActiveCity] = useState<string>('Pune');
  const [activeState, setActiveState] = useState<string>('Maharashtra');
  
  // Geolocation search state inside modal
  const [modalPincode, setModalPincode] = useState<string>('');
  const [manualState, setManualState] = useState<string>('Maharashtra');
  const [manualCity, setManualCity] = useState<string>('Pune');

  // Seasonal alert / watches tabs state
  const [activeAlertTab, setActiveAlertTab] = useState<'monsoon' | 'heatwave' | 'pollution' | 'events'>('monsoon');

  // City Comparison State
  const [compareCityA, setCompareCityA] = useState<string>('Pune');
  const [compareCityB, setCompareCityB] = useState<string>('Bengaluru');

  // Load location from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nagarsathi_current_location');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          setActiveCity(parsed.name);
          setActiveState(parsed.state || '');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setShowLocationModal(true);
    }
  }, []);

  // Sync with logged in user city preferences if available
  useEffect(() => {
    if (user?.settings?.city_preference) {
      setActiveCity(user.settings.city_preference);
      const matched = INDIAN_LOCATIONS.find(c => c.name.toLowerCase() === user.settings.city_preference.toLowerCase());
      if (matched) {
        setActiveState(matched.state);
        localStorage.setItem('nagarsathi_current_location', JSON.stringify(matched));
      }
    }
  }, [user]);

  // GSAP Entrance animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [activeCity]);

  // Filter issues based on active city selection
  const cityIssues = useMemo(() => {
    return issues.filter((i) => (i.city || '').toLowerCase() === activeCity.toLowerCase());
  }, [issues, activeCity]);

  // Fallback to all issues if city issues is empty (to populate maps and feeds for empty cities)
  const displayIssues = useMemo(() => {
    return cityIssues.length > 0 ? cityIssues : issues;
  }, [cityIssues, issues]);

  // Derive Stats
  const totalReportsCount = displayIssues.length;
  const activeReportsCount = displayIssues.filter((i) => i.status !== 'Resolved' && i.status !== 'Verified').length;
  const resolvedReportsCount = displayIssues.filter((i) => i.status === 'Resolved' || i.status === 'Verified').length;
  const highPriorityCount = displayIssues.filter((i) => i.priority === 'High' || i.priority === 'Critical').length;
  const verifiedCount = displayIssues.filter((i) => i.status === 'Verified').length;

  // Active City Feed (sort by reportedAt desc, limit 3)
  const recentIssues = useMemo(() => {
    return [...displayIssues]
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
      .slice(0, 3);
  }, [displayIssues]);

  // Top Upvoted Community Issues
  const communityIssues = useMemo(() => {
    return [...displayIssues]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
  }, [displayIssues]);

  const handleCategoryClick = (catId: string) => {
    navigate(`/reports?category=${catId}`);
  };

  const handleCommunityUpvote = async (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please log in to upvote community issues.', 'warning');
      return;
    }
    await upvoteIssue(issueId, user.id);
    showToast('Upvote submitted successfully!', 'success');
  };

  // Location selector change handler
  const selectNewCity = (cityObj: CityInfo) => {
    setActiveCity(cityObj.name);
    setActiveState(cityObj.state);
    localStorage.setItem('nagarsathi_current_location', JSON.stringify(cityObj));
    setShowLocationModal(false);
    showToast(`Location context updated to ${cityObj.name}, ${cityObj.state}`, 'success');
  };

  // Modal Pincode Search
  const handleModalPincodeSearch = () => {
    const cleanPin = modalPincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      showToast('Please enter a valid 6-digit Indian Pincode.', 'warning');
      return;
    }

    const pinMap: Record<string, string> = {
      '411038': 'Pune',
      '400001': 'Mumbai',
      '560008': 'Bengaluru',
      '110017': 'Delhi',
      '462011': 'Bhopal',
      '382424': 'Ahmedabad',
    };

    const cityName = pinMap[cleanPin];
    if (cityName) {
      const match = INDIAN_LOCATIONS.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      if (match) {
        selectNewCity(match);
        return;
      }
    }

    // Default digit fallback
    const firstDigit = cleanPin[0];
    let fallbackCity = 'Pune';
    if (firstDigit === '5') fallbackCity = 'Bengaluru';
    if (firstDigit === '1') fallbackCity = 'Delhi';
    if (firstDigit === '2') fallbackCity = 'Lucknow';
    if (firstDigit === '3') fallbackCity = 'Ahmedabad';

    const match = INDIAN_LOCATIONS.find(c => c.name.toLowerCase() === fallbackCity.toLowerCase());
    if (match) {
      selectNewCity(match);
    }
  };

  const handleManualDropdownSelect = () => {
    const match = INDIAN_LOCATIONS.find(c => c.name.toLowerCase() === manualCity.toLowerCase());
    if (match) {
      selectNewCity(match);
    }
  };

  // Categories configurations
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

  // Compare Cities derived mock data
  const compareStats = useMemo(() => {
    const data: Record<string, { resolutionRate: string, avgTime: string, verification: string }> = {
      'Pune': { resolutionRate: '88%', avgTime: '28h', verification: '92%' },
      'Bengaluru': { resolutionRate: '81%', avgTime: '36h', verification: '85%' },
      'Mumbai': { resolutionRate: '84%', avgTime: '32h', verification: '89%' },
      'Delhi': { resolutionRate: '79%', avgTime: '40h', verification: '82%' },
      'Ahmedabad': { resolutionRate: '87%', avgTime: '29h', verification: '90%' },
      'Bhopal': { resolutionRate: '85%', avgTime: '31h', verification: '88%' },
    };
    return {
      cityA: data[compareCityA] || { resolutionRate: '85%', avgTime: '30h', verification: '88%' },
      cityB: data[compareCityB] || { resolutionRate: '82%', avgTime: '34h', verification: '86%' },
    };
  }, [compareCityA, compareCityB]);

  return (
    <div ref={heroRef} className="w-full bg-[#050816] text-white min-h-screen py-8 overflow-hidden relative selection:bg-indigo-650 selection:text-white">
      
      {/* BACKGROUND DECORATIVE GRADIENTS */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-60 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* ACTIVE LOCATION BAR */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121B2B]/85 border border-slate-800 backdrop-blur-md shadow-lg text-xs font-semibold">
          <div className="flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-indigo-400" />
            <span>Active Location Context: <strong className="text-white">{activeCity}, {activeState}</strong></span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLocationModal(true)}
              className="text-indigo-400 hover:text-indigo-300 font-extrabold hover:underline"
            >
              Change Location
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] text-slate-450 uppercase tracking-widest hidden sm:inline">India-Wide Portal</span>
          </div>
        </div>
      </div>

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
                <span className="text-xl sm:text-2xl font-black tricolor-text-animate font-serif block italic mt-3 flex items-center gap-2">
                  Hamara Shehar, Hamari Awaaz
                  <svg className="w-6 h-6 text-[#000080]/80 dark:text-cyan-400/80 spin-slow shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="50" r="45" strokeWidth="2" />
                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 45 * Math.cos((i * 2 * Math.PI) / 24)}
                        y2={50 + 45 * Math.sin((i * 2 * Math.PI) / 24)}
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </span>
              </h1>
              <p className="gsap-reveal text-lg font-bold text-slate-200">
                Your Impact. Report It. Track It. Fix It.
              </p>
              <p className="gsap-reveal text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-semibold">
                NagarSathi connects citizens with civic departments across India to report local problems, track resolution progress and make public services more transparent.
              </p>
            </div>

            {/* CTAs */}
            <div className="gsap-reveal flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/report"
                className="relative group overflow-hidden px-7 py-4 rounded-2xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-[0_4px_20px_rgba(79,70,229,0.35)] flex items-center justify-center gap-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-indigo-650 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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
              <span>Active Reports in {activeCity}: <strong className="text-slate-300 font-black">{activeReportsCount} complaints</strong></span>
            </p>
          </div>

          {/* Right Map Preview */}
          <div className="lg:col-span-5 gsap-reveal">
            <div className="h-[360px] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl relative bg-slate-900/40 backdrop-blur-md">
              <CityMap issues={displayIssues} className="h-full w-full" zoom={11} />
              
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
            2. INTERACTIVE SEASONAL WATCH MODES
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Active Seasonal Civic Watches</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto font-semibold">
              India faces seasonal civic challenges. Explore dedicated reporting channels and watch grids below.
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-amber-500 via-white to-emerald-500 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { id: 'monsoon', label: 'Monsoon Watch', icon: <CloudRain className="w-4 h-4" /> },
              { id: 'heatwave', label: 'Heatwave Mode', icon: <Sun className="w-4 h-4" /> },
              { id: 'pollution', label: 'Pollution Watch', icon: <Wind className="w-4 h-4" /> },
              { id: 'events', label: 'Public Event Watch', icon: <Calendar className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAlertTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                  activeAlertTab === tab.id
                    ? 'bg-indigo-650 text-white border-transparent shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-[#121B2B] border border-slate-800 shadow-xl max-w-3xl mx-auto">
            {activeAlertTab === 'monsoon' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <CloudRain className="w-5 h-5 text-blue-400" />
                  <h3 className="font-extrabold text-sm text-white">🌧️ Active Monsoon Watch &amp; Flooding Channels</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Report waterlogging, road flooding, blocked storm sewers, fallen trees, or dangerous uninsulated electrical lines during the monsoon season.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-350">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Road waterlogging reports</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Broken storm drains</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Unsafe transformer wiring</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Local landslide/trees blockage</div>
                </div>
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 font-black hover:underline"
                >
                  File Monsoon Emergency Report <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {activeAlertTab === 'heatwave' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-white">🔥 Summer Heatwave &amp; Water Shelter Watch</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Report public water point breakdowns, requests for municipal water tankers, or report missing heat shelters in high-temperature city clusters.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-350">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Water point breakdown</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Tanker supplies required</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Community heat shelters request</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Public shade structure damage</div>
                </div>
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 font-black hover:underline"
                >
                  File Heatwave Assistance Request <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {activeAlertTab === 'pollution' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-extrabold text-sm text-white">🌫️ Air Quality &amp; Pollution Watch</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Report active agricultural straw burning, illegal garbage burning dumps, heavy industrial soot, or construction debris dust blowing on highways.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-350">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Open waste burning</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Road construction dust plumes</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; High factory soot emission</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Commercial generator noise limits</div>
                </div>
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 font-black hover:underline"
                >
                  File Pollution Watch Report <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {activeAlertTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h3 className="font-extrabold text-sm text-white">🎡 Festival &amp; Public Event Watch</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Report local waste piles, crowd safety infrastructure damage, toilet blockages, or road barriers blocking emergency vehicles during major public gathering festivals.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-350">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; High waste dump accumulation</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Temporary toilet blockade</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Illegal sound loudspeaker after limits</div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">&bull; Road barriers choking traffic</div>
                </div>
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 font-black hover:underline"
                >
                  File Festival Watch Complaint <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            3. NEIGHBORHOOD SCORE & SCOREBOARD
            ====================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-2xl font-black">Neighborhood Civic Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              The **NagarSathi Civic Insight Score** is a demo/community metric calculating resolution SLA compliance and local citizen verification feedback loops.
            </p>
            
            <div className="p-6 rounded-3xl bg-[#121B2B] border border-slate-800 shadow-xl space-y-4 text-center">
              <span className="block text-[10px] uppercase font-black tracking-widest text-slate-450">
                Civic Health of {activeCity}
              </span>
              <div className="text-5xl font-black text-emerald-450 font-mono tracking-tighter">
                78<span className="text-lg text-slate-500">/100</span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-400 text-[10px] font-bold border border-emerald-900">
                Grade A &bull; High Citizen Engagement
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {[
              { title: 'Roads & Signage', rating: '74/100', color: 'text-amber-500' },
              { title: 'Waste Management', rating: '82/100', color: 'text-emerald-400' },
              { title: 'Water Infrastructure', rating: '79/100', color: 'text-indigo-400' },
              { title: 'Electricity & Lights', rating: '85/100', color: 'text-yellow-400' },
              { title: 'Public Safety Rating', rating: '88/100', color: 'text-rose-500' },
              { title: 'Citizen Voice Support', rating: '90/100', color: 'text-cyan-400' },
            ].map((metric, idx) => (
              <div key={idx} className="p-4 bg-[#121B2B] border border-slate-805 rounded-2xl flex items-center justify-between shadow-md">
                <span className="text-xs font-bold text-slate-300">{metric.title}</span>
                <span className={`font-mono text-xs font-black ${metric.color}`}>{metric.rating}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================
            4. CITY AT A GLANCE
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight">City at a Glance</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto font-semibold">
              Live civic counts recorded in {activeCity}.
            </p>
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
            5. WHAT CAN YOU REPORT
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">What Can You Report?</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              Raise issues that affect your locality. Suggesting authority routing in every category block.
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
            6. RECENT ACTIVITY COMPLAINT FEED
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Recent Complaints in {activeCity}</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              Live timeline feed of verified issues reported around your city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate('/reports')}
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
                No active complaints filed in {activeCity}. Be the first to report!
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            7. COMMUNITY VOTING SECTION
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Problems Your Neighborhood Cares About</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              These issues have been identified as affecting multiple citizens in {activeCity}. Support to increaseSuggested priority.
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
                          : 'bg-indigo-650 text-white border-transparent hover:bg-indigo-500'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{hasVoted ? 'Affected Too (Registered)' : 'I Have This Problem Too'}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-500 text-xs font-semibold">
                No active issues to upvote in {activeCity}.
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            8. CITY COMPARISON TOOL
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Compare Civic Progress</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              Compare resolution compliance metrics and citizen feedback rates across tier-1 and tier-2 Indian municipalities.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#121B2B] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-450">Compare City A</label>
                <select
                  value={compareCityA}
                  onChange={(e) => setCompareCityA(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none"
                >
                  {['Pune', 'Bengaluru', 'Mumbai', 'Delhi', 'Ahmedabad', 'Bhopal'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-450">Compare City B</label>
                <select
                  value={compareCityB}
                  onChange={(e) => setCompareCityB(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none"
                >
                  {['Pune', 'Bengaluru', 'Mumbai', 'Delhi', 'Ahmedabad', 'Bhopal'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-4">
              {[
                { label: 'SLA Resolution Rate', key: 'resolutionRate' },
                { label: 'Average Response Time', key: 'avgTime' },
                { label: 'Citizen Verification Match', key: 'verification' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 text-xs font-semibold items-center text-center">
                  <span className="text-slate-400 text-left">{row.label}</span>
                  <span className="text-white font-black font-mono">{(compareStats.cityA as any)[row.key]}</span>
                  <span className="text-indigo-400 font-black font-mono">{(compareStats.cityB as any)[row.key]}</span>
                </div>
              ))}
            </div>
            
            <p className="text-[10px] text-slate-500 font-bold leading-normal text-center">
              * Note: All metrics are compiled demo representations of municipal performance dashboards.
            </p>
          </div>
        </section>

        {/* ======================================================
            9. CIVIC CHAMPIONS LEADERBOARD
            ====================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">🏆 Civic Champions Leaderboard</h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto font-semibold">
              Meet active community members earning points and badges for verified reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Ramesh Deshmukh', points: 280, badge: 'Neighborhood Champion', icon: '🥇' },
              { name: 'Kavita Iyer', points: 245, badge: 'Resolution Verifier', icon: '🥈' },
              { name: 'Amit Jagtap', points: 210, badge: 'Community Helper', icon: '🥉' },
            ].map((champ, idx) => (
              <div key={idx} className="p-5 bg-[#121B2B] border border-slate-805 rounded-2xl text-center space-y-3 shadow-lg">
                <div className="text-3xl">{champ.icon}</div>
                <h4 className="font-extrabold text-xs text-white truncate">{champ.name}</h4>
                <p className="text-[10px] text-indigo-400 font-mono font-black">{champ.points} Civic Points</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 uppercase">
                  {champ.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================
            10. MULTILINGUAL & I18N WARNING
            ====================================================== */}
        <section className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-900/60 max-w-2xl mx-auto flex items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>More Indian languages coming soon (Hindi, Marathi, Tamil, Telugu, Gujarati, Kannada, Bengali).</span>
          </div>
          <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider shrink-0 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
            i18n ready
          </span>
        </section>

        {/* ======================================================
            11. STORYTELLING: WHY WE CREATED NAGARSATHI
            ====================================================== */}
        <section className="bg-gradient-to-br from-slate-950 via-[#0B1220] to-indigo-950 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-slate-800 shadow-xl space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-805 text-amber-500 text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>NagarSathi Slogan &amp; Integrity</span>
            </div>

            <h3 className="text-3xl font-black">Why We Created NagarSathi</h3>
            
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold">
              Everyday civic problems — broken roads, overflowing garbage, leaking pipelines, damaged streetlights and unsafe public spaces — affect thousands of people. But reporting a problem is only the first step.
            </p>

            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold">
              NagarSathi was created to bridge the gap between citizens and civic departments by making reporting easier, tracking clearer and resolution more transparent.
            </p>

            <p className="text-sm font-black text-amber-405 italic">
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
            12. SUGGESTIONS / FEEDBACK BANNER
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
              className="px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md transition-colors"
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

      {/* ======================================================
          INDIA-WIDE LOCATION SELECTOR MODAL
          ====================================================== */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121B2B] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" /> Where do you live?
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Quick GPS button */}
              <button
                type="button"
                onClick={() => {
                  // Simulate GPS lookup mapping to Pune
                  const matched = INDIAN_LOCATIONS.find(c => c.name === 'Pune');
                  if (matched) selectNewCity(matched);
                }}
                className="w-full py-3 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
              >
                📍 Use My Location (GPS Detect)
              </button>

              <div className="relative text-center">
                <span className="px-3 bg-[#121B2B] text-[10px] text-slate-500 font-black uppercase tracking-wider relative z-10">Or search pincode</span>
                <div className="absolute inset-x-0 top-2 h-[1px] bg-slate-800" />
              </div>

              {/* 2. Pincode Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={modalPincode}
                  onChange={(e) => setModalPincode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleModalPincodeSearch}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black uppercase text-indigo-400 hover:bg-slate-800"
                >
                  Search
                </button>
              </div>

              <div className="relative text-center">
                <span className="px-3 bg-[#121B2B] text-[10px] text-slate-500 font-black uppercase tracking-wider relative z-10">Or select manually</span>
                <div className="absolute inset-x-0 top-2 h-[1px] bg-slate-800" />
              </div>

              {/* 3. Manual Dropdown selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-500 font-black">State</label>
                  <select
                    value={manualState}
                    onChange={(e) => {
                      setManualState(e.target.value);
                      const matched = INDIAN_LOCATIONS.find(c => c.state === e.target.value);
                      if (matched) setManualCity(matched.name);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold focus:outline-none"
                  >
                    {Array.from(new Set(INDIAN_LOCATIONS.map(c => c.state))).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-500 font-black">City</label>
                  <select
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold focus:outline-none"
                  >
                    {INDIAN_LOCATIONS.filter(c => c.state === manualState).map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleManualDropdownSelect}
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider"
              >
                Confirm Region Choice
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
