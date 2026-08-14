import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';

// Reusable animated ambient background component
export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Saffron Glow */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#FF9933]/[0.025] dark:bg-[#FFA64D]/[0.015] blur-3xl animate-ambient-1" 
      />
      {/* Green Glow */}
      <div 
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#138808]/[0.025] dark:bg-[#19A30F]/[0.015] blur-3xl animate-ambient-2" 
      />
      
      {/* Subtle center light */}
      <div 
        className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-[#053229]/[0.01] dark:bg-[#0ca688]/[0.005] blur-3xl animate-ambient-1" 
      />

      {/* Floating particles/waves */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]">
        <svg className="absolute top-[20%] left-[-10%] w-[120%] h-24 text-[#053229] dark:text-[#0ca688] animate-float-1" viewBox="0 0 1200 120" fill="none">
          <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1250,60 1300,60" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-[30%] left-[-10%] w-[120%] h-24 text-[#053229] dark:text-[#0ca688] animate-float-2" viewBox="0 0 1200 120" fill="none">
          <path d="M0,40 C200,80 400,20 600,60 C800,100 1000,40 1200,80" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>
    </div>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isPublicPage = (location.pathname === '/' && !isAuthenticated) || location.pathname === '/login';

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarHidden(true);
      } else {
        setIsSidebarHidden(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarHidden(!isSidebarHidden);
      setIsSidebarExpanded(true);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  if (isPublicPage || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F8F7] dark:bg-[#090e0c] text-[#10201C] dark:text-[#f2f7f5] flex flex-col font-sans selection:bg-[#053229] selection:text-white transition-colors relative overflow-x-hidden">
        <AnimatedBackground />
        <Navbar />
        <main className="flex-1 pb-20 md:pb-8 z-10">{children}</main>
        <Footer />
        <MobileBottomNav />
        <ToastContainer />
      </div>
    );
  }

  const sidebarWidth = isSidebarHidden ? '0px' : (isSidebarExpanded ? '256px' : '72px');

  return (
    <div 
      className="bg-[#F5F8F7] dark:bg-[#090e0c] text-[#10201C] dark:text-[#f2f7f5] font-sans selection:bg-[#053229] selection:text-white transition-colors relative overflow-x-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth} minmax(0, 1fr)`,
        gridTemplateRows: '68px minmax(0, 1fr)',
        minHeight: '100vh',
        transition: 'grid-template-columns 300ms ease-in-out'
      }}
    >
      <AnimatedBackground />

      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }} className={`${isSidebarHidden ? 'hidden md:block' : ''} z-20`}>
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          isHidden={isSidebarHidden} 
          onToggle={toggleSidebar} 
          onHide={() => setIsSidebarHidden(true)} 
        />
      </div>
      
      <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }} className="z-20">
        <Header onToggleSidebar={toggleSidebar} />
      </div>
      
      <main style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }} className="pb-20 md:pb-8 overflow-y-auto relative z-10">
        <div className="w-[min(100%-48px,1400px)] mx-auto pt-6 pb-6 relative">
          
          {/* Top-Left Corner Leaf (Floating, Organic) */}
          <div className="absolute -top-4 -left-12 w-28 h-28 text-[#138808] opacity-[0.04] dark:opacity-[0.03] pointer-events-none hidden lg:block animate-float-1">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 20 C40 10, 60 20, 80 40 C60 50, 40 40, 20 20 Z" />
              <path d="M30 40 C45 35, 55 45, 70 60 C55 65, 45 55, 30 40 Z" opacity="0.7"/>
              <path d="M10 20 L80 80" stroke="currentColor" strokeWidth="0.8" fill="none" />
            </svg>
          </div>

          {/* Top-Right Corner Curved Peacock Feather */}
          <div className="absolute -top-4 -right-12 w-32 h-32 text-[#053229] dark:text-[#0ca688] opacity-[0.035] pointer-events-none hidden lg:block animate-float-2">
            <svg viewBox="0 0 120 120" fill="currentColor">
              <path d="M120 0 C90 20, 80 40, 60 80 C70 60, 90 40, 120 0 Z" />
              <circle cx="60" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="60" cy="80" r="4" />
              <path d="M100 20 C80 40, 70 60, 65 72" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </svg>
          </div>

          {/* Bottom-Left Corner Leaf (Botanical) */}
          <div className="absolute bottom-4 -left-16 w-32 h-32 text-[#138808] opacity-[0.03] pointer-events-none hidden xl:block animate-float-2">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 100 C30 80, 50 60, 70 30 C55 50, 35 70, 0 100 Z" />
              <path d="M10 90 Q40 60 70 40" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <circle cx="70" cy="30" r="3" />
            </svg>
          </div>

          {/* Bottom-Right Corner Tricolor Flowing Light */}
          <div className="absolute bottom-4 -right-16 w-32 h-32 text-[#FF9933] opacity-[0.03] pointer-events-none hidden xl:block animate-float-1">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M100 100 C60 80, 40 50, 20 20" stroke="#FF9933" />
              <path d="M90 100 C55 75, 45 45, 30 15" stroke="#FFFFFF" opacity="0.8" />
              <path d="M80 100 C50 70, 50 40, 40 10" stroke="#138808" />
            </svg>
          </div>

          <div className="animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
