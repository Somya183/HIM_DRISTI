import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, Sparkles, Compass, Radio, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';
import StarfieldBackground from './StarfieldBackground';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('commander.lunar@himdristi.gov');
  const [password, setPassword] = useState('LunarIce2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
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
    }, 900);
  };

  const handleFillDemo = () => {
    setEmail('commander.lunar@himdristi.gov');
    setPassword('LunarIce2026!');
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      color: '#f8fafc',
      padding: '20px'
    }}>
      {/* 3D MOVING STARFIELD & MOONLIGHT GLOW BACKDROP */}
      <StarfieldBackground />

      {/* Ambient Moon Light Aura */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(0, 243, 255, 0.12) 0%, rgba(56, 189, 248, 0.05) 45%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* MAIN LOGIN CARD */}
      <div 
        className="hud-card" 
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 32px',
          zIndex: 10,
          background: 'rgba(6, 11, 24, 0.92)',
          boxShadow: '0 25px 60px -15px rgba(0, 243, 255, 0.25), inset 0 1px 0 rgba(0, 243, 255, 0.4)',
          border: '1px solid rgba(0, 243, 255, 0.35)'
        }}
      >
        {/* LOGO & BRAND TITLE */}
        <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 243, 255, 0.08)',
            padding: '12px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.35)',
            boxShadow: '0 0 25px rgba(0, 243, 255, 0.3)',
            marginBottom: '16px'
          }}>
            <img 
              src={logoImg} 
              alt="HImDristi Logo" 
              style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#f8fafc',
            margin: '0 0 4px 0',
            fontFamily: 'Space Grotesk',
            letterSpacing: '-0.5px'
          }}>
            HImDristi <span style={{ color: '#00f3ff', fontWeight: '400', fontSize: '18px' }}>हिम दृष्टि</span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
            <span className="neon-badge badge-cyan" style={{ fontSize: '10px' }}>
              <Radio size={12} className="pulse-glow" /> LUNAR POLAR MISSION CONTROL
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '10px 0 0 0', lineHeight: '1.4' }}>
            Secure Authentication Gateway • Polar Water Ice AI & Rover Traversal Platform
          </p>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div style={{
            background: 'rgba(248, 113, 113, 0.12)',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
          {/* USERNAME / EMAIL INPUT */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: '700',
              color: '#cbd5e1',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Mission ID / Commander Email
            </label>

            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                color="#00f3ff" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }} 
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@lunar.nasa.gov"
                style={{
                  width: '100%',
                  background: 'rgba(3, 7, 18, 0.95)',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '11px 12px 11px 40px',
                  color: '#00f3ff',
                  fontSize: '13px',
                  fontFamily: 'JetBrains Mono',
                  outline: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00f3ff';
                  e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 243, 255, 0.3)';
                  e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
                }}
              />
            </div>
          </div>

          {/* PASSCODE INPUT */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: '700',
              color: '#cbd5e1',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Security Passcode
            </label>

            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                color="#00f3ff" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(3, 7, 18, 0.95)',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '11px 40px 11px 40px',
                  color: '#00f3ff',
                  fontSize: '13px',
                  fontFamily: 'JetBrains Mono',
                  outline: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00f3ff';
                  e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 243, 255, 0.3)';
                  e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} color="#00f3ff" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* REMEMBER ME & DEMO HELP */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#00f3ff', cursor: 'pointer' }}
              />
              Keep Mission Session Active
            </label>

            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#00f3ff',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ⚡ Auto-Fill Demo Credentials
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="hud-btn hud-btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '13px',
              justifyContent: 'center',
              borderRadius: '10px'
            }}
          >
            {isLoading ? (
              <span>AUTHENTICATING TELEMETRY...</span>
            ) : (
              <>
                <span>INITIALIZE MISSION CONTROL</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* SECURITY FOOTER BADGE */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          fontSize: '11px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={14} color="#00ff9d" />
          <span>Encrypted Space Protocol • Moon PA-454 Authorization</span>
        </div>
      </div>
    </div>
  );
}
