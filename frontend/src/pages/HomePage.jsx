import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Settings, User, FileText, ArrowRight, Upload, Layers, ShieldCheck, Database } from 'lucide-react';
import StarfieldBackground from '../components/StarfieldBackground';
import AutoRotatingMoon3D from '../components/AutoRotatingMoon3D';
import { API_BASE } from '../config';

export default function HomePage({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleDownloadPdf = async () => {
    try {
      window.open(`${API_BASE}/api/export/pdf?target=shackleton`, '_blank');
    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#030712',
      color: '#ffffff',
      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* DEEP SPACE STARFIELD BACKGROUND */}
      <StarfieldBackground />

      {/* TOP HEADER NAVBAR (EXACT MATCH TO SCREENSHOT) */}
      <header style={{
        height: '70px',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0, 243, 255, 0.15)',
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        zIndex: 100
      }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#ffffff',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            Himdristi
          </h1>
        </div>

        {/* NAVIGATION LINKS: DATASET | UPLOAD | IMAGES */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button
            onClick={() => navigate('/app')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#00f3ff'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            DATASET
          </button>

          <label style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => e.target.style.color = '#00f3ff'}
          onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            UPLOAD
            <input type="file" accept="image/*,.bin,.raw,.tif" onChange={() => navigate('/app')} style={{ display: 'none' }} />
          </label>

          <button
            onClick={() => navigate('/app')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#00f3ff'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            IMAGES
          </button>
        </nav>

        {/* RIGHT UTILITIES & SOLID CYAN LOGIN BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Rocket size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => navigate('/app')} />
          <Settings size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => navigate('/app')} />

          <button
            onClick={() => {
              if (isAuthenticated) {
                localStorage.removeItem('himdrishti_auth_token');
                window.location.reload();
              } else {
                navigate('/login');
              }
            }}
            style={{
              background: '#00f3ff',
              color: '#030712',
              border: 'none',
              padding: '8px 22px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '900',
              letterSpacing: '1.2px',
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#38bdf8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00f3ff';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {isAuthenticated ? 'LOG OUT' : 'LOGIN'}
          </button>
        </div>
      </header>

      {/* MAIN HERO CARD SECTION (EXACT MATCH TO SCREENSHOT) */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 80px',
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* LEFT COLUMN: TEXT HEADLINE & ACTIONS */}
        <div style={{ maxWidth: '580px' }}>
          {/* SYSTEM ONLINE BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 243, 255, 0.08)',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            marginBottom: '24px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00f3ff',
              boxShadow: '0 0 8px #00f3ff'
            }} />
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#00f3ff',
              letterSpacing: '1.5px',
              fontFamily: 'JetBrains Mono'
            }}>
              SYSTEM ONLINE
            </span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            lineHeight: 1.08,
            color: '#ffffff',
            margin: '0 0 20px 0',
            letterSpacing: '-1px'
          }}>
            AI-Powered Lunar<br />
            <span style={{ color: '#00f3ff', textShadow: '0 0 30px rgba(0,243,255,0.3)' }}>
              Ice Detection
            </span>
          </h1>

          {/* SUBTITLE */}
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#94a3b8',
            marginBottom: '36px',
            fontFamily: "'Outfit', sans-serif"
          }}>
            Harnessing advanced machine learning to secure lunar resources. High-precision telemetry and spectral analysis for deep space operations.
          </p>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/app')}
              style={{
                background: '#00f3ff',
                color: '#030712',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '900',
                letterSpacing: '1px',
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 25px rgba(0, 243, 255, 0.4)',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#38bdf8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00f3ff';
                e.currentTarget.style.transform = 'none';
              }}
            >
              GET STARTED <ArrowRight size={16} />
            </button>

            <button
              onClick={handleDownloadPdf}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '800',
                letterSpacing: '1px',
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00f3ff';
                e.currentTarget.style.color = '#00f3ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              VIEW DOCS <FileText size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SCANNER HUD CARD & 3D ROTATING MOON */}
        <div style={{ position: 'relative', width: '480px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* DIAMOND OVERLAY GRID LINES */}
          <div style={{
            position: 'absolute',
            width: '360px',
            height: '360px',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            transform: 'rotate(45deg)',
            pointerEvents: 'none',
            boxShadow: '0 0 30px rgba(0, 243, 255, 0.1)'
          }} />

          {/* FLOATING SCANNER CARD */}
          <div
            onClick={() => navigate('/app')}
            style={{
              width: '240px',
              height: '240px',
              background: 'rgba(7, 15, 32, 0.85)',
              border: '1px solid rgba(0, 243, 255, 0.5)',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 243, 255, 0.25)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* SPINNING TARGET HUD ICON */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px dashed #00f3ff',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)',
              animation: 'spin 12s linear infinite'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f3ff' }} />
              </div>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#00f3ff',
              letterSpacing: '2px',
              fontFamily: 'JetBrains Mono'
            }}>
              QUANTUM VECTOR 75
            </span>
          </div>

          {/* BACKGROUND 3D MOON ROTATION */}
          <div style={{
            position: 'absolute',
            inset: '-40px',
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 5
          }}>
            <AutoRotatingMoon3D />
          </div>
        </div>
      </main>

      {/* FOOTER METRICS BAR */}
      <footer style={{
        height: '50px',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(3, 7, 18, 0.9)',
        fontSize: '11px',
        color: '#64748b',
        fontFamily: 'JetBrains Mono',
        position: 'relative',
        zIndex: 50
      }}>
        <div>ISRO CHANDRAYAAN-2 DFSAR • NASA LROC POLAR DATA INGESTION</div>
        <div style={{ color: '#00f3ff' }}>PYTORCH UNET SEGMENTATION ACCURACY: 93.7% F1-SCORE</div>
      </footer>
    </div>
  );
}
