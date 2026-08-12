import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CitizenLayout from './layouts/CitizenLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AuthPages from './pages/public/AuthPages';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenReport from './pages/citizen/CitizenReport';
import CitizenIssues from './pages/citizen/CitizenIssues';
import CitizenIssueDetail from './pages/citizen/CitizenIssueDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIssues from './pages/admin/AdminIssues';
import AdminIssueDetail from './pages/admin/AdminIssueDetail';

// Placeholder for unmigrated routes to prevent crashing
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-outline font-medium">
    {title} - Coming Soon
  </div>
);

function App() {
  const initializeMockData = useStore(state => state.initializeMockData);

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPages type="login" />} />
          <Route path="/register" element={<AuthPages type="register" />} />
        </Route>

        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="report" element={<CitizenReport />} />
          <Route path="issues" element={<CitizenIssues />} />
          <Route path="issues/:id" element={<CitizenIssueDetail />} />
          
          <Route path="map" element={<Placeholder title="Citizen Map" />} />
          <Route path="notifications" element={<Placeholder title="Notifications" />} />
          <Route path="profile" element={<Placeholder title="Profile" />} />
          <Route path="impact" element={<Placeholder title="Civic Impact" />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="issues" element={<AdminIssues />} />
          <Route path="issues/:id" element={<AdminIssueDetail />} />
          
          <Route path="map" element={<Placeholder title="Command Map" />} />
          <Route path="analytics" element={<Placeholder title="Analytics" />} />
          <Route path="hotspots" element={<Placeholder title="Hotspots" />} />
          <Route path="sla" element={<Placeholder title="SLA Tracking" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
          <Route path="profile" element={<Placeholder title="Admin Profile" />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
