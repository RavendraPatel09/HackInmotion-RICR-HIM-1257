import React from 'react';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
