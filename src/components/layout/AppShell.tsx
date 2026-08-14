import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';

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
      <div className="min-h-screen bg-[#F5F8F7] text-[#10201C] flex flex-col font-sans selection:bg-[#053229] selection:text-white transition-colors">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
        <Footer />
        <MobileBottomNav />
        <ToastContainer />
      </div>
    );
  }

  const sidebarWidth = isSidebarHidden ? '0px' : (isSidebarExpanded ? '256px' : '72px');

  return (
    <div 
      className="bg-[#F5F8F7] text-[#10201C] font-sans selection:bg-[#053229] selection:text-white"
      style={{
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth} minmax(0, 1fr)`,
        gridTemplateRows: '68px minmax(0, 1fr)',
        minHeight: '100vh',
        transition: 'grid-template-columns 300ms ease-in-out'
      }}
    >
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }} className={isSidebarHidden ? 'hidden md:block' : ''}>
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          isHidden={isSidebarHidden} 
          onToggle={toggleSidebar} 
          onHide={() => setIsSidebarHidden(true)} 
        />
      </div>
      
      <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
        <Header onToggleSidebar={toggleSidebar} />
      </div>
      
      <main style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }} className="pb-20 md:pb-8 overflow-y-auto relative">
        <div className="w-[min(100%-48px,1400px)] mx-auto pt-6 pb-6 relative">
          {/* Top-Left Corner Leaf */}
          <svg className="absolute -top-4 -left-12 w-32 h-32 text-[#053229] opacity-[0.03] pointer-events-none hidden lg:block" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 C30 20, 40 50, 50 100 C40 80, 20 60, 0 0 Z" />
            <path d="M10 20 C40 35, 50 60, 55 90" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>

          {/* Top-Right Corner Leaf */}
          <svg className="absolute -top-4 -right-12 w-32 h-32 text-[#053229] opacity-[0.03] pointer-events-none hidden lg:block" viewBox="0 0 100 100" fill="currentColor">
            <path d="M100 0 C70 30, 60 60, 50 100 C60 80, 80 60, 100 0 Z" />
            <path d="M90 10 C65 35, 55 65, 50 90" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>

          {/* Bottom-Left Corner Peacock Feather */}
          <svg className="absolute bottom-4 -left-16 w-36 h-36 text-[#053229] opacity-[0.025] pointer-events-none hidden xl:block" viewBox="0 0 120 120" fill="currentColor">
            <path d="M0 120 C40 100, 60 70, 80 30 C70 50, 50 70, 0 120 Z" />
            <circle cx="80" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="80" cy="30" r="5" />
            <path d="M15 105 C45 90, 65 70, 75 42" stroke="currentColor" strokeWidth="0.8" fill="none" />
          </svg>

          {/* Bottom-Right Corner Peacock Feather */}
          <svg className="absolute bottom-4 -right-16 w-36 h-36 text-[#053229] opacity-[0.025] pointer-events-none hidden xl:block" viewBox="0 0 120 120" fill="currentColor">
            <path d="M120 120 C80 100, 60 70, 40 30 C50 50, 70 70, 120 120 Z" />
            <circle cx="40" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="40" cy="30" r="5" />
            <path d="M105 105 C75 90, 55 70, 45 42" stroke="currentColor" strokeWidth="0.8" fill="none" />
          </svg>

          {children}
        </div>
      </main>

      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
