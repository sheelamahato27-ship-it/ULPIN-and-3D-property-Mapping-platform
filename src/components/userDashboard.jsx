import React, { useState } from "react";
import { Link } from "react-router-dom";
import BuildingViewport from "./buildingViewPort";

function UserDashboard() {
  const [showSubterranean, setShowSubterranean] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for ULPIN / Location:", searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Navbar Header */}
      <nav className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/95 backdrop-blur px-6 lg:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-extrabold text-sm tracking-wide shadow-sm">
            ULPIN
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Property Mapping Platform
          </span>
        </div>
        </nav>
        

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Search Section */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Search ULPIN & Cadastral Maps
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xl mx-auto">
            Enter a 14-digit ULPIN code or property coordinates to view 3D vertical ownership boundaries.
          </p>
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter ULPIN (e.g., 14-2026-9081) or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              Search Map
            </button>
          </form>
        </section>

        {/* 3D Map Viewport Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Interactive 3D Cadastral View
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore vertical property boundaries, floor plans, and subterranean infrastructure.
              </p>
            </div>

            {/* Subterranean Structure Toggle Button */}
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-700">Subterranean View</span>
              <button
                type="button"
                onClick={() => setShowSubterranean(!showSubterranean)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                  showSubterranean ? "bg-blue-600" : "bg-slate-300"
                }`}
                aria-pressed={showSubterranean}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    showSubterranean ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-600 w-16">
                {showSubterranean ? "ENABLED" : "DISABLED"}
              </span>
            </div>
          </div>

          {/* 3D Canvas Viewport Container */}
          <div className="w-full h-130 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 relative">
            <BuildingViewport showSubterranean={showSubterranean} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-10 pb-6 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-8 mb-8">
          <div className="text-sm space-y-1.5">
            <h3 className="text-sky-400 font-bold text-xs uppercase tracking-wider mb-3">
              Contact Us
            </h3>
            <p className="text-slate-300">
              <strong className="text-slate-100">Support:</strong> +91 1800-XXX-XXXX
            </p>
            <p className="text-slate-300">
              <strong className="text-slate-100">Email:</strong> support@ulpinmapping.gov.in
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <h4 className="text-slate-200 font-semibold text-sm mb-1">Quick Links</h4>
            <Link to="/privacy" className="text-slate-400 hover:text-sky-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-sky-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/help" className="text-slate-400 hover:text-sky-400 transition-colors">
              Help & Documentation
            </Link>
          </div>
        </div>

        <p className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ULPIN 3D Property Mapping Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default UserDashboard;