import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { ULPIN_DATASET } from '../services/ulpinApi';

// Recalibrated Spatial Thresholds for 3D Raycasting
const SPATIAL_BOUNDS = {
  // X-Axis Normalized Thresholds (0.000 = Left, 1.000 = Right)
  X_CORRIDOR_END: 0.25,     // Main Corridor / Common Area (427.50 sq ft front / 570.00 sq ft back)
  X_UNIT_1_3_END: 0.58,     // Left Flat Block: Unit 01 (Front) & Unit 03 (Back)
                            // Right Flat Block: Unit 02 (Front) & Unit 04 (Back) occupies (0.58 -> 1.000)

  // Z-Axis Depth Thresholds (0.000 = Rear/Back View, 1.000 = Front View)
  Z_BACK_UNIT_MAX: 0.40,    // Back units zone (Unit 03 & Unit 04)
  Z_EMPTY_CUTOUT_MIN: 0.40, // Central Empty Area (114.00 sq ft) between Unit 02 & Unit 04
  Z_EMPTY_CUTOUT_MAX: 0.60,
  Z_FRONT_UNIT_MIN: 0.60,   // Front units zone (Unit 01 & Unit 02)

  // Y-Axis Floor Level Thresholds (0.000 = Base, 1.000 = Top Roof)
  Y_BASEMENT_END: 0.166,    // Basement (B01)
  Y_GROUND_END: 0.333,      // Ground Floor (F00)
  Y_FLOOR1_END: 0.500,      // First Floor (F01)
  Y_FLOOR2_END: 0.666,      // Second Floor (F02)
  Y_FLOOR3_END: 0.833,      // Third Floor (F03)
                            // Roof Terrace (RF01) above 0.833
};

/**
 * Normalizes floor and unit identifiers from ULPIN_DATASET
 * to guarantee seamless matching regardless of dataset naming conventions
 */
function findUlpinRecord(dataset, targetFloor, targetUnit) {
  if (!dataset || !Array.isArray(dataset)) return null;

  const extractDigits = (str) => {
    const match = String(str || '').match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const targetFloorNum = extractDigits(targetFloor);
  const targetUnitNum = extractDigits(targetUnit);

  return dataset.find((item) => {
    const dbFloorStr = String(item.floor || '').toUpperCase();
    const dbUnitStr = String(item.unit || '').toUpperCase();

    // 1. Floor Matching
    let isFloorMatch = false;
    if (targetFloor === 'B01') {
      isFloorMatch = dbFloorStr.includes('B') || dbFloorStr.includes('BASE');
    } else if (targetFloor === 'RF01') {
      isFloorMatch = dbFloorStr.includes('ROOF') || dbFloorStr.includes('RF') || dbFloorStr.includes('TERRACE');
    } else if (targetFloor === 'F00') {
      isFloorMatch = dbFloorStr.includes('G') || dbFloorStr.includes('GROUND') || dbFloorStr === '0' || dbFloorStr === '00';
    } else {
      const dbFloorNum = extractDigits(dbFloorStr);
      isFloorMatch = dbFloorNum !== null && targetFloorNum !== null && dbFloorNum === targetFloorNum;
    }

    if (!isFloorMatch) return false;

    // 2. Spatial Zone / Unit Matching
    if (targetUnit === 'COMM') {
      return dbUnitStr.includes('COMM') || dbUnitStr.includes('CORR') || dbUnitStr.includes('COMMON') || dbUnitStr.includes('DUCT');
    }
    if (targetUnit === 'BASE') {
      return dbUnitStr.includes('BASE') || dbUnitStr.includes('PARK') || dbUnitStr.includes('B01');
    }
    if (targetUnit === 'ROOF') {
      return dbUnitStr.includes('ROOF') || dbUnitStr.includes('TERR') || dbUnitStr.includes('RF');
    }

    const dbUnitNum = extractDigits(dbUnitStr);
    if (targetUnitNum !== null && dbUnitNum !== null) {
      return dbUnitNum === targetUnitNum;
    }

    return dbUnitStr.includes(targetUnit) || targetUnit.includes(dbUnitStr);
  });
}

export function Model({ onHoverUnit, onUnhoverUnit }) {
  const { scene } = useGLTF('/SIH_Sample_Building.glb');

  // Clone scene to prevent memory leakage and Matrix4 corruption
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Calculate local bounding box for normalized percentage spatial division
  const bbox = useMemo(() => {
    clonedScene.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(clonedScene);
  }, [clonedScene]);

  const handlePointerMove = (e) => {
    e.stopPropagation();

    // Transform intersection point from world to local mesh space
    const localPoint = clonedScene.worldToLocal(e.point.clone());

    const spanX = bbox.max.x - bbox.min.x || 1;
    const spanY = bbox.max.y - bbox.min.y || 1;
    const spanZ = bbox.max.z - bbox.min.z || 1;

    // Normalize coordinates strictly to [0.0, 0.999]
    const normX = Math.max(0, Math.min(0.999, (localPoint.x - bbox.min.x) / spanX));
    const normY = Math.max(0, Math.min(0.999, (localPoint.y - bbox.min.y) / spanY));
    const normZ = Math.max(0, Math.min(0.999, (localPoint.z - bbox.min.z) / spanZ));

    // Step 1: Categorize Floor Level (Y-Axis)
    let targetFloor = '';
    if (normY < SPATIAL_BOUNDS.Y_BASEMENT_END) {
      targetFloor = 'B01';
    } else if (normY < SPATIAL_BOUNDS.Y_GROUND_END) {
      targetFloor = 'F00';
    } else if (normY < SPATIAL_BOUNDS.Y_FLOOR1_END) {
      targetFloor = 'F01';
    } else if (normY < SPATIAL_BOUNDS.Y_FLOOR2_END) {
      targetFloor = 'F02';
    } else if (normY < SPATIAL_BOUNDS.Y_FLOOR3_END) {
      targetFloor = 'F03';
    } else {
      targetFloor = 'RF01';
    }

    // Step 2: Categorize Flat / Common Area / Base / Roof (X & Z Axes)
    let targetUnit = '';

    if (targetFloor === 'B01') {
      targetUnit = 'BASE';
    } else if (targetFloor === 'RF01') {
      targetUnit = 'ROOF';
    } else {
      // Main Corridor Zone (Left wing: 427.50 sq ft front / 570.00 sq ft back)
      if (normX < SPATIAL_BOUNDS.X_CORRIDOR_END) {
        targetUnit = 'COMM';
      } 
      // First Block of Units (Unit 01 & Unit 03)
      else if (normX < SPATIAL_BOUNDS.X_UNIT_1_3_END) {
        targetUnit = normZ > 0.50 ? 'U01' : 'U03';
      } 
      // Second Block of Units (Unit 02 & Unit 04) + Empty Shaft Cutout
      else {
        if (normZ >= SPATIAL_BOUNDS.Z_EMPTY_CUTOUT_MIN && normZ <= SPATIAL_BOUNDS.Z_EMPTY_CUTOUT_MAX) {
          // Empty Cutout Area between Unit 02 and Unit 04 (114.00 sq ft)
          targetUnit = 'COMM';
        } else if (normZ > SPATIAL_BOUNDS.Z_FRONT_UNIT_MIN) {
          // Unit 02 (Front - 232.50 sq ft)
          targetUnit = 'U02';
        } else {
          // Unit 04 (Back - 232.50 sq ft / 168.333 sq ft side view)
          targetUnit = 'U04';
        }
      }
    }

    // Step 3: Match with ULPIN Dataset
    const match = findUlpinRecord(ULPIN_DATASET, targetFloor, targetUnit);

    if (match) {
      onHoverUnit(match, { x: e.clientX, y: e.clientY });
    } else {
      onUnhoverUnit();
    }
  };

  return (
    <primitive
      object={clonedScene}
      onPointerMove={handlePointerMove}
      onPointerOut={(e) => {
        e.stopPropagation();
        onUnhoverUnit();
      }}
    />
  );
}

export default function BuildingViewport() {
  const [mode2D, setMode2D] = useState(false);
  const [svgData, setSvgData] = useState(null);
  const [svgError, setSvgError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [hoveredUlpin, setHoveredUlpin] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const [scale, setScale] = useState(1.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewportRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    let isCancelled = false;

    if (mode2D && !svgData) {
      fetch('/SIH_Sample_Building_2D.svg')
        .then((res) => {
          if (!res.ok) throw new Error('SVG File Not Found');
          return res.text();
        })
        .then((text) => {
          if (isCancelled) return;
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
        .catch(() => {
          if (!isCancelled) setSvgError(true);
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [mode2D, svgData]);

  const handleSvgMouseMove = useCallback((e) => {
    if (!mode2D) return;

    const target = e.target.closest('[id], [data-unit], [data-floor], path, rect, g');
    if (!target) {
      setHoveredUlpin(null);
      return;
    }

    const targetId = (
      target.id ||
      target.getAttribute('data-unit') ||
      target.getAttribute('data-floor') ||
      ''
    ).toLowerCase();

    if (!targetId) {
      setHoveredUlpin(null);
      return;
    }

    const match = ULPIN_DATASET?.find((item) => {
      const u = (item.unit || '').toLowerCase();
      const f = (item.floor || '').toLowerCase();
      const ulp = (item.ulpin || '').toLowerCase();

      return (
        (u && (u === targetId || targetId.includes(u))) ||
        (f && (f === targetId || targetId.includes(f))) ||
        (ulp && ulp.includes(targetId))
      );
    });

    if (match) {
      setHoveredUlpin(match);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredUlpin(null);
    }
  }, [mode2D]);

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

      {/* Fullscreen Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-white/90 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/50 transition-all active:scale-95"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
        </button>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredUlpin && (
        <div
          className="pointer-events-none fixed z-50 w-80 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl text-slate-800"
          style={{
            left: `${Math.min(tooltipPos.x + 16, window.innerWidth - 340)}px`,
            top: `${Math.min(tooltipPos.y + 16, window.innerHeight - 220)}px`,
          }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-[10px] font-mono font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
              Floor {hoveredUlpin.floor} • Unit {hoveredUlpin.unit}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {hoveredUlpin.area} sq ft
            </span>
          </div>

          <h4 className="text-xs font-extrabold text-slate-900 font-mono tracking-tight break-all">
            {hoveredUlpin.ulpin}
          </h4>

          <p className="text-[11px] font-medium text-slate-600 mt-1.5 leading-snug">
            {hoveredUlpin.type}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Elevation (Y):</span>
            <span className="font-semibold text-indigo-600">
              {hoveredUlpin.yMin} ft to {hoveredUlpin.yMax} ft
            </span>
          </div>
        </div>
      )}

      {/* 2D Canvas Container */}
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

      {/* 3D Canvas Container */}
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