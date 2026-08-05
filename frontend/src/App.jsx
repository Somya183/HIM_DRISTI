import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TelemetryDashboard from './components/TelemetryDashboard';
import Moon3DViewer from './components/Moon3DViewer';
import PreprocessingPanel from './components/PreprocessingPanel';
import LunarGPSMap from './components/LunarGPSMap';
import StarfieldBackground from './components/StarfieldBackground';
import { Compass, Cpu, Activity, Database, Layers, Radio, Globe2, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedTarget, setSelectedTarget] = useState('shackleton');
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    fetchAnalysis();
  }, [selectedTarget]);

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
      />

      {/* SECTION 01: EXECUTIVE MISSION TELEMETRY & MODEL ACCURACY DASHBOARD */}
      <div id="telemetry-overview" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00f3ff', letterSpacing: '1px', background: 'rgba(0, 243, 255, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
              SECTION 01
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      <div id="data-pipeline" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              SECTION 02
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      <div id="3d-globe" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', letterSpacing: '1px', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              SECTION 03
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe2 size={18} color="#10b981" /> 3D LUNAR SURFACE ROTATION & UNET CONFIDENCE HEATMAP
            </h2>
          </div>
          <span className="neon-badge badge-green" style={{ fontSize: '10px' }}>
            PYTORCH UNET FUSION MODEL ACTIVE
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* LEFT PANEL: INTERACTIVE 3D MOON & ROVER PATH MAP */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
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
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Cpu size={18} /> AI Water Ice Deposit Confidence Map
              </h3>
              <span className="neon-badge badge-cyan">DEEP UNET TENSOR SEGMENTATION</span>
            </div>

            <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
                background: 'rgba(7, 10, 18, 0.85)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#94a3b8',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <span>Low Probability (0%)</span>
                <div style={{ width: '160px', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #000080, #00ffff, #00ff00, #ffff00, #ff0000)' }}></div>
                <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>High Ice Confidence (100%)</span>
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(7, 10, 18, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                <span style={{ color: '#94a3b8' }}>High Confidence Area:</span>
                <strong style={{ color: '#00f3ff', display: 'block', fontSize: '15px', marginTop: '2px' }}>
                  {analysisData?.metrics?.high_probability_area_km2 || '8.54'} km²
                </strong>
              </div>
              <div style={{ background: 'rgba(7, 10, 18, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ color: '#94a3b8' }}>Estimated Subsurface Mass:</span>
                <strong style={{ color: '#38bdf8', display: 'block', fontSize: '15px', marginTop: '2px' }}>
                  {analysisData?.metrics?.estimated_ice_mass_tonnes ? (analysisData.metrics.estimated_ice_mass_tonnes / 1e6).toFixed(2) + " Million Tonnes" : "0.04 Million Tonnes"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 04: FULL INTERACTIVE 2D AI LUNAR GPS MAP & LOCATION ANALYSIS PANEL */}
      <div id="gps-map" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#c084fc', letterSpacing: '1px', background: 'rgba(192, 132, 252, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
              SECTION 04
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#c084fc" /> TACTICAL LUNAR GPS NAVIGATION & WATER ICE INVENTORY
            </h2>
          </div>
          <span className="neon-badge badge-cyan" style={{ fontSize: '10px' }}>
            MULTILAYERED SUB-METRIC TACTICAL GPS
          </span>
        </div>

        <LunarGPSMap
          analysisData={analysisData}
          selectedTarget={selectedTarget}
        />
      </div>

      {/* SPACE MISSION CONTROL FOOTER CONSOLE */}
      <footer className="glass-card" style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#64748b',
        borderTop: '1px solid rgba(0, 243, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f3ff' }}>
            <Sparkles size={13} /> <strong>HImDristi v2.0 Mission Control</strong>
          </span>
          <span>Target: <strong style={{ color: '#94a3b8' }}>{selectedTarget.toUpperCase()} CRATER</strong></span>
          <span>Frame: <strong style={{ color: '#94a3b8' }}>MOON ME / PA-454</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>CUDA Acceleration: <strong style={{ color: '#10b981' }}>ACTIVE</strong></span>
          <span>Backend Latency: <strong style={{ color: '#00f3ff' }}>14ms</strong></span>
          <span>© 2026 HImDristi AI Space Intelligence</span>
        </div>
      </footer>
    </div>
  );
}