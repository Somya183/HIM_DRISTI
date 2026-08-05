import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio, Compass, Cpu, Database, Layers, Activity, Bell, Settings, HelpCircle,
  User, CheckCircle2, Loader2, ArrowRight, Download, FileText, Play, RotateCcw,
  Sparkles, ShieldCheck, MapPin, Sliders, ChevronRight
} from 'lucide-react';
import StarfieldBackground from '../components/StarfieldBackground';
import PreprocessingPanel from '../components/PreprocessingPanel';
import Moon3DViewer from '../components/Moon3DViewer';
import LunarGPSMap from '../components/LunarGPSMap';
import TelemetryDashboard from '../components/TelemetryDashboard';

export default function MissionControl({ user, onLogout }) {
  const navigate = useNavigate();

  // Navigation & View States
  const [topTab, setTopTab] = useState('telemetry'); // 'telemetry', 'map', 'analytics'
  const [activeStep, setActiveStep] = useState('acquisition'); // 'acquisition', 'preprocessing', 'extraction', 'detection', 'decision'
  const [selectedTarget, setSelectedTarget] = useState('shackleton');

  // Execution & Pipeline States
  const [pipelineStatus, setPipelineStatus] = useState({
    acquisition: 'complete',
    preprocessing: 'processing', // 'pending', 'processing', 'complete'
    extraction: 'pending',
    detection: 'pending',
    decision: 'pending'
  });

  const [scanProgress, setScanProgress] = useState(45);
  const [isExecuting, setIsExecuting] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Fetch analysis data from backend
  const fetchAnalysis = async () => {
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
    }
  };

  const handleExecuteScan = () => {
    if (isExecuting) return;
    setIsExecuting(true);

    // Step 1: Preprocessing
    setPipelineStatus({
      acquisition: 'complete',
      preprocessing: 'processing',
      extraction: 'pending',
      detection: 'pending',
      decision: 'pending'
    });
    setScanProgress(25);

    setTimeout(() => {
      // Step 2: Feature Extraction
      setPipelineStatus(prev => ({ ...prev, preprocessing: 'complete', extraction: 'processing' }));
      setScanProgress(55);

      setTimeout(() => {
        // Step 3: AI Detection
        setPipelineStatus(prev => ({ ...prev, extraction: 'complete', detection: 'processing' }));
        setScanProgress(85);

        setTimeout(() => {
          // Step 4: Decision & Complete
          setPipelineStatus({
            acquisition: 'complete',
            preprocessing: 'complete',
            extraction: 'complete',
            detection: 'complete',
            decision: 'complete'
          });
          setScanProgress(100);
          setIsExecuting(false);
          fetchAnalysis();
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleDownloadPDF = () => {
    alert("Generating official HImDristi Lunar Ops Command Mission Report (PDF)...");
  };

  const handleExportCSV = () => {
    alert("Exporting raw DFSAR Radar CPR & Water Ice Inventory Data (CSV)...");
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTarget]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#040711',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 3D STARFIELD BACKGROUND */}
      <StarfieldBackground />

      {/* TOP HEADER: LUNAR OPS COMMAND */}
      <header style={{
        height: '64px',
        padding: '0 32px',
        background: '#070b16',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 30
      }}>
        {/* BRAND TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#00f3ff',
            letterSpacing: '1px',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            LUNAR OPS COMMAND
          </h1>
        </div>

        {/* CENTER TABS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
          {[
            { id: 'telemetry', label: 'Telemetry' },
            { id: 'map', label: 'Map View' },
            { id: 'analytics', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTopTab(tab.id)}
              style={{
                height: '100%',
                padding: '0 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: topTab === tab.id ? '2px solid #00f3ff' : '2px solid transparent',
                color: topTab === tab.id ? '#ffffff' : '#94a3b8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* RIGHT SYSTEM UTILITIES & PROFILE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#94a3b8' }}>
          <Bell size={18} style={{ cursor: 'pointer' }} />
          <Settings size={18} style={{ cursor: 'pointer' }} />
          <HelpCircle size={18} style={{ cursor: 'pointer' }} />
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 243, 255, 0.15)',
            border: '1px solid rgba(0, 243, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00f3ff',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            <User size={16} />
          </div>
        </div>
      </header>

      {/* MAIN THREE-COLUMN LUNAR OPS DASHBOARD */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '260px 1fr 340px',
        gap: '1px',
        background: 'rgba(0, 243, 255, 0.12)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* LEFT COLUMN: SIDEBAR MENU & PIPELINE STAGES */}
        <aside style={{
          background: '#070b16',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(0, 243, 255, 0.15)'
        }}>
          <div>
            {/* MISSION HEADER BOX */}
            <div style={{
              background: 'rgba(11, 18, 36, 0.8)',
              border: '1px solid rgba(0, 243, 255, 0.25)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                MISSION LUNAR-ICE
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                Sector: South Pole-Aitken
              </span>
            </div>

            {/* PIPELINE NAVIGATION ITEMS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'acquisition', label: 'Data Acquisition', icon: Radio },
                { id: 'preprocessing', label: 'Preprocessing', icon: Sliders },
                { id: 'extraction', label: 'Feature Extraction', icon: Activity },
                { id: 'detection', label: 'AI Detection', icon: Cpu },
                { id: 'decision', label: 'Mission Decision', icon: Compass }
              ].map(item => {
                const IconComponent = item.icon;
                const isActive = activeStep === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveStep(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: isActive ? '#00f3ff' : 'transparent',
                      color: isActive ? '#040711' : '#94a3b8',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: isActive ? '800' : '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <IconComponent size={17} color={isActive ? '#040711' : '#94a3b8'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleExecuteScan}
              disabled={isExecuting}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 243, 255, 0.12)',
                border: '1px solid #00f3ff',
                color: '#00f3ff',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '1px',
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={15} />}
              {isExecuting ? 'SCANNING...' : 'EXECUTE SCAN'}
            </button>

            <button
              onClick={handleDownloadPDF}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 0'
              }}
            >
              <Download size={14} /> Export Reports
            </button>

            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 0'
              }}
            >
              <Settings size={14} /> System Status
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN: MAIN VIEWPORT & ACTIONABLE OUTPUTS */}
        <main style={{
          background: '#040711',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto'
        }}>
          {/* TOP STATUS BADGES */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 243, 255, 0.12)',
              border: '1px solid rgba(0, 243, 255, 0.35)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '800',
              color: '#00f3ff',
              fontFamily: 'JetBrains Mono'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f3ff' }} className="pulse-glow" />
              SYS_ON_LINE
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#cbd5e1',
              fontFamily: 'JetBrains Mono'
            }}>
              <MapPin size={13} color="#38bdf8" /> COORD: -89.9°S, 180.0°E
            </div>
          </div>

          {/* MAIN VIEWPORT PANEL */}
          <div style={{
            flex: 1,
            minHeight: '420px',
            background: '#070b16',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative'
          }}>
            {topTab === 'telemetry' && (
              <div>
                {activeStep === 'acquisition' || activeStep === 'preprocessing' ? (
                  <PreprocessingPanel
                    images={analysisData?.images}
                    onRunAnalysis={fetchAnalysis}
                    isAnalyzing={isExecuting}
                  />
                ) : activeStep === 'detection' ? (
                  <Moon3DViewer
                    selectedTarget={selectedTarget}
                    targetInfo={analysisData?.target}
                    iceGrid={analysisData?.ice_grid}
                  />
                ) : (
                  <LunarGPSMap analysisData={analysisData} selectedTarget={selectedTarget} />
                )}
              </div>
            )}

            {topTab === 'map' && (
              <LunarGPSMap analysisData={analysisData} selectedTarget={selectedTarget} />
            )}

            {topTab === 'analytics' && (
              <TelemetryDashboard
                metrics={analysisData?.metrics}
                landingSite={analysisData?.landing_site}
                roverPath={analysisData?.rover_path}
              />
            )}
          </div>

          {/* BOTTOM SECTION: ACTIONABLE OUTPUTS */}
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '800',
              color: '#38bdf8',
              letterSpacing: '1px',
              fontFamily: 'JetBrains Mono',
              marginBottom: '14px',
              textTransform: 'uppercase'
            }}>
              ACTIONABLE OUTPUTS
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* CARD 1: FINAL ICE PROBABILITY MAP */}
              <div style={{
                background: '#070b16',
                border: '1px solid rgba(0, 243, 255, 0.35)',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Layers size={18} color="#00f3ff" />
                  <span style={{ fontSize: '10px', fontWeight: '800', color: scanProgress === 100 ? '#00ff9d' : '#00f3ff', fontFamily: 'JetBrains Mono' }}>
                    {scanProgress === 100 ? 'COMPLETE' : 'GENERATING'}
                  </span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 12px 0' }}>
                  Final Ice Probability Map
                </h4>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${scanProgress}%`, height: '100%', background: '#00f3ff', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* CARD 2: SAFE LANDING SITE MAP */}
              <div style={{
                background: '#070b16',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Compass size={18} color="#94a3b8" />
                  <span style={{ fontSize: '10px', fontWeight: '800', color: pipelineStatus.decision === 'complete' ? '#00ff9d' : '#64748b', fontFamily: 'JetBrains Mono' }}>
                    {pipelineStatus.decision === 'complete' ? 'COMPLETE' : 'PENDING'}
                  </span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: pipelineStatus.decision === 'complete' ? '#ffffff' : '#94a3b8' }}>
                  Safe Landing Site Map
                </h4>
              </div>

              {/* CARD 3: ROVER PATH PLAN */}
              <div style={{
                background: '#070b16',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Activity size={18} color="#94a3b8" />
                  <span style={{ fontSize: '10px', fontWeight: '800', color: pipelineStatus.decision === 'complete' ? '#00ff9d' : '#64748b', fontFamily: 'JetBrains Mono' }}>
                    {pipelineStatus.decision === 'complete' ? 'COMPLETE' : 'PENDING'}
                  </span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: pipelineStatus.decision === 'complete' ? '#ffffff' : '#94a3b8' }}>
                  Rover Path Plan
                </h4>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: AUTOMATED PIPELINE STATUS */}
        <aside style={{
          background: '#070b16',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '1px solid rgba(0, 243, 255, 0.15)'
        }}>
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '800',
              color: '#38bdf8',
              letterSpacing: '1px',
              fontFamily: 'JetBrains Mono',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              AUTOMATED PIPELINE STATUS
            </h3>

            {/* TIMELINE STEPS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* STAGE 1: DATA ACQUISITION */}
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#00f3ff',
                  boxShadow: '0 0 10px #00f3ff'
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    DATA ACQUISITION
                  </h4>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#00ff9d', fontFamily: 'JetBrains Mono' }}>
                    COMPLETE
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['OPTICAL', 'RADAR', 'DEM', 'SHADOW MAP'].map(tag => (
                    <span key={tag} style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      color: '#cbd5e1'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* STAGE 2: DATA PREPROCESSING */}
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: pipelineStatus.preprocessing === 'complete' ? '#00ff9d' : '#f59e0b',
                  boxShadow: '0 0 10px #f59e0b'
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    DATA PREPROCESSING
                  </h4>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: pipelineStatus.preprocessing === 'complete' ? '#00ff9d' : '#f59e0b', fontFamily: 'JetBrains Mono' }}>
                    {pipelineStatus.preprocessing.toUpperCase()}
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
                  <li>Normalization</li>
                  <li>Data Alignment</li>
                  <li style={{ color: '#f59e0b', fontWeight: '600' }}>Radiometric Calibration</li>
                  <li>Noise Filtering</li>
                </ul>
              </div>

              {/* STAGE 3: FEATURE EXTRACTION */}
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: pipelineStatus.extraction === 'complete' ? '#00ff9d' : '#475569'
                }} />
                <h4 style={{ fontSize: '12px', fontWeight: '800', margin: '0 0 4px 0', color: pipelineStatus.extraction === 'complete' ? '#ffffff' : '#64748b' }}>
                  FEATURE EXTRACTION
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                  {pipelineStatus.extraction === 'complete' ? 'Extracted 128-PPD high CPR features.' : 'Pending prior step completion.'}
                </p>
              </div>

              {/* STAGE 4: AI DETECTION & DECISION */}
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: pipelineStatus.decision === 'complete' ? '#00ff9d' : '#475569'
                }} />
                <h4 style={{ fontSize: '12px', fontWeight: '800', margin: '0 0 4px 0', color: pipelineStatus.decision === 'complete' ? '#ffffff' : '#64748b' }}>
                  AI DETECTION & DECISION
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                  {pipelineStatus.decision === 'complete' ? 'UNet segmentation & A* traversal ready.' : 'Pending prior step completion.'}
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM EXPORT ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleDownloadPDF}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              <Download size={14} /> DOWNLOAD REPORTS (PDF)
            </button>

            <button
              onClick={handleExportCSV}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94a3b8',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={14} /> EXPORT RAW CSV
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
