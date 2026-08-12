import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IssuesProvider } from './context/IssuesContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { CitizenHome } from './pages/CitizenHome';
import { ReportIssue } from './pages/ReportIssue';
import { MyIssues } from './pages/MyIssues';
import { CityMapPage } from './pages/CityMapPage';
import { TransparencyScore } from './pages/TransparencyScore';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminQueue } from './pages/AdminQueue';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <NotificationsProvider>
              <IssuesProvider>
                <AppShell>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/transparency" element={<TransparencyScore />} />
                    <Route path="/map" element={<CityMapPage />} />
                    
                    {/* Shared Protected Profile Route */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Citizen Routes */}
                    <Route
                      path="/citizen"
                      element={
                        <ProtectedRoute allowedRole="citizen">
                          <CitizenHome />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/citizen/report"
                      element={
                        <ProtectedRoute allowedRole="citizen">
                          <ReportIssue />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/citizen/issues"
                      element={
                        <ProtectedRoute allowedRole="citizen">
                          <MyIssues />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/queue"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <AdminQueue />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <AdminAnalytics />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppShell>
              </IssuesProvider>
            </NotificationsProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
