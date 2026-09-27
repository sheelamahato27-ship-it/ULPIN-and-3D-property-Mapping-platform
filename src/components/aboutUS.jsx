import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const stats = [
    { label: 'Problem Statement', value: 'SIH #26011', sub: '3D Cadastre & Mapping' },
    { label: 'Spatial Precision', value: 'Sub-Meter', sub: 'Volumetric Boundary Accuracy' },
    { label: 'ULPIN Standard', value: '14-Digit', sub: '3D Floor & Unit Integration' },
    { label: 'Interoperability', value: 'IFC / STEP / GLB', sub: 'BIM & GIS Synergy' },
  ];

  const features = [
    {
      icon: '🏗️',
      title: 'Volumetric 3D Property Mapping',
      description:
        'Transitioning land administration from legacy 2D parcel boundaries to true 3D spatial units for high-rise apartments, commercial towers, and multi-owner structures.',
    },
    {
      icon: '🏷️',
      title: '3D ULPIN Generation',
      description:
        'Extending India’s Unique Land Parcel Identification Number (ULPIN) with vertical floor indexing, sub-unit identification, and subterranean layer tags.',
    },
    {
      icon: '⛏️',
      title: 'Subterranean Infrastructure View',
      description:
        'Visualizing underground utility corridors, basement parking levels, metro tunnels, and foundation footprints alongside surface buildings.',
    },
    {
      icon: '⚡',
      title: 'Automated Footprint & Model Processing',
      description:
        'Streamlined ingestion of BIM/CAD models (STEP, IFC, DWG) and direct footprint extrusion to render lightweight web-ready 3D GLB assets.',
    },
    {
      icon: '👥',
      title: 'Role-Based Ecosystem',
      description:
        'Tailored dashboards for Citizens to inspect their floor unit titles, and Land Surveyors to validate CAD/BIM submissions and cadastral boundaries.',
    },
    {
      icon: '🌐',
      title: 'Open Standard Interoperability',
      description:
        'Built for integration with Digital India cadastral frameworks, GIS backends, municipal land records, and spatial database standards.',
    },
  ];

  const techStack = [
    { name: 'React.js', category: 'Frontend UI' },
    { name: 'Three.js / WebGL', category: '3D Viewport Engine' },
    { name: 'Tailwind CSS', category: 'Styling & Design' },
    { name: 'Flask / Python', category: 'Spatial Processing Backend' },
    { name: 'GIS & STEP Pipeline', category: '3D Conversion Engine' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8 flex flex-col gap-12 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
            <span>🚀</span> Smart India Hackathon 2026 • Problem Statement #26011
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Revolutionizing Cadastral Mapping with <span className="text-indigo-600">BhuDrishti 3D</span>
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            BhuDrishti 3D introduces a next-generation vertical property mapping and 3D ULPIN generation framework. By digitizing urban spaces beyond traditional 2D surface plots, we bridge municipal land governance, BIM architectures, and citizen property verification into a unified spatial ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/map"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
            >
              Launch 3D Viewport
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all border border-slate-200"
            >
              Explore User Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Impact & Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 my-2">{item.value}</p>
            <p className="text-[11px] text-indigo-600 font-medium">{item.sub}</p>
          </div>
        ))}
      </section>

      {/* Mission & Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl font-bold mb-4">
              🎯
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To eliminate property boundary disputes in multi-story developments by creating a transparent, verifiable, and standardized 3D cadastral registry. We empower municipal authorities and property owners with volumetric ownership records.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-xl font-bold mb-4">
              👁️
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A fully integrated 3D Digital Twin for Indian urban infrastructure, where every apartment unit, commercial floor, and underground utility corridor possesses a unique, tamper-evident spatial identity linked directly to national land databases.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Core System Capabilities</h2>
          <p className="text-sm text-slate-500 mt-1">Engineered to handle complex urban density and high-rise property structures.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-3">{feat.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Built With Modern Architecture</h2>
        <p className="text-xs text-slate-500 mb-6">Designed for speed, modularity, and real-time 3D web performance.</p>

        <div className="flex flex-wrap gap-3">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-800">{tech.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({tech.category})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-linear-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Ready to inspect 3D property boundaries?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Access the interactive viewport or log in as a certified surveyor to test CAD file uploads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="px-5 py-2.5 bg-white text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-xs"
          >
            Open Map Viewport
          </Link>
          <Link
            to="/surveyor"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
          >
            Surveyor Portal
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;