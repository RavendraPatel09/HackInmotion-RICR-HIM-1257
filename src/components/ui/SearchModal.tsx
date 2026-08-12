import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIssues } from '../../context/IssuesContext';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, CategoryBadge } from './Badge';
import { Search, X, MapPin, ArrowRight, ArrowLeft, Clock, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { issues } = useIssues();
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  
  // LocalState for recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nagarsathi_recent_searches');
      return saved ? JSON.parse(saved) : ['pothole', 'street light', 'water logging'];
    } catch {
      return ['pothole', 'street light', 'water logging'];
    }
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return issues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.trackingId.toLowerCase().includes(q) ||
        i.address.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q)
    );
  }, [issues, query]);

  // Dynamic suggestions from active high priority issues
  const suggestions = useMemo(() => {
    return issues
      .filter((i) => i.status !== 'Resolved' && i.status !== 'Verified')
      .slice(0, 3);
  }, [issues]);

  const handleSelectIssue = (issueCategory: string) => {
    // Record search keyword
    if (query.trim()) {
      setRecentSearches((prev) => {
        const next = [query.trim(), ...prev.filter((p) => p !== query.trim())].slice(0, 5);
        localStorage.setItem('nagarsathi_recent_searches', JSON.stringify(next));
        return next;
      });
    }
    onClose();
    navigate(`/citizen/issues?category=${issueCategory}`);
  };

  const handleRecentClick = (val: string) => {
    setQuery(val);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('nagarsathi_recent_searches');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('search-modal-overlay')) {
            onClose();
          }
        }}
        className="search-modal-overlay fixed inset-0 z-[2000] flex items-start justify-center pt-0 sm:pt-20 px-0 sm:px-4 bg-slate-950/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative max-w-2xl w-full h-full sm:h-auto rounded-none sm:rounded-3xl bg-white border-0 sm:border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3 shrink-0">
            <button 
              onClick={onClose} 
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-xs font-bold shrink-0"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <Search className="w-4 h-4 text-indigo-600 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Tracking ID, title, category, location, status..."
              className="w-full bg-transparent text-slate-950 placeholder-slate-400 text-xs font-semibold focus:outline-none"
            />
            {query && (
              <button 
                onClick={() => setQuery('')} 
                className="p-1 text-slate-400 hover:text-slate-650"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 max-h-[450px]">
            {query.trim() === '' ? (
              <div className="space-y-4">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Recent Searches</span>
                      <button onClick={handleClearRecent} className="hover:text-rose-650 font-extrabold normal-case">
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {recentSearches.map((keyword, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRecentClick(keyword)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{keyword}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Popular categories</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'roads', label: '🛣 Roads & Potholes' },
                      { id: 'sanitation', label: '🗑 Garbage & Waste' },
                      { id: 'electricity', label: '⚡ Electricity' },
                      { id: 'water', label: '🚰 Water Leakage' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectIssue(cat.id)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-805 hover:text-indigo-700 text-xs font-bold transition-all text-left truncate"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Issue Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Issue Suggestions
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() => handleSelectIssue(issue.category)}
                          className="p-3 rounded-xl bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-indigo-200 transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-650 transition-colors truncate max-w-sm sm:max-w-md">{issue.title}</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{issue.address.split(',')[0]} • {issue.category}</p>
                          </div>
                          <span className="text-[10px] text-indigo-650 font-black flex items-center gap-0.5">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Search Results ({filtered.length})</p>
                {filtered.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => handleSelectIssue(issue.category)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-150 flex items-start gap-3 justify-between group"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">
                          {issue.trackingId}
                        </span>
                        <CategoryBadge category={issue.category} />
                        <StatusBadge status={issue.status} />
                      </div>

                      <h4 className="font-bold text-xs text-slate-950 group-hover:text-indigo-600 transition-colors truncate">
                        {issue.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> 
                        <span className="truncate">{issue.address}</span>
                      </p>
                    </div>

                    <span className="font-extrabold text-[11px] text-indigo-650 flex items-center gap-1 shrink-0 self-center">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-950">No issues found.</p>
                  <p className="text-xs text-slate-550">Try searching by tracking ID, category, location, status or keyword.</p>
                </div>
                <button
                  onClick={() => setQuery('')}
                  className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
