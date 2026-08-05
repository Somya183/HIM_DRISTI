import React, { useState } from 'react';
import { Sliders, RefreshCw, Upload, Eye, CheckCircle2 } from 'lucide-react';

export default function PreprocessingPanel({ images, onRunAnalysis, onUploadCustomFile, isAnalyzing }) {
  const [activeTab, setActiveTab] = useState('optical');
  const [denoiseLevel, setDenoiseLevel] = useState(5);
  const [contrastClip, setContrastClip] = useState(3.0);
  const [shadowThreshold, setShadowThreshold] = useState(50);
  const [isUploaded, setIsUploaded] = useState(false);

  const tabs = [
    { id: 'optical', name: 'Optical Satellite Photo (LROC Albedo)', desc: 'Bicubic Resize & CLAHE Contrast Enhancement' },
    { id: 'radar', name: 'Radar (DFSAR CPR)', desc: 'Noise Removal & Min-Max Normalization' },
    { id: 'dem', name: 'DEM (Terrain Elevation)', desc: 'Elevation Min-Max Scaling & Outlier Removal' },
    { id: 'shadow', name: 'Shadow Map (PSR)', desc: 'Strict Binary Thresholding & Morphological Cleanup' }
  ];

  const rawPhoto = images?.raw?.optical || images?.raw?.radar || '';
  const prepImg = images?.preprocessed?.[activeTab] || '';

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploaded(true);
      if (onUploadCustomFile) {
        onUploadCustomFile(file);
      } else {
        onRunAnalysis();
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      {/* Header with Title & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: '700', fontFamily: 'Space Grotesk' }}>
          <Sliders size={18} /> Multi-Modal Data Preprocessing Engine
        </h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label className="glass-button" style={{ fontSize: '11px', padding: '6px 14px', cursor: 'pointer' }}>
            <Upload size={14} color="#00f3ff" /> Upload Custom Dataset
            <input type="file" accept="image/*" onChange={handleCustomUpload} style={{ display: 'none' }} />
          </label>

          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="glass-button glass-button-primary"
            style={{ fontSize: '11px', padding: '6px 16px', opacity: isAnalyzing ? 0.7 : 1 }}
          >
            <RefreshCw size={14} className={isAnalyzing ? 'spin' : ''} color="#030712" />
            {isAnalyzing ? 'Processing Pipeline...' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', paddingBottom: '10px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(0, 243, 255, 0.15)' : 'rgba(15, 23, 42, 0.4)',
              border: activeTab === tab.id ? '1px solid #00f3ff' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === tab.id ? '#00f3ff' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 0 15px rgba(0, 243, 255, 0.25)' : 'none'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Side by Side Image Comparison Display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* RAW INPUT */}
        <div style={{ background: '#030712', borderRadius: '12px', padding: '14px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} /> RAW UNFILTERED SATELLITE TENSOR
            </span>
            <span className="neon-badge badge-warning" style={{ fontSize: '10px' }}>RAW SATELLITE PHOTO</span>
          </div>
          <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {rawPhoto ? (
              <img src={rawPhoto} alt="Raw Unchanged Satellite Photo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '12px', color: '#64748b' }}>Loading Raw Satellite Photo...</span>
            )}
          </div>
        </div>

        {/* PREPROCESSED OUTPUT */}
        <div style={{ background: '#030712', borderRadius: '12px', padding: '14px', border: '1px solid rgba(0, 243, 255, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> PREPROCESSED CLEANED SENSOR OUTPUT
            </span>
            <span className="neon-badge badge-cyan" style={{ fontSize: '10px' }}>
              {isAnalyzing ? 'PREPROCESSING...' : 'PREPROCESSED'}
            </span>
          </div>
          <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', background: '#000', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {isAnalyzing ? (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'rgba(7, 10, 18, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                borderRadius: '8px'
              }}>
                <RefreshCw size={34} color="#00f3ff" className="spin" style={{ marginBottom: '14px', filter: 'drop-shadow(0 0 12px rgba(0, 243, 255, 0.6))' }} />

                <h4 style={{ color: '#00f3ff', fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>
                  Preprocessing in Progress...
                </h4>

                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, maxWidth: '300px', lineHeight: '1.5' }}>
                  Processing speckle denoise, CLAHE contrast scaling, and PSR thresholding...
                </p>
              </div>
            ) : prepImg ? (
              <img src={prepImg} alt="Preprocessed Output" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '12px', color: '#64748b' }}>Running Preprocessing...</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Parameters */}
      <div style={{ background: 'rgba(3, 7, 18, 0.8)', padding: '14px 18px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Radar Speckle Denoise: <strong style={{ color: '#00f3ff' }}>{denoiseLevel}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={denoiseLevel}
            onChange={(e) => setDenoiseLevel(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Optical CLAHE Clip: <strong style={{ color: '#00f3ff' }}>{contrastClip.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.5"
            value={contrastClip}
            onChange={(e) => setContrastClip(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Shadow Mask Threshold: <strong style={{ color: '#00f3ff' }}>{shadowThreshold}%</strong>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={shadowThreshold}
            onChange={(e) => setShadowThreshold(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
