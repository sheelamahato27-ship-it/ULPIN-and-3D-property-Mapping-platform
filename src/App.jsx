import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BuildingViewport from './components/buildingViewPort';
import UserDashboard from './components/userDashboard';
import SurveyorDashboard from './components/surveyorDashboard';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (role) => {
    setIsAuthOpen(false);
    
    // Redirect based on role
    if (role === 'surveyor') {
      navigate('/surveyor');
    } else {
      navigate('/');
    }
  };

  const currentRole = user?.role || null;

  return (
    <>
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} userRole={currentRole} />

      <Routes>
        {/* Main Citizen / User Dashboard Route */}
        <Route path="/" element={<UserDashboard />} />

        {/* Land Surveyor Dashboard Route */}
        <Route path="/surveyor" element={<SurveyorDashboard />} />

        {/* Detailed Floor Inspection Viewport Route */}
        <Route
          path="/map"
          element={
            <div className="h-screen w-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
              {/* Sub-Header / Control Bar */}
              <div className="flex items-center justify-between px-6 py-2 bg-slate-950 border-b border-slate-800 text-xs font-semibold z-10">
                <span className="font-bold tracking-wide px-3 py-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg">
                  Detailed Floor Inspector
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    to={currentRole === 'surveyor' ? '/surveyor' : '/'}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    ← Back to {currentRole === 'surveyor' ? 'Surveyor Dashboard' : 'Dashboard'}
                  </Link>
                </div>
              </div>

              {/* Main Viewport */}
              <main className="flex-1 w-full relative overflow-hidden">
                <BuildingViewport selectedParcel={selectedParcel} />
              </main>
            </div>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<UserDashboard />} />
      </Routes>

      {/* Auth Modal wrapped inside AuthProvider context */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}