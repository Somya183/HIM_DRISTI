import React from 'react';
import { Activity, Sparkles, FileText, Download, Table, Database, Upload, Compass, Navigation, LogOut } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({ selectedTarget, onSelectTarget, onRunAnalysis, isAnalyzing, analysisData, onLogout, user }) {
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
        padding: '12px 28px', 
        marginBottom: '28px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: '12px',
        zIndex: 100,
        borderRadius: '16px',
        width: '100%'
      }}
    >
      {/* Brand Logo & Clean Expanded Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 243, 255, 0.08)',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 243, 255, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
          }}
        >
          <img 
            src={logoImg} 
            alt="HImDristi Logo" 
            style={{ 
              height: '36px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.5))'
            }} 
          />
        </div>

        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: '800', 
          color: '#f8fafc', 
          margin: 0, 
          letterSpacing: '-0.5px', 
          fontFamily: 'Space Grotesk',
          whiteSpace: 'nowrap'
        }}>
          HImDristi <span style={{ color: '#00f3ff', fontWeight: '400', fontSize: '13px', marginLeft: '6px' }}>• MISSION CONTROL</span>
        </h1>
      </div>

      {/* QUICK NAVIGATION HEADER LINKS (DIRECT SCROLL TO SECTIONS IN SEQUENCE) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(7, 12, 24, 0.9)', padding: '4px 6px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <button
          onClick={() => scrollToSection('telemetry-overview')}
          className="glass-button"
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: 'none', background: 'transparent' }}
        >
          <Activity size={14} color="#00f3ff" />
          01 Telemetry
        </button>

        <button
          onClick={() => scrollToSection('data-pipeline')}
          className="glass-button"
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: 'none', background: 'transparent' }}
        >
          <Database size={14} color="#38bdf8" />
          02 Data Pipeline
        </button>

        <button
          onClick={() => scrollToSection('3d-globe')}
          className="glass-button"
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: 'none', background: 'transparent' }}
        >
          <Compass size={14} color="#10b981" />
          03 3D & AI Detection
        </button>

        <button
          onClick={() => scrollToSection('gps-map')}
          className="glass-button"
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: 'none', background: 'transparent' }}
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
              className="glass-button"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                padding: '6px 12px',
                fontSize: '11px'
              }}
            >
              <FileText size={13} /> PDF Report
            </button>

            <button
              onClick={handleExportGeoJSON}
              title="Export GeoJSON Route"
              className="glass-button"
              style={{
                background: 'rgba(0, 243, 255, 0.15)',
                color: '#00f3ff',
                borderColor: 'rgba(0, 243, 255, 0.4)',
                padding: '6px 12px',
                fontSize: '11px'
              }}
            >
              <Download size={13} /> GeoJSON
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Crater:</label>
          <select
            value={selectedTarget}
            onChange={(e) => onSelectTarget(e.target.value)}
            style={{
              background: 'rgba(7, 12, 24, 0.95)',
              color: '#00f3ff',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(0, 243, 255, 0.15)'
            }}
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* LOGOUT / LOCK MISSION CONTROL BUTTON */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Lock Session / Sign Out"
            className="hud-btn"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              color: '#f87171',
              borderColor: 'rgba(248, 113, 113, 0.4)',
              background: 'rgba(248, 113, 113, 0.12)'
            }}
          >
            <LogOut size={13} color="#f87171" />
            Lock Session
          </button>
        )}
      </div>
    </nav>
  );
}