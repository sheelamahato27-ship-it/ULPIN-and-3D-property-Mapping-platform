import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, Center, Bounds } from '@react-three/drei';
import { ULPIN_DATASET } from '../services/ulpinApi';

// 3D Model with Local Coordinate Elevation & Mesh Traversal Raycasting
function Model({ onHoverUnit, onUnhoverUnit }) {
  const { scene } = useGLTF('/SIH_Sample_Building.glb');
  const groupRef = useRef();

  const handlePointerMove = (e) => {
    e.stopPropagation();

    const mesh = e.object;
    const meshName = mesh.name || '';
    const parentName = mesh.parent?.name || '';

    // Convert raycast point from World Space to Local Model Space
    // (Fixes coordinate distortion caused by <Center> or <Bounds>)
    const localPoint = groupRef.current
      ? groupRef.current.worldToLocal(e.point.clone())
      : e.point;

    const localY = localPoint.y;
    const localZ = localPoint.z;

    // Search dataset by mesh name, unit code, or local height elevation (Y/Z)
    const match = ULPIN_DATASET.find((item) => {
      // 1. Exact or partial mesh name match
      const nameMatch =
        (item.ulpin && (meshName.includes(item.ulpin) || parentName.includes(item.ulpin))) ||
        (item.unit && (meshName.includes(item.unit) || parentName.includes(item.unit))) ||
        (item.floor && (meshName.includes(item.floor) || parentName.includes(item.floor)));

      if (nameMatch) return true;

      // 2. Fallback elevation range matching
      const yInRange = localY >= item.zMin && localY <= item.zMax;
      const zInRange = localZ >= item.zMin && localZ <= item.zMax;

      return yInRange || zInRange;
    });

    if (match) {
      onHoverUnit(match, { x: e.clientX, y: e.clientY });
    } else {
      onUnhoverUnit();
    }
  };

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onPointerMove={handlePointerMove}
        onPointerOut={(e) => {
          e.stopPropagation();
          onUnhoverUnit();
        }}
      />
    </group>
  );
}

export default function BuildingViewport() {
  const [mode2D, setMode2D] = useState(false);
  const [svgData, setSvgData] = useState(null);
  const [svgError, setSvgError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hover State for Tooltip
  const [hoveredUlpin, setHoveredUlpin] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 2D Controls
  const [scale, setScale] = useState(1.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewportRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Fetch 2D SVG
  useEffect(() => {
    if (mode2D && !svgData) {
      fetch('/SIH_Sample_Building_2D.svg')
        .then((res) => {
          if (!res.ok) throw new Error('SVG File Not Found');
          return res.text();
        })
        .then((text) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');

          if (svgEl) {
            const rawW = svgEl.getAttribute('width')?.replace('px', '') || '1000';
            const rawH = svgEl.getAttribute('height')?.replace('px', '') || '800';

            if (!svgEl.getAttribute('viewBox')) {
              svgEl.setAttribute('viewBox', `0 0 ${rawW} ${rawH}`);
            }

            svgEl.removeAttribute('width');
            svgEl.removeAttribute('height');
            svgEl.setAttribute('class', 'w-full h-full text-indigo-700 stroke-current cursor-pointer');
            setSvgData(svgEl.outerHTML);
          } else {
            setSvgData(text);
          }
          setSvgError(false);
        })
        .catch(() => setSvgError(true));
    }
  }, [mode2D, svgData]);

  // 2D Mouse Hover Delegation
  const handleSvgMouseMove = (e) => {
    if (!mode2D) return;
    const target = e.target.closest('[id], [data-unit], [data-floor], path, rect, g');
    if (!target) return;

    const targetId = target.id || target.getAttribute('data-unit') || target.getAttribute('data-floor') || '';

    if (targetId) {
      const match = ULPIN_DATASET.find(
        (item) =>
          item.unit === targetId ||
          item.floor === targetId ||
          item.ulpin.includes(targetId) ||
          targetId.includes(item.unit)
      );

      if (match) {
        setHoveredUlpin(match);
        setTooltipPos({ x: e.clientX, y: e.clientY });
        return;
      }
    }
  };

  const handleWheel = (e) => {
    if (!mode2D) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.85;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.5), 8.0));
  };

  const handleMouseDown = (e) => {
    if (!mode2D) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (hoveredUlpin) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
    if (mode2D) {
      handleSvgMouseMove(e);
    }
    if (!isDragging || !mode2D) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      ref={viewportRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full bg-slate-100/70 relative border border-slate-200 flex flex-col select-none overflow-hidden"
    >
      {/* View Switcher Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-1.5 bg-white/90 p-1.5 rounded-2xl backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/50">
        <button
          onClick={() => {
            setMode2D(false);
            setHoveredUlpin(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !mode2D ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          3D View
        </button>
        <button
          onClick={() => {
            setMode2D(true);
            setHoveredUlpin(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode2D ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          2D Floor Plan
        </button>
      </div>

      {/* Fullscreen Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-white/90 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/50 transition-all active:scale-95"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
        </button>
      </div>

      {/* FLOATING ULPIN TOOLTIP */}
      {hoveredUlpin && (
        <div
          className="pointer-events-none fixed z-50 w-72 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl shadow-indigo-900/10 transition-transform duration-75 text-slate-800"
          style={{
            left: `${Math.min(tooltipPos.x + 16, window.innerWidth - 300)}px`,
            top: `${Math.min(tooltipPos.y + 16, window.innerHeight - 200)}px`,
          }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-[10px] font-mono font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
              {hoveredUlpin.floor} • Unit {hoveredUlpin.unit || 'ALL'}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {hoveredUlpin.area} m²
            </span>
          </div>

          <h4 className="text-xs font-extrabold text-slate-900 font-mono tracking-tight break-all">
            {hoveredUlpin.ulpin}
          </h4>

          <p className="text-[11px] font-medium text-slate-600 mt-1.5 leading-snug">
            {hoveredUlpin.type}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Elevation (z):</span>
            <span className="font-semibold text-indigo-600">
              {hoveredUlpin.zMin}m to {hoveredUlpin.zMax}m
            </span>
          </div>
        </div>
      )}

      {/* 2D VIEWPORT */}
      <div
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setHoveredUlpin(null);
        }}
        className={`w-full h-full items-center justify-center bg-slate-50 overflow-hidden cursor-grab active:cursor-grabbing ${
          mode2D ? 'flex' : 'hidden'
        }`}
      >
        {svgError ? (
          <div className="text-center p-6 border border-rose-200 bg-rose-50 rounded-2xl text-rose-600 text-xs font-mono">
            <p className="font-bold mb-1">SIH_Sample_Building_2D.svg not found in /public!</p>
          </div>
        ) : svgData ? (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
            dangerouslySetInnerHTML={{ __html: svgData }}
          />
        ) : (
          <p className="text-indigo-600 text-xs font-mono font-semibold animate-pulse">Loading 2D Floor Plan...</p>
        )}
      </div>

      {/* 3D CANVAS VIEWPORT */}
      <div className={`w-full h-full ${!mode2D ? 'block' : 'hidden'}`}>
        <Canvas camera={{ position: [25, 25, 25], fov: 40 }}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={2.2} />
          <directionalLight position={[20, 35, 20]} intensity={2.8} />
          <directionalLight position={[-20, 15, -20]} intensity={1.2} />

          <Suspense fallback={<Html center className="text-indigo-600 text-xs font-mono font-semibold">Loading 3D Model...</Html>}>
            <Bounds fit clip observe margin={0.55}>
              <Center>
                <Model
                  onHoverUnit={(data, pos) => {
                    setHoveredUlpin(data);
                    setTooltipPos(pos);
                  }}
                  onUnhoverUnit={() => setHoveredUlpin(null)}
                />
              </Center>
            </Bounds>
          </Suspense>

          <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={1} maxDistance={300} />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload('/SIH_Sample_Building.glb');