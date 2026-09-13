import React, { useState } from 'react';
import { Layers, Edit3, ShieldAlert, PlusCircle, Save } from 'lucide-react';

export default function MapViewport({ user }) {
  // Role Permission Checks
  const canEditParcels = user?.role === 'Admin' || user?.role === 'Surveyor';
  const isAdmin = user?.role === 'Admin';

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [extrusionHeight, setExtrusionHeight] = useState(15); // Default 3D height in meters

  // Sample Cadastral Parcels (ULPIN-indexed)
  const sampleParcels = [
    { ulpin: 'ULPIN-JH-832101-001', area: '450 sq.m', currentOwner: 'Ramesh Sharma', height: 12, layer: 'Surface' },
    { ulpin: 'ULPIN-JH-832101-002', area: '1200 sq.m', currentOwner: 'State Mining Corp', height: -25, layer: 'Subsurface' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex overflow-hidden">
      
      {/* 3D CANVAS PLACEHOLDER VIEWPORT */}
      <div className="flex-1 relative bg-linear-to-b from-slate-900 to-slate-950 flex items-center justify-center border-r border-slate-800">
        
        {/* HUD Overlay Banner */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3 z-10">
          <Layers className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="text-xs font-bold text-slate-100">3D View</p>
            <p className="text-[10px] text-slate-400">• Vertical Layer Active</p>
          </div>
        </div>

        {/* PARCEL SELECTION TILES (Simulating 3D Objects) */}
        <div className="grid grid-cols-2 gap-6 z-10 p-4">
          {sampleParcels.map((parcel) => (
            <button
              key={parcel.ulpin}
              onClick={() => {
                setSelectedParcel(parcel);
                setExtrusionHeight(parcel.height);
              }}
              className={`p-6 rounded-2xl border text-left transition-all ${
                selectedParcel?.ulpin === parcel.ulpin
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded">
                  {parcel.layer}
                </span>
                <span className="text-xs font-mono text-slate-400">{parcel.area}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{parcel.ulpin}</h3>
              <p className="text-xs text-slate-400 mt-1">Owner: {parcel.currentOwner}</p>
            </button>
          ))}
        </div>
      </div>

      {/* INSPECTOR & PERMISSION-BASED EDITING SIDEBAR */}
      <aside className="w-80 bg-slate-900 p-6 flex flex-col justify-between border-l border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-400" /> Parcel Inspector
          </h2>

          {selectedParcel ? (
            <div className="flex flex-col gap-4 text-xs">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">ULPIN ID</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedParcel.ulpin}</span>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">Current Owner</span>
                <span className="text-slate-200 font-semibold">{selectedParcel.currentOwner}</span>
              </div>

              {/* ROLE-BASED CONDITIONAL EDITING SECTION */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <label className="block font-semibold text-slate-300 mb-2">
                  3D Extrusion Height ({extrusionHeight}m)
                </label>
                
                <input
                  type="range"
                  min="-50"
                  max="100"
                  disabled={!canEditParcels}
                  value={extrusionHeight}
                  onChange={(e) => setExtrusionHeight(e.target.value)}
                  className="w-full accent-indigo-500 bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                />

                {!canEditParcels && (
                  <div className="mt-3 p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-start gap-2 text-amber-300 text-[11px]">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Viewing mode only. Log in as a Surveyor or Admin to adjust 3D parcel volumes.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Select a parcel from the viewport to inspect metadata.</p>
          )}
        </div>

        {/* BOTTOM ACTION BUTTONS (RESTRICTED BY ROLE) */}
        {selectedParcel && (
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
            {canEditParcels && (
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2">
                <Save className="w-3.5 h-3.5" /> Save 3D Geometry
              </button>
            )}

            {isAdmin && (
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-3.5 h-3.5" /> Register New ULPIN Layer
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}