import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState('citizen'); // 'citizen' or 'surveyor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: formData.name || (role === 'surveyor' ? 'Land Surveyor' : 'Citizen User'),
      email: formData.email,
      role,
      licenseNumber: formData.licenseNumber,
    };
    
    login(userData);

    if (onAuthSuccess) {
      onAuthSuccess(role);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access BhuDrishti 3D Cadastral & Property Mapping Portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                role === 'citizen'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏛️ Citizen / Owner
            </button>
            <button
              type="button"
              onClick={() => setRole('surveyor')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                role === 'surveyor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📐 Land Surveyor
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Conditional field for Land Surveyor */}
          {isSignUp && role === 'surveyor' && (
            <div>
              <label className="block text-xs font-semibold text-indigo-400 mb-1">
                Surveyor License / Registration ID
              </label>
              <input
                type="text"
                name="licenseNumber"
                required
                placeholder="SURV-2026-8891"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-indigo-500/30 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md mt-2"
          >
            {isSignUp
              ? `Sign Up as ${role === 'surveyor' ? 'Land Surveyor' : 'Citizen'}`
              : `Sign In as ${role === 'surveyor' ? 'Land Surveyor' : 'Citizen'}`}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-400 font-semibold hover:underline ml-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;