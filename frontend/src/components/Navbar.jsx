import React from 'react';
import { Activity, Sparkles, FileText, Download, Table, Database, Upload, Compass, Navigation } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({ selectedTarget, onSelectTarget, onRunAnalysis, isAnalyzing, analysisData }) {
  const targets = [
    { id: 'shackleton', name: 'Shackleton Crater (89.9°S, 0°E)' },
    { id: 'haworth', name: 'Haworth Crater (87.5°S, -5°E)' },
    { id: 'shoemaker', name: 'Shoemaker Crater (88.1°S, 45°E)' }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportPDF = async () => {
    if (!analysisData) return;
    try {
      const resp = await fetch('http://127.0.0.1:5000/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HImDristi_Lunar_Mission_Assessment_Report.pdf`;
      a.click();
    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  const handleExportGeoJSON = async () => {
    if (!analysisData) return;
    try {
      const resp = await fetch('http://127.0.0.1:5000/api/export/geojson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });
      const data = await resp.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lunar_rover_path_shackleton.geojson`;
      a.click();
    } catch (err) {
      console.error("GeoJSON Export Error:", err);
    }
  };

  const handleExportCSV = async () => {
    if (!analysisData) return;
    try {
      const resp = await fetch('http://127.0.0.1:5000/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });
      const text = await resp.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lunar_telemetry_shackleton.csv`;
      a.click();
    } catch (err) {
      console.error("CSV Export Error:", err);
    }
  };

  return (
    <nav 
      className="glass-card" 
      style={{ 
        padding: '12px 24px', 
        marginBottom: '20px', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: '10px',
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        background: 'rgba(7, 10, 18, 0.92)',
        border: '1px solid rgba(0, 243, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img 
          src={logoImg} 
          alt="HImDristi Logo" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ 
            height: '64px', 
            width: 'auto', 
            objectFit: 'contain',
            cursor: 'pointer'
          }} 
        />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <span style={{ fontSize: '11px', color: '#00f3ff', background: 'rgba(0,243,255,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #00f3ff', fontWeight: '700', letterSpacing: '0.5px' }}>
              v2.0 LUNAR MISSION
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '3px 0 0 0' }}>
            Multi-Modal Water Ice AI Pipeline & Traversal System
          </p>
        </div>
      </div>

      {/* QUICK NAVIGATION HEADER LINKS (DIRECT SCROLL TO SECTIONS IN SEQUENCE) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '10px', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
        <button
          onClick={() => scrollToSection('telemetry-overview')}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#00f3ff'; e.target.style.background = 'rgba(0, 243, 255, 0.12)'; }}
          onMouseLeave={(e) => { e.target.style.color = '#e2e8f0'; e.target.style.background = 'transparent'; }}
        >
          <Activity size={14} color="#00f3ff" />
          01 Telemetry
        </button>

        <button
          onClick={() => scrollToSection('data-pipeline')}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#38bdf8'; e.target.style.background = 'rgba(56, 189, 248, 0.12)'; }}
          onMouseLeave={(e) => { e.target.style.color = '#e2e8f0'; e.target.style.background = 'transparent'; }}
        >
          <Database size={14} color="#38bdf8" />
          02 Data Pipeline
        </button>

        <button
          onClick={() => scrollToSection('3d-globe')}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#10b981'; e.target.style.background = 'rgba(16, 185, 129, 0.12)'; }}
          onMouseLeave={(e) => { e.target.style.color = '#e2e8f0'; e.target.style.background = 'transparent'; }}
        >
          <Compass size={14} color="#10b981" />
          03 3D & AI Detection
        </button>

        <button
          onClick={() => scrollToSection('gps-map')}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#c084fc'; e.target.style.background = 'rgba(192, 132, 252, 0.12)'; }}
          onMouseLeave={(e) => { e.target.style.color = '#e2e8f0'; e.target.style.background = 'transparent'; }}
        >
          <Navigation size={14} color="#c084fc" />
          04 Tactical GPS Map
        </button>
      </div>

      {/* Target Selector & Mission Exports */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* EXPORT BUTTONS */}
        {analysisData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleExportPDF}
              title="Export PDF Mission Report"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid #10b981',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FileText size={13} /> PDF
            </button>

            <button
              onClick={handleExportGeoJSON}
              title="Export GeoJSON Route"
              style={{
                background: 'rgba(0, 243, 255, 0.15)',
                color: '#00f3ff',
                border: '1px solid #00f3ff',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Download size={13} /> GeoJSON
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Crater:</label>
          <select
            value={selectedTarget}
            onChange={(e) => onSelectTarget(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#00f3ff',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}