import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapPicker } from '../components/map/MapPicker';
import { DuplicateWarningModal } from '../components/issues/DuplicateWarningModal';
import { getDepartmentForCategory } from '../services/routing';
import { getDepartmentById } from '../data/departments';
import { verifyPhotoHeuristic, type PhotoVerificationResult } from '../services/photoVerification';
import { findPotentialDuplicate } from '../services/duplicateDetection';
import { generateTrackingId, generateIssueId } from '../utils/idGenerator';
import type { Issue, IssueCategory } from '../types';
import { showToast } from '../components/ui/Toast';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Camera,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Copy,
  FileText,
  Building2,
  FileCheck,
  RotateCcw,
  Check,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';

const DRAFT_KEY = 'nagarsathi_report_draft';

interface CategoryItem {
  id: IssueCategory;
  label: string;
  desc: string;
  icon: string;
}

const UI_CATEGORIES: CategoryItem[] = [
  { id: 'roads', label: 'Roads & Infrastructure', desc: 'Potholes, broken roads and damaged public infrastructure', icon: '🛣️' },
  { id: 'sanitation', label: 'Sanitation', desc: 'Garbage, waste collection and cleanliness issues', icon: '🗑️' },
  { id: 'electricity', label: 'Electricity & Street Lighting', desc: 'Streetlights, exposed wires and electrical hazards', icon: '💡' },
  { id: 'water', label: 'Water & Drainage', desc: 'Water leakage, drainage and pipeline problems', icon: '💧' },
  { id: 'public-property', label: 'Public Property', desc: 'Damaged public buildings, benches, shelters, etc.', icon: '🏗️' },
  { id: 'drainage', label: 'Safety', desc: 'Dangerous locations and urgent civic hazards', icon: '🚨' },
];

export const ReportIssue: React.FC = () => {
  const { user } = useAuth();
  const { issues, addIssue, upvoteIssue } = useIssues();
  const navigate = useNavigate();

  const { lat, lng, loading: geoLoading, requestLocation, defaultLat, defaultLng } = useGeolocation();

  // Steps: 1 = Details & Category, 2 = Evidence, 3 = Location & Submit
  const [step, setStep] = useState<number>(1);

  const [selectedLat, setSelectedLat] = useState<number>(defaultLat);
  const [selectedLng, setSelectedLng] = useState<number>(defaultLng);
  const [address, setAddress] = useState<string>('Maharana Pratap Nagar, Bhopal, MP');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('roads');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [draftTime, setDraftTime] = useState<string>('');

  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<PhotoVerificationResult | null>(null);

  const [duplicateModalOpen, setDuplicateModalOpen] = useState<boolean>(false);
  const [duplicateMatch, setDuplicateMatch] = useState<Issue | undefined>(undefined);
  const [duplicateDistance, setDuplicateDistance] = useState<number | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null);
  
  // Show Map picker inside Location step
  const [showMap, setShowMap] = useState<boolean>(true);

  useEffect(() => {
    if (lat && lng) {
      setSelectedLat(lat);
      setSelectedLng(lng);
      setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} — MP Nagar Area, Bhopal`);
    }
  }, [lat, lng]);

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
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }
  }, [title, description, selectedCategory, address, selectedLat, selectedLng, submittedIssue]);

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
    } catch {
      // Fallback
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleStep1Next = () => {
    if (!title.trim()) {
      showToast('Please enter an issue title.', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Please write a brief description.', 'warning');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleLocationSubmitClick = () => {
    // Check duplicates before submitting
    const dupCheck = findPotentialDuplicate(selectedCategory, selectedLat, selectedLng, issues);
    if (dupCheck.isDuplicateFound && dupCheck.matchingIssue) {
      setDuplicateMatch(dupCheck.matchingIssue);
      setDuplicateDistance(dupCheck.distanceMeters);
      setDuplicateModalOpen(true);
    } else {
      executeSubmission();
    }
  };

  const executeSubmission = () => {
    setDuplicateModalOpen(false);
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
        priority: aiResult?.confidence && aiResult.confidence > 0.8 ? 'High' : 'Medium',
        lat: selectedLat,
        lng: selectedLng,
        address,
        photoUrl: photoUrl || undefined,
        reportedBy: user?.name || 'Citizen',
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: 'Reported',
            timestamp: new Date().toISOString(),
            note: 'Issue submitted on portal by citizen.',
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
    }, 800);
  };

  const handleConfirmDuplicateUpvote = (issueId: string) => {
    if (user) {
      upvoteIssue(issueId, user.id);
      showToast('Upvoted existing report! Navigating to your issues list.', 'success');
      localStorage.removeItem(DRAFT_KEY);
      navigate('/citizen/issues');
    }
  };

  const handleProceedAnyway = () => {
    executeSubmission();
  };

  const targetDept = getDepartmentById(getDepartmentForCategory(selectedCategory));
  const activeCategoryDetail = useMemo(() => {
    return UI_CATEGORIES.find((c) => c.id === selectedCategory) || UI_CATEGORIES[0];
  }, [selectedCategory]);

  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl space-y-6 text-center shadow-xl border border-slate-200"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-650 text-xs font-mono font-bold border border-indigo-200">
              {submittedIssue.trackingId}
            </span>
            <h2 className="text-3xl font-black text-slate-900">Report Submitted Successfully!</h2>
            <p className="text-xs text-slate-500 font-semibold">
              Your issue has been forwarded to the relevant department: <strong className="text-slate-900">{targetDept.name}</strong>.
            </p>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Expected response: Within 24–72 hours
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 text-left space-y-2 text-xs border border-slate-200 font-semibold text-slate-700">
            <p><strong>Title:</strong> {submittedIssue.title}</p>
            <p><strong>Category:</strong> {activeCategoryDetail.label}</p>
            <p><strong>Location:</strong> {submittedIssue.address}</p>
            <p><strong>SLA priority:</strong> {submittedIssue.priority} Priority</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(submittedIssue.trackingId);
                showToast('Tracking ID copied!', 'info');
              }}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-250 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy Tracking ID
            </button>

            <button
              onClick={() => navigate('/citizen/issues')}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              Track Progress &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Resume Unsaved Draft Banner */}
      {hasDraft && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold">
            <FileCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>You have an unsaved draft saved at <strong>{draftTime}</strong>. Would you like to resume?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumeDraft}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resume Draft
            </button>
            <button
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 rounded-xl bg-slate-150 text-slate-700 text-xs font-semibold hover:bg-slate-200 border border-slate-200"
            >
              Discard
            </button>
          </div>
        </motion.div>
      )}

      {/* Header and Step Indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-600" /> Report a Civic Issue
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            File details, attach photo evidence, and select coordinates for municipal dispatch routing.
          </p>
        </div>
        <div className="text-xs font-black uppercase text-indigo-650 tracking-wider bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 shrink-0">
          Step {step} of 3
        </div>
      </div>

      {/* Modern Progress Steps Bar */}
      <div className="grid grid-cols-3 gap-2 relative">
        {[
          { num: '01', label: 'Issue Details' },
          { num: '02', label: 'Category & Evidence' },
          { num: '03', label: 'Location & Submit' },
        ].map((s, idx) => (
          <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === idx + 1
                  ? 'bg-indigo-600 text-white border border-indigo-700 shadow-sm'
                  : step > idx + 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500 border border-slate-300'
              }`}>
                {step > idx + 1 ? '✓' : s.num}
              </div>
              <span className={`hidden sm:inline text-[11px] font-extrabold tracking-tight ${
                step === idx + 1 ? 'text-indigo-600 font-black' : 'text-slate-500'
              }`}>{s.label}</span>
            </div>
            <div className={`h-1.5 w-full rounded-full mt-1 ${
              step >= idx + 1 ? 'bg-indigo-600' : 'bg-slate-200'
            }`} />
          </div>
        ))}
      </div>

      {/* Step 1: Issue Details */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Step 1: Issue Details &amp; Category
            </h3>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="issue-title" className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="issue-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep Potholes on MP Nagar Main Road"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="issue-desc" className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                Problem Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="issue-desc"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, landmark details, or immediate safety concern..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-905 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 font-semibold"
              />
            </div>

            {/* Redesigned Category Selection Cards */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                Select Problem Category <span className="text-rose-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {UI_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-start justify-between gap-3 ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-550/15'
                        : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl mt-0.5">{cat.icon}</span>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-slate-900">{cat.label}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{cat.desc}</p>
                      </div>
                    </div>
                    {selectedCategory === cat.id && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm border border-indigo-700">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-end">
            <button
              onClick={handleStep1Next}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:scale-[1.01] transition-transform"
            >
              Continue to Evidence &rarr;
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Evidence & Category Verification */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="font-black text-base text-slate-900">Step 2: Attach Photo Evidence</h3>

            {/* Photo Upload Area */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                📷 Add Photo Evidence
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 relative hover:border-indigo-500 transition-colors bg-slate-50/50">
                {photoUrl ? (
                  <div className="space-y-4">
                    <img src={photoUrl} alt="Preview" className="h-44 mx-auto rounded-xl object-cover shadow-sm border border-slate-200" />
                    
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>

                      <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Replace
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-slate-800">
                        Drag &amp; Drop or Browse from device
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">JPG, PNG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>

              {aiAnalyzing && (
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-semibold flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Simulated AI Analyzing Photo Quality &amp; Categorization...
                </div>
              )}

              {aiResult && (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" /> AI Confidence Score: {Math.round(aiResult.confidence * 100)}% — Photo Verified!
                </div>
              )}
            </div>

            {/* Auto Routing Info Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-250/60 space-y-2">
              <h4 className="font-extrabold text-xs text-indigo-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" /> Auto-Routing Dispatch
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                Your issue will be routed to: <strong className="text-slate-900">{targetDept.name}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase text-indigo-650 tracking-wider pt-1">
                <span className="flex items-center gap-1">✓ Automatically detected</span>
                <span className="flex items-center gap-1">✓ No manual department selection required</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={handleStep2Next}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:scale-[1.01] transition-transform"
            >
              Continue to Location &rarr;
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Location, Review & Submit */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" /> Step 3: Location &amp; Review
            </h3>

            {/* Geotag Coordinates Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-xs text-slate-905 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-600" /> Current Location
              </h4>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Latitude</span>
                  <span className="font-mono text-slate-900">{selectedLat.toFixed(6)}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Longitude</span>
                  <span className="font-mono text-slate-900">{selectedLng.toFixed(6)}</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-200/60 pt-3">
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Readable address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-650 hover:bg-indigo-100 text-[11px] font-bold flex items-center gap-1"
                >
                  {geoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                  Use My Location
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-750 hover:bg-slate-200 text-[11px] font-bold"
                >
                  {showMap ? 'Hide Map' : 'Change Location (Show Map)'}
                </button>
              </div>
            </div>

            {/* Map Picker Visual Toggle */}
            {showMap && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-1 bg-slate-50">
                <MapPicker
                  lat={selectedLat}
                  lng={selectedLng}
                  onLocationChange={(newLat, newLng) => {
                    setSelectedLat(newLat);
                    setSelectedLng(newLng);
                    setAddress(`Lat: ${newLat.toFixed(4)}, Lng: ${newLng.toFixed(4)} — MP Nagar Area, Bhopal`);
                  }}
                />
              </div>
            )}

            {/* Summary Review Step */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h4 className="font-black text-xs text-slate-900">Review Your Report</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-indigo-50/30 border border-indigo-150 rounded-2xl text-xs font-semibold text-slate-700 space-y-1 sm:space-y-0">
                <div className="space-y-1">
                  <p><strong>Title:</strong> {title}</p>
                  <p><strong>Category:</strong> {activeCategoryDetail.label}</p>
                  <p className="line-clamp-2"><strong>Description:</strong> {description}</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Photo:</strong> {photoUrl ? 'Evidence attached (JPG/PNG)' : 'No Photo Evidence'}</p>
                  <p><strong>Location:</strong> {address}</p>
                  <p><strong>Target Department:</strong> {targetDept.name}</p>
                  <p><strong>Priority SLA:</strong> {aiResult?.confidence && aiResult.confidence > 0.8 ? 'High' : 'Medium'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              onClick={handleLocationSubmitClick}
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-indigo-605 hover:bg-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:scale-[1.01] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Report &rarr;
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Duplicate Warning Modal */}
      {duplicateMatch && (
        <DuplicateWarningModal
          isOpen={duplicateModalOpen}
          matchingIssue={duplicateMatch}
          distanceMeters={duplicateDistance || 100}
          onUpvoteExisting={handleConfirmDuplicateUpvote}
          onSubmitAnyway={handleProceedAnyway}
          onClose={() => setDuplicateModalOpen(false)}
        />
      )}
    </div>
  );
};
