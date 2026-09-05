import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import MapViewport from './map/MapViewport';
import { supabase } from './components/supabaseClient';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 relative">
        <MapViewport user={user} />
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