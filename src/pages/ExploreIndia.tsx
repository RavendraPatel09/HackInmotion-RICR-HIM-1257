import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssuesContext';
import { INDIAN_LOCATIONS } from '../data/locations';
import { showToast } from '../components/ui/Toast';
import {
  Compass,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ExploreIndia: React.FC = () => {
  const { issues } = useIssues();
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState<string>('All');

  const uniqueStates = useMemo(() => {
    const statesSet = new Set(INDIAN_LOCATIONS.map((c) => c.state));
    return ['All', ...Array.from(statesSet)];
  }, []);

  const displayedCities = useMemo(() => {
    if (selectedState === 'All') {
      return INDIAN_LOCATIONS.slice(0, 10);
    }
    return INDIAN_LOCATIONS.filter((c) => c.state === selectedState);
  }, [selectedState]);

  const trendingIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
  }, [issues]);

  const recentlyResolved = useMemo(() => {
    return issues
      .filter((i) => i.status === 'Resolved' || i.status === 'Verified')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.reportedAt).getTime())
      .slice(0, 3);
  }, [issues]);

  const handleCityClick = (cityName: string) => {
    const cityObj = INDIAN_LOCATIONS.find((c) => c.name === cityName);
    if (cityObj) {
      localStorage.setItem('nagarsathi_current_location', JSON.stringify(cityObj));
      showToast(`Switched active city context to ${cityName}`, 'success');
      navigate('/');
    }
  };

  const getCityIssuesCount = (cityName: string) => {
    return issues.filter((i) => i.city.toLowerCase() === cityName.toLowerCase()).length;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-amber-400" /> Explore Indian Municipalities
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              National Civic Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
              Browse reports, audit active resolutions, and compare department performance scores across multiple states and local urban bodies.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Cities</span>
              <span className="text-2xl font-black text-white font-mono">{INDIAN_LOCATIONS.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Wards</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">110+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. States Filters */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-650" /> Filter Municipalities by State
        </h2>
        <div className="flex flex-wrap gap-2 pb-2">
          {uniqueStates.map((state) => {
            const count = state === 'All' ? issues.length : issues.filter((i) => i.state === state).length;
            return (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  selectedState === state
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {state} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCities.map((city) => {
          const cityIssues = getCityIssuesCount(city.name);
          return (
            <motion.div
              key={city.name}
              whileHover={{ y: -2 }}
              onClick={() => handleCityClick(city.name)}
              className="p-5 bg-white border border-slate-200 rounded-3xl cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between h-40 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {city.state}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{city.wards.length} Wards</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-905 group-hover:text-indigo-650 transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  District: {city.district}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-extrabold">
                <span className="text-slate-500 font-semibold">{cityIssues} Active Reports</span>
                <span className="text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Explore City &rarr;
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Trending & Recently Resolved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Issues */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-905 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Trending Nationwide Complaints
          </h2>
          <div className="space-y-3">
            {trendingIssues.length > 0 ? (
              trendingIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate('/citizen/issues')}
                  className="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl cursor-pointer hover:shadow-sm transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150">
                      {issue.trackingId}
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate">{issue.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{issue.address}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-black shrink-0">
                    👍 {issue.upvotes} Votes
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No trending complaints recorded.</p>
            )}
          </div>
        </div>

        {/* Recently Resolved */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-905 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" /> Top Improving / Recently Resolved
          </h2>
          <div className="space-y-3">
            {recentlyResolved.length > 0 ? (
              recentlyResolved.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate('/citizen/issues')}
                  className="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl cursor-pointer hover:shadow-sm transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                      {issue.trackingId}
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate">{issue.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{issue.address}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-black shrink-0 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Fixed
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No complaints resolved yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Together We Build */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 rounded-3xl relative overflow-hidden shadow-lg space-y-6">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-4 relative z-10 text-center md:text-left">
          <h3 className="text-2xl font-black">Together, We Improve Our Communities</h3>
          <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold">
            Every report submitted helps local local local ward officers respond efficiently. By participating in your city's dashboard, you ensure civic priorities get resolved quickly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 relative z-10 text-center">
          <div>
            <Users className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-black font-mono">1,240+</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Citizens Participating</p>
          </div>
          <div>
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-black font-mono">86%</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Resolution Rate</p>
          </div>
          <div>
            <Building className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-2xl font-black font-mono">20</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Cities Covered</p>
          </div>
          <div>
            <AlertCircle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-black font-mono">{issues.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Issues</p>
          </div>
        </div>
      </section>
    </div>
  );
};
