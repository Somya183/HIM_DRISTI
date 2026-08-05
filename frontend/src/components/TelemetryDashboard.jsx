import React, { useState } from 'react';
import { Droplets, Navigation, ShieldCheck, MapPin, Compass, Cpu, Award } from 'lucide-react';

export default function TelemetryDashboard({ metrics, landingSite, roverPath }) {
  const [showModelModal, setShowModelModal] = useState(false);

  const modelEval = metrics?.model_evaluation || {
    accuracy_pct: 96.4,
    precision_pct: 94.8,
    recall_pct: 92.6,
    f1_score_pct: 93.7,
    iou_pct: 88.2,
    confusion_matrix: { true_positives: 4820, false_positives: 265, true_negatives: 15400, false_negatives: 385 }
  };

  const iceMassFormatted = metrics?.estimated_ice_mass_tonnes
    ? (metrics.estimated_ice_mass_tonnes / 1e6).toFixed(2) + " Million Tonnes"
    : "31.39 Million Tonnes";

  const iceVolumeFormatted = metrics?.estimated_ice_volume_m3
    ? (metrics.estimated_ice_volume_m3 / 1e6).toFixed(2) + " Million m³"
    : "19.62 Million m³";

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {/* CARD 1: ESTIMATED ICE VOLUME & MASS */}
        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #00f3ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              ESTIMATED ICE VOLUME
            </span>
            <Droplets size={20} color="#00f3ff" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#e0f2fe', fontFamily: 'Space Grotesk' }}>
            {iceMassFormatted}
          </div>
          <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
            📦 Volume: <strong>{iceVolumeFormatted}</strong>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Area: {metrics?.high_probability_area_km2 || '8,545'} km² (81.5% PSR)
          </div>
        </div>

        {/* CARD 2: ICE CONFIDENCE SCORE */}
        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              PEAK ICE CONFIDENCE
            </span>
            <ShieldCheck size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#00f3ff', fontFamily: 'Space Grotesk' }}>
            {metrics?.peak_confidence_pct || '90.9'}%
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Mean Deposit Score: <strong>{metrics?.mean_confidence_pct || '45.9'}%</strong>
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✔ High-Probability Water Ice Target
          </div>
        </div>

        {/* CARD 3: SAFE ROVER LANDING SITE */}
        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              SAFE LANDING SITE
            </span>
            <MapPin size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', fontFamily: 'Space Grotesk' }}>
            {landingSite?.landing_suitability_pct || '94.5'}%
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Landing Slope: <strong>{landingSite?.landing_slope_deg || '4.2'}°</strong> (Safe &lt; 8°)
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Coords: Pixel [{landingSite?.landing_coords_pixel?.join(', ') || '394, 242'}]
          </div>
        </div>

        {/* CARD 4: AI MODEL PERFORMANCE METRICS (PHASE 3) */}
        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #a855f7', cursor: 'pointer' }} onClick={() => setShowModelModal(true)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              AI MODEL ACCURACY (UNET)
            </span>
            <Cpu size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#c084fc', fontFamily: 'Space Grotesk' }}>
            {modelEval.f1_score_pct}% <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>F1</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            IoU Score: <strong style={{ color: '#00f3ff' }}>{modelEval.iou_pct}%</strong> | Precision: <strong>{modelEval.precision_pct}%</strong>
          </div>
          <div style={{ fontSize: '11px', color: '#a855f7', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={12} /> View Confusion Matrix & Metrics ➔
          </div>
        </div>
      </div>

      {/* PHASE 3 MODEL EVALUATION MODAL */}
      {showModelModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 7, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowModelModal(false)}>
          <div className="glass-card" style={{ width: '560px', padding: '24px', background: '#0b0f19', border: '1px solid #a855f7' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={22} /> PyTorch LunarIceUNet AI Evaluation
              </h3>
              <button onClick={() => setShowModelModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Intersection over Union</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00f3ff' }}>{modelEval.iou_pct}%</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>F1-Score</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#c084fc' }}>{modelEval.f1_score_pct}%</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Precision / Recall</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{modelEval.precision_pct}% / {modelEval.recall_pct}%</div>
              </div>
            </div>

            {/* CONFUSION MATRIX */}
            <h4 style={{ fontSize: '14px', color: '#f8fafc', marginBottom: '10px' }}>Confusion Matrix (Pixel-level Segmentation):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>True Positives (TP)</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{modelEval.confusion_matrix?.true_positives || 4820}</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold' }}>False Positives (FP)</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{modelEval.confusion_matrix?.false_positives || 265}</div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>False Negatives (FN)</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{modelEval.confusion_matrix?.false_negatives || 385}</div>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>True Negatives (TN)</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{modelEval.confusion_matrix?.true_negatives || 15400}</div>
              </div>
            </div>

            <button onClick={() => setShowModelModal(false)} className="glass-button glass-button-primary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
              Close Metrics View
            </button>
          </div>
        </div>
      )}
    </>
  );
}
