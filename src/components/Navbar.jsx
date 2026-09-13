import React, { useState } from 'react';
import logo from '../assets/ulpin.png';
import { UserCheck, LogIn, LogOut, ChevronDown } from 'lucide-react';

const Navbar = ({ user, onOpenAuth, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 w-full h-16 px-6 flex items-center justify-between z-30 shadow-xs">
      {/* LOGO & BRANDING */}
      <div className="flex items-center gap-3">
        <div className="p-1 bg-indigo-50 rounded-xl border border-indigo-100 shadow-xs">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-slate-900 font-extrabold text-lg tracking-tight">BhuDrishti</h2>
          <span className="text-[10px] font-mono font-bold uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-200/60">
            3D ULPIN
          </span>
        </div>
      </div>

      {/* USER AUTHENTICATION */}
      <div className="relative">
        {user ? (
          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 transition-all shadow-xs"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{user.name}</span>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
                {user.role}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-indigo-500/20 active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;