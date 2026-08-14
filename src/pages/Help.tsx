import React, { useState } from 'react';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, Mail, 
  MapPin, CheckCircle, Info, MessageSquare, AlertTriangle, Bug
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface FaqItem {
  q: string;
  a: string;
  category: 'general' | 'location' | 'verification' | 'technical';
}

const FAQS: FaqItem[] = [
  {
    q: 'How does NagarSathi routing work?',
    a: 'NagarSathi uses an automated GIS department routing matrix. When you file a report, the category selected (e.g. sanitation, streetlights) automatically routes the issue to the respective municipal department (like the Electricity Board or Public Works). The geographical coordinates map the ticket directly to the ward officer in charge of that zone.',
    category: 'general'
  },
  {
    q: 'What is the 72-hour municipal SLA?',
    a: 'NagarSathi holds city departments accountable by locking a 72-hour Service Level Agreement (SLA) timer onto all reported complaints. If an issue is not acknowledged and status updated to "In Progress" within 72 hours of submission, the ticket automatically is flagged as "SLA Breached" and escalated in the admin operation queue.',
    category: 'general'
  },
  {
    q: 'How do upvotes and community priorities work?',
    a: 'If a problem affects multiple households on a street or neighborhood, citizens can visit the report detail and click "I have this problem too" (Upvote). High-upvoted issues climb to the top of the municipal dispatch queue, forcing departments to resolve high-impact public issues first.',
    category: 'general'
  },
  {
    q: 'How do I verify if an issue has been fixed?',
    a: 'Once the department uploads verification evidence (photos and completion logs) and resolves the ticket, the citizen reporter is notified. The reporter has the authority to audit the work on-site and click "Confirm Fixed" to close the report or "Reopen Issue" if the work is unsatisfactory.',
    category: 'verification'
  },
  {
    q: 'How does GPS and location tracking work?',
    a: 'NagarSathi uses your browser\'s Geolocation API to auto-fill your exact coordinates when submitting a complaint. If GPS is disabled or unavailable, you can manually drag the pin marker on the interactive map picker to set the position and select your locality area from the dropdown menu.',
    category: 'location'
  },
  {
    q: 'Can I report an issue in another Indian city?',
    a: 'Yes. NagarSathi is an India-wide platform supporting 20 major metropolitan areas. You can switch your active location in the top header or map filters to browse and report complaints in Mumbai, Pune, Bengaluru, Delhi, etc.',
    category: 'location'
  },
  {
    q: 'What happens if my photo fails heuristic check?',
    a: 'To prevent spam, NagarSathi runs a client-side heuristic validation check on images. If your photo fails (e.g. does not contain features matching the selected category), you will receive a soft warning. You can override and submit anyway, but authentic photos guarantee faster dispatch.',
    category: 'technical'
  }
];

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'location' | 'verification' | 'technical'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Form states
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  const [techType, setTechType] = useState('UI Glitch');
  const [techDesc, setTechDesc] = useState('');
  const [isSubmittingTech, setIsSubmittingTech] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMsg) {
      showToast('All contact fields are required', 'warning');
      return;
    }
    setIsSubmittingSupport(true);
    setTimeout(() => {
      showToast('Support ticket logged successfully! We will contact you soon.', 'success');
      setSupportName('');
      setSupportEmail('');
      setSupportMsg('');
      setIsSubmittingSupport(false);
    }, 800);
  };

  const handleTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techDesc) {
      showToast('Please provide a description of the issue', 'warning');
      return;
    }
    setIsSubmittingTech(true);
    setTimeout(() => {
      showToast('Technical problem reported. Thank you for helping us improve!', 'success');
      setTechDesc('');
      setIsSubmittingTech(false);
    }, 800);
  };

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-2 relative">
      {/* Decorative leaf element */}
      <div className="absolute -top-12 -right-12 w-48 h-48 opacity-5 pointer-events-none text-[#053229] select-none hidden md:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C60 25, 80 35, 100 50 C75 60, 65 80, 50 100 C40 75, 20 65, 0 50 C25 40, 35 20, 50 0 Z" />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-black text-[#10201C] dark:text-[#f2f7f5]">Help &amp; Support</h1>
        <p className="text-sm text-[#536761] dark:text-[#a3c4b9]">Find answers to common questions or get directly in touch with our support team.</p>
      </div>

      {/* Quick guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-sm">How to report</h3>
          <p className="text-xs text-[#536761] dark:text-[#a3c4b9] leading-relaxed font-semibold">
            Click "Report Issue" in the sidebar, fill in category details, snap/upload evidence, pin your location, and submit!
          </p>
        </div>

        <div className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-sm">How to track</h3>
          <p className="text-xs text-[#536761] dark:text-[#a3c4b9] leading-relaxed font-semibold">
            Visit "My Reports" to check active complaints, unique tracking IDs, assigned engineers, and progress timestamps.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-sm">How to verify</h3>
          <p className="text-xs text-[#536761] dark:text-[#a3c4b9] leading-relaxed font-semibold">
            Once resolved, review completion photos. Click "Confirm Fixed" to verify or "Reopen" if the problem persists.
          </p>
        </div>
      </div>

      {/* FAQS section */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
            <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Frequently Asked Questions</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73827D]" />
            <input 
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setOpenIndex(null); }}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs focus:outline-none focus:border-[#053229]"
            />
          </div>
        </div>

        {/* Category Filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'general', 'location', 'verification', 'technical'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                activeCategory === cat 
                  ? 'bg-[#053229] text-white shadow-xs' 
                  : 'bg-slate-50 dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border border-[#D6E2DE] dark:border-[#1e332f] rounded-xl bg-slate-50/50 dark:bg-[#152420]/30 overflow-hidden">
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-4 py-3.5 text-left font-bold text-sm text-[#10201C] dark:text-[#f2f7f5] flex items-center justify-between hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#73827D]" /> : <ChevronDown className="w-4 h-4 text-[#73827D]" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#536761] dark:text-[#a3c4b9] leading-relaxed font-semibold">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs font-bold text-[#73827D]">
              No FAQs matched your filters.
            </div>
          )}
        </div>
      </section>

      {/* Support & Tech Ticket Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSupportSubmit} className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D6E2DE] dark:border-[#1e332f]">
            <Mail className="w-4.5 h-4.5 text-[#053229] dark:text-[#0ca688]" />
            <h3 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-sm">Contact Civic Support</h3>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-[#536761] dark:text-[#a3c4b9] uppercase tracking-wider">Your Name</label>
            <input 
              type="text" 
              required
              value={supportName}
              onChange={e => setSupportName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs focus:outline-none focus:border-[#053229]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-[#536761] dark:text-[#a3c4b9] uppercase tracking-wider">Email address</label>
            <input 
              type="email" 
              required
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs focus:outline-none focus:border-[#053229]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-[#536761] dark:text-[#a3c4b9] uppercase tracking-wider">Message</label>
            <textarea 
              rows={3}
              required
              value={supportMsg}
              placeholder="What do you need help with?"
              onChange={e => setSupportMsg(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs focus:outline-none focus:border-[#053229]"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmittingSupport}
            className="w-full py-2 bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-bold rounded-xl transition-all"
          >
            {isSubmittingSupport ? 'Sending...' : 'Send Support Ticket'}
          </button>
        </form>

        <form onSubmit={handleTechSubmit} className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D6E2DE] dark:border-[#1e332f]">
            <Bug className="w-4.5 h-4.5 text-rose-500" />
            <h3 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-sm">Report a Technical Bug</h3>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-[#536761] dark:text-[#a3c4b9] uppercase tracking-wider">Bug Category</label>
            <select 
              value={techType}
              onChange={e => setTechType(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs focus:outline-none focus:border-[#053229]"
            >
              <option>UI Glitch / Layout Alignments</option>
              <option>Map Picker / Marker Failure</option>
              <option>Language Selector Error</option>
              <option>Login / Account Glitch</option>
              <option>General Platform Failure</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-[#536761] dark:text-[#a3c4b9] uppercase tracking-wider">Bug Details &amp; Steps</label>
            <textarea 
              rows={5}
              required
              value={techDesc}
              placeholder="Describe what went wrong, and how to reproduce it..."
              onChange={e => setTechDesc(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-xs focus:outline-none focus:border-[#053229]"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmittingTech}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            {isSubmittingTech ? 'Reporting...' : 'Submit Technical Bug'}
          </button>
        </form>
      </div>
    </div>
  );
};
