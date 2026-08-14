import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#E6F1EE] dark:bg-[#142e2a] border border-[#BFD5CE] dark:border-[#1e332f] flex items-center justify-center mx-auto text-[#053229] dark:text-[#0ca688]">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#10201C] dark:text-[#f2f7f5]">404</h1>
          <h2 className="text-lg font-bold text-[#10201C] dark:text-[#f2f7f5]">Page Not Found</h2>
          <p className="text-sm text-[#536761] dark:text-[#a3c4b9]">
            The municipal portal route you requested does not exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-sm font-bold shadow-lg shadow-[#053229]/20 flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
