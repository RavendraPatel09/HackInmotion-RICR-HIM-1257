import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Camera, Sparkles, MapPin, CheckCircle2, ChevronRight, X, AlertTriangle } from 'lucide-react';

export default function CitizenReport() {
  const navigate = useNavigate();
  const { addIssue } = useStore();
  
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const totalSteps = 5;

  const categories = [
    { id: 'Roads', icon: '🛣️' },
    { id: 'Waste', icon: '🗑️' },
    { id: 'Water', icon: '💧' },
    { id: 'Drainage', icon: '🌊' },
    { id: 'Electricity', icon: '💡' },
    { id: 'Public Property', icon: '🌳' },
    { id: 'Other', icon: '📝', span2: true },
  ];

  const handleNext = () => {
    if (step === 4) {
      setIsSubmitting(true);
      // Simulate API call for duplicate detection
      setTimeout(() => {
        setIsSubmitting(false);
        if (description.length > 50 && Math.random() > 0.5) {
          setShowDuplicate(true);
        } else {
          setStep(5);
        }
      }, 1000);
    } else if (step < totalSteps) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Mock derived values
      let mockPrio: 'High' | 'Medium' | 'Low' | 'Critical' = 'Medium';
      let mockDept = 'General Municipal Services';
      
      if (['Roads', 'Infrastructure'].includes(category)) mockDept = 'PWD - Roads Division';
      if (['Sanitation', 'Waste'].includes(category)) mockDept = 'Solid Waste Management';
      if (['Electricity'].includes(category)) mockDept = 'Electricity Board';
      
      const descLower = description.toLowerCase();
      if (descLower.includes('urgent') || descLower.includes('dangerous') || descLower.includes('leak')) mockPrio = 'High';

      const dupProb = Math.min(Math.floor(description.length / 5), 89);

      const newIssue = addIssue({
        title: `${category} Issue in ${location.split(',')[0] || 'Unknown'}`,
        category,
        description,
        location,
        imageUrl: evidenceUrl,
        priority: mockPrio,
        department: mockDept,
        duplicateProbability: dupProb
      });
      
      setSuccessId(newIssue.id);
      setIsSubmitting(false);
      setStep(6); // Success step
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEvidenceUrl(ev.target?.result as string);
        setStep(4);
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!category;
    if (step === 2) return !!location && location.trim().length > 0;
    if (step === 3) return !!evidenceUrl;
    if (step === 4) return !!description && description.trim().length > 0;
    return true;
  };

  if (step === 6) {
    return (
      <div className="max-w-[800px] mx-auto py-12 px-4 text-center page-enter">
        <CheckCircle2 size={80} className="text-success mx-auto mb-6" />
        <h2 className="display-sm mb-2 text-brand-navy">Report Submitted!</h2>
        <p className="body-lg text-outline mb-10">Thank you for making Bhopal better.</p>
        
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1 max-w-[400px] mx-auto mb-10">
          <div className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Issue Tracking ID</div>
          <div className="text-3xl font-mono font-bold text-brand-navy tracking-widest mb-4">{successId}</div>
          <div className="inline-block px-3 py-1 bg-warning/10 text-warning font-semibold rounded-full text-sm">
            Under Review
          </div>
        </div>

        <div className="flex flex-col gap-4 max-w-[400px] mx-auto">
          <Link to={`/citizen/issues`} className="w-full py-4 bg-brand-green text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 transition shadow-elevation-1">
            Track Issue Status
          </Link>
          <Link to="/citizen" className="w-full py-4 bg-transparent border border-outline-variant text-brand-navy font-semibold rounded-xl text-lg hover:bg-slate-50 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (showDuplicate) {
    return (
      <div className="max-w-[800px] mx-auto py-8 page-enter">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setShowDuplicate(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={24} /></button>
          <h2 className="headline-md m-0">Similar Issue Found</h2>
        </div>
        
        <div className="bg-warning/10 border border-warning/30 p-6 rounded-2xl mb-8 flex gap-4">
          <div className="text-warning mt-1"><AlertTriangle size={24} /></div>
          <div>
            <h3 className="text-lg font-semibold text-warning-dark mb-1">We found a matching report</h3>
            <p className="text-sm text-outline-dark">Someone else has already reported a similar issue nearby. Supporting their report helps authorities prioritize it faster.</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-elevation-1 mb-10">
          <div className="flex justify-between items-start mb-4">
            <div className="inline-block px-2.5 py-1 bg-brand-navy/10 text-brand-navy text-xs font-bold rounded">BH-98234</div>
            <div className="text-sm text-outline">Reported 2 hours ago</div>
          </div>
          <h4 className="text-xl font-semibold mb-2">{category} Issue in {location.split(',')[0]}</h4>
          <p className="text-outline text-sm mb-4 line-clamp-2">The exact same issue was described here...</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
              </div>
              <span className="text-xs font-medium text-outline">12 citizens supporting</span>
            </div>
            <span className="px-2 py-1 bg-warning/20 text-warning text-xs font-bold rounded-full">In Progress</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button 
            onClick={() => {
              setSuccessId('BH-98234');
              setStep(6);
              setShowDuplicate(false);
            }}
            className="flex-1 py-4 bg-brand-green text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 transition shadow-elevation-1 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} /> Support Existing Issue
          </button>
          <button 
            onClick={() => {
              setShowDuplicate(false);
              setStep(5);
            }}
            className="flex-1 py-4 bg-transparent border border-outline-variant text-brand-navy font-semibold rounded-xl text-lg hover:bg-slate-50 transition"
          >
            Report Separately Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto pb-24 md:pb-8 page-enter relative min-h-[80vh]">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/citizen" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-brand-navy"><ArrowLeft size={24} /></Link>
        <h2 className="headline-md m-0 text-brand-navy">Report Issue</h2>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-brand-green' : 'bg-outline-variant'}`} />
        ))}
      </div>

      {/* STEP 1: CATEGORY */}
      {step === 1 && (
        <div className="page-enter">
          <h3 className="title-lg mb-2 text-brand-navy">What type of issue is it?</h3>
          <p className="body-md text-outline mb-8">Select the category that best fits.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${cat.span2 ? 'col-span-2' : ''} ${category === cat.id ? 'border-brand-green bg-brand-green/5 shadow-elevation-1 scale-[1.02]' : 'border-outline-variant bg-surface-container-lowest hover:border-brand-navy hover:shadow-elevation-1'}`}
              >
                <div className="text-4xl">{cat.icon}</div>
                <div className="font-semibold text-brand-navy">{cat.id}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION */}
      {step === 2 && (
        <div className="page-enter">
          <h3 className="title-lg mb-2 text-brand-navy">Where is the issue?</h3>
          <p className="body-md text-outline mb-8">Pinpoint the exact location for faster resolution.</p>
          
          <input 
            type="text" 
            placeholder="Search location (e.g. MP Nagar, Zone 1)" 
            className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all outline-none mb-4 shadow-elevation-1"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          
          <button 
            onClick={() => setLocation('MP Nagar Zone 1, Bhopal (GPS)')}
            className="w-full py-4 bg-slate-100 text-brand-navy font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors mb-6"
          >
            <MapPin size={20} /> Use Current Location
          </button>

          <div className="h-[250px] bg-slate-200 rounded-2xl relative overflow-hidden border border-outline-variant map-preview-container shadow-inner">
            <div className="absolute w-4 h-4 rounded-full bg-error ring-4 ring-error/20 top-[50%] left-[50%]"></div>
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-center text-sm font-semibold text-brand-navy shadow-elevation-1">
              {location || "Move map to adjust pin"}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EVIDENCE */}
      {step === 3 && (
        <div className="page-enter">
          <h3 className="title-lg mb-2 text-brand-navy">Upload Evidence</h3>
          <p className="body-md text-outline mb-8">Clear photos help authorities understand the severity.</p>
          
          {!evidenceUrl ? (
            <label className="border-2 border-dashed border-brand-green/50 bg-brand-green/5 rounded-2xl flex flex-col items-center justify-center h-[300px] cursor-pointer hover:bg-brand-green/10 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Camera size={48} className="text-brand-green mb-4" />
              <div className="font-bold text-lg text-brand-navy mb-1">Tap to take photo or upload</div>
              <div className="text-sm text-outline">Max size: 5MB</div>
            </label>
          ) : (
            <div className="relative h-[300px] rounded-2xl overflow-hidden bg-black shadow-elevation-2">
              <img src={evidenceUrl} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between">
                <button onClick={() => setEvidenceUrl(null)} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition">Remove</button>
                <label className="px-4 py-2 bg-brand-green hover:bg-emerald-600 text-white rounded-lg font-semibold transition cursor-pointer">
                  Replace
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: DESCRIPTION */}
      {step === 4 && (
        <div className="page-enter">
          <h3 className="title-lg mb-2 text-brand-navy">Describe the issue</h3>
          <p className="body-md text-outline mb-8">Provide any additional context or details.</p>
          
          <div className="relative">
            <textarea 
              className="w-full h-[200px] p-5 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all outline-none resize-none shadow-elevation-1"
              placeholder="E.g., The pothole is on the left side of the road heading north. It is causing severe traffic."
              value={description}
              onChange={e => setDescription(e.target.value.substring(0, 500))}
            ></textarea>
            <div className="absolute bottom-4 right-4 text-xs font-medium text-outline">
              {description.length} / 500
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW */}
      {step === 5 && (
        <div className="page-enter">
          <h3 className="title-lg mb-2 text-brand-navy">Review & Submit</h3>
          <p className="body-md text-outline mb-8">Ensure all details are correct before submitting.</p>

          {/* AI Analysis Panel */}
          <div className="bg-purple-50/50 border border-purple-200 border-l-4 border-l-purple-500 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-purple-200/50">
              <Sparkles className="text-purple-500" size={24} />
              <h3 className="text-lg font-bold text-purple-700">AI Analysis</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Category Prediction</div>
                <div className="font-semibold text-brand-navy">{category}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Confidence Score</div>
                <div className="font-semibold text-purple-600">94%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Recommended Priority</div>
                <div className="font-semibold text-error">High</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Recommended Dept</div>
                <div className="font-semibold text-brand-navy truncate">PWD - Roads Division</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Duplicate Probability</div>
                <div className="font-semibold text-success">12%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Photo Verification</div>
                <div className="font-semibold text-success">Likely Valid</div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant shadow-elevation-1 mb-10">
            <div className="h-[140px] bg-black relative">
              <img src={evidenceUrl || ''} className="w-full h-full object-cover opacity-80" alt="Evidence" />
              <div className="absolute bottom-3 left-3 bg-brand-green text-white px-2 py-1 rounded text-xs font-bold shadow-sm">{category}</div>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="text-brand-navy shrink-0 mt-0.5" size={18} />
                <div className="font-semibold text-brand-navy text-sm">{location}</div>
              </div>
              <div className="text-sm text-outline whitespace-pre-wrap">{description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="fixed md:absolute bottom-0 left-0 right-0 p-4 md:p-0 md:pt-8 bg-surface-base md:bg-transparent border-t border-outline-variant md:border-t-0 flex gap-4 z-40">
        {step > 1 && (
          <button 
            onClick={handleBack}
            className="flex-1 md:flex-none md:w-32 py-4 bg-slate-100 hover:bg-slate-200 text-brand-navy font-semibold rounded-xl transition text-lg"
          >
            Back
          </button>
        )}
        <button 
          onClick={step === totalSteps ? handleSubmit : handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex-[2] md:flex-1 py-4 bg-brand-green text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 transition shadow-elevation-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">Processing <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></span>
          ) : step === totalSteps ? (
            'Submit Report'
          ) : (
            'Next'
          )}
        </button>
      </div>

    </div>
  );
}
