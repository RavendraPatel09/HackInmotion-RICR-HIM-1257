import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { PremiumCard } from '../components/ui/PremiumCard';
import { showToast } from '../components/ui/Toast';
import {
  User,
  Mail,
  Calendar,
  Award,
  Bookmark,
  Clock,
  HelpCircle,
  Bug,
  MessageSquare,
  Star,
  ChevronDown,
  Trash2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Settings,
  Bell,
  Database,
  Info,
  WifiOff,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
];

export const Profile: React.FC = () => {
  const { user, loginCustom, logout } = useAuth();
  const { issues, addIssue } = useIssues();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'account' | 'activity' | 'support' | 'feedback' | 'settings'>('account');
  const [offlineDrafts, setOfflineDrafts] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('nagarsathi_offline_drafts');
    if (raw) {
      try {
        setOfflineDrafts(JSON.parse(raw));
      } catch (e) {
        setOfflineDrafts([]);
      }
    }
  }, []);

  const handleSyncDraft = (draft: any) => {
    const trackingId = 'NS-' + Math.floor(100000 + Math.random() * 900000);
    const newIssue = {
      id: draft.id.replace('draft-', ''),
      trackingId,
      title: draft.title,
      description: draft.description,
      category: draft.category,
      department: 'roads-infra' as any,
      status: 'Reported' as any,
      priority: 'Medium' as any,
      lat: draft.lat,
      lng: draft.lng,
      address: draft.address,
      reportedBy: user?.name || 'Citizen',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Reported' as any,
          timestamp: new Date().toISOString(),
          note: 'Issue submitted from offline draft sync by citizen.',
          updatedBy: user?.name || 'Citizen',
        },
      ],
      upvotes: 1,
      upvotedBy: [user?.id || 'guest'],
      escalated: false,
      language: 'en' as any,
    };

    addIssue(newIssue);
    const updated = offlineDrafts.filter((d) => d.id !== draft.id);
    setOfflineDrafts(updated);
    localStorage.setItem('nagarsathi_offline_drafts', JSON.stringify(updated));
    showToast(`Offline report "${draft.title}" synced successfully online!`, 'success');
  };

  const handleRemoveDraft = (draftId: string) => {
    const updated = offlineDrafts.filter((d) => d.id !== draftId);
    setOfflineDrafts(updated);
    localStorage.setItem('nagarsathi_offline_drafts', JSON.stringify(updated));
    showToast('Offline draft removed.', 'info');
  };

  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Bookmarks & Recents
  const [savedIssueIds, setSavedIssueIds] = useState<string[]>([]);
  const [recentViewIds, setRecentViewIds] = useState<string[]>([]);

  // Feedback Form State
  const [feedbackType, setFeedbackType] = useState<string>('General Feedback');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // App Problem Form State
  const [problemType, setProblemType] = useState<string>('UI Bug');
  const [problemDesc, setProblemDesc] = useState<string>('');
  const [problemPage, setProblemPage] = useState<string>('');
  const [isSubmittingProblem, setIsSubmittingProblem] = useState<boolean>(false);

  // Settings tab inputs
  const [settingsName, setSettingsName] = useState<string>(user?.name || '');
  const [settingsEmail, setSettingsEmail] = useState<string>(user?.email || '');
  const [settingsAvatar, setSettingsAvatar] = useState<string>(user?.avatar || '');

  // Preferences Toggles
  const [emailNotify, setEmailNotify] = useState<boolean>(() => {
    return localStorage.getItem('nagarsathi_notify_email') !== 'false';
  });
  const [updateNotify, setUpdateNotify] = useState<boolean>(() => {
    return localStorage.getItem('nagarsathi_notify_updates') !== 'false';
  });

  // Load Bookmarks and Recents
  useEffect(() => {
    const saved = localStorage.getItem('nagarsathi_saved_issues');
    if (saved) {
      try {
        setSavedIssueIds(JSON.parse(saved));
      } catch (e) {
        setSavedIssueIds([]);
      }
    }

    const recents = localStorage.getItem('nagarsathi_recent_views');
    if (recents) {
      try {
        setRecentViewIds(JSON.parse(recents));
      } catch (e) {
        setRecentViewIds([]);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto animate-bounce" />
        <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-500">Please sign in to access your NagarSathi profile dashboard.</p>
      </div>
    );
  }

  // Derive stats
  const myReports = issues.filter((i) => i.reportedBy === user.name);
  const reportsSubmittedCount = myReports.length;
  const reportsResolvedCount = myReports.filter((i) => i.status === 'Resolved' || i.status === 'Verified').length;
  const reportsVerifiedCount = myReports.filter((i) => i.status === 'Verified').length;
  
  // Custom mock upvotes given count
  const upvotesGivenCount = user.role === 'citizen' ? 8 : 0;
  
  // Calculate Contribution Score
  const contributionScore = (reportsSubmittedCount * 15) + (upvotesGivenCount * 5) + (reportsVerifiedCount * 25);

  // Dynamic Badges
  const badges = [
    {
      id: 'first-report',
      name: 'First Report',
      desc: 'Submitted your first civic complaint',
      unlocked: reportsSubmittedCount >= 1,
      icon: '🚀',
    },
    {
      id: 'community-helper',
      name: 'Community Helper',
      desc: 'Supported civic issues in your ward',
      unlocked: upvotesGivenCount >= 3,
      icon: '📣',
    },
    {
      id: 'issue-tracker',
      name: 'Issue Tracker',
      desc: 'Saved complaints to your local bookmarks list',
      unlocked: savedIssueIds.length >= 2,
      icon: '🔖',
    },
    {
      id: 'civic-watcher',
      name: 'Civic Watcher',
      desc: 'Audited recently viewed city timeline updates',
      unlocked: recentViewIds.length >= 3,
      icon: '👁️',
    },
    {
      id: 'resolution-verifier',
      name: 'Resolution Verifier',
      desc: 'Citizen verified a resolved municipal ticket',
      unlocked: reportsVerifiedCount >= 1,
      icon: '✅',
    },
    {
      id: 'neighborhood-champion',
      name: 'Neighborhood Champion',
      desc: 'Accumulated over 50 contribution score points',
      unlocked: contributionScore >= 50,
      icon: '👑',
    },
  ];

  // Bookmark actions
  const handleRemoveBookmark = (issueId: string) => {
    const updated = savedIssueIds.filter((id) => id !== issueId);
    setSavedIssueIds(updated);
    localStorage.setItem('nagarsathi_saved_issues', JSON.stringify(updated));
    showToast('Report removed from bookmarks', 'info');
  };

  // Recents actions
  const handleClearRecents = () => {
    setRecentViewIds([]);
    localStorage.removeItem('nagarsathi_recent_views');
    showToast('Recently viewed history cleared', 'success');
  };

  // Settings Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsName.trim() || !settingsEmail.trim()) {
      showToast('Name and Email fields are required', 'warning');
      return;
    }
    
    // Save details via loginCustom
    loginCustom({
      ...user,
      name: settingsName.trim(),
      email: settingsEmail.trim(),
      avatar: settingsAvatar,
    });

    // Save notify configurations
    localStorage.setItem('nagarsathi_notify_email', String(emailNotify));
    localStorage.setItem('nagarsathi_notify_updates', String(updateNotify));

    showToast('Account settings updated successfully', 'success');
  };

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to clear your local feedback, bugs, and bookmarks? Your account state is preserved.')) {
      localStorage.removeItem('nagarsathi_feedback');
      localStorage.removeItem('nagarsathi_app_problems');
      localStorage.removeItem('nagarsathi_saved_issues');
      localStorage.removeItem('nagarsathi_recent_views');
      setSavedIssueIds([]);
      setRecentViewIds([]);
      showToast('Local application feedback data cleared.', 'info');
    }
  };

  const handleClearAllData = () => {
    if (confirm('WARNING: This will clear ALL local storage data, including reports, settings, and logs. You will be logged out. Continue?')) {
      localStorage.clear();
      logout();
      navigate('/login');
    }
  };

  // Submit Feedback Handler
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      showToast('Please type a feedback message', 'warning');
      return;
    }

    setIsSubmittingFeedback(true);

    setTimeout(() => {
      const newFeedback = {
        id: 'fb-' + Date.now(),
        userId: user.id,
        userName: user.name,
        type: feedbackType,
        rating: feedbackRating,
        message: feedbackMessage,
        submittedAt: new Date().toISOString(),
      };

      const existingFeedbackStr = localStorage.getItem('nagarsathi_feedback') || '[]';
      let existingFeedback = [];
      try {
        existingFeedback = JSON.parse(existingFeedbackStr);
      } catch (e) {
        existingFeedback = [];
      }

      existingFeedback.push(newFeedback);
      localStorage.setItem('nagarsathi_feedback', JSON.stringify(existingFeedback));

      showToast('Thank you! Your feedback has been recorded.', 'success');
      setFeedbackMessage('');
      setFeedbackRating(5);
      setIsSubmittingFeedback(false);
    }, 600);
  };

  // Submit App Bug Handler
  const handleAppBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDesc.trim()) {
      showToast('Please describe the problem you experienced', 'warning');
      return;
    }

    setIsSubmittingProblem(true);

    setTimeout(() => {
      const newProblem = {
        id: 'bug-' + Date.now(),
        userId: user.id,
        userName: user.name,
        type: problemType,
        description: problemDesc,
        relatedPage: problemPage || 'Not Specified',
        submittedAt: new Date().toISOString(),
      };

      const existingProblemsStr = localStorage.getItem('nagarsathi_app_problems') || '[]';
      let existingProblems = [];
      try {
        existingProblems = JSON.parse(existingProblemsStr);
      } catch (e) {
        existingProblems = [];
      }

      existingProblems.push(newProblem);
      localStorage.setItem('nagarsathi_app_problems', JSON.stringify(existingProblems));

      showToast('Problem report recorded. The tech team will review it.', 'success');
      setProblemDesc('');
      setProblemPage('');
      setIsSubmittingProblem(false);
    }, 600);
  };

  // FAQs Accordion
  const faqs = [
    {
      q: 'How does NagarSathi routing work?',
      a: 'NagarSathi uses a GIS sector map. When you report an issue, the category (e.g. sanitation, streetlights) determines which municipal department receives it. The ward location determines which local officer is assigned.',
    },
    {
      q: 'What is the 72h municipal SLA?',
      a: 'NagarSathi holds departments accountable by setting a 72-hour Service Level Agreement (SLA) clock. If an issue is not acknowledged and in-progress within 72 hours, it gets flagged as "Escalated" publicly.',
    },
    {
      q: 'How do upvotes and community priorities work?',
      a: 'If an issue is affecting multiple families in a street, other citizens can click "I have this problem too". High-upvoted issues climb the admin queue automatically, ensuring the department prioritizes high-impact grievances.',
    },
    {
      q: 'How do I verify if an issue is fixed?',
      a: 'Once the municipal supervisor updates the status to "Resolved" with completion photos, the citizen reporter has a "Confirm Fixed" panel. Once clicked, the issue is locked as "Verified", increasing the department transparency rating.',
    },
  ];

  // Saved/Recents mappings
  const savedIssues = issues.filter((i) => savedIssueIds.includes(i.id));
  const recentlyViewedIssues = issues.filter((i) => recentViewIds.includes(i.id)).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header Profile Dashboard Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                {user.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-center md:justify-start font-semibold">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-center md:justify-start font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since: August 2025
            </p>
          </div>
        </div>

        {/* Contribution Score Badge */}
        <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-center gap-4 text-left w-full md:w-auto shadow-sm shrink-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">Civic Contribution Score</div>
            <div className="text-2xl font-black text-slate-900 font-mono">{contributionScore} Points</div>
            <div className="text-[10px] text-slate-500 font-semibold pt-0.5">Based on reports, votes, &amp; confirmations</div>
          </div>
        </div>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'account'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <User className="w-4 h-4" /> Account Profile
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Activity &amp; Bookmarks
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'support'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Help &amp; FAQs
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Feedback &amp; Support
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>

      {/* Tab Panels Layout */}
      <div className="min-h-[400px]">
        
        {/* Tab 1: Account Profile */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Civic Gamification Badges
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((b) => (
                  <PremiumCard
                    key={b.id}
                    className={`p-4 flex items-center gap-4 relative overflow-hidden premium-card-hover ${
                      b.unlocked ? 'border-indigo-250 bg-indigo-50/10' : 'opacity-60 bg-slate-50/50'
                    }`}
                  >
                    <div className="text-3xl shrink-0">{b.icon}</div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{b.name}</span>
                        {b.unlocked ? (
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-650 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-250">Unlocked</span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 bg-slate-100 px-1.5 py-0.5 rounded">Locked</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-1">{b.desc}</p>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>

            {/* Stats list cards */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Civic Activity Summary
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reports Logged</p>
                  <p className="text-3xl font-black text-slate-900 font-mono">{reportsSubmittedCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reports Resolved</p>
                  <p className="text-3xl font-black text-emerald-600 font-mono">{reportsResolvedCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resolutions Verified</p>
                  <p className="text-3xl font-black text-cyan-605 font-mono">{reportsVerifiedCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Activity & Bookmarks */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bookmarks Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600" /> Saved Bookmarks ({savedIssues.length})
              </h2>

              <div className="space-y-3">
                {savedIssues.length > 0 ? (
                  savedIssues.map((issue) => (
                    <div key={issue.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{issue.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">{issue.address.split(',')[0]} &bull; {issue.category}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to="/reports" className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-[11px] font-extrabold border border-slate-200 rounded-xl transition-colors">
                          Track
                        </Link>
                        <button onClick={() => handleRemoveBookmark(issue.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Remove bookmark">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                    No issues bookmarked yet.
                  </div>
                )}
              </div>
            </div>

            {/* Offline Saved Drafts */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-indigo-650" /> Offline Saved Drafts ({offlineDrafts.length})
              </h2>

              <div className="space-y-3">
                {offlineDrafts.length > 0 ? (
                  offlineDrafts.map((draft) => (
                    <div key={draft.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{draft.title}</h4>
                        <p className="text-[10px] text-slate-450 mt-1 font-bold">{draft.address.split(',')[0]} &bull; {draft.category}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleSyncDraft(draft)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black rounded-xl transition-colors"
                        >
                          Sync Online
                        </button>
                        <button
                          onClick={() => handleRemoveDraft(draft.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                    No offline drafts saved.
                  </div>
                )}
              </div>
            </div>

            {/* Recently Viewed History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Recently Viewed ({recentlyViewedIssues.length})
                </h2>
                {recentlyViewedIssues.length > 0 && (
                  <button onClick={handleClearRecents} className="text-xs font-extrabold text-indigo-650 hover:underline">
                    Clear history
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {recentlyViewedIssues.length > 0 ? (
                  recentlyViewedIssues.map((issue) => (
                    <div key={issue.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{issue.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">{issue.address.split(',')[0]} &bull; {issue.category}</p>
                      </div>
                      <Link to="/reports" className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-[11px] font-extrabold border border-slate-200 rounded-xl transition-colors shrink-0">
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                    No recently viewed issues.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Help & FAQs accordion */}
        {activeTab === 'support' && (
          <div className="max-w-2xl bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">Find answers to common questions about the NagarSathi platform.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-5 py-4 text-left font-extrabold text-xs text-slate-900 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed font-semibold">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Feedback & Support Forms */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={handleFeedbackSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" /> Share Platform Feedback
                </h3>
                <p className="text-xs text-slate-500">Let us know how we can make NagarSathi better.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Type
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                >
                  <option>General Feedback</option>
                  <option>Suggestion</option>
                  <option>UI/UX Layout</option>
                  <option>Performance Issue</option>
                  <option>Support Request</option>
                </select>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Type your suggestion or feedback here..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingFeedback ? 'Saving...' : 'Submit Feedback'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <form onSubmit={handleAppBugSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-500" /> Report an App Problem
                </h3>
                <p className="text-xs text-slate-500">Report errors or glitches in this NagarSathi application.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Problem Type
                </label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                >
                  <option>UI Bug or Alignment</option>
                  <option>Map Failure / Loading</option>
                  <option>Login / Session Issue</option>
                  <option>Notification Glitch</option>
                  <option>Other technical error</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Related Page/URL
                </label>
                <input
                  type="text"
                  value={problemPage}
                  onChange={(e) => setProblemPage(e.target.value)}
                  placeholder="e.g. /reports or Map view"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Description of Problem
                </label>
                <textarea
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  placeholder="Explain exactly what happened, and steps to reproduce..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProblem}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingProblem ? 'Submitting...' : 'Report App Bug'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: Settings Section */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleSaveSettings} className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-indigo-550" /> Account Settings
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      required
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      required
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Avatar Selection presets */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Profile Picture Avatar</label>
                  <div className="flex flex-wrap items-center gap-3">
                    {AVATAR_PRESETS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSettingsAvatar(url)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all relative ${
                          settingsAvatar === url ? 'border-indigo-650 scale-105 shadow-sm' : 'border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <img src={url} alt={`Avatar Preset ${i + 1}`} className="w-full h-full object-cover" />
                        {settingsAvatar === url && (
                          <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center text-indigo-700 font-extrabold text-xs">✓</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferences Settings */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-indigo-550" /> Preference Settings
                </h3>

                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-3.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotify}
                      onChange={(e) => setEmailNotify(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 border-slate-300 bg-slate-50"
                    />
                    <span>Enable Email Notifications for report dispatches</span>
                  </label>
                  <label className="flex items-center gap-3.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateNotify}
                      onChange={(e) => setUpdateNotify(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 border-slate-300 bg-slate-50"
                    />
                    <span>Enable real-time push update notifications in navbar</span>
                  </label>
                </div>
              </div>

              {/* Privacy settings */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-4.5 h-4.5 text-indigo-550" /> Privacy &amp; Storage
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  NagarSathi operates locally. All reports, notifications, activity logs, bug reports, and feedback details are safely persisted in your browser's Local Storage. No external databases are tracked.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClearLocalData}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-extrabold rounded-xl transition-all"
                  >
                    Clear Feedback &amp; Bookmarks
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-100 pt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  Save Settings <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </form>

            {/* Right block details: Info & Reset */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Application Details */}
              <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3">
                <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-indigo-550" /> Application Info
                </h3>
                <div className="space-y-1.5 text-xs text-slate-650 font-semibold leading-relaxed">
                  <p><strong>Version:</strong> NagarSathi v1.2.0-demo</p>
                  <p><strong>Environment:</strong> Frontend LocalStorage client</p>
                  <p><strong>Core Stack:</strong> React, TypeScript, Leaflet, GSAP</p>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-rose-700 flex items-center gap-2">
                    <Trash2 className="w-4.5 h-4.5 text-rose-600" /> Danger Zone
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold">Irreversible account resetting and clearing operations.</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleClearAllData}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Clear All Local Storage
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-200 rounded-xl transition-colors"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
