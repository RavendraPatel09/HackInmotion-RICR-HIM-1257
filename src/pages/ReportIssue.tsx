import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapPicker } from '../components/map/MapPicker';
import { getDepartmentForCategory } from '../services/routing';
import { getDepartmentById } from '../data/departments';
import { verifyPhotoHeuristic, type PhotoVerificationResult } from '../services/photoVerification';
import { findPotentialDuplicate } from '../services/duplicateDetection';
import { generateTrackingId, generateIssueId } from '../utils/idGenerator';
import { INDIAN_LOCATIONS } from '../data/locations';
import type { Issue, IssueCategory } from '../types';
import { showToast } from '../components/ui/Toast';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Camera,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Copy,
  FileText,
  Building2,
  FileCheck,
  RotateCcw,
  Check,
  AlertTriangle,
  WifiOff,
  Database,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DRAFT_KEY = 'nagarsathi_report_draft';
const OFFLINE_DRAFTS_KEY = 'nagarsathi_offline_drafts';

interface CategoryItem {
  id: IssueCategory;
  label: string;
  desc: string;
  icon: string;
}

const UI_CATEGORIES: CategoryItem[] = [
  { id: 'roads', label: 'Roads & Infrastructure', desc: 'Potholes, broken roads and damaged footpaths', icon: '🛣️' },
  { id: 'sanitation', label: 'Sanitation & Waste', desc: 'Garbage accumulation, waste dumping and open drains', icon: '🗑️' },
  { id: 'electricity', label: 'Electricity & Lighting', desc: 'Streetlights not working, dangerous loose wires', icon: '💡' },
  { id: 'water', label: 'Water & Sewerage', desc: 'Pipeline bursts, water supply leakage, sewage overflow', icon: '💧' },
  { id: 'public-property', label: 'Public Property', desc: 'Damaged benches, bus shelters, public toilets', icon: '🏢' },
  { id: 'drainage', label: 'Waterlogging & Flood', desc: 'Sewer blockage, storm drainage, flooded roads', icon: '🌊' },
];

export const ReportIssue: React.FC = () => {
  const { user } = useAuth();
  const { issues, addIssue, upvoteIssue } = useIssues();
  const navigate = useNavigate();
  const { lat, lng, loading: geoLoading, requestLocation, defaultLat, defaultLng } = useGeolocation();

  // 5-step wizard state
  const [step, setStep] = useState<number>(1);

  // Form Inputs
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('roads');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [videoSimulated, setVideoSimulated] = useState<boolean>(false);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  
  // Location States
  const [locationMode, setLocationMode] = useState<'gps' | 'pincode' | 'manual'>('gps');
  const [pincode, setPincode] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [selectedLat, setSelectedLat] = useState<number>(defaultLat);
  const [selectedLng, setSelectedLng] = useState<number>(defaultLng);
  const [address, setAddress] = useState<string>('Detecting location...');
  
  // Manual Location Selection dropdown states
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedCity, setSelectedCity] = useState<string>('Pune');
  const [selectedWardId, setSelectedWardId] = useState<string>('pne-ward-01');
  const [selectedWardName, setSelectedWardName] = useState<string>('Kothrud Area');

  // Modes & Status Indicators
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [dataSaver, setDataSaver] = useState<boolean>(false);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [draftTime, setDraftTime] = useState<string>('');

  // AI & Duplicate check results
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<PhotoVerificationResult | null>(null);
  const [duplicatesFound, setDuplicatesFound] = useState<Issue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null);

  // States List for Manual Dropdowns
  const statesList = useMemo(() => {
    const states = new Set(INDIAN_LOCATIONS.map((loc) => loc.state));
    return Array.from(states);
  }, []);

  // Cities List dynamically populated based on selectedState
  const citiesInState = useMemo(() => {
    return INDIAN_LOCATIONS.filter((loc) => loc.state === selectedState);
  }, [selectedState]);

  // Wards List dynamically populated based on selectedCity
  const wardsInCity = useMemo(() => {
    const cityObj = INDIAN_LOCATIONS.find((c) => c.name === selectedCity);
    return cityObj ? cityObj.wards : [];
  }, [selectedCity]);

  // Set default ward when city changes
  useEffect(() => {
    if (wardsInCity.length > 0) {
      setSelectedWardId(wardsInCity[0].id);
      setSelectedWardName(wardsInCity[0].name);
    }
  }, [wardsInCity, selectedCity]);

  // Synchronize GPS coordinates
  useEffect(() => {
    if (lat && lng && locationMode === 'gps') {
      setSelectedLat(lat);
      setSelectedLng(lng);
      setAddress(`GPS Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} — Indiranagar, Bengaluru`);
    }
  }, [lat, lng, locationMode]);

  // Read LocalStorage draft on mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && (parsed.title || parsed.description)) {
          setHasDraft(true);
          setDraftTime(parsed.savedAt ? new Date(parsed.savedAt).toLocaleTimeString() : 'earlier');
        }
      }
    } catch (err) {
      console.error('Error checking draft:', err);
    }
  }, []);

  // Save current progress as temporary local draft
  useEffect(() => {
    if (submittedIssue) return;
    if (title.trim() || description.trim()) {
      const draftData = {
        title,
        description,
        selectedCategory,
        address,
        selectedLat,
        selectedLng,
        pincode,
        landmark,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }
  }, [title, description, selectedCategory, address, selectedLat, selectedLng, pincode, landmark, submittedIssue]);

  const handleResumeDraft = () => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const d = JSON.parse(rawDraft);
        if (d.title) setTitle(d.title);
        if (d.description) setDescription(d.description);
        if (d.selectedCategory) setSelectedCategory(d.selectedCategory);
        if (d.address) setAddress(d.address);
        if (d.selectedLat) setSelectedLat(d.selectedLat);
        if (d.selectedLng) setSelectedLng(d.selectedLng);
        if (d.pincode) setPincode(d.pincode);
        if (d.landmark) setLandmark(d.landmark);
        showToast('Resumed report draft.', 'info');
      }
    } catch {
      showToast('Could not resume draft.', 'error');
    } finally {
      setHasDraft(false);
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    showToast('Draft discarded.', 'info');
  };

  // Pincode Search mapping to autoselect city & ward
  const handlePincodeSearch = () => {
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      showToast('Please enter a valid 6-digit Indian Pincode.', 'warning');
      return;
    }

    // Static Mock Pincode Lookup
    const pinMap: Record<string, { city: string, state: string, ward: string, lat: number, lng: number }> = {
      '411038': { city: 'Pune', state: 'Maharashtra', ward: 'Kothrud Area', lat: 18.5074, lng: 73.8077 },
      '400001': { city: 'Mumbai', state: 'Maharashtra', ward: 'Colaba (Ward A)', lat: 18.9220, lng: 72.8347 },
      '560008': { city: 'Bengaluru', state: 'Karnataka', ward: 'Indiranagar (Ward 80)', lat: 12.9784, lng: 77.6408 },
      '110017': { city: 'Delhi', state: 'Delhi', ward: 'Saket (South Zone)', lat: 28.5244, lng: 77.2066 },
      '462011': { city: 'Bhopal', state: 'Madhya Pradesh', ward: 'Zone I — MP Nagar', lat: 23.2324, lng: 77.4294 },
      '382424': { city: 'Ahmedabad', state: 'Gujarat', ward: 'Navrangpura', lat: 23.0305, lng: 72.5582 },
    };

    const match = pinMap[cleanPin];
    if (match) {
      setSelectedState(match.state);
      setSelectedCity(match.city);
      setSelectedWardName(match.ward);
      setSelectedLat(match.lat);
      setSelectedLng(match.lng);
      setAddress(`${match.ward}, ${match.city}, ${match.state} (Pincode: ${cleanPin})`);
      showToast(`Pincode verified! Auto-mapped to ${match.city}, ${match.state}.`, 'success');
    } else {
      // General region fallback based on first digit
      const digit = cleanPin[0];
      let fallback = { city: 'Bhopal', state: 'Madhya Pradesh', ward: 'Zone I — MP Nagar', lat: 23.2599, lng: 77.4126 };
      if (digit === '4') fallback = { city: 'Pune', state: 'Maharashtra', ward: 'Kothrud Area', lat: 18.5204, lng: 73.8567 };
      if (digit === '5') fallback = { city: 'Bengaluru', state: 'Karnataka', ward: 'Indiranagar (Ward 80)', lat: 12.9716, lng: 77.5946 };
      if (digit === '1') fallback = { city: 'Delhi', state: 'Delhi', ward: 'Saket (South Zone)', lat: 28.6139, lng: 77.2090 };
      
      setSelectedState(fallback.state);
      setSelectedCity(fallback.city);
      setSelectedWardName(fallback.ward);
      setSelectedLat(fallback.lat);
      setSelectedLng(fallback.lng);
      setAddress(`${fallback.ward}, ${fallback.city}, ${fallback.state} (Approximate Pincode Fallback)`);
      showToast(`Mapped to region fallback for pincode range: ${fallback.city}.`, 'info');
    }
  };

  const handleManualMapSelect = (newLat: number, newLng: number) => {
    setSelectedLat(newLat);
    setSelectedLng(newLng);
    setAddress(`Manual Coordinates: ${newLat.toFixed(4)}, ${newLng.toFixed(4)} — ${selectedWardName}, ${selectedCity}`);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size must be smaller than 10MB.', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPhotoUrl(objectUrl);

    setAiAnalyzing(true);
    setAiResult(null);
    try {
      const res = await verifyPhotoHeuristic(file, selectedCategory);
      setAiResult(res);
      if (res.status === 'SUCCESS') {
        showToast(`AI verification passed! Confidence: ${res.confidence}%`, 'success');
      } else {
        showToast('AI Warning: Uploaded image content has low feature match.', 'warning');
      }
    } catch {
      // Fallback
    } fillingly: {
      setAiAnalyzing(false);
    }
  };

  // Form Step Validation Handlers
  const handleStep1Next = () => {
    if (locationMode === 'pincode' && !/^\d{6}$/.test(pincode)) {
      showToast('Please enter and verify a valid pincode first.', 'warning');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleStep3Next = () => {
    if (!title.trim()) {
      showToast('Please enter a descriptive title.', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Please describe the problem details.', 'warning');
      return;
    }
    
    // Check duplicates before moving to Review step
    const dupCheck = findPotentialDuplicate(selectedCategory, selectedLat, selectedLng, issues);
    if (dupCheck.isDuplicateFound && dupCheck.matchingIssue) {
      setDuplicatesFound([dupCheck.matchingIssue]);
    } else {
      setDuplicatesFound([]);
    }
    setStep(4);
  };

  const handleStep4Next = () => {
    setStep(5);
  };

  // Submit and save operations
  const handleSubmitOnline = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const deptId = getDepartmentForCategory(selectedCategory);
      const trackingId = generateTrackingId();
      const issueId = generateIssueId();

      const newIssue: Issue = {
        id: issueId,
        trackingId,
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        department: deptId,
        status: 'Reported',
        priority: priority,
        lat: selectedLat,
        lng: selectedLng,
        address: `${address} ${landmark ? `(Landmark: ${landmark})` : ''}`,
        city: selectedCity,
        state: selectedState,
        photoUrl: photoUrl || undefined,
        reportedBy: user?.name || 'Citizen',
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: 'Reported',
            timestamp: new Date().toISOString(),
            note: 'Issue submitted on India Portal by citizen.',
            updatedBy: user?.name || 'Citizen',
          },
        ],
        upvotes: 1,
        upvotedBy: [user?.id || 'guest'],
        escalated: false,
        language: 'en',
      };

      addIssue(newIssue);
      localStorage.removeItem(DRAFT_KEY);
      setSubmittedIssue(newIssue);
      setIsSubmitting(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1000);
  };

  const handleSaveOffline = () => {
    try {
      const offlineDraftsRaw = localStorage.getItem(OFFLINE_DRAFTS_KEY) || '[]';
      const offlineDrafts = JSON.parse(offlineDraftsRaw);
      
      const newDraft = {
        id: `draft-${generateIssueId()}`,
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        lat: selectedLat,
        lng: selectedLng,
        address,
        landmark,
        photoUrl,
        savedAt: new Date().toISOString(),
      };

      offlineDrafts.push(newDraft);
      localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(offlineDrafts));
      localStorage.removeItem(DRAFT_KEY);

      showToast('Saved offline — we\'ll submit when you\'re back online.', 'success');
      navigate('/reports');
    } catch {
      showToast('Failed to save offline draft.', 'error');
    }
  };

  const handleDuplicateUpvote = (issueId: string) => {
    if (user) {
      upvoteIssue(issueId, user.id);
      showToast('Support registered successfully! Upvoted existing issue.', 'success');
      localStorage.removeItem(DRAFT_KEY);
      navigate('/reports');
    } else {
      showToast('Please log in to support community issues.', 'warning');
    }
  };

  const targetDept = getDepartmentById(getDepartmentForCategory(selectedCategory));

  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#121B2B] border border-slate-800 p-8 rounded-3xl space-y-6 text-center shadow-xl text-white"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-450 mx-auto flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-950/40 text-indigo-400 text-xs font-mono font-bold border border-indigo-900">
              {submittedIssue.trackingId}
            </span>
            <h2 className="text-3xl font-black">Report Filed Successfully!</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Forwarded to suggested authority: <strong className="text-indigo-400">{targetDept.name}</strong>.
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              NagarSathi Suggested SLA Audit: Response expected within 24–72 hours
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800 text-left space-y-2 text-xs font-semibold text-slate-300">
            <p><strong>Title:</strong> {submittedIssue.title}</p>
            <p><strong>Category:</strong> {UI_CATEGORIES.find(c => c.id === selectedCategory)?.label}</p>
            <p><strong>Location:</strong> {submittedIssue.address}</p>
            <p><strong>Suggested SLA Priority:</strong> {submittedIssue.priority}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(submittedIssue.trackingId);
                showToast('Tracking ID copied!', 'info');
              }}
              className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy Tracking ID
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              Track Progress &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8 text-white bg-[#050816] min-h-screen">
      
      {/* Resume Unsaved Draft Banner */}
      {hasDraft && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
            <FileCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>You have an unsaved draft saved at <strong>{draftTime}</strong>. Resume?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumeDraft}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resume Draft
            </button>
            <button
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:bg-slate-800 border border-slate-800"
            >
              Discard
            </button>
          </div>
        </motion.div>
      )}

      {/* Header and Step Indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-500" /> File a Civic Report
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            NagarSathi India-wide Civic Grievance Submission Portal
          </p>
        </div>
        
        {/* Offline Mode and Data Saver Checkbox Row */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 border border-slate-800 px-2.5 py-1 rounded-xl bg-slate-900/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOffline}
              onChange={(e) => setIsOffline(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/25 text-xs"
            />
            <WifiOff className="w-3 h-3 text-rose-500" />
            <span>Simulate Offline</span>
          </label>

          <label className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 border border-slate-800 px-2.5 py-1 rounded-xl bg-slate-900/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dataSaver}
              onChange={(e) => setDataSaver(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/25 text-xs"
            />
            <Database className="w-3 h-3 text-indigo-400" />
            <span>Low-Bandwidth</span>
          </label>

          <div className="text-xs font-black uppercase text-indigo-400 tracking-wider bg-indigo-950/40 px-3 py-1 rounded-xl border border-indigo-900/60 shrink-0">
            Step {step} of 5
          </div>
        </div>
      </div>

      {/* 5-Step Progress Bar */}
      <div className="grid grid-cols-5 gap-2 relative">
        {[
          { num: '01', label: 'Location' },
          { num: '02', label: 'Category' },
          { num: '03', label: 'Details' },
          { num: '04', label: 'Review' },
          { num: '05', label: 'Submit' },
        ].map((s, idx) => (
          <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                step === idx + 1
                  ? 'bg-indigo-650 text-white border border-indigo-500/40 shadow-sm'
                  : step > idx + 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}>
                {step > idx + 1 ? '✓' : s.num}
              </div>
              <span className={`hidden md:inline text-[10px] font-black tracking-wider uppercase ${
                step === idx + 1 ? 'text-indigo-400' : 'text-slate-500'
              }`}>{s.label}</span>
            </div>
            <div className={`h-1.5 w-full rounded-full mt-1 ${
              step >= idx + 1 ? 'bg-indigo-600' : 'bg-slate-900'
            }`} />
          </div>
        ))}
      </div>

      {/* EMERGENCY SAFETY WARNING */}
      {step === 1 && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 font-semibold leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Emergency Safety Warning:</strong>
            NagarSathi is a civic infrastructure reporting platform and is <strong>not</strong> an emergency response dispatcher. For dangerous, live electrical wires, active fires, or road emergencies, call local helplines (112, 101, 102) immediately.
          </div>
        </div>
      )}

      {/* WIZARD RENDER STEPS */}
      
      {/* STEP 1: Location Setup */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#121B2B] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-black text-base flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-indigo-400" /> Step 1: Pinpoint Incident Location
            </h3>

            {/* Location Mode Choice */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: 'gps', label: 'Use GPS', icon: '📍' },
                { mode: 'pincode', label: 'Search Pincode', icon: '🔍' },
                { mode: 'manual', label: 'Select Manually', icon: '🏢' },
              ].map((item) => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setLocationMode(item.mode as any)}
                  className={`p-3.5 rounded-xl border text-xs font-black transition-all flex flex-col items-center justify-center gap-1.5 uppercase tracking-wider ${
                    locationMode === item.mode
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mode-Specific Renders */}
            {locationMode === 'gps' && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#0B1220] border border-slate-800 text-center">
                <p className="text-xs text-slate-400 font-semibold">
                  Press request to acquire precise GPS geo-coordinates.
                </p>
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 mx-auto transition-transform active:scale-95"
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Detecting GPS...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" /> Detect GPS Coordinates
                    </>
                  )}
                </button>
              </div>
            )}

            {locationMode === 'pincode' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#0B1220] border border-slate-800">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450">
                  Search by 6-Digit Indian Pincode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g., 411038 or 560008"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handlePincodeSearch}
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                  Try verified demo pincodes: <strong>411038</strong> (Pune Kothrud), <strong>560008</strong> (Bengaluru Indiranagar), <strong>400001</strong> (Mumbai Colaba).
                </p>
              </div>
            )}

            {locationMode === 'manual' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0B1220] border border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450">State / UT</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const matched = INDIAN_LOCATIONS.find((loc) => loc.state === e.target.value);
                      if (matched) setSelectedCity(matched.name);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
                  >
                    {statesList.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450">City / Municipality</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
                  >
                    {citiesInState.map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450">Select Ward / Zone</label>
                  <select
                    value={selectedWardId}
                    onChange={(e) => {
                      const matched = wardsInCity.find((w) => w.id === e.target.value);
                      if (matched) {
                        setSelectedWardId(matched.id);
                        setSelectedWardName(matched.name);
                        setAddress(`${matched.name}, ${selectedCity}, ${selectedState}`);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
                  >
                    {wardsInCity.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Landmark and Address Verification */}
            <div className="space-y-4 border-t border-slate-800 pt-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Landmark / Neighborhood Block <span className="text-slate-550 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g., Near Shiv Mandir / Behind Metro Pillar 42"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Detected Report Address Reference
                </label>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                  {address}
                </div>
              </div>

              {/* Map coordinate picker wrapper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Pinpoint Location coordinates</span>
                </div>
                <div className="h-[250px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <MapPicker
                    lat={selectedLat}
                    lng={selectedLng}
                    onLocationChange={handleManualMapSelect}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleStep1Next}
              className="px-6 py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1 transition-transform active:scale-98"
            >
              Step 2: Choose Category <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Category Select */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#121B2B] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-black text-base flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-indigo-400" /> Step 2: Select Civic Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {UI_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2.5 ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600/10 border-indigo-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl shrink-0">{cat.icon}</span>
                    <h4 className="font-extrabold text-xs text-white">{cat.label}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Smart Routing Preview Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/60 space-y-2">
              <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                NagarSathi Suggested Routing Path
              </h4>
              <p className="text-xs text-slate-350 font-semibold leading-relaxed">
                Based on category rules, this complaint will route to the suggested municipal division:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-white mt-1 shadow-md">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>{targetDept.name} ({targetDept.id.toUpperCase()})</span>
              </div>
              <p className="text-[9px] text-slate-550 font-bold leading-normal">
                Note: Municipal names and structures are mock configurations and will auto-map based on your selected city.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 font-extrabold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleStep2Next}
              className="px-6 py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1"
            >
              Step 3: Enter Details &amp; Evidence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Enter Details & Evidence */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#121B2B] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-black text-base flex items-center gap-2 text-white">
              <Camera className="w-5 h-5 text-indigo-400" /> Step 3: Description &amp; Photo Evidence
            </h3>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Issue Header Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Blocked sewer pipes causing heavy water overflow"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Complaint Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed logs of the incident. Unresolved time, severity indicators, water contamination alerts, or safety dangers..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Priority Picker */}
            <div className="space-y-2 border-t border-slate-850 pt-4">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Estimated Issue Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p as any)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors border ${
                      priority === p
                        ? p === 'Critical'
                          ? 'bg-rose-950/40 text-rose-500 border-rose-800 shadow-md'
                          : p === 'High'
                          ? 'bg-orange-950/40 text-orange-400 border-orange-800 shadow-md'
                          : 'bg-indigo-650 text-white border-transparent'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-550 leading-normal font-bold">
                * Note: Final priority score is dynamic and will verify based on community support count and safety hazards.
              </p>
            </div>

            {/* Photo Picker and Verification */}
            <div className="space-y-4 border-t border-slate-800 pt-5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Attach Image Evidence
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-800 bg-[#0B1220] overflow-hidden flex items-center justify-center relative shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    id="evidence-file"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="evidence-file"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-805 hover:bg-slate-805 cursor-pointer text-xs font-black text-white"
                  >
                    Select Photo File
                  </label>
                  <p className="text-[10px] text-slate-505 font-semibold leading-relaxed">
                    Supported extensions: JPG, JPEG, PNG (max 10MB). Image validation engine matches pixel category heuristics.
                  </p>
                </div>
              </div>

              {/* simulated video toggle */}
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 mt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={videoSimulated}
                  onChange={(e) => setVideoSimulated(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500/25"
                />
                <span>Simulate Optional Video Evidence attachment</span>
              </label>

              {/* AI Verification Results Box */}
              <AnimatePresence>
                {aiAnalyzing && (
                  <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-2 text-xs text-indigo-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>NagarSathi AI analyzing upload content heuristics...</span>
                  </div>
                )}
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                      aiResult.status === 'SUCCESS'
                        ? 'bg-emerald-950/20 border-emerald-900 text-emerald-450'
                        : 'bg-amber-950/20 border-amber-900 text-amber-500'
                    }`}
                  >
                    {aiResult.status === 'SUCCESS' ? (
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="block font-black uppercase text-[10px]">
                        AI Verification Heuristics: {aiResult.status} ({aiResult.confidence}% Confidence)
                      </strong>
                      <span className="block text-[11px] text-slate-350 font-semibold mt-0.5">
                        {aiResult.heuristicDetails}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 font-extrabold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleStep3Next}
              className="px-6 py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1"
            >
              Step 4: Review Report Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Review Details & Duplicate Check */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#121B2B] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-black text-base flex items-center gap-2 text-white">
              <FileCheck className="w-5 h-5 text-indigo-400" /> Step 4: Review &amp; Duplicate Checker
            </h3>

            {/* DUPLICATE WARNINGS GRID */}
            <AnimatePresence>
              {duplicatesFound.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-5 rounded-3xl bg-amber-950/20 border border-amber-900/50 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">
                        Similar Issues Detected Nearby!
                      </h4>
                      <p className="text-xs text-slate-350 font-semibold leading-relaxed">
                        We discovered a matching issue of category <strong>{selectedCategory}</strong> within 150m of your coordinates. To avoid duplicate logs, you can support this existing report:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {duplicatesFound.map((dup) => (
                      <div
                        key={dup.id}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
                      >
                        <div className="text-left space-y-1 text-xs">
                          <p className="font-extrabold text-white">{dup.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Address: {dup.address}</p>
                          <p className="text-[10px] text-amber-500 font-black uppercase">
                            Status: {dup.status} &bull; {dup.upvotes} Citizens Affected
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleDuplicateUpvote(dup.id)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95"
                        >
                          I Have This Problem Too
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 font-bold leading-normal">
                    * If you believe your issue is completely distinct, you can ignore this warning and proceed to submit.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Review Summary */}
            <div className="space-y-4 border-t border-slate-800 pt-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Summary of Submission details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-350 bg-[#0B1220] p-5 rounded-2xl border border-slate-850">
                <div className="space-y-1 sm:col-span-2">
                  <span className="block text-[9px] uppercase text-slate-500 font-black">Title</span>
                  <span className="text-white text-sm font-black">{title}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase text-slate-500 font-black">Region / City</span>
                  <span className="text-white font-bold">{selectedCity}, {selectedState}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase text-slate-500 font-black">Ward / Zone</span>
                  <span className="text-white font-bold">{selectedWardName}</span>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="block text-[9px] uppercase text-slate-500 font-black">Incident Address Reference</span>
                  <span className="text-white font-semibold leading-relaxed">{address} {landmark && `(Landmark: ${landmark})`}</span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[9px] uppercase text-slate-500 font-black">Civic Category</span>
                  <span className="text-white font-bold">{UI_CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[9px] uppercase text-slate-500 font-black">Suggested Routing Authority</span>
                  <span className="text-indigo-400 font-black">{targetDept.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 font-extrabold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleStep4Next}
              className="px-6 py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1"
            >
              Step 5: Select Submission Mode <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: Select Submission Mode & Submit */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#121B2B] p-6 rounded-3xl border border-slate-805 space-y-6">
            <h3 className="font-black text-base flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Step 5: Ready for Submission
            </h3>

            {isOffline ? (
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/50 space-y-4">
                <div className="flex items-start gap-3 text-xs text-amber-500 font-semibold leading-relaxed">
                  <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Offline Mode Enabled</strong>
                    Your internet connection is currently simulated as offline. NagarSathi will save this report safely to your local device draft queue, and submit automatically once connectivity is restored.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveOffline}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <WifiOff className="w-4 h-4" /> Save Local Offline Draft
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-805 text-xs text-slate-400 leading-relaxed font-semibold">
                  You are online. Ready to dispatch this complaint record to suggested authority database routers. All coordinates will persist in primary PostgreSQL tables.
                </div>

                <button
                  type="button"
                  onClick={handleSubmitOnline}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-99 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" /> Sending to Municipal Dispatch...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4.5 h-4.5" /> Dispatch Report Online
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 font-extrabold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};
