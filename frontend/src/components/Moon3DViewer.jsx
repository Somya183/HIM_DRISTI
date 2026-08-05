import React from 'react';
import { Globe, MapPin, Compass, Eye, ShieldAlert } from 'lucide-react';

const CRATER_LOCATIONS = {
  shackleton: {
    name: 'Shackleton Crater',
    latLon: '89.9°S, 0.0°E',
    side: 'Lunar South Pole Rim (Near-Side Sub-Earth)',
    facing: 'Facing Earth / Prime Meridian (0°E)',
    specs: '21.0 km Diameter • 4.2 km Depth',
    lighting: 'Grazing Solar Rim Illumination'
  },
  haworth: {
    name: 'Haworth Crater',
    latLon: '87.5°S, 5.0°W (-5.0°E)',
    side: 'South Polar Highlands (Sub-Earth Meridian West)',
    facing: 'West of Prime Meridian (-5.0°E)',
    specs: '35.0 km Diameter • 3.8 km Depth',
    lighting: 'Deep Perpetual Shadow Floor (PSR Cold Trap)'
  },
  shoemaker: {
    name: 'Shoemaker Crater',
    latLon: '88.1°S, 45.0°E',
    side: 'South Polar Far-Eastern Quadrant',
    facing: 'Eastern Limb (45.0°E Meridian)',
    specs: '50.0 km Diameter • 4.5 km Depth',
    lighting: 'High Elevation Sunlit Rim Crests'
  }
};

export default function Moon3DViewer({ selectedTarget = 'shackleton', targetInfo }) {
  const currentCrater = CRATER_LOCATIONS[selectedTarget] || {
    name: targetInfo?.name || 'Shackleton Crater',
    latLon: `${targetInfo?.coordinates?.lat || -89.9}°S, ${targetInfo?.coordinates?.lon || 0.0}°E`,
    side: 'Lunar South Pole Region',
    facing: 'Polar Rim Orientation',
    specs: `${targetInfo?.diameter_km || 21.0} km Diameter • ${targetInfo?.depth_km || 4.2} km Depth`,
    lighting: 'Low Grazing Illumination'
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden' }} className="glass-card">
      {/* HUD OVERLAY CARD - SHOWING SELECTED CRATER & LUNAR SIDE */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 20,
        background: 'rgba(7, 10, 18, 0.88)',
        padding: '10px 14px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 243, 255, 0.4)',
        boxShadow: '0 4px 20px rgba(0, 243, 255, 0.15)',
        maxWidth: '340px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <MapPin size={16} color="#00f3ff" style={{ filter: 'drop-shadow(0 0 5px #00f3ff)' }} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
            {currentCrater.name}
          </h4>
          <span style={{
            fontSize: '9px',
            background: 'rgba(0, 243, 255, 0.15)',
            color: '#00f3ff',
            padding: '1px 6px',
            borderRadius: '4px',
            border: '1px solid rgba(0, 243, 255, 0.4)',
            fontWeight: 'bold'
          }}>
            {currentCrater.latLon}
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
          <Compass size={12} color="#38bdf8" />
          <strong>Side & Location:</strong> {currentCrater.side}
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
          <Eye size={11} color="#94a3b8" />
          <strong>Facing Angle:</strong> {currentCrater.facing}
        </div>

        <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ShieldAlert size={11} color="#f59e0b" />
          <strong>Specs:</strong> {currentCrater.specs}
        </div>
      </div>

      {/* OFFICIAL NASA 3D INTERACTIVE MOON GLTF EMBED */}
      <div style={{ width: '100%', height: '480px', background: '#000', position: 'relative' }}>
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2366/"
          title="Official NASA 3D Moon Model (gltf_embed/2366)"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
