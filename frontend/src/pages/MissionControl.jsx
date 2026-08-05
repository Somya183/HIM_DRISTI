import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio, Compass, Cpu, Database, Activity, Bell, Settings, HelpCircle,
  User, CheckCircle2, Loader2, ArrowRight, Download, FileText, Play, RotateCcw,
  Sparkles, ShieldCheck, MapPin, Sliders, ChevronRight, Terminal, AlertTriangle,
  HardDrive, CpuIcon, Signal
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
    acquisition: 'active',
    preprocessing: 'awaiting', // 'awaiting', 'processing', 'complete'
    extraction: 'idle',
    detection: 'standby',
    decision: 'locked'
  });

  const [scanProgress, setScanProgress] = useState(45);
  const [isExecuting, setIsExecuting] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Live Telemetry Terminal Stream Logs
  const [logs, setLogs] = useState([
    { time: '00:45:12.10', text: 'INITIATING SENSOR SWEEP... OK', type: 'info' },
    { time: '00:45:12.45', text: 'CALIBRATING THERMAL IMAGER... OK', type: 'info' },
    { time: '00:45:13.02', text: 'RECEIVING SAR DATA PACKET 1682...', type: 'info' },
    { time: '00:45:13.50', text: 'WRN: ANOMALOUS ALBEDO READING SEC_7A', type: 'warn' },
    { time: '00:45:14.11', text: 'COMPENSATING FOR SIGNAL NOISE... OK', type: 'info' },
    { time: '00:45:14.89', text: 'ACQUIRING NEUTRON SPECTROMETER DATA...', type: 'info' },
    { time: '00:45:15.20', text: 'POSITIVE HYDROGEN SIGNATURE DETECTED', type: 'success' }
  ]);

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

  const handleInitScanSeq = () => {
    if (isExecuting) return;
    setIsExecuting(true);

    const addLog = (text, type = 'info') => {
      const now = new Date();
      const timeStr = `00:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0').slice(0, 2)}`;
      setLogs(prev => [...prev.slice(-12), { time: timeStr, text, type }]);
    };

    addLog('INITIATING TACTICAL LUNAR SCAN SEQUENCE...', 'info');

    // Step 1: Preprocessing
    setPipelineStatus({
      acquisition: 'complete',
      preprocessing: 'processing',
      extraction: 'idle',
      detection: 'standby',
      decision: 'locked'
    });
    setScanProgress(30);

    setTimeout(() => {
      addLog('RADIOMETRIC CALIBRATION & NOISE FILTERING COMPLETE', 'info');
      // Step 2: Feature Extraction
      setPipelineStatus(prev => ({ ...prev, preprocessing: 'complete', extraction: 'processing' }));
      setScanProgress(60);

      setTimeout(() => {
        addLog('ISRO DFSAR HIGH-CPR ANOMALY DETECTED IN PSR', 'warn');
        addLog('EXECUTING PYTORCH UNET TENSOR SEGMENTATION...', 'info');
        // Step 3: AI Detection
        setPipelineStatus(prev => ({ ...prev, extraction: 'complete', detection: 'processing' }));
        setScanProgress(90);

        setTimeout(() => {
          addLog('HIGH ICE PROBABILITY CONFIRMED: 94.2%', 'success');
          addLog('SAFE LANDING SITE & ROVER PATH GENERATED', 'success');
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
    alert("Downloading LUNAR_OPS_CMD Mission Intelligence Report (PDF)...");
  };

  const handleExportCSV = () => {
    alert("Exporting Raw DFSAR Radar Telemetry & Ice Matrix Data (CSV)...");
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTarget]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#02040a',
      color: '#ffffff',
      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 3D STARFIELD BACKGROUND */}
      <StarfieldBackground />

      {/* TOP HEADER: LUNAR_OPS_CMD [SYS.VER 4.2.1] */}
      <header style={{
        height: '56px',
        padding: '0 24px',
        background: '#050a14',
        borderBottom: '1px solid rgba(0, 243, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 30
      }}>
        {/* BRAND & VERSION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '900',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#00f3ff',
            letterSpacing: '1.5px',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            LUNAR_OPS_CMD
          </h1>
          <span style={{
            fontSize: '10px',
            fontWeight: '800',
            color: '#64748b',
            letterSpacing: '1px',
            fontFamily: 'JetBrains Mono'
          }}>
            [SYS.VER 4.2.1]
          </span>
        </div>

        {/* CENTER TABS: TELEMETRY | MAP_VIEW | ANALYTICS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '100%' }}>
          {[
            { id: 'telemetry', label: 'TELEMETRY' },
            { id: 'map', label: 'Map_View' },
            { id: 'analytics', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTopTab(tab.id)}
              style={{
                height: '100%',
                padding: '0 28px',
                background: topTab === tab.id ? 'rgba(0, 243, 255, 0.08)' : 'transparent',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                borderBottom: topTab === tab.id ? '2px solid #00f3ff' : '1px solid rgba(0, 243, 255, 0.2)',
                color: topTab === tab.id ? '#ffffff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '1px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* RIGHT SYSTEM UTILITIES & USER PROFILE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8' }}>
          <Bell size={16} style={{ cursor: 'pointer' }} />
          <Settings size={16} style={{ cursor: 'pointer' }} />
          <HelpCircle size={16} style={{ cursor: 'pointer' }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            fontFamily: 'JetBrains Mono'
          }}>
            <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>CMD_AUTH_OK</span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#00f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#02040a'
            }}>
              <User size={14} />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LUNAR_OPS GRID DASHBOARD */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '260px 1fr 320px',
        gap: '2px',
        background: 'rgba(0, 243, 255, 0.15)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* LEFT COLUMN: MISSION FEED & PIPELINE STAGES */}
        <aside style={{
          background: '#040814',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(0, 243, 255, 0.2)'
        }}>
          <div>
            {/* LIVE FEED STATUS BAR */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '9px',
              fontWeight: '800',
              color: '#64748b',
              fontFamily: 'JetBrains Mono',
              marginBottom: '12px'
            }}>
              <span>LIVE FEED // SECURE</span>
              <span style={{ color: '#00f3ff' }}>T-MINUS 00:45:12</span>
            </div>

            {/* OP: LUNAR-ICE MISSION CARD */}
            <div style={{
              background: 'rgba(8, 14, 28, 0.9)',
              border: '1px solid rgba(0, 243, 255, 0.3)',
              padding: '14px',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>
                OP: LUNAR-ICE
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>SECTOR:</span>
                  <span style={{ color: '#cbd5e1' }}>SPA_BASIN_S</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>TARGET:</span>
                  <span style={{ color: '#38bdf8' }}>H2O_DEPOSIT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>STATUS:</span>
                  <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>NOMINAL</span>
                </div>
              </div>
            </div>

            {/* PIPELINE NAVIGATION STAGES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'acquisition', label: 'DATA_ACQ_PHASE', sub: 'OPTICAL // SAR // THERMAL [ACTV]', icon: Radio },
                { id: 'preprocessing', label: 'SIG_PREPROC', sub: pipelineStatus.preprocessing === 'complete' ? 'COMPLETE' : 'AWAITING_DATA_STREAM', icon: Sliders },
                { id: 'extraction', label: 'FEAT_EXTRACT', sub: pipelineStatus.extraction === 'complete' ? 'COMPLETE' : 'IDLE', icon: Activity },
                { id: 'detection', label: 'NEURAL_NET_EVAL', sub: pipelineStatus.detection === 'complete' ? 'COMPLETE' : 'MODEL_V4.2_STANDBY', icon: Cpu },
                { id: 'decision', label: 'EXEC_DECISION', sub: pipelineStatus.decision === 'complete' ? 'COMPLETE' : 'LOCKED', icon: Compass }
              ].map(stage => {
                const IconComp = stage.icon;
                const isActive = activeStep === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStep(stage.id)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: isActive ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isActive ? '1px solid #00f3ff' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      color: isActive ? '#00f3ff' : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <IconComp size={14} color={isActive ? '#00f3ff' : '#64748b'} />
                      <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px' }}>
                        {stage.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '9px', color: isActive ? '#38bdf8' : '#475569', fontFamily: 'JetBrains Mono', display: 'block', paddingLeft: '22px' }}>
                      {stage.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM LEFT ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleInitScanSeq}
              disabled={isExecuting}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 243, 255, 0.15)',
                border: '1px solid #00f3ff',
                color: '#00f3ff',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '900',
                letterSpacing: '1.5px',
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {isExecuting ? <Loader2 size={15} className="animate-spin" /> : <Play size={14} />}
              {isExecuting ? 'SCANNING...' : '► INIT_SCAN_SEQ'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer'
              }}>
                📜 LOGS
              </button>
              <button style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer'
              }}>
                ⚙️ SYS
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: MAIN RADAR VIEWPORT & LIVE TERMINAL STREAM */}
        <main style={{
          background: '#02040a',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto'
        }}>
          {/* MAIN RADAR HUD CONTAINER */}
          <div style={{
            flex: 1,
            minHeight: '440px',
            background: '#050a14',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* RADAR HEADER BAR */}
            <div style={{
              padding: '10px 16px',
              background: 'rgba(0, 243, 255, 0.05)',
              borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontFamily: 'JetBrains Mono',
              color: '#38bdf8'
            }}>
              <span>☒ TOPOGRAPHIC_RADAR_MAP_v2.0</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>SCALE: 1:1000</span>
                <span>MODE: TACTICAL</span>
              </div>
            </div>

            {/* RADAR GRID & VIEWPORT */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05) 0%, transparent 70%)'
            }}>
              {/* TARGET COORDINATES OVERLAY BOX */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(4, 8, 20, 0.85)',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono',
                color: '#00f3ff',
                zIndex: 10
              }}>
                <div>LAT: -89.9°S</div>
                <div>LON: 180.0°E</div>
                <div>ALT: 2.4KM</div>
              </div>

              {/* RENDER VIEWPORT DEPENDING ON TOP TAB */}
              {topTab === 'telemetry' ? (
                activeStep === 'detection' ? (
                  <Moon3DViewer selectedTarget={selectedTarget} targetInfo={analysisData?.target} iceGrid={analysisData?.ice_grid} />
                ) : (
                  <PreprocessingPanel images={analysisData?.images} onRunAnalysis={fetchAnalysis} isAnalyzing={isExecuting} />
                )
              ) : topTab === 'map' ? (
                <LunarGPSMap analysisData={analysisData} selectedTarget={selectedTarget} />
              ) : (
                <TelemetryDashboard metrics={analysisData?.metrics} landingSite={analysisData?.landing_site} roverPath={analysisData?.rover_path} />
              )}

              {/* HAZARD DETECTED WARNING BADGE */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                color: '#f59e0b',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 10
              }}>
                <AlertTriangle size={13} /> HAZARD_DETECTED | CONFIDENCE: 87%
              </div>
            </div>
          </div>

          {/* BOTTOM TERMINAL LOG CONSOLE (`LIVE_TELEMETRY_STREAM`) */}
          <div style={{
            height: '140px',
            background: '#050a14',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontFamily: 'JetBrains Mono',
              color: '#38bdf8',
              marginBottom: '8px',
              borderBottom: '1px solid rgba(0, 243, 255, 0.15)',
              paddingBottom: '6px'
            }}>
              <span style={{ fontWeight: 'bold' }}>LIVE_TELEMETRY_STREAM</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: 'rgba(0,243,255,0.1)', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}>RAW_DATA</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}>FILTERED</span>
              </div>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: 'JetBrains Mono',
              fontSize: '10px',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{
                  color: log.type === 'warn' ? '#f59e0b' : log.type === 'success' ? '#00ff9d' : '#94a3b8'
                }}>
                  <span style={{ color: '#475569', marginRight: '8px' }}>[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: OUTPUT CARDS & PIPELINE DIAGNOSTICS */}
        <aside style={{
          background: '#040814',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '1px solid rgba(0, 243, 255, 0.2)'
        }}>
          {/* TOP THREE ACTIONABLE CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* CARD 1: MAP_GEN */}
            <div style={{
              background: '#070f20',
              border: '1px solid rgba(0, 243, 255, 0.35)',
              borderRadius: '6px',
              padding: '14px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                <span style={{ color: '#38bdf8' }}>MAP_GEN</span>
                <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>
                  {scanProgress === 100 ? 'COMPLETE' : 'PROCESSING'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Layers size={18} color="#00f3ff" />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                  ICE_PROBABILITY_MATRIX_V3
                </span>
              </div>

              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#00f3ff', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* CARD 2: SITE_EVAL */}
            <div style={{
              background: '#070f20',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '14px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>SITE_EVAL</span>
                <span style={{ color: pipelineStatus.decision === 'complete' ? '#00ff9d' : '#64748b', fontWeight: 'bold' }}>
                  {pipelineStatus.decision === 'complete' ? 'COMPLETE' : 'QUEUED'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={18} color={pipelineStatus.decision === 'complete' ? '#00f3ff' : '#64748b'} />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: pipelineStatus.decision === 'complete' ? '#ffffff' : '#64748b' }}>
                  SAFE_LANDING_ZONES
                </span>
              </div>
            </div>

            {/* CARD 3: PATH_CALC */}
            <div style={{
              background: '#070f20',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '14px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>PATH_CALC</span>
                <span style={{ color: pipelineStatus.decision === 'complete' ? '#00ff9d' : '#64748b', fontWeight: 'bold' }}>
                  {pipelineStatus.decision === 'complete' ? 'COMPLETE' : 'LOCKED'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={18} color={pipelineStatus.decision === 'complete' ? '#00f3ff' : '#64748b'} />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: pipelineStatus.decision === 'complete' ? '#ffffff' : '#64748b' }}>
                  ROVER_TRAVERSAL_VECTORS
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM PIPELINE DIAGNOSTICS PANEL */}
          <div style={{
            background: '#070f20',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            borderRadius: '6px',
            padding: '14px'
          }}>
            <h4 style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8', fontFamily: 'JetBrains Mono', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              PIPELINE_DIAGNOSTICS
            </h4>

            {/* RESOURCE BARS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '10px', fontFamily: 'JetBrains Mono', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>CPU_LOAD</span>
                  <span style={{ color: '#00f3ff' }}>78%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '78%', height: '100%', background: '#00f3ff' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>MEM_USE</span>
                  <span style={{ color: '#38bdf8' }}>62%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '62%', height: '100%', background: '#38bdf8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>UPLINK</span>
                  <span style={{ color: '#00ff9d' }}>95%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '95%', height: '100%', background: '#00ff9d' }} />
                </div>
              </div>
            </div>

            {/* SUB METRICS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '9px', fontFamily: 'JetBrains Mono', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', display: 'block' }}>NET_LATENCY</span>
                <strong style={{ color: '#ffffff' }}>1.24s</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', display: 'block' }}>DATA_RATE</span>
                <strong style={{ color: '#ffffff' }}>14.2 MB/s</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: '#64748b', display: 'block' }}>ERR_RATE</span>
                <strong style={{ color: '#00ff9d' }}>0.001%</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
