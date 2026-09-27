import React, { useRef, useState } from "react";

import BuildingViewport from "./buildingViewPort";

const SurveyorDashboard = () => {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ulpin, setUlpin] = useState("");
  const [result, setResult] = useState(null);
  const [showSubterranean, setShowSubterranean] = useState(false);

  // File Upload Handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ULPIN Search Handler
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const searchValue = ulpin.trim().toUpperCase();
    if (!searchValue) return;

    const found = ULPIN_DATASET.find(
      (item) => item.ulpin.toUpperCase() === searchValue
    );

    setResult(found || "not-found");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8 flex flex-col gap-8">
      {/* Dashboard Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 gap-4 bg-white p-6 rounded-2xl shadow-xs border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Surveyor Dashboard
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              3D CAD / BIM Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload BIM models, query 14-digit ULPIN cadastre, and inspect vertical 3D property boundaries.
          </p>
        </div>
      </header>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & ULPIN Search (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* CAD / BIM Upload Section */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Upload CAD / BIM File
              </h2>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                MAX 100MB
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? "border-indigo-600 bg-indigo-50/60"
                  : file
                  ? "border-emerald-500/60 bg-emerald-50/40"
                  : "border-slate-300 hover:border-indigo-500/60 hover:bg-slate-50"
              }`}
            >
              <div className="p-3 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600">
                📁
              </div>

              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-semibold text-emerald-700 break-all">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="mt-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-md transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-700">
                    Click to browse or drag & drop CAD/BIM model
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                    {["DWG", "DXF", "IFC", "RVT"].map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 rounded border border-slate-200"
                      >
                        .{fmt}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".dwg,.dxf,.ifc,.rvt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </section>

          {/* ULPIN Search Section */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Search by ULPIN
            </h2>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="Enter ULPIN (e.g. 14-2026-9081)"
                value={ulpin}
                onChange={(e) => setUlpin(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl transition-all shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Search Result Card */}
            {result && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                {result === "not-found" ? (
                  <div className="flex items-center gap-2 text-amber-700 font-medium">
                    <span>⚠️</span>
                    <span>No record found for ULPIN "{ulpin}".</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-mono font-semibold">PARCEL DETAILS</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                        MATCH FOUND
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <p className="text-[11px] text-slate-500">ULPIN Code</p>
                        <p className="font-mono font-bold text-slate-900">{result.ulpin}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Floor Level</p>
                        <p className="font-semibold text-slate-800">{result.floor ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Unit ID</p>
                        <p className="font-semibold text-slate-800">{result.unit ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Property Type</p>
                        <p className="font-semibold text-slate-800">{result.type ?? "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: 3D Building Viewport & Subterranean Controls (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {/* Viewport Toolbar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Interactive 3D Cadastral View
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect vertical floor boundaries and subterranean infrastructure.
              </p>
            </div>

            {/* Subterranean Structure Toggle Button */}
            <div className="flex items-center gap-3 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>⛏️</span> Subterranean View
              </span>
              <button
                type="button"
                onClick={() => setShowSubterranean(!showSubterranean)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                  showSubterranean ? "bg-indigo-600" : "bg-slate-300"
                }`}
                aria-pressed={showSubterranean}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${
                    showSubterranean ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-600 w-12 text-right">
                {showSubterranean ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          {/* Integrated 3D Building Viewport Canvas */}
          <div className="w-full h-135 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
            <BuildingViewport
              showSubterranean={showSubterranean}
              selectedParcel={result !== "not-found" ? result : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyorDashboard;