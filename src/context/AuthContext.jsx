import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(
      userData || {
        name: 'Sheela Mahato',
        email: 'user@example.com',
        role: 'citizen',
      }
    );
    setIsSignedIn(true);
  };

  const logout = () => {
    setIsSignedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;