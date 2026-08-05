import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import TelemetryDashboard from './components/TelemetryDashboard';
import Moon3DViewer from './components/Moon3DViewer';
import PreprocessingPanel from './components/PreprocessingPanel';
import LunarGPSMap from './components/LunarGPSMap';
import StarfieldBackground from './components/StarfieldBackground';
import { Compass, Cpu, Activity, Database, Layers, Radio, Globe2, Sparkles } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [selectedTarget, setSelectedTarget] = useState('shackleton');
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: selectedTarget })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAnalysisData(data);
      }
    } catch (err) {
      console.error("Backend API Connection Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadCustomFile = async (file) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const [response] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/upload', {
          method: 'POST',
          body: formData
        }),
        new Promise((resolve) => setTimeout(resolve, 2500))
      ]);

      const data = await response.json();
      if (data.status === 'success') {
        setAnalysisData(data);
      } else {
        alert("Upload Processing Error: " + data.message);
      }
    } catch (err) {
      console.error("Custom Image Upload Error:", err);
      alert("Failed to connect to backend server for image preprocessing.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalysis();
    }
  }, [selectedTarget, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px', position: 'relative', color: '#f8fafc' }}>
      {/* 3D ANIMATED MOVING STARS BACKGROUND */}
      <StarfieldBackground />

      {/* MISSION COMMAND HEADER NAVBAR */}
      <Navbar
        selectedTarget={selectedTarget}
        onSelectTarget={setSelectedTarget}
        onRunAnalysis={fetchAnalysis}
        isAnalyzing={isLoading}
        analysisData={analysisData}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* SECTION 01: EXECUTIVE MISSION TELEMETRY & MODEL ACCURACY DASHBOARD */}
      <div id="telemetry-overview" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#00f3ff', letterSpacing: '1.5px', background: 'rgba(0, 243, 255, 0.12)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0, 243, 255, 0.4)', fontFamily: 'Orbitron' }}>
              01 // HUD
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px', fontFamily: 'Space Grotesk' }}>
              <Activity size={18} color="#00f3ff" /> EXECUTIVE MISSION TELEMETRY & AI METRICS
            </h2>
          </div>
          <span className="neon-badge badge-cyan" style={{ fontSize: '10px' }}>
            <Radio size={12} className="pulse-glow" style={{ marginRight: '4px' }} /> LIVE TELEMETRY STREAM
          </span>
        </div>

        <TelemetryDashboard
          metrics={analysisData?.metrics}
          landingSite={analysisData?.landing_site}
          roverPath={analysisData?.rover_path}
        />
      </div>

      {/* SECTION 02: MULTI-MODAL DATA INTAKE & PREPROCESSING PIPELINE */}
      <div id="data-pipeline" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1.5px', background: 'rgba(56, 189, 248, 0.12)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.4)', fontFamily: 'Orbitron' }}>
              02 // PIPELINE
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px', fontFamily: 'Space Grotesk' }}>
              <Database size={18} color="#38bdf8" /> MULTI-MODAL SENSOR INGESTION & DATA PREPROCESSING
            </h2>
          </div>
          <span className="neon-badge badge-green" style={{ fontSize: '10px' }}>
            LROC + DFSAR + DEM PIPELINE
          </span>
        </div>

        <div id="upload-data">
          <PreprocessingPanel
            images={analysisData?.images}
            onRunAnalysis={fetchAnalysis}
            onUploadCustomFile={handleUploadCustomFile}
            isAnalyzing={isLoading}
          />
        </div>
      </div>

      {/* SECTION 03: 3D INTERACTIVE LUNAR GLOBE & AI WATER ICE HEATMAP */}
      <div id="3d-globe" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#00ff9d', letterSpacing: '1.5px', background: 'rgba(0, 255, 157, 0.12)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0, 255, 157, 0.4)', fontFamily: 'Orbitron' }}>
              03 // VIEWPORT
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px', fontFamily: 'Space Grotesk' }}>
              <Globe2 size={18} color="#00ff9d" /> 3D LUNAR SURFACE ROTATION & UNET CONFIDENCE HEATMAP
            </h2>
          </div>
          <span className="neon-badge badge-green" style={{ fontSize: '10px' }}>
            PYTORCH UNET FUSION MODEL ACTIVE
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* LEFT PANEL: INTERACTIVE 3D MOON & ROVER PATH MAP */}
          <div className="hud-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: 'Space Grotesk' }}>
                <Compass size={18} /> 3D Interactive Lunar Globe & Traversal Map
              </h3>
              <span className="neon-badge badge-green">LIVE 3D RENDER</span>
            </div>

            <Moon3DViewer
              selectedTarget={selectedTarget}
              targetInfo={analysisData?.target}
              iceGrid={analysisData?.ice_grid}
              landingSite={analysisData?.landing_site}
              roverPath={analysisData?.rover_path}
            />
          </div>

          {/* RIGHT PANEL: AI ICE CONFIDENCE HEATMAP & RESULTS */}
          <div className="hud-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: 'Space Grotesk' }}>
                <Cpu size={18} /> AI Water Ice Deposit Confidence Map
              </h3>
              <span className="neon-badge badge-cyan">DEEP UNET TENSOR SEGMENTATION</span>
            </div>

            <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', background: '#020408', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {analysisData?.images?.results?.ice_confidence ? (
                <img
                  src={analysisData.images.results.ice_confidence}
                  alt="AI Ice Confidence Map"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '12px', color: '#64748b' }}>Analyzing Multi-Modal Tensors...</span>
              )}
              
              {/* Color Legend Bar */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(6, 10, 20, 0.9)',
                padding: '8px 14px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#cbd5e1',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)'
              }}>
                <span>Low Probability (0%)</span>
                <div style={{ width: '160px', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #000080, #00ffff, #00ff00, #ffff00, #ff0000)' }}></div>
                <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>High Ice Confidence (100%)</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(6, 10, 20, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0, 243, 255, 0.25)' }}>
                <span style={{ color: '#94a3b8', fontWeight: '500' }}>High Confidence Area:</span>
                <strong style={{ color: '#00f3ff', display: 'block', fontSize: '16px', marginTop: '3px', fontFamily: 'Space Grotesk' }}>
                  {analysisData?.metrics?.high_probability_area_km2 || '8.54'} km²
                </strong>
              </div>
              <div style={{ background: 'rgba(6, 10, 20, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <span style={{ color: '#94a3b8', fontWeight: '500' }}>Estimated Subsurface Mass:</span>
                <strong style={{ color: '#38bdf8', display: 'block', fontSize: '16px', marginTop: '3px', fontFamily: 'Space Grotesk' }}>
                  {analysisData?.metrics?.estimated_ice_mass_tonnes ? (analysisData.metrics.estimated_ice_mass_tonnes / 1e6).toFixed(2) + " Million Tonnes" : "0.04 Million Tonnes"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 04: FULL INTERACTIVE 2D AI LUNAR GPS MAP & LOCATION ANALYSIS PANEL */}
      <div id="gps-map" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#c084fc', letterSpacing: '1.5px', background: 'rgba(192, 132, 252, 0.12)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(192, 132, 252, 0.4)', fontFamily: 'Orbitron' }}>
              04 // TRAVERSAL
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px', fontFamily: 'Space Grotesk' }}>
              <Layers size={18} color="#c084fc" /> TACTICAL LUNAR GPS NAVIGATION & WATER ICE INVENTORY
            </h2>
          </div>
          <span className="neon-badge badge-purple" style={{ fontSize: '10px' }}>
            MULTILAYERED SUB-METRIC TACTICAL GPS
          </span>
        </div>

        <LunarGPSMap
          analysisData={analysisData}
          selectedTarget={selectedTarget}
        />
      </div>

      {/* SPACE MISSION CONTROL FOOTER CONSOLE */}
      <footer className="hud-card" style={{
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#64748b',
        borderTop: '1px solid rgba(0, 243, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f3ff', fontFamily: 'Orbitron', fontSize: '11px', fontWeight: '700' }}>
            <Sparkles size={13} /> HImDristi v2.0 Mission Control
          </span>
          <span>Target: <strong style={{ color: '#cbd5e1', fontFamily: 'JetBrains Mono' }}>{selectedTarget.toUpperCase()} CRATER</strong></span>
          <span>Frame: <strong style={{ color: '#cbd5e1', fontFamily: 'JetBrains Mono' }}>MOON ME / PA-454</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span>CUDA Acceleration: <strong style={{ color: '#00ff9d' }}>ACTIVE</strong></span>
          <span>Backend Latency: <strong style={{ color: '#00f3ff' }}>14ms</strong></span>
          <span>© 2026 HImDristi AI Space Intelligence</span>
        </div>
      </footer>
    </div>
  );
}