import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { ReportCrisis } from './pages/ReportCrisis';
import { TrackCrisis } from './pages/TrackCrisis';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { ResponderDashboard } from './pages/ResponderDashboard';

// Guard for root route: authenticated staff are automatically routed to their dashboard
const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#18392b]/20 border-t-[#18392b] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Checking campus portal session...</p>
      </div>
    );
  }
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/responder'} replace />;
  }
  return <Home />;
};

// Guard for login route: already authenticated staff are forwarded directly to their dashboard
const LoginRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#18392b]/20 border-t-[#18392b] rounded-full animate-spin"></div>
      </div>
    );
  }
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/responder'} replace />;
  }
  return <Login />;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] selection:bg-[#18392b] selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Landing & Public Pages */}
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/report" element={<ReportCrisis />} />
              <Route path="/track" element={<TrackCrisis />} />
              <Route path="/contacts" element={<EmergencyContacts />} />

              {/* Protected Staff / Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Responder Routes */}
              <Route
                path="/responder"
                element={
                  <ProtectedRoute allowedRoles={['RESPONDER']}>
                    <ResponderDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
