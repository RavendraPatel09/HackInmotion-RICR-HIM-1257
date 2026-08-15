import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const LocationSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ city: 'Bhopal', state: 'Madhya Pradesh' });

  const locations = [
    { city: 'Bhopal', state: 'Madhya Pradesh' },
    { city: 'Indore', state: 'Madhya Pradesh' },
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Delhi', state: 'Delhi' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <MapPin className="w-4 h-4 text-cf-primary-500" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-slate-900 leading-none">{selectedLocation.city}</p>
          <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{selectedLocation.state}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2 bg-slate-50 border-b border-slate-100">
              <input
                type="text"
                placeholder="Search city..."
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-cf-primary-400 focus:ring-1 focus:ring-cf-primary-400"
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    selectedLocation.city === loc.city
                      ? 'bg-cf-primary-50 text-cf-primary-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${selectedLocation.city === loc.city ? 'text-cf-primary-500' : 'text-slate-400'}`} />
                  <div>
                    <span className="block">{loc.city}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">{loc.state}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
