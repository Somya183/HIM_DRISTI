import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, Radio, ArrowRight, AlertCircle, X, Sparkles, Compass } from 'lucide-react';
import logoImg from '../assets/logo.png';
import moonSphereImg from '../assets/moon_sphere.png';
import StarfieldBackground from './StarfieldBackground';

export default function LoginPage({ onLoginSuccess }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('commander.lunar@himdristi.gov');
  const [password, setPassword] = useState('LunarIce2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Mission ID / Email and Passcode.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({ email, name: 'Commander Somya Dubey', role: 'Chief Mission Director' });
      }
    }, 800);
  };

  const handleQuickExplore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({ email: 'commander.lunar@himdristi.gov', name: 'Commander Somya Dubey', role: 'Chief Mission Director' });
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#020408',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* 3D MOVING STARFIELD */}
      <StarfieldBackground />

      {/* TOP HEADER NAVIGATION BAR */}
      <header style={{
        padding: '24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        width: '100%'
      }}>
        {/* BRAND LOGO & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoImg} alt="Logo" style={{ height: '32px', width: 'auto' }} />
          <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk', letterSpacing: '-0.5px', color: '#ffffff' }}>
            HImDristi <span style={{ fontSize: '13px', color: '#00f3ff', fontWeight: '400' }}>• LUNAR</span>
          </span>
        </div>

        {/* NAV LINKS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>
          <span style={{ color: '#ffffff', cursor: 'pointer' }}>Home</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00f3ff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'} onClick={() => setShowLoginModal(true)}>Telemetry</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00f3ff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'} onClick={() => setShowLoginModal(true)}>3D Surface</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#00f3ff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'} onClick={() => setShowLoginModal(true)}>GPS Traversal</span>
          
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#00f3ff';
              e.target.style.color = '#020408';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.color = '#ffffff';
            }}
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* HERO CONTENT SECTION */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 20px'
      }}>
        {/* SUBTITLE */}
        <p style={{
          fontSize: '16px',
          color: '#cbd5e1',
          maxWidth: '560px',
          margin: '0 0 24px 0',
          lineHeight: '1.6',
          fontWeight: '400',
          letterSpacing: '0.2px'
        }}>
          From lunar polar water ice exploration to AI rover traversal, dive into everything about Earth's celestial companion.
        </p>

        {/* GIANT "MOON" TYPOGRAPHY (OVERLAPPED BY SPHERE BELOW) */}
        <h1 style={{
          fontSize: 'clamp(90px, 16vw, 210px)',
          fontWeight: '900',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.04em',
          color: '#ffffff',
          margin: 0,
          lineHeight: '0.85',
          textTransform: 'uppercase',
          userSelect: 'none'
        }}>
          MOON
        </h1>

        {/* PHOTOREALISTIC 3D MOON SPHERE WITH "EXPLORE" BUTTON OVERLAY */}
        <div style={{
          position: 'relative',
          marginTop: '-7vw',
          width: 'clamp(280px, 34vw, 480px)',
          height: 'clamp(280px, 34vw, 480px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Ambient Lunar Glow Halo */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 162, 255, 0.25) 0%, rgba(0, 243, 255, 0.1) 50%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }} />

          {/* Realistic 3D Moon Sphere Image */}
          <img
            src={moonSphereImg}
            alt="3D Photorealistic Moon Sphere"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '50%',
              filter: 'drop-shadow(0 0 40px rgba(0, 162, 255, 0.3))'
            }}
          />

          {/* ELECTRIC BLUE "EXPLORE" PILL BUTTON OVERLAPPING MOON SPHERE */}
          <button
            onClick={handleQuickExplore}
            disabled={isLoading}
            style={{
              position: 'absolute',
              top: '38%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #00a2ff 0%, #00f3ff 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px 44px',
              borderRadius: '40px',
              fontSize: '18px',
              fontWeight: '700',
              fontFamily: 'Space Grotesk',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0, 162, 255, 0.6), 0 0 20px rgba(0, 243, 255, 0.8)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.5px',
              zIndex: 30
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 162, 255, 0.9), 0 0 35px rgba(0, 243, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 162, 255, 0.6), 0 0 20px rgba(0, 243, 255, 0.8)';
            }}
          >
            {isLoading ? 'Accessing...' : 'Explore'}
          </button>
        </div>
      </main>

      {/* BOTTOM FOOTER TICKER */}
      <footer style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        zIndex: 20
      }}>
        <span>HImDristi • NASA PDS Geosciences Polar Dataset</span>
        <span style={{ color: '#00f3ff' }}>Coordinates: 89.9°S, 0.0°E (Shackleton Rim)</span>
        <span>© 2026 AI Mission Intelligence</span>
      </footer>

      {/* AUTHENTICATION LOGIN MODAL (TRIGGERED BY SIGN IN BUTTON) */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 4, 8, 0.82)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div 
            className="hud-card" 
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '32px',
              background: 'rgba(8, 14, 28, 0.95)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              boxShadow: '0 25px 60px rgba(0, 243, 255, 0.25)',
              position: 'relative'
            }}
          >
            {/* CLOSE MODAL BUTTON */}
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94a3b8',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            {/* LOGO & TITLE */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '10px',
                background: 'rgba(0, 243, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                marginBottom: '12px'
              }}>
                <img src={logoImg} alt="Logo" style={{ height: '40px' }} />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: 'Space Grotesk' }}>
                Commander Sign In
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                HImDristi Mission Control Authentication
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: 'rgba(248, 113, 113, 0.12)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Mission ID / Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#00f3ff" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(3, 7, 18, 0.95)',
                      border: '1px solid rgba(0, 243, 255, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 10px 10px 38px',
                      color: '#00f3ff',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#00f3ff" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(3, 7, 18, 0.95)',
                      border: '1px solid rgba(0, 243, 255, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 38px 10px 38px',
                      color: '#00f3ff',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} color="#00f3ff" /> : <Eye size={16} color="#94a3b8" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="hud-btn hud-btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '8px', fontSize: '13px' }}
              >
                {isLoading ? 'AUTHENTICATING...' : 'ENTER MISSION CONTROL ➔'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
