import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio, Compass, Cpu, Database, Activity, Bell, Settings, HelpCircle,
  User, CheckCircle2, Loader2, ArrowRight, Download, FileText, Play, RotateCcw,
  Sparkles, ShieldCheck, MapPin, Sliders, ChevronRight, AlertTriangle, Layers, Upload,
  Eye, Grid, Shield, Check, Info, FileSpreadsheet, Menu
} from 'lucide-react';
import StarfieldBackground from '../components/StarfieldBackground';
import PreprocessingPanel from '../components/PreprocessingPanel';
import Moon3DViewer from '../components/Moon3DViewer';
import LunarGPSMap from '../components/LunarGPSMap';
import TelemetryDashboard from '../components/TelemetryDashboard';
import { API_BASE } from '../config';

export default function LandingPage({ isAuthenticated }) {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(true);
  const [pipelineStage, setPipelineStage] = useState('acquisition'); // 'acquisition', 'preprocessing', 'extraction', 'ai_detection', 'outputs'
  const [selectedTarget, setSelectedTarget] = useState('shackleton');
  const [activeLayer, setActiveLayer] = useState('radar'); // 'optical', 'radar', 'dem', 'shadow'
  const [isExecuting, setIsExecuting] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [stageStatusMessage, setStageStatusMessage] = useState('READY');
  const [analysisData, setAnalysisData] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  // Fetch real backend data
  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
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

  const [stageProcessing, setStageProcessing] = useState(false);
  const [currentTaskDetail, setCurrentTaskDetail] = useState('');

  const handleExecuteFullPipeline = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setStageProcessing(true);

    // STAGE 01: DATA ACQUISITION (0.5 SECONDS)
    setPipelineStage('acquisition');
    setScanProgress(20);
    setStageStatusMessage('[STAGE 1/5] DATA ACQUISITION IN PROGRESS...');
    setCurrentTaskDetail('Ingesting LROC Optical Albedo, DFSAR Radar CPR, LOLA DEM Topography & PSR Shadow Maps...');

    setTimeout(() => {
      // STAGE 02: DATA PREPROCESSING (0.5 SECONDS)
      setPipelineStage('preprocessing');
      setScanProgress(40);
      setStageStatusMessage('[STAGE 2/5] DATA PREPROCESSING IN PROGRESS...');
      setCurrentTaskDetail('Applying Min-Max Normalization, Geo-Registration Alignment & Radiometric Speckle Noise Filtering...');

      setTimeout(() => {
        // STAGE 03: FEATURE EXTRACTION (0.5 SECONDS)
        setPipelineStage('extraction');
        setScanProgress(60);
        setStageStatusMessage('[STAGE 3/5] FEATURE EXTRACTION IN PROGRESS...');
        setCurrentTaskDetail('Isolating High-CPR Radar Anomalies (CPR > 1.2), Slope Gradients (<15°) & PSR Thermal Boundaries...');

        setTimeout(() => {
          // STAGE 04: AI DETECTION & DECISION (0.5 SECONDS)
          setPipelineStage('ai_detection');
          setScanProgress(80);
          setStageStatusMessage('[STAGE 4/5] PYTORCH UNET AI SEGMENTATION IN PROGRESS...');
          setCurrentTaskDetail('Executing PyTorch Multi-Modal Fusion Model & Computing Touchdown Suitability Scores...');

          setTimeout(() => {
            // STAGE 05: OUTPUTS & REPORTS (0.5 SECONDS)
            setPipelineStage('outputs');
            setScanProgress(100);
            setStageStatusMessage('[STAGE 5/5] GENERATING MISSION OUTPUTS & ROVER PATH...');
            setCurrentTaskDetail('Computing Final 2D/3D Ice Probability Heatmaps, Touchdown Maps & A* Rover Traversal Vectors...');

            setTimeout(() => {
              setIsExecuting(false);
              setStageProcessing(false);
              setStageStatusMessage('PIPELINE EXECUTION COMPLETE');
              fetchAnalysis();
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleUploadCustomFile = async (file) => {
    if (!file || isExecuting) return;
    setIsExecuting(true);
    setStageProcessing(true);
    setPipelineStage('acquisition');
    setScanProgress(20);
    setStageStatusMessage('[CUSTOM DATASET] UPLOADING & INGESTING SENSOR LAYERS...');
    setCurrentTaskDetail(`Processing uploaded dataset "${file.name}"... Ingesting multi-source raster image channels...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.status === 'success') {
        setTimeout(() => {
          setPipelineStage('preprocessing');
          setScanProgress(40);
          setStageStatusMessage('[STAGE 2/5] DATA PREPROCESSING IN PROGRESS...');
          setCurrentTaskDetail('Applying Min-Max Normalization & Radiometric Speckle Noise Filtering...');

          setTimeout(() => {
            setPipelineStage('extraction');
            setScanProgress(60);
            setStageStatusMessage('[STAGE 3/5] FEATURE EXTRACTION IN PROGRESS...');
            setCurrentTaskDetail('Isolating High-CPR Radar Anomalies (CPR > 1.2) & Terrain Slope Gradients...');

            setTimeout(() => {
              setPipelineStage('ai_detection');
              setScanProgress(80);
              setStageStatusMessage('[STAGE 4/5] PYTORCH UNET AI SEGMENTATION IN PROGRESS...');
              setCurrentTaskDetail('Executing PyTorch Multi-Modal Fusion Model & Computing Touchdown Suitability Scores...');

              setTimeout(() => {
                setPipelineStage('outputs');
                setScanProgress(100);
                setStageStatusMessage('[STAGE 5/5] GENERATING MISSION OUTPUTS & ROVER PATH...');
                setCurrentTaskDetail('Computing Final 2D/3D Ice Probability Heatmaps & A* Traversal Vectors...');

                setTimeout(() => {
                  setIsExecuting(false);
                  setStageProcessing(false);
                  setStageStatusMessage('CUSTOM DATASET PIPELINE COMPLETE');
                  setAnalysisData(data);
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      } else {
        alert(`Upload error: ${data.message}`);
        setIsExecuting(false);
        setStageProcessing(false);
      }
    } catch (err) {
      console.error("Custom Dataset Upload Error:", err);
      alert("Failed to upload custom dataset file.");
      setIsExecuting(false);
      setStageProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysisData) {
      alert("Please run the analysis pipeline first to generate data for the PDF report.");
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/export/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });
      if (!resp.ok) throw new Error("Server error generating PDF");
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HImDristi_Lunar_Mission_Assessment_Report_${selectedTarget}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Error generating PDF report. Please check backend connection.");
    }
  };

  const handleExportCSV = async () => {
    if (!analysisData) {
      alert("Please run the analysis pipeline first to generate data for CSV export.");
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/export/csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });
      if (!resp.ok) throw new Error("Server error generating CSV");
      const text = await resp.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HImDristi_Rover_Telemetry_${selectedTarget}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export Error:", err);
      alert("Error exporting CSV data. Please check backend connection.");
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTarget]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: '#02040a',
      color: '#ffffff',
      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 3D STARFIELD BACKGROUND */}
      <StarfieldBackground />

      {/* TOP HEADER: LUNAR_OPS_CMD [SYS.VER 4.2.1] */}
      <header style={{
        height: '56px',
        minHeight: '56px',
        padding: '0 24px',
        background: '#050a14',
        borderBottom: '1px solid rgba(0, 243, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 30
      }}>
        {/* BRAND TITLE & TOGGLE SIDEBAR MENU */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setShowSidebar(prev => !prev)}
            title="Toggle Left Panel"
            style={{
              background: showSidebar ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showSidebar ? '1px solid #00f3ff' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: showSidebar ? '#00f3ff' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: showSidebar ? '0 0 10px rgba(0, 243, 255, 0.3)' : 'none'
            }}
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '900',
              fontFamily: "'Space Grotesk', sans-serif",
              color: '#00f3ff',
              letterSpacing: '1px',
              margin: 0
            }}>
              HimDristi
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
        </div>

        {/* CENTER CRATER SELECTOR & UPLOAD ACTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}>
            <span style={{ color: '#64748b' }}>TARGET CRATER:</span>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              style={{
                background: '#070f20',
                border: '1px solid rgba(0, 243, 255, 0.4)',
                color: '#00f3ff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="shackleton">Shackleton Crater (-89.9°S, 0.0°E)</option>
              <option value="haworth">Haworth Crater (-87.5°S, -5.0°E)</option>
              <option value="shoemaker">Shoemaker Crater (-88.1°S, 45.0°E)</option>
              <option value="faustini">Faustini Crater (-87.3°S, 87.0°E)</option>
              <option value="cabeus">Cabeus Crater (-84.9°S, -35.5°E)</option>
            </select>
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 243, 255, 0.12)',
            border: '1px solid #00f3ff',
            color: '#00f3ff',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '10px',
            fontFamily: 'JetBrains Mono',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <Upload size={13} /> UPLOAD DATASET
            <input type="file" accept="image/*,.bin,.raw,.tif" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUploadCustomFile(file);
              }
            }} style={{ display: 'none' }} />
          </label>
        </div>

        {/* RIGHT UTILITIES & AUTH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8' }}>
          <Bell size={16} style={{ cursor: 'pointer' }} />
          <Settings size={16} style={{ cursor: 'pointer' }} />
          <HelpCircle size={16} style={{ cursor: 'pointer' }} />

          <button
            onClick={() => {
              localStorage.removeItem('himdrishti_auth_token');
              navigate('/');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 243, 255, 0.12)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              padding: '5px 12px',
              borderRadius: '6px',
              color: '#00f3ff',
              fontSize: '10px',
              fontWeight: '800',
              fontFamily: 'JetBrains Mono',
              cursor: 'pointer'
            }}
          >
            <User size={13} />
            LOG OUT
          </button>
        </div>
      </header>

      {/* PIPELINE FLOWCHART STEP BAR */}
      <div style={{
        height: '42px',
        minHeight: '42px',
        background: '#040814',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'acquisition', num: '01', name: 'DATA ACQUISITION', sub: 'OPTICAL • RADAR • DEM • SHADOW' },
            { id: 'preprocessing', num: '02', name: 'DATA PREPROCESSING', sub: 'NORM • ALIGN • CALIBRATE • FILTER' },
            { id: 'extraction', num: '03', name: 'FEATURE EXTRACTION', sub: 'HIGH CPR • SLOPE • PSR COLD TRAPS' },
            { id: 'ai_detection', num: '04', name: 'AI DETECTION & DECISION', sub: 'PYTORCH UNET • MULTI-CRITERIA RANK' },
            { id: 'outputs', num: '05', name: 'ROVER PATH PLANNING', sub: 'ICE MAP • LANDING • 3D • ROVER PATH' }
          ].map((stage, idx) => {
            const isActive = pipelineStage === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setPipelineStage(stage.id)}
                  style={{
                    background: isActive ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                    border: isActive ? '1px solid #00f3ff' : '1px solid transparent',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '900',
                    color: isActive ? '#00f3ff' : '#475569',
                    background: isActive ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {stage.num}
                  </span>
                  <span style={{ fontWeight: '800', letterSpacing: '0.5px' }}>{stage.name}</span>
                </button>

                {idx < 4 && <ChevronRight size={14} color="#334155" />}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isExecuting && (
            <span style={{
              fontSize: '10px',
              fontFamily: 'JetBrains Mono',
              color: '#00f3ff',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
              {stageStatusMessage}
            </span>
          )}

          <button
            onClick={handleExecuteFullPipeline}
            disabled={isExecuting}
            style={{
              background: isExecuting ? 'rgba(0, 243, 255, 0.2)' : '#00f3ff',
              color: isExecuting ? '#00f3ff' : '#02040a',
              border: isExecuting ? '1px solid #00f3ff' : 'none',
              padding: '6px 18px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '900',
              fontFamily: 'JetBrains Mono',
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
          >
            {isExecuting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            {isExecuting ? `EXECUTING (${scanProgress}%)` : 'EXECUTE PIPELINE'}
          </button>
        </div>
      </div>

      {/* GLOWING PROGRESS BAR WHEN EXECUTING PIPELINE */}
      {isExecuting && (
        <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 25 }}>
          <div style={{
            height: '100%',
            width: `${scanProgress}%`,
            background: 'linear-gradient(90deg, #00f3ff, #00ff9d)',
            boxShadow: '0 0 10px #00f3ff',
            transition: 'width 0.4s ease-in-out'
          }} />
        </div>
      )}

      {/* MAIN 3-COLUMN WORKSPACE */}
      <div style={{
        height: 'calc(100vh - 98px)',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: showSidebar ? '260px 1fr 340px' : '1fr 340px',
        gap: '2px',
        background: 'rgba(0, 243, 255, 0.15)',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        transition: 'grid-template-columns 0.3s ease'
      }}>
        {/* LEFT COLUMN: MULTI-SOURCE SENSOR INGESTION & STAGE CONFIG */}
        {showSidebar && (
          <aside style={{
            background: '#040814',
            padding: '16px',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(0, 243, 255, 0.2)'
          }}>
            <div>
              {/* STAGE STATUS */}
              <div style={{
                background: 'rgba(8, 14, 28, 0.9)',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', fontFamily: 'JetBrains Mono', marginBottom: '4px' }}>
                  ACTIVE FLOWCHART STAGE
                </div>
                <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#00f3ff', margin: 0, textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>
                  {pipelineStage.replace('_', ' ')}
                </h2>
              </div>

              {/* MULTI-SOURCE DATA LAYERS */}
              <h3 style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px', fontFamily: 'JetBrains Mono', marginBottom: '10px', textTransform: 'uppercase' }}>
                COMPREHENSIVE SENSOR LAYERS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'optical', name: 'OPTICAL IMAGE', desc: 'LROC Narrow Angle Camera (0.5m Albedo)', icon: Eye },
                  { id: 'radar', name: 'RADAR IMAGE', desc: 'ISRO DFSAR & Mini-RF CPR (128-PPD)', icon: Radio },
                  { id: 'dem', name: 'DEM (TERRAIN)', desc: 'LOLA Elevation & Surface Roughness', icon: Layers },
                  { id: 'shadow', name: 'SHADOW MAP', desc: 'Permanently Shadowed Region (PSR <100K)', icon: Database }
                ].map(layer => {
                  const LayerIcon = layer.icon;
                  const isSel = activeLayer === layer.id;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: isSel ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSel ? '1px solid #00f3ff' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        color: isSel ? '#00f3ff' : '#94a3b8',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <LayerIcon size={14} color={isSel ? '#00f3ff' : '#64748b'} />
                        <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono' }}>{layer.name}</span>
                      </div>
                      <span style={{ fontSize: '9px', color: isSel ? '#38bdf8' : '#475569', fontFamily: 'JetBrains Mono', display: 'block', paddingLeft: '22px' }}>
                        {layer.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* CENTER COLUMN: MAIN VIEWPORT (SWITCHES WITH FLOWCHART STAGE) */}
        <main style={{
          background: '#02040a',
          padding: '16px',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* HIGH-TECH 5-SECOND STAGE PROCESSING LOADER CARD */}
          {stageProcessing && (
            <div style={{
              flex: 1,
              background: '#050a14',
              border: '1px solid #00f3ff',
              borderRadius: '10px',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              boxShadow: '0 0 40px rgba(0, 243, 255, 0.2)',
              position: 'relative'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '3px solid rgba(0, 243, 255, 0.2)',
                borderTop: '3px solid #00f3ff',
                animation: 'spin 1s linear infinite'
              }} />

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#00f3ff', fontFamily: 'Space Grotesk', margin: '0 0 8px 0', letterSpacing: '1px' }}>
                  {stageStatusMessage}
                </h3>
                <p style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'JetBrains Mono', margin: 0, maxWidth: '540px', lineHeight: '1.6' }}>
                  {currentTaskDetail}
                </p>
              </div>

              {/* STAGE EXECUTION COUNTDOWN COUNTER */}
              <div style={{
                background: 'rgba(0, 243, 255, 0.08)',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                color: '#00ff9d',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Loader2 size={14} className="animate-spin" />
                PROCESSING STAGE TASK • 0.5 SECONDS PER STEP ({scanProgress}%)
              </div>
            </div>
          )}
          {/* STAGE VIEWPORTS (RENDERED WHEN NOT PROCESSING) */}
          {!stageProcessing && (
            <>
              {/* STAGE 01: DATA ACQUISITION VIEWPORT */}
              {pipelineStage === 'acquisition' && (
                <div style={{ flex: 1, background: '#050a14', border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', color: '#00f3ff', margin: 0, fontFamily: 'Space Grotesk' }}>
                      DATA ACQUISITION — Multi-Source Sensor Ingestion
                    </h3>
                    <span className="neon-badge badge-cyan">4 SENSOR CHANNELS READY</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { title: 'OPTICAL IMAGE (LROC)', key: 'optical', type: 'Albedo Imagery (0.5m/px)' },
                      { title: 'RADAR IMAGE (DFSAR CPR)', key: 'radar', type: 'Circular Polarization Ratio (>1.0)' },
                      { title: 'DEM (TERRAIN ELEVATION)', key: 'dem', type: 'LOLA Topographic Relief Map' },
                      { title: 'SHADOW MAP (PSR)', key: 'shadow', type: 'Thermal Cold Trap (<100K)' }
                    ].map(item => {
                      const imgUrl = analysisData?.images?.preprocessed?.[item.key] || analysisData?.images?.raw?.[item.key];
                      return (
                        <div key={item.key} style={{
                          background: '#070f20',
                          border: activeLayer === item.key ? '2px solid #00f3ff' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '14px',
                          cursor: imgUrl ? 'zoom-in' : 'pointer'
                        }} onClick={() => {
                          setActiveLayer(item.key);
                          if (imgUrl) {
                            setExpandedImage({ src: imgUrl, title: `${item.title} (FULL VIEW)`, subtitle: item.type });
                          }
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                            <strong style={{ color: activeLayer === item.key ? '#00f3ff' : '#ffffff' }}>{item.title}</strong>
                            <span style={{ color: '#00ff9d' }}>CLICK TO EXPAND</span>
                          </div>
                          <div style={{ height: '160px', borderRadius: '6px', overflow: 'hidden', background: '#020408', border: '1px solid rgba(0,243,255,0.2)' }}>
                            {imgUrl ? (
                              <img src={imgUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '11px' }}>
                                Loading Multi-Modal Ingestion Channel...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STAGE 02: DATA PREPROCESSING VIEWPORT */}
              {pipelineStage === 'preprocessing' && (
                <PreprocessingPanel
                  images={analysisData?.images}
                  onRunAnalysis={fetchAnalysis}
                  onUploadCustomFile={handleUploadCustomFile}
                  isAnalyzing={isExecuting}
                  onExpandImage={setExpandedImage}
                />
              )}

              {/* STAGE 03: FEATURE EXTRACTION VIEWPORT */}
              {pipelineStage === 'extraction' && (
                <div style={{ flex: 1, background: '#050a14', border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: 0, fontFamily: 'Space Grotesk' }}>
                      FEATURE EXTRACTION — High-CPR Anomaly & Slope Extraction
                    </h3>
                    <span className="neon-badge badge-blue">EXTRACTED 128-PPD FEATURES</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div
                      onClick={() => analysisData?.images?.results?.ice_confidence && setExpandedImage({ src: analysisData.images.results.ice_confidence, title: 'RADAR CPR ANOMALY OVERLAY', subtitle: 'CPR > 1.2 High-Polarization Subsurface Volatile Anomalies' })}
                      style={{ background: '#070f20', border: '1px solid rgba(0, 243, 255, 0.25)', borderRadius: '8px', padding: '14px', cursor: analysisData?.images?.results?.ice_confidence ? 'zoom-in' : 'default' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '12px', color: '#00f3ff', fontFamily: 'JetBrains Mono', margin: 0 }}>
                          Radar CPR Anomaly Overlay (CPR {'> 1.2'})
                        </h4>
                        <span className="neon-badge badge-cyan" style={{ fontSize: '9px' }}>CLICK TO EXPAND</span>
                      </div>
                      <div style={{ height: '240px', background: '#020408', borderRadius: '6px', overflow: 'hidden' }}>
                        {analysisData?.images?.results?.ice_confidence && (
                          <img src={analysisData.images.results.ice_confidence} alt="CPR Anomaly" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        )}
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        const slopeImg = analysisData?.images?.results?.slope_map || analysisData?.images?.results?.landing_suitability || analysisData?.images?.preprocessed?.dem;
                        if (slopeImg) {
                          setExpandedImage({ src: slopeImg, title: 'TERRAIN SLOPE HAZARD BOUNDARY', subtitle: '<15° Slope Inclination Landing Suitability Grid' });
                        }
                      }}
                      style={{ background: '#070f20', border: '1px solid rgba(0, 243, 255, 0.25)', borderRadius: '8px', padding: '14px', cursor: 'zoom-in' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'JetBrains Mono', margin: 0 }}>
                          Terrain Slope Hazard Boundary ({'<15°'})
                        </h4>
                        <span className="neon-badge badge-blue" style={{ fontSize: '9px' }}>CLICK TO EXPAND</span>
                      </div>
                      <div style={{ height: '240px', background: '#020408', borderRadius: '6px', overflow: 'hidden' }}>
                        {(analysisData?.images?.results?.slope_map || analysisData?.images?.results?.landing_suitability || analysisData?.images?.preprocessed?.dem) && (
                          <img
                            src={analysisData?.images?.results?.slope_map || analysisData?.images?.results?.landing_suitability || analysisData?.images?.preprocessed?.dem}
                            alt="Slope Hazard Boundary"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 04: AI DETECTION & DECISION VIEWPORT (3D MOON ROTATION & HEATMAP) */}
              {pipelineStage === 'ai_detection' && (
                <Moon3DViewer
                  selectedTarget={selectedTarget}
                  targetInfo={analysisData?.target}
                  iceGrid={analysisData?.ice_grid}
                  analysisData={analysisData}
                  onExpandImage={setExpandedImage}
                />
              )}

              {/* STAGE 05: OUTPUTS & REPORTS VIEWPORT (GPS & ROVER TRAVERSAL VECTORS) */}
              {pipelineStage === 'outputs' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ flex: 1, background: '#050a14', border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: '8px', padding: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', fontFamily: 'JetBrains Mono', margin: '0 0 14px 0', textTransform: 'uppercase' }}>
                      TACTICAL LUNAR GPS & A* ROVER PATH VECTORS
                    </h3>
                    <LunarGPSMap analysisData={analysisData} selectedTarget={selectedTarget} />
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* RIGHT COLUMN: ACTIONABLE FLOWCHART OUTPUT CARDS & REPORTS */}
        <aside style={{
          background: '#040814',
          padding: '16px',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '1px solid rgba(0, 243, 255, 0.2)'
        }}>
          {/* FLOWCHART OUTPUT CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px', fontFamily: 'JetBrains Mono', marginBottom: '4px', textTransform: 'uppercase' }}>
              ACTIONABLE MISSION OUTPUTS
            </h3>

            {/* OUTPUT 1: FINAL ICE PROBABILITY MAP */}
            <div
              onClick={() => setPipelineStage('outputs')}
              style={{
                background: '#070f20',
                border: '1px solid rgba(0, 243, 255, 0.35)',
                borderRadius: '6px',
                padding: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>
                <span style={{ color: '#38bdf8' }}>OUTPUT 01</span>
                <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>GENERATED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Layers size={18} color="#00f3ff" />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                  FINAL ICE PROBABILITY MAP
                </span>
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                2D & 3D PyTorch UNet Confidence Matrix
              </div>
            </div>

            {/* OUTPUT 2: SAFE LANDING SITE MAP */}
            <div
              onClick={() => setPipelineStage('outputs')}
              style={{
                background: '#070f20',
                border: '1px solid rgba(0, 243, 255, 0.25)',
                borderRadius: '6px',
                padding: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>
                <span style={{ color: '#38bdf8' }}>OUTPUT 02</span>
                <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>OPTIMAL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Compass size={18} color="#00f3ff" />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                  SAFE LANDING SITE MAP
                </span>
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                Multi-criteria slope {'<15°'} Touchdown Zones
              </div>
            </div>

            {/* OUTPUT 3: 3D TERRAIN VISUALIZATION */}
            <div
              onClick={() => setPipelineStage('ai_detection')}
              style={{
                background: '#070f20',
                border: '1px solid rgba(0, 243, 255, 0.25)',
                borderRadius: '6px',
                padding: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>
                <span style={{ color: '#38bdf8' }}>OUTPUT 03</span>
                <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>3D RENDER</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Activity size={18} color="#00f3ff" />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                  3D TERRAIN VISUALIZATION
                </span>
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                Rotating 3D Surface Globe & Solar Shadows
              </div>
            </div>

            {/* OUTPUT 4: ROVER PATH PLAN */}
            <div
              onClick={() => setPipelineStage('outputs')}
              style={{
                background: '#070f20',
                border: '1px solid rgba(0, 243, 255, 0.25)',
                borderRadius: '6px',
                padding: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>
                <span style={{ color: '#38bdf8' }}>OUTPUT 04</span>
                <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>A* COMPUTED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Compass size={18} color="#00ff9d" />
                <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                  ROVER PATH PLAN
                </span>
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                Safe traversal vectors avoiding hazard craters
              </div>
            </div>
          </div>

          {/* DOWNLOAD REPORTS & EXPORT SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <h4 style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8', fontFamily: 'JetBrains Mono', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
              DOWNLOAD REPORTS
            </h4>

            <button
              onClick={handleDownloadPDF}
              style={{
                width: '100%',
                padding: '12px',
                background: '#00f3ff',
                color: '#02040a',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
              }}
            >
              <Download size={14} /> DOWNLOAD REPORT (PDF)
            </button>

            <button
              onClick={handleExportCSV}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
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
                textTransform: 'uppercase'
              }}
            >
              <FileSpreadsheet size={14} /> EXPORT RAW DATA (CSV)
            </button>
          </div>
        </aside>
      </div>

      {/* FULL IMAGE MODAL LIGHTBOX */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(2, 4, 10, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '92vh',
              background: '#070d1a',
              border: '1px solid rgba(0, 243, 255, 0.5)',
              borderRadius: '12px',
              boxShadow: '0 0 40px rgba(0, 243, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
              background: 'rgba(11, 22, 40, 0.9)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#00f3ff', fontFamily: 'Space Grotesk', fontWeight: 'bold' }}>
                  {expandedImage.title || 'FULL RESOLUTION SENSOR IMAGE'}
                </h3>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>
                  {expandedImage.subtitle || 'Uncropped Multi-Modal Spatial Channel (512x512 High-Definition View)'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a
                  href={expandedImage.src}
                  download={`${expandedImage.title || 'lunar_image'}.png`}
                  className="glass-button"
                  style={{ fontSize: '11px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#00f3ff' }}
                >
                  <Download size={13} /> Download Image
                </a>
                <button
                  onClick={() => setExpandedImage(null)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Full Image Display Container */}
            <div style={{
              flex: 1,
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              background: '#020408',
              overflow: 'auto'
            }}>
              <img
                src={expandedImage.src}
                alt={expandedImage.title || 'Full View'}
                style={{
                  maxWidth: '85vw',
                  maxHeight: '78vh',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  boxShadow: '0 0 24px rgba(0,0,0,0.9)'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
