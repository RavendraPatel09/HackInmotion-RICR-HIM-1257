import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-slate-500 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200">
        
        {/* Brand Block */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="NagarSathi Logo"
              className="w-10 h-10 object-contain rounded-full shadow-sm"
            />
            <div>
              <span className="font-black text-slate-900 text-lg">NagarSathi</span>
              <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Report it. Track it. Fix it.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            NagarSathi is a civic-tech platform built to turn city problems into visible action. Connecting citizens with municipal services for a cleaner, safer city.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Bhopal Municipal Zone, MP</span>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/citizen/report" className="hover:text-indigo-600 transition-colors">Report an Issue</Link>
              </li>
              <li>
                <Link to="/citizen/issues" className="hover:text-indigo-600 transition-colors">Track Issues</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-indigo-600 transition-colors">City Map</Link>
              </li>
              <li>
                <Link to="/transparency" className="hover:text-indigo-600 transition-colors">Transparency Score</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: About */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wider">About</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">Why NagarSathi</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">Our Mission</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/profile" className="hover:text-indigo-600 transition-colors">Help &amp; FAQs</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 transition-colors">Give Feedback</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 transition-colors">Report App Bug</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <span className="text-slate-400 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Terms of Use</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Local Storage Data</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
        <p className="text-slate-500">
          &copy; {new Date().getFullYear()} NagarSathi Initiative. All rights reserved.
        </p>
        <p className="flex items-center gap-1 text-slate-500">
          <span>Made with civic pride for smart Indian communities</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </p>
      </div>
    </footer>
  );
};
