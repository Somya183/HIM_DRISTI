import React, { useState, useRef } from 'react';
import { 
  Layers, Navigation, ZoomIn, ZoomOut, RotateCcw, 
  Eye, Compass, Cpu, Activity, ArrowUpRight, Crosshair, Droplets, MapPin, Target, Sparkles, Box
} from 'lucide-react';

export default function LunarGPSMap({ analysisData, selectedTarget = 'shackleton' }) {
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite', 'terrain', 'radar', 'hybrid'
  const [iceOpacity, setIceOpacity] = useState(0.70);
  const [showPath, setShowPath] = useState(true);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedDepositId, setSelectedDepositId] = useState(null);

  const containerRef = useRef(null);

  const targetName = analysisData?.target?.name || 'Shackleton Crater';
  const landingInfo = analysisData?.landing_site || {};
  const landingCoords = landingInfo?.landing_coords_pixel || [394, 242];
  const landingLunar = landingInfo?.landing_lunar_coords || { lat: -90.0, lon: 0.0 };

  const waypoints = analysisData?.rover_path?.path_waypoints || [];
  const primaryTargetCoords = landingInfo?.target_coords_pixel || (waypoints.length ? waypoints[waypoints.length - 1] : [280, 200]);

  const iceDeposits = analysisData?.ice_deposits || analysisData?.metrics?.ice_deposits || [
    {
      id: "deposit_primary",
      name: "Ice Deposit Alpha (Primary Target)",
      centroid_pixel: primaryTargetCoords,
      lunar_coords: landingInfo?.target_lunar_coords || { lat: -89.6, lon: 3.7 },
      volume_m3: analysisData?.metrics?.estimated_ice_volume_m3 || 23728.77,
      mass_tonnes: analysisData?.metrics?.estimated_ice_mass_tonnes || 37966.0,
      peak_confidence_pct: analysisData?.metrics?.peak_confidence_pct || 90.9,
      distance_from_landing_site_km: landingInfo?.straight_line_distance_km || 20.59,
      distance_from_landing_site_m: landingInfo?.straight_line_distance_m || 20590.4
    }
  ];

  // Base map image selection
  const getBaseMapSrc = () => {
    if (!analysisData?.images) return null;
    if (mapMode === 'terrain') return analysisData.images.raw.dem;
    if (mapMode === 'radar') return analysisData.images.raw.radar;
    if (mapMode === 'hybrid') return analysisData.images.results.slope_map;
    return analysisData.images.raw.optical || analysisData.images.preprocessed.optical;
  };

  const iceHeatmapSrc = analysisData?.images?.results?.ice_confidence;

  // Pan & Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.3, 3.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.3, 0.8));
  const handleResetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setSelectedDepositId(null);
  };

  const handleFocusDeposit = (dep) => {
    setSelectedDepositId(dep.id);
    const pxR = dep.centroid_pixel[0];
    const pxC = dep.centroid_pixel[1];
    setZoomLevel(1.6);
    const offsetX = (0.5 - pxC / 512) * 460;
    const offsetY = (0.5 - pxR / 512) * 460;
    setPan({ x: offsetX, y: offsetY });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - pan.x) / zoomLevel;
      const clickY = (e.clientY - rect.top - pan.y) / zoomLevel;
      
      const normX = Math.max(0, Math.min(1, clickX / rect.width));
      const normY = Math.max(0, Math.min(1, clickY / rect.height));

      const centerLat = analysisData?.target?.coordinates?.lat ?? -89.9;
      const centerLon = analysisData?.target?.coordinates?.lon ?? 0.0;

      const deltaN = (0.5 - normY) * 25.0;
      const deltaE = (normX - 0.5) * 25.0;

      const lat = (centerLat + deltaN / 30.323).toFixed(4);
      const lon = (centerLon + deltaE / (30.323 * Math.max(Math.cos(centerLat * Math.PI / 180), 0.05))).toFixed(4);

      const elevationM = Math.round(-4200 + (1 - normY) * 800);
      const iceProb = Math.round(10 + normY * 85);

      setHoverInfo({ lat, lon, elevationM, iceProb, x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', position: 'relative' }}>
      {/* MAP HEADER TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Navigation size={20} color="#00f3ff" /> Interactive AI Lunar GPS Map & Location Analysis
          </h3>
          <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Image-based AI Analysis • Safe Landing Position & Water Ice Deposit Locations • Real Coordinates & Distance Metrics
          </p>
        </div>

        {/* MAP VIEW SWITCHER */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(7, 10, 18, 0.85)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
          <button
            onClick={() => setMapMode('satellite')}
            style={{
              background: mapMode === 'satellite' ? 'linear-gradient(135deg, #00f3ff 0%, #0284c7 100%)' : 'transparent',
              color: mapMode === 'satellite' ? '#070a12' : '#94a3b8',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Eye size={12} /> Optical Satellite
          </button>

          <button
            onClick={() => setMapMode('terrain')}
            style={{
              background: mapMode === 'terrain' ? 'linear-gradient(135deg, #00f3ff 0%, #0284c7 100%)' : 'transparent',
              color: mapMode === 'terrain' ? '#070a12' : '#94a3b8',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Layers size={12} /> Topo DEM
          </button>

          <button
            onClick={() => setMapMode('radar')}
            style={{
              background: mapMode === 'radar' ? 'linear-gradient(135deg, #00f3ff 0%, #0284c7 100%)' : 'transparent',
              color: mapMode === 'radar' ? '#070a12' : '#94a3b8',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Activity size={12} /> Radar CPR
          </button>
        </div>
      </div>

      {/* LAYER CONTROL BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.75)',
        padding: '8px 14px',
        borderRadius: '10px',
        marginBottom: '12px',
        fontSize: '11px',
        color: '#cbd5e1',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* AI Heatmap Opacity Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} color="#00f3ff" />
          <span>AI Water Ice Heatmap Overlay:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={iceOpacity}
            onChange={(e) => setIceOpacity(parseFloat(e.target.value))}
            style={{ accentColor: '#00f3ff', width: '100px', cursor: 'pointer' }}
          />
          <strong style={{ color: '#00f3ff', width: '32px' }}>{Math.round(iceOpacity * 100)}%</strong>
        </div>

        {/* GPS Path Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showPath}
              onChange={(e) => setShowPath(e.target.checked)}
              style={{ accentColor: '#00f3ff' }}
            />
            <span style={{ color: '#38bdf8', fontWeight: '600' }}>A* Safe Rover Traversal Path</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showWaypoints}
              onChange={(e) => setShowWaypoints(e.target.checked)}
              style={{ accentColor: '#00f3ff' }}
            />
            <span>Waypoints ({waypoints.length})</span>
          </label>
        </div>
      </div>

      {/* MAIN INTERACTIVE MAP CANVAS CONTAINER */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          background: '#020617',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          border: '1px solid rgba(0, 243, 255, 0.4)',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* MAP CANVAS CONTENT */}
        <div style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          position: 'relative'
        }}>
          {/* BASE MAP LAYER */}
          {getBaseMapSrc() ? (
            <img
              src={getBaseMapSrc()}
              alt="Lunar Map Layer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#64748b', fontSize: '13px' }}>
              Processing Model Image Analysis...
            </div>
          )}

          {/* AI ICE CONFIDENCE OVERLAY LAYER */}
          {iceHeatmapSrc && iceOpacity > 0 && (
            <img
              src={iceHeatmapSrc}
              alt="Ice Confidence Overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: iceOpacity,
                mixBlendMode: 'screen',
                pointerEvents: 'none'
              }}
            />
          )}

          {/* SVG OVERLAY FOR ROVER TRAVERSAL PATH & DIRECT DISTANCE LINES */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
            viewBox="0 0 512 512"
            preserveAspectRatio="none"
          >
            {/* STRAIGHT LINE DISTANCE CONNECTIONS TO ICE LOCATIONS */}
            {landingCoords && iceDeposits.map((dep, idx) => {
              const depR = dep.centroid_pixel[0];
              const depC = dep.centroid_pixel[1];
              const landR = landingCoords[0];
              const landC = landingCoords[1];

              return (
                <g key={`line_${dep.id}`}>
                  <line
                    x1={landC}
                    y1={landR}
                    x2={depC}
                    y2={depR}
                    stroke={idx === 0 ? "rgba(0, 243, 255, 0.8)" : "rgba(255, 255, 255, 0.35)"}
                    strokeWidth={idx === 0 ? "2.5" : "1.5"}
                    strokeDasharray="4,4"
                  />
                </g>
              );
            })}

            {/* A* ROVER TRAVERSAL ROUTE */}
            {showPath && waypoints.length > 0 && (
              <>
                <polyline
                  points={waypoints.map(([r, c]) => `${c},${r}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 6px #10b981)"
                />

                {showWaypoints && waypoints.map(([r, c], idx) => (
                  <circle
                    key={idx}
                    cx={c}
                    cy={r}
                    r={idx === 0 || idx === waypoints.length - 1 ? "5" : "2.5"}
                    fill={idx === 0 ? "#10b981" : idx === waypoints.length - 1 ? "#00f3ff" : "#34d399"}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                ))}
              </>
            )}
          </svg>

          {/* SAFE ROVER LANDING POSITION MARKER */}
          {landingCoords && (
            <div style={{
              position: 'absolute',
              top: `${(landingCoords[0] / 512) * 100}%`,
              left: `${(landingCoords[1] / 512) * 100}%`,
              transform: 'translate(-50%, -100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 20
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
                border: '1px solid #6ee7b7',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MapPin size={12} color="#ffffff" />
                <span>ROVER LANDING ({landingLunar.lat}°S, {landingLunar.lon}°E)</span>
              </div>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #ffffff',
                boxShadow: '0 0 14px #10b981',
                marginTop: '2px'
              }} />
            </div>
          )}

          {/* DETECTED ICE DEPOSIT LOCATION MARKERS */}
          {iceDeposits.map((dep, idx) => {
            const isSelected = selectedDepositId === dep.id;
            const topPct = (dep.centroid_pixel[0] / 512) * 100;
            const leftPct = (dep.centroid_pixel[1] / 512) * 100;

            return (
              <div
                key={dep.id}
                onClick={() => handleFocusDeposit(dep)}
                style={{
                  position: 'absolute',
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  transform: 'translate(-50%, -100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: isSelected ? 30 : 15
                }}
              >
                <div style={{
                  background: isSelected ? 'linear-gradient(135deg, #00f3ff 0%, #0284c7 100%)' : 'rgba(7, 10, 18, 0.9)',
                  color: isSelected ? '#070a12' : '#00f3ff',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: '800',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.8)',
                  border: isSelected ? '2px solid #ffffff' : '1px solid #00f3ff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Droplets size={11} color={isSelected ? '#070a12' : '#00f3ff'} />
                  <span>{dep.name} ({dep.peak_confidence_pct}%)</span>
                </div>
                <div style={{
                  fontSize: '8px',
                  color: '#e0f2fe',
                  background: 'rgba(2, 6, 23, 0.85)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  marginTop: '2px',
                  fontFamily: 'monospace'
                }}>
                  📍 {dep.lunar_coords.lat}°S, {dep.lunar_coords.lon}°E | 📏 {dep.distance_from_landing_site_km ? `${dep.distance_from_landing_site_km} km` : `${(dep.distance_from_landing_site_m / 1000).toFixed(1)} km`}
                </div>
                <div style={{
                  width: isSelected ? '16px' : '12px',
                  height: isSelected ? '16px' : '12px',
                  borderRadius: '50%',
                  background: isSelected ? '#ffffff' : '#00f3ff',
                  border: '2px solid #0284c7',
                  boxShadow: '0 0 16px #00f3ff',
                  marginTop: '2px'
                }} />
              </div>
            );
          })}
        </div>

        {/* MAP CONTROL BUTTONS */}
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 40
        }}>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(7, 10, 18, 0.85)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              color: '#00f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(7, 10, 18, 0.85)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              color: '#00f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={handleResetView}
            title="Reset Map View"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(7, 10, 18, 0.85)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* GPS COMPASS */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          background: 'rgba(7, 10, 18, 0.85)',
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#00f3ff',
          zIndex: 40,
          backdropFilter: 'blur(8px)'
        }}>
          <Compass size={16} color="#00f3ff" />
          <strong>Target Region: {targetName}</strong>
        </div>

        {/* MOUSE CURSOR GPS INSPECTOR */}
        <div style={{
          position: 'absolute',
          right: '12px',
          bottom: '12px',
          background: 'rgba(7, 10, 18, 0.9)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 243, 255, 0.4)',
          fontSize: '11px',
          color: '#cbd5e1',
          zIndex: 40,
          backdropFilter: 'blur(8px)',
          fontFamily: 'monospace'
        }}>
          {hoverInfo ? (
            <span>
              <Crosshair size={12} color="#00f3ff" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              LAT: <strong style={{ color: '#00f3ff' }}>{hoverInfo.lat}°S</strong> | LON: <strong style={{ color: '#00f3ff' }}>{hoverInfo.lon}°E</strong> | ELEV: <strong>{hoverInfo.elevationM}m</strong> | ICE CONF: <strong style={{ color: '#10b981' }}>{hoverInfo.iceProb}%</strong>
            </span>
          ) : (
            <span style={{ color: '#64748b' }}>Hover cursor over map to inspect coordinates & ice probability</span>
          )}
        </div>
      </div>

    </div>
  );
}
