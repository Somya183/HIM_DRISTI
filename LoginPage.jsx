import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Rocket } from 'lucide-react';
import logoImg from '../assets/logo.png';
import StarfieldBackground from './StarfieldBackground';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('commander.lunar@himdristi.gov');
  const [password, setPassword] = useState('LunarIce2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const completeLogin = (userData) => {
    setIsLoading(false);
    onLoginSuccess(userData);
    navigate('/dashboard');
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Mission ID / Email and Passcode.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      completeLogin({ email, name: 'Commander Somya Dubey', role: 'Chief Mission Director' });
    }, 800);
  };

  const handleQuickExplore = () => {
    setIsLoading(true);
    setTimeout(() => {
      completeLogin({ email: 'guest.commander@himdristi.gov', name: 'Guest Commander', role: 'Mission Observer' });
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#020408',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <StarfieldBackground />

      <header style={{ padding: '24px 48px', position: 'relative', zIndex: 20 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={15} /> Back to home
        </button>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '20px',
      }}>
        <div
          className="hud-card"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '36px',
            background: 'rgba(8, 14, 28, 0.95)',
            border: '1px solid rgba(0, 243, 255, 0.4)',
            boxShadow: '0 25px 60px rgba(0, 243, 255, 0.25)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              background: 'rgba(0, 243, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 243, 255, 0.3)',
              marginBottom: '14px',
            }}>
              <img src={logoImg} alt="HImDristi logo" style={{ height: '40px' }} />
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, fontFamily: 'Space Grotesk' }}>
              Commander Sign In
            </h1>
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
              gap: '6px',
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
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
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
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
              {isLoading ? 'AUTHENTICATING...' : 'ENTER MISSION CONTROL \u2794'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button
            type="button"
            onClick={handleQuickExplore}
            disabled={isLoading}
            className="hud-btn"
            style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '8px', fontSize: '12px' }}
          >
            <Rocket size={14} /> Continue as Guest Observer
          </button>
        </div>
      </main>

      <footer style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        position: 'relative',
        zIndex: 20,
      }}>
        <span>HImDristi &bull; NASA PDS Geosciences Polar Dataset</span>
        <span>&copy; 2026 AI Mission Intelligence</span>
      </footer>
    </div>
  );
}
