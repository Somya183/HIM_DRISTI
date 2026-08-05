import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
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
      background: '#02040a',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* 3D MOVING STARFIELD BACKGROUND */}
      <StarfieldBackground />

      {/* PAGE CONTENT */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
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
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          padding: '50px 64px 80px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          gap: '50px',
          position: 'relative',
          zIndex: 20
        }}>
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
          <div>
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
              fontSize: 'clamp(44px, 5.5vw, 68px)',
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
              fontSize: '16px',
              color: '#cbd5e1',
              lineHeight: '1.65',
              maxWidth: '540px',
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

          {/* RIGHT COLUMN: DRAMATIC 3D POP-OUT MOON MODEL */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justify: 'center',
            alignItems: 'center',
            zIndex: 999,
            marginRight: '-30px'
          }}>
            {/* Ambient Moonlight Halo */}
            <div style={{
              position: 'absolute',
              width: '640px',
              height: '640px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(0, 243, 255, 0.16) 45%, transparent 70%)',
              filter: 'blur(70px)',
              pointerEvents: 'none'
            }} />

            {/* 3D Moon Orb Container (Pops Out of Page with Deep Spatial Shadow) */}
            <div className="float-moon" style={{
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              background: '#000000',
              border: '1px solid rgba(0, 243, 255, 0.65)',
              boxShadow: '0 40px 120px rgba(0, 0, 0, 0.98), 0 0 85px rgba(56, 189, 248, 0.7), 0 0 150px rgba(0, 243, 255, 0.4), inset 0 0 50px rgba(0, 0, 0, 0.95)'
            }}>
              <iframe
                src="https://solarsystem.nasa.gov/gltf_embed/2366/"
                title="Official NASA Photorealistic 3D Moon Model"
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  background: 'transparent',
                  transform: 'scale(1.42)',
                  transformOrigin: 'center center'
                }}
                allowFullScreen
              />

              {/* Volumetric Realistic 3D Solar Shadow & Terminator Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 24% 24%, transparent 25%, rgba(2, 4, 11, 0.45) 55%, rgba(2, 4, 11, 0.82) 80%, rgba(2, 4, 11, 0.96) 100%)',
                pointerEvents: 'none'
              }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
