import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';
import StarfieldBackground from './StarfieldBackground';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('you@universe.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const completeLogin = (userData) => {
    setIsLoading(false);
    onLoginSuccess(userData);
    navigate('/app');
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email Address and Password.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      completeLogin({ email, name: 'Commander Somya Dubey', role: 'Chief Mission Director' });
    }, 800);
  };

  const handleSocialSignIn = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      completeLogin({ email: `${provider.toLowerCase()}@himdristi.gov`, name: `${provider} Authenticated User`, role: 'Mission Specialist' });
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#04060c',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* STARFIELD BACKGROUND */}
      <StarfieldBackground />

      {/* HEADER NAV BACK */}
      <header style={{ padding: '24px 48px', position: 'relative', zIndex: 20 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
        >
          <ArrowLeft size={15} /> Back to home
        </button>
      </header>

      {/* MAIN CENTER LOGIN MODAL CARD (EXACT MATCH TO SCREENSHOT) */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '24px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '410px',
          background: '#09090b',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(56, 189, 248, 0.15)',
          padding: '36px 32px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* TOP ORBITAL LOGO ICON */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.04) 60%, transparent 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 0 10px #ffffff'
            }} />
          </div>

          {/* PROJECT TITLE & SUBTITLE */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            letterSpacing: '4px',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#ffffff',
            margin: '0 0 6px 0',
            textTransform: 'uppercase'
          }}>
            HIMDRISTI
          </h1>
          <p style={{
            fontSize: '10px',
            fontWeight: '600',
            color: '#71717a',
            letterSpacing: '1.5px',
            fontFamily: 'JetBrains Mono',
            margin: '0 0 28px 0',
            textTransform: 'uppercase'
          }}>
            LUNAR WATER ICE AUTHENTICATION PORTAL
          </p>

          {/* SIGN IN / SIGN UP TABS TOGGLE */}
          <div style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '28px'
          }}>
            <button
              onClick={() => setActiveTab('signin')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'signin' ? '2px solid #ffffff' : '2px solid transparent',
                paddingBottom: '12px',
                color: activeTab === 'signin' ? '#ffffff' : '#71717a',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              SIGN IN
            </button>

            <button
              onClick={() => setActiveTab('signup')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'signup' ? '2px solid #ffffff' : '2px solid transparent',
                paddingBottom: '12px',
                color: activeTab === 'signup' ? '#ffffff' : '#71717a',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              SIGN UP
            </button>
          </div>

          {/* ERROR NOTIFICATION */}
          {errorMsg && (
            <div style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#ef4444',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={15} /> {errorMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
            {/* EMAIL ADDRESS INPUT */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: '700',
                color: '#71717a',
                letterSpacing: '1.2px',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@universe.com"
                style={{
                  width: '100%',
                  background: '#121215',
                  border: '1px solid #27272a',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                onBlur={(e) => e.target.style.borderColor = '#27272a'}
              />
            </div>

            {/* PASSWORD INPUT WITH SHOW TOGGLE */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: '700',
                color: '#71717a',
                letterSpacing: '1.2px',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: '#121215',
                    border: '1px solid #27272a',
                    borderRadius: '10px',
                    padding: '12px 64px 12px 14px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#e4e4e7',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD ROW */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '26px',
              fontSize: '12px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a1a1aa',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: '#ffffff',
                    width: '14px',
                    height: '14px',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>

              <span
                style={{ color: '#a1a1aa', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}
                onClick={() => setErrorMsg('Reset link sent to your registered email.')}
              >
                Forgot password?
              </span>
            </div>

            {/* PRIMARY LAUNCH SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#09090b',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e4e4e7';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {isLoading ? 'AUTHENTICATING...' : (activeTab === 'signin' ? 'LAUNCH SIGN IN' : 'CREATE ACCOUNT')}
            </button>
          </form>

          {/* OR CONTINUE WITH DIVIDER */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#71717a', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              OR CONTINUE WITH
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
          </div>

          {/* SOCIAL AUTH BUTTONS (GOOGLE & GITHUB) */}
          <div style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '28px'
          }}>
            <button
              type="button"
              onClick={() => handleSocialSignIn('Google')}
              style={{
                background: '#121215',
                border: '1px solid #27272a',
                color: '#ffffff',
                padding: '11px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#27272a'}
            >
              <span style={{ fontSize: '14px' }}>⦿</span> Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn('GitHub')}
              style={{
                background: '#121215',
                border: '1px solid #27272a',
                color: '#ffffff',
                padding: '11px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#27272a'}
            >
              <span style={{ fontSize: '14px' }}>⎈</span> GitHub
            </button>
          </div>

          {/* FOOTER SIGN UP LINK */}
          <div style={{ fontSize: '12px', color: '#71717a' }}>
            Don't have an account?{' '}
            <span
              onClick={() => setActiveTab('signup')}
              style={{ color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
            >
              Sign up
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
