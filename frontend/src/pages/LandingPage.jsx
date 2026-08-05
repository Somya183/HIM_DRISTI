import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Layers, Radio, Satellite, MapPinned, ArrowUpRight, ShieldCheck, Cpu, Database, Activity } from 'lucide-react';
import logoImg from '../assets/logo.png';
import moonSphereImg from '../assets/moon_sphere.png';
import StarfieldBackground from '../components/StarfieldBackground';

export default function LandingPage({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleInitiateScan = () => {
    navigate('/dashboard');
  };

  const handleViewData = () => {
    navigate('/dashboard');
  };

  const handleLoginClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

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
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* 3D MOVING STARFIELD */}
      <StarfieldBackground />

      {/* TOP NAVIGATION HEADER */}
      <header style={{
        padding: '24px 64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 30,
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* BRAND LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logoImg} alt="HimDristi logo" style={{ height: '36px', width: 'auto' }} />
          <span style={{ fontSize: '24px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', color: '#ffffff' }}>
            HimDristi
          </span>
        </div>

        {/* NAV LINKS & LOGIN BUTTON */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '40px', fontSize: '15px', fontWeight: '500' }}>
          <span 
            style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
            onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            onClick={() => navigate('/dashboard')}
          >
            Detection
          </span>

          <span 
            style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
            onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            onClick={() => navigate('/dashboard')}
          >
            Data
          </span>

          <span 
            style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
            onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            onClick={() => navigate('/dashboard')}
          >
            Mission
          </span>

          <button
            onClick={handleLoginClick}
            style={{
              background: '#ffffff',
              color: '#020408',
              border: 'none',
              padding: '9px 26px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 243, 255, 0.5)';
              e.currentTarget.style.background = '#00f3ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            {isAuthenticated ? 'Control' : 'Login'}
          </button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '60px 64px 100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 20
      }}>
        {/* HERO HEADLINE & ACTIONS */}
        <div style={{ maxWidth: '720px' }}>
          {/* LIVE TELEMETRY PILL BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '5px 14px',
            borderRadius: '20px',
            marginBottom: '28px'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#38bdf8',
              display: 'inline-block',
              boxShadow: '0 0 10px #38bdf8'
            }} className="pulse-glow" />
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#38bdf8',
              letterSpacing: '1.5px',
              fontFamily: 'JetBrains Mono',
              textTransform: 'uppercase'
            }}>
              LIVE TELEMETRY
            </span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 style={{
            fontSize: 'clamp(48px, 6vw, 76px)',
            fontWeight: '800',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: '1.08',
            color: '#ffffff',
            margin: '0 0 24px 0',
            letterSpacing: '-1.5px'
          }}>
            Detecting Lunar Secrets with AI
          </h1>

          {/* SUB-HEADLINE DESCRIPTION */}
          <p style={{
            fontSize: '17px',
            color: '#cbd5e1',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 0 40px 0',
            fontWeight: '400'
          }}>
            Advanced machine learning models scanning the lunar surface for resource identification and subsurface ice deposits in real-time.
          </p>

          {/* RECTANGULAR ACTION BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleInitiateScan}
              style={{
                background: '#38bdf8',
                color: '#040711',
                border: 'none',
                padding: '14px 36px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '800',
                fontFamily: 'JetBrains Mono',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
                transition: 'all 0.25s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00f3ff';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 243, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#38bdf8';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.5)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              INITIATE SCAN
            </button>

            <button
              onClick={handleViewData}
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 36px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '800',
                fontFamily: 'JetBrains Mono',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.color = '#38bdf8';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              VIEW DATA
            </button>
          </div>
        </div>
      </main>



      {/* FOOTER */}
      <footer style={{
        padding: '24px 64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 20
      }}>
        <span>HimDristi • Multi-Modal Lunar Water Ice AI & Traversal Platform</span>
        <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>Shackleton Target: 89.9°S, 0.0°E</span>
        <span>© 2026 AI Space Intelligence</span>
      </footer>
    </div>
  );
}
