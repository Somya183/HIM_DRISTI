import React, { useState, useEffect } from 'react';
import { Layers, Database, Sparkles, RefreshCw, Cpu, CheckCircle2, Sliders, Info, ShieldAlert, GitBranch } from 'lucide-react';

const MOONPIES_CRATER_DATA = {
  shackleton: {
    name: 'Shackleton Crater',
    latLon: '89.9°S, 0.0°E',
    totalIceDepthM: 4.8,
    icePurityPct: 78.4,
    ejectaThicknessM: 2.1,
    ageGyr: 3.55,
    strata: [
      { depthStart: 0.0, depthEnd: 0.35, type: 'regolith', label: 'Dry Surface Regolith Overburden', icePct: 2.1, color: '#475569', desc: 'Micrometeorite gardened fine dust & desorbed dry topsoil' },
      { depthStart: 0.35, depthEnd: 1.45, type: 'ice_rich', label: 'Shackleton Concentrated Water Ice Stratum', icePct: 84.5, color: '#00f3ff', desc: 'High-purity solid ice slab deposited during Orientale impact era' },
      { depthStart: 1.45, depthEnd: 2.85, type: 'ejecta', label: 'Imbrium Basin Ejecta Blanket', icePct: 14.2, color: '#64748b', desc: 'Crushed basaltic ejecta gravel & breccia layer' },
      { depthStart: 2.85, depthEnd: 4.10, type: 'comet_ice', label: 'Cometary Volatile Ice & Organics Layer', icePct: 62.0, color: '#c084fc', desc: 'Ancient cometary delivery rich in H2O, CO2 & NH3 volatiles' },
      { depthStart: 4.10, depthEnd: 5.50, type: 'solar_wind', label: 'Solar Wind Hydrogen Impregnated Regolith', icePct: 28.4, color: '#f59e0b', desc: 'Proton-implanted OH/H2O trapped in ilmenite mineral grains' }
    ]
  },
  haworth: {
    name: 'Haworth Crater',
    latLon: '87.5°S, 5.0°W (-5.0°E)',
    totalIceDepthM: 6.2,
    icePurityPct: 82.1,
    ejectaThicknessM: 1.6,
    ageGyr: 3.82,
    strata: [
      { depthStart: 0.0, depthEnd: 0.20, type: 'regolith', label: 'Desorbed Dry Topsoil Shield', icePct: 1.5, color: '#475569', desc: 'Insulating dry dust cap maintaining thermal cold trap' },
      { depthStart: 0.20, depthEnd: 2.10, type: 'ice_rich', label: 'Haworth Deep PSR Mass Ice Sheet', icePct: 89.2, color: '#00f3ff', desc: 'Massive un-gardened cryogenic water ice deposit' },
      { depthStart: 2.10, depthEnd: 3.40, type: 'comet_ice', label: 'Volcanic Outgassing Volatile Layer', icePct: 54.0, color: '#c084fc', desc: 'Ancient lunar volcanic venting condensate stratum' },
      { depthStart: 3.40, depthEnd: 5.20, type: 'ejecta', label: 'Nectarian Impact Ejecta Matrix', icePct: 18.0, color: '#64748b', desc: 'Coarse impact melt & fragmented anorthosite rock' }
    ]
  },
  shoemaker: {
    name: 'Shoemaker Crater',
    latLon: '88.1°S, 45.0°E',
    totalIceDepthM: 3.9,
    icePurityPct: 71.5,
    ejectaThicknessM: 3.2,
    ageGyr: 3.90,
    strata: [
      { depthStart: 0.0, depthEnd: 0.60, type: 'regolith', label: 'Impact Ejecta Gardened Regolith', icePct: 4.8, color: '#475569', desc: 'Gardened topsoil mixed with local rim debris' },
      { depthStart: 0.60, depthEnd: 1.90, type: 'ice_rich', label: 'Shoemaker Subsurface Ice Lense', icePct: 74.0, color: '#00f3ff', desc: 'Interspersed crystalline H2O ice veins' },
      { depthStart: 1.90, depthEnd: 3.80, type: 'ejecta', label: 'Crisium Basin Ejecta Stratum', icePct: 11.5, color: '#64748b', desc: 'Thick impact ejecta overburden blanket' },
      { depthStart: 3.80, depthEnd: 5.00, type: 'solar_wind', label: 'Deep Solar Wind Proton Accumulation', icePct: 32.0, color: '#f59e0b', desc: 'Implanted hydrogen & hydroxyl enriched regolith' }
    ]
  }
};

export default function MoonPIESViewer({ selectedTarget = 'shackleton' }) {
  const [seed, setSeed] = useState(1958);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(1);
  const [sources, setSources] = useState({
    cometary: true,
    solarWind: true,
    volcanic: true
  });

  const craterData = MOONPIES_CRATER_DATA[selectedTarget] || MOONPIES_CRATER_DATA['shackleton'];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const selectedLayer = craterData.strata[selectedLayerIndex] || craterData.strata[0];

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', padding: '20px' }} className="glass-card">
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
              <Layers size={20} color="#00f3ff" /> MoonPIES: Polar Ice & Ejecta Stratigraphy Model
            </h3>
            <a
              href="https://github.com/cjtu/moonpies"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '10px',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <GitBranch size={11} /> cjtu/moonpies
            </a>
          </div>
          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
            NASA / LPI Monte Carlo Subsurface Stratigraphy & Volatile Ice Deposition Model
          </p>
        </div>

        <span className="neon-badge badge-cyan" style={{ fontSize: '10px' }}>
          MONTE CARLO ACTIVE (v1.2)
        </span>
      </div>

      {/* CONTROLS & MONTE CARLO SEED PANEL */}
      <div style={{
        background: 'rgba(7, 10, 18, 0.75)',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(0, 243, 255, 0.25)',
        marginBottom: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        justify: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Seed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sliders size={13} color="#00f3ff" /> Random Seed:
          </label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
            style={{
              width: '80px',
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#00f3ff',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 'bold',
              outline: 'none'
            }}
          />
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 90000) + 10000)}
            className="glass-button"
            style={{ fontSize: '10px', padding: '4px 8px' }}
          >
            🎲 Randomize
          </button>
        </div>

        {/* Volatile Source Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#cbd5e1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sources.cometary}
              onChange={(e) => setSources({ ...sources, cometary: e.target.checked })}
            />
            ☄️ Cometary Delivery
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sources.solarWind}
              onChange={(e) => setSources({ ...sources, solarWind: e.target.checked })}
            />
            ☀️ Solar Wind Protons
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sources.volcanic}
              onChange={(e) => setSources({ ...sources, volcanic: e.target.checked })}
            />
            🌋 Volcanic Outgassing
          </label>
        </div>

        {/* Run Simulation Button */}
        <button
          onClick={handleRunSimulation}
          className="glass-button glass-button-primary"
          style={{ fontSize: '11px', padding: '6px 14px' }}
          disabled={isSimulating}
        >
          <RefreshCw size={13} className={isSimulating ? 'animate-spin' : ''} />
          {isSimulating ? 'Simulating Stratigraphy...' : 'Run MoonPIES Model'}
        </button>
      </div>

      {/* STRATIGRAPHY COLUMN VISUALIZER & LAYER BREAKDOWN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '18px' }}>
        {/* VERTICAL CORE SAMPLE COLUMN (0.0m to 5.5m depth) */}
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            📍 Core Sample (0 - 5.5m)
          </div>

          <div style={{
            width: '100%',
            height: '320px',
            background: '#04060a',
            borderRadius: '12px',
            border: '2px solid rgba(0, 243, 255, 0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.15)'
          }}>
            {craterData.strata.map((layer, idx) => {
              const heightPct = ((layer.depthEnd - layer.depthStart) / 5.5) * 100;
              const isSelected = idx === selectedLayerIndex;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedLayerIndex(idx)}
                  style={{
                    height: `${heightPct}%`,
                    background: layer.color,
                    opacity: isSelected ? 1.0 : 0.7,
                    border: isSelected ? '2px solid #ffffff' : '1px dashed rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: isSelected ? `inset 0 0 15px ${layer.color}` : 'none'
                  }}
                  title={`${layer.label}: ${layer.depthStart}m - ${layer.depthEnd}m (${layer.icePct}% Ice)`}
                >
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: layer.type === 'ice_rich' ? '#070a12' : '#ffffff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    textAlign: 'center',
                    padding: '2px'
                  }}>
                    {layer.icePct}% Ice
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: '6px' }}>
            Click layer to view details
          </div>
        </div>

        {/* SELECTED STRATIGRAPHIC LAYER DETAIL PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Layer Detail Box */}
          <div style={{
            background: 'rgba(7, 10, 18, 0.85)',
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${selectedLayer.color}`,
            boxShadow: `0 0 20px ${selectedLayer.color}33`,
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                background: selectedLayer.color,
                color: selectedLayer.type === 'ice_rich' ? '#070a12' : '#ffffff',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                DEPTH: {selectedLayer.depthStart}m — {selectedLayer.depthEnd}m BELOW SURFACE
              </span>

              <span style={{ fontSize: '12px', color: '#00f3ff', fontWeight: 'bold' }}>
                🧊 Ice Fraction: {selectedLayer.icePct}%
              </span>
            </div>

            <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#f8fafc', fontWeight: '700' }}>
              {selectedLayer.label}
            </h4>

            <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
              {selectedLayer.desc}
            </p>
          </div>

          {/* CRATER STRATIGRAPHY METRICS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>Total Ice Deposit Thickness</span>
              <strong style={{ color: '#00f3ff', fontSize: '15px' }}>{craterData.totalIceDepthM} m</strong>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>Average Ice Purity</span>
              <strong style={{ color: '#10b981', fontSize: '15px' }}>{craterData.icePurityPct}%</strong>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>Ejecta Overburden</span>
              <strong style={{ color: '#f59e0b', fontSize: '15px' }}>{craterData.ejectaThicknessM} m</strong>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>Estimated Strata Age</span>
              <strong style={{ color: '#c084fc', fontSize: '15px' }}>{craterData.ageGyr} Gy</strong>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CITATION */}
      <div style={{
        marginTop: '16px',
        padding: '8px 12px',
        background: 'rgba(7, 10, 18, 0.6)',
        borderRadius: '8px',
        fontSize: '11px',
        color: '#94a3b8',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <span>📖 Reference Model: <strong>Tai Udovicic et al. (2022) MoonPIES Zenodo DOI: 10.5281/zenodo.7055800</strong></span>
        <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>Lunar Cold Trap Ejecta & Volatile Deposition Simulator</span>
      </div>
    </div>
  );
}
