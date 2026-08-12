import { Link } from 'react-router-dom';
import { Droplet, Lightbulb, MapPin, Check, AlertTriangle, FileText, TreePine } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <style>{`
        .landing-hero {
          background: linear-gradient(135deg, var(--color-brand-navy) 0%, color-mix(in srgb, var(--color-brand-navy) 80%, var(--color-brand-green)) 100%);
          border-radius: 0 0 32px 32px;
        }
        .map-preview-container {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      {/* 1. Hero */}
      <section className="landing-hero text-white text-center py-20 px-5 -mt-[1px]">
        <div className="max-w-[800px] mx-auto">
          <h1 className="display-lg text-white mb-4">SMART BHOPAL</h1>
          <h2 className="headline-md text-white mb-3">Make Bhopal Better, One Issue at a Time.</h2>
          <p className="body-lg text-white/80 max-w-[600px] mx-auto mb-8">
            Report civic problems, track their resolution, and help build a cleaner, safer and smarter Bhopal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link to="/citizen/report" className="px-8 py-3 bg-brand-green text-white font-semibold rounded-lg text-lg hover:bg-emerald-700 transition shadow-elevation-1">
              Report an Issue
            </Link>
            <Link to="/citizen" className="px-8 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-lg text-lg hover:bg-white/10 transition">
              Explore City Issues
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 pt-12 space-y-24">
        {/* 2. Civic Map Preview */}
        <section>
          <div className="flex justify-between items-end mb-6 page-enter">
            <div>
              <h2 className="headline-lg mb-3">Live City Map</h2>
              <p className="body-lg text-outline">See what's happening around Bhopal in real-time.</p>
            </div>
            <span className="hidden md:flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              142 Active Issues
            </span>
          </div>
          <div className="map-preview-container bg-slate-200 rounded-2xl h-[400px] relative overflow-hidden shadow-inner border-2 border-white">
            {/* Simulated Map Pins */}
            <div className="absolute w-4 h-4 rounded-full bg-error ring-4 ring-error/20 top-[30%] left-[40%] animate-pulse"></div>
            <div className="absolute w-4 h-4 rounded-full bg-warning ring-4 ring-warning/20 top-[55%] left-[70%]"></div>
            <div className="absolute w-4 h-4 rounded-full bg-error ring-4 ring-error/20 top-[20%] left-[80%] animate-pulse"></div>
            <div className="absolute w-4 h-4 rounded-full bg-success ring-4 ring-success/20 top-[70%] left-[25%]"></div>
            
            {/* Simulated Issue Card Overlay */}
            <div className="absolute bottom-5 left-5 w-[300px] bg-white rounded-xl p-4 flex gap-4 shadow-elevation-3 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Droplet size={20} />
              </div>
              <div className="flex-grow">
                <div className="font-semibold text-on-surface">Water Leakage</div>
                <div className="text-xs text-outline flex justify-between items-center mt-1">
                  <span>Arera Colony</span>
                  <span className="bg-warning/20 text-warning px-2 py-0.5 rounded text-[10px] font-bold">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section>
          <h2 className="headline-lg text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-surface-base rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-brand-navy font-bold">1</div>
              <h3 className="title-lg mb-3">Report</h3>
              <p className="body-md text-outline">Snap a photo, add location details, and submit a civic complaint in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-surface-base rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-brand-navy font-bold">2</div>
              <h3 className="title-lg mb-3">Track</h3>
              <p className="body-md text-outline">Get real-time updates as authorities assign and work on your reported issue.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green/15 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-brand-green font-bold">3</div>
              <h3 className="title-lg mb-3">Resolve</h3>
              <p className="body-md text-outline">The issue is fixed by the municipal corporation, making Bhopal better for everyone.</p>
            </div>
          </div>
        </section>

        {/* 4. Issue Categories */}
        <section>
          <h2 className="headline-lg mb-8 page-enter">What can you report?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: MapPin, label: "Infrastructure" },
              { icon: FileText, label: "Sanitation" },
              { icon: Droplet, label: "Water Supply" },
              { icon: Lightbulb, label: "Electricity" },
              { icon: TreePine, label: "Public Parks" }
            ].map((cat, i) => (
              <div key={i} className="text-center p-6 border border-outline-variant rounded-xl bg-surface-container-lowest hover:border-brand-green hover:-translate-y-1 hover:shadow-elevation-1 transition-all duration-200">
                <cat.icon className="mx-auto mb-3 text-brand-navy" size={32} />
                <div className="label-md font-semibold text-on-surface">{cat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. City Activity & 6. Transparency */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="headline-lg mb-8 page-enter">Live City Activity</h2>
              <div className="flex flex-col gap-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl flex gap-4 items-center border border-outline-variant">
                  <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0"><Check size={24} /></div>
                  <div className="flex-grow">
                    <div className="font-semibold text-on-surface">Streetlight Fixed</div>
                    <div className="text-sm text-outline flex gap-2"><MapPin size={16}/> MP Nagar Zone 1 &bull; 2 mins ago</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl flex gap-4 items-center border border-outline-variant">
                  <div className="w-12 h-12 rounded-full bg-warning/15 text-warning flex items-center justify-center shrink-0"><AlertTriangle size={24} /></div>
                  <div className="flex-grow">
                    <div className="font-semibold text-on-surface">Pothole Repair Started</div>
                    <div className="text-sm text-outline flex gap-2"><MapPin size={16}/> Hoshangabad Road &bull; 15 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="headline-lg mb-8 page-enter">Transparency</h2>
              <div className="flex flex-col gap-4">
                <div className="text-center p-8 bg-surface-container-lowest rounded-xl shadow-elevation-1 border border-outline-variant">
                  <div className="text-5xl font-bold text-brand-green mb-3">1,204</div>
                  <div className="label-md text-outline">Issues Resolved This Month</div>
                </div>
                <div className="text-center p-8 bg-surface-container-lowest rounded-xl shadow-elevation-1 border border-outline-variant">
                  <div className="text-5xl font-bold text-brand-navy mb-3">48h</div>
                  <div className="label-md text-outline">Average Resolution Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <section className="bg-surface-base py-16 px-5 text-center rounded-[32px] my-12 border border-outline-variant">
          <h2 className="display-lg mb-4 text-brand-navy">Ready to make a difference?</h2>
          <p className="body-lg text-outline mb-8 page-enter">Join thousands of citizens improving Bhopal daily.</p>
          <Link to="/citizen/report" className="inline-block px-8 py-3 bg-brand-green text-white font-semibold rounded-lg text-lg hover:bg-emerald-700 transition shadow-elevation-1">
            Start Reporting
          </Link>
        </section>
      </div>
    </>
  );
}
