import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Settings, User, FileText, ArrowRight, Upload } from 'lucide-react';
import StarfieldBackground from '../components/StarfieldBackground';
import AutoRotatingMoon3D from '../components/AutoRotatingMoon3D';

export default function HomePage({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleNavToLogin = () => {
    navigate('/login');
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

      {/* TOP HEADER NAVBAR */}
      <header style={{
        height: '70px',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        borderBottom: '1px solid rgba(0, 243, 255, 0.15)',
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        zIndex: 100
      }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleNavToLogin}>
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

        {/* RIGHT ALIGNED NAV LINKS & LOGIN BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginLeft: 'auto' }}>
          <button
            onClick={handleNavToLogin}
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

          <button
            onClick={handleNavToLogin}
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
            UPLOAD
          </button>

          <button
            onClick={handleNavToLogin}
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

          <button
            onClick={handleNavToLogin}
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

      {/* MAIN HERO CARD SECTION */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 20px 0 80px',
        maxWidth: '100%',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden'
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
              onClick={handleNavToLogin}
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
              onClick={handleNavToLogin}
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

        {/* RIGHT COLUMN: 3D ROTATING MOON SHIFTED RIGHTWARDS */}
        <div
          style={{
            position: 'relative',
            width: '520px',
            height: '520px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            flexShrink: 0,
            transform: 'translateX(110px)'
          }}
        >
          {/* AMBIENT MOONLIGHT GLOW HALO */}
          <div style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 243, 255, 0.18) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }} />

          {/* 3D MOON ROTATION */}
          <div style={{
            width: '100%',
            height: '100%',
            cursor: 'grab',
            zIndex: 10
          }}>
            <AutoRotatingMoon3D />
          </div>
        </div>
      </main>
    </div>
  );
}
