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
        <h3 style={{ fontSize: '18px', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: '700' }}>
          <Sliders size={20} /> Data Preprocessing & Analysis
        </h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label 
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.12) 0%, rgba(2, 132, 199, 0.22) 100%)',
              border: '1px solid rgba(0, 243, 255, 0.6)',
              color: '#00f3ff',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.25)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 243, 255, 0.25) 0%, rgba(2, 132, 199, 0.38) 100%)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 243, 255, 0.12) 0%, rgba(2, 132, 199, 0.22) 100%)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.25)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <Upload size={15} color="#00f3ff" /> Upload Custom Dataset
            <input type="file" accept="image/*" onChange={handleCustomUpload} style={{ display: 'none' }} />
          </label>

          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            style={{
              background: isAnalyzing 
                ? 'rgba(56, 189, 248, 0.3)' 
                : 'linear-gradient(135deg, #00f3ff 0%, #0284c7 100%)',
              border: 'none',
              color: '#070a12',
              padding: '8px 18px',
              borderRadius: '10px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.5)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              if (!isAnalyzing) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #38bdf8 0%, #00f3ff 100%)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 243, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAnalyzing) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #00f3ff 0%, #0284c7 100%)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.5)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            <RefreshCw size={15} className={isAnalyzing ? 'spin' : ''} color="#070a12" />
            {isAnalyzing ? 'Processing...' : 'Run Pipeline'}
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
              background: activeTab === tab.id ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
              border: activeTab === tab.id ? '1px solid #00f3ff' : '1px solid transparent',
              color: activeTab === tab.id ? '#00f3ff' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Side by Side Image Comparison Display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* RAW INPUT */}
        <div style={{ background: '#05070e', borderRadius: '12px', padding: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} /> RAW UNFILTERED DATA
            </span>
            <span className="neon-badge badge-warning">RAW SATELLITE PHOTO</span>
          </div>
          <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {rawPhoto ? (
              <img src={rawPhoto} alt="Raw Unchanged Satellite Photo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '12px', color: '#64748b' }}>Loading Raw Satellite Photo...</span>
            )}
          </div>
        </div>

        {/* PREPROCESSED OUTPUT */}
        <div style={{ background: '#05070e', borderRadius: '12px', padding: '12px', border: '1px solid rgba(0, 243, 255, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> PREPROCESSED CLEANED DATA
            </span>
            <span className="neon-badge badge-cyan">
              {isAnalyzing ? 'PREPROCESSING...' : 'PREPROCESSED'}
            </span>
          </div>
          <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
                border: '1px solid rgba(0, 243, 255, 0.3)',
                borderRadius: '8px'
              }}>
                <RefreshCw size={34} color="#00f3ff" className="spin" style={{ marginBottom: '14px', filter: 'drop-shadow(0 0 10px rgba(0, 243, 255, 0.5))' }} />
                
                <h4 style={{ color: '#00f3ff', fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0' }}>
                  Preprocessing in Progress...
                </h4>
                
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, maxWidth: '300px', lineHeight: '1.5' }}>
                  Please wait, preprocessing will be done in a while...
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
      <div style={{ background: 'rgba(7, 10, 18, 0.6)', padding: '14px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Radar Speckle Denoise Strength: <strong>{denoiseLevel}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={denoiseLevel}
            onChange={(e) => setDenoiseLevel(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#00f3ff' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Optical CLAHE Clip Limit: <strong>{contrastClip.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.5"
            value={contrastClip}
            onChange={(e) => setContrastClip(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#00f3ff' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Shadow Binary Mask Threshold: <strong>{shadowThreshold}%</strong>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={shadowThreshold}
            onChange={(e) => setShadowThreshold(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#00f3ff' }}
          />
        </div>
      </div>
    </div>
  );
}
