import React, { useState } from 'react';
import logo from '../assets/image.png';
import { UserCheck, LogIn, LogOut, ChevronDown } from 'lucide-react';

const Navbar = ({ user, onOpenAuth, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 w-full h-16 px-6 flex items-center justify-between z-20">
      {/* LOGO AND BRANDING */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl object-cover" />
        <h2 className="text-white font-bold text-lg tracking-wide">BhuDrishti3D</h2>
      </div>

      {/* AUTHENTICATION CONTROL */}
      <div className="relative">
        {user ? (
          <div>
            {/* USER PROFILE BADGE (CLICKABLE) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{user.name}</span>
              <span className="bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded text-[10px] uppercase">
                {user.role}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-30">
                <div className="px-4 py-2 border-b border-slate-700/60">
                  <p className="text-xs font-bold text-slate-200">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-slate-700/60 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-md"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;