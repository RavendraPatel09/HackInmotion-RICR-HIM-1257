import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Public Header & Navigation */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-brand-navy">Smart Bhopal</div>
          <nav className="hidden md:flex gap-4 ml-8">
            <Link to="/" className="font-semibold text-brand-green">Home</Link>
            <Link to="/" className="font-semibold text-outline hover:text-on-surface transition-colors">About</Link>
            <Link to="/" className="font-semibold text-outline hover:text-on-surface transition-colors">Services</Link>
          </nav>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/login" className="px-4 py-2 font-semibold text-brand-navy border border-brand-navy rounded-lg hover:bg-slate-50 transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 font-semibold text-white bg-brand-green rounded-lg hover:bg-emerald-700 transition-colors shadow-elevation-1">Sign Up</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-surface-base">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-surface-base border-t border-outline-variant py-12 px-4 md:px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-xl font-semibold text-brand-navy mb-2">Smart Bhopal Civic Connect</div>
            <p className="text-sm text-outline">Empowering citizens for a better city.</p>
          </div>
          <div className="flex gap-4 text-sm text-outline">
            <Link to="/" className="hover:text-on-surface">Privacy Policy</Link>
            <Link to="/" className="hover:text-on-surface">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
