import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Radar, Rocket, Waves, ArrowUpRight, Satellite, MapPinned } from 'lucide-react';
import logoImg from '../assets/logo.png';
import moonSphereImg from '../assets/moon_sphere.png';
import StarfieldBackground from '../components/StarfieldBackground';

const NAV_LINKS = ['Home', 'Mission', 'AI Model', 'Traversal'];

const STAT_CARDS = [
  { label: 'F1 Score', value: '93.7%', accent: '#00f3ff' },
  { label: 'IoU Accuracy', value: '88.2%', accent: '#38bdf8' },
  { label: 'Polar Craters Modeled', value: '03', accent: '#c084fc' },
];

const INSIGHT_ITEMS = [
  {
    icon: Satellite,
    color: '#00f3ff',
    title: 'Multi-modal sensor fusion',
    body: 'Optical, radar, DEM and shadow layers are combined by a PyTorch UNet to score ice probability pixel by pixel.',
  },
  {
    icon: MapPinned,
    color: '#00ff9d',
    title: 'Autonomous traversal planning',
    body: 'Safe rover paths are computed from slope and confidence data, ready to export as GeoJSON for mission ops.',
  },
];

export default function LandingPage({ isAuthenticated }) {
  const navigate = useNavigate();

  const goToApp = () => navigate(isAuthenticated ? '/dashboard' : '/login');

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#020408',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <StarfieldBackground />

      {/* TOP NAVIGATION */}
      <header style={{
        padding: '24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoImg} alt="HImDristi logo" style={{ height: '32px', width: 'auto' }} />
          <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk', letterSpacing: '-0.5px' }}>
            HImDristi <span style={{ fontSize: '13px', color: '#00f3ff', fontWeight: '400' }}>&bull; LUNAR</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>
          {NAV_LINKS.map((link, i) => (
            <span
              key={link}
              style={{ color: i === 0 ? '#ffffff' : '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#00f3ff')}
              onMouseLeave={(e) => (e.target.style.color = i === 0 ? '#ffffff' : '#94a3b8')}
            >
              {link}
            </span>
          ))}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#00f3ff'; e.currentTarget.style.color = '#020408'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#ffffff'; }}
          >
            {isAuthenticated ? 'Mission Control' : 'Sign In'}
          </button>
        </nav>
      </header>

      {/* HERO */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '20px 20px 0',
      }}>
        <p style={{
          fontSize: '16px',
          color: '#cbd5e1',
          maxWidth: '560px',
          margin: '0 0 24px 0',
          lineHeight: '1.6',
          fontWeight: '400',
        }}>
          From lunar polar water-ice detection to AI rover traversal, explore everything HImDristi maps beneath the shadowed craters.
        </p>

        <h1 style={{
          fontSize: 'clamp(90px, 16vw, 210px)',
          fontWeight: '900',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.04em',
          margin: 0,
          lineHeight: '0.85',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          MOON
        </h1>

        <div style={{
          position: 'relative',
          marginTop: '-7vw',
          width: 'clamp(280px, 34vw, 480px)',
          height: 'clamp(280px, 34vw, 480px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 162, 255, 0.25) 0%, rgba(0, 243, 255, 0.1) 50%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }} />

          <img
            src={moonSphereImg}
            alt="Photorealistic render of the Moon's south pole region"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '50%',
              filter: 'drop-shadow(0 0 40px rgba(0, 162, 255, 0.3))',
            }}
          />

          <button
            onClick={goToApp}
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
              zIndex: 30,
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
            Explore
          </button>
        </div>
      </main>

      {/* MISSION INSIGHTS SECTION */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1100px',
        margin: '40px auto 0',
        padding: '0 32px 64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <Layers size={20} color="#00f3ff" />
          <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Space Grotesk', margin: 0 }}>
            Mission Insights
          </h2>
        </div>

        {/* STAT ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {STAT_CARDS.map((stat) => (
            <div key={stat.label} className="hud-card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {stat.label}
              </p>
              <strong style={{ fontSize: '28px', fontFamily: 'Space Grotesk', color: stat.accent }}>
                {stat.value}
              </strong>
            </div>
          ))}
        </div>

        {/* TWO-COLUMN INSIGHT ROW: visual card + feature list, echoing the reference layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '16px' }}>
          <div className="hud-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Primary Target
              </p>
              <strong style={{ fontSize: '22px', fontFamily: 'Space Grotesk', display: 'block' }}>Shackleton Crater</strong>
              <span style={{ fontSize: '13px', color: '#64748b', fontFamily: 'JetBrains Mono' }}>89.9&deg;S, 0&deg;E</span>
            </div>
            <div style={{
              marginTop: '18px',
              height: '110px',
              borderRadius: '10px',
              background: 'radial-gradient(circle at 35% 35%, #cfd8e3 0%, #7d8896 45%, #3a4552 100%)',
              boxShadow: 'inset -14px -12px 26px rgba(0,0,0,0.35), inset 12px 10px 20px rgba(255,255,255,0.18)',
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {INSIGHT_ITEMS.map((item) => (
              <div key={item.title} className="hud-card" style={{ padding: '18px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  flexShrink: 0,
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${item.color}1f`,
                  border: `1px solid ${item.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <item.icon size={18} color={item.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontFamily: 'Space Grotesk', margin: '0 0 4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{item.body}</p>
                </div>
                <ArrowUpRight size={16} color="#64748b" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        position: 'relative',
        zIndex: 20,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span>HImDristi &bull; NASA PDS Geosciences Polar Dataset</span>
        <span style={{ color: '#00f3ff' }}>Coordinates: 89.9&deg;S, 0.0&deg;E (Shackleton Rim)</span>
        <span>&copy; 2026 AI Mission Intelligence</span>
      </footer>
    </div>
  );
}
