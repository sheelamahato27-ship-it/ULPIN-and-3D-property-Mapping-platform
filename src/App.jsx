import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import BuildingViewport from './components/buildingViewPort';
import { supabase } from './components/supabaseClient';
import Dashboard from './components/dashboard';
import SurveyorDashboard from './components/sur.dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const extractUserData = (session) => {
    if (!session?.user) return null;
    const meta = session.user.user_metadata;
    return {
      id: session.user.id,
      email: session.user.email,
      name: meta?.full_name || session.user.email.split('@')[0],
      role: meta?.role || 'Citizen',
    };
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(extractUserData(session));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(extractUserData(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 flex flex-col overflow-auto">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full min-h-screen relative bg-slate-100/60">
        <SurveyorDashboard/>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />
    </div>
  );
};

export default App;