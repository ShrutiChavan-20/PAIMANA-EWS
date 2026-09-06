// ============================================================
//  AuthPage v5 — PAIMANA-EWS Sovereign Infrastructure Intelligence
//  Restored Indigo / Purple / Violet Color Accents & Theme
// ============================================================
import React, { useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import {
  Shield, Eye, EyeOff, LogIn, Building2, Lock,
  Brain, BarChart3, Activity, Layers
} from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import GlowButton from '../components/GlowButton';

// ─── Interactive 3D Hero Graphic Component ────────────────────
function Interactive3DGraphic() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-22, 22]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        height: '310px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1200,
        cursor: 'pointer',
        margin: '1.25rem 0',
      }}
    >
      <motion.div
        style={{
          width: '280px',
          height: '230px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        {/* Background 3D Pulsing Ring */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            border: '2px dashed rgba(139, 92, 246, 0.35)',
            transform: 'translateZ(-40px)',
            boxShadow: '0 0 50px rgba(124, 58, 237, 0.2)',
          }}
        />

        {/* 3D Glassmorphic Main Central Platform */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.18) 0%, rgba(99, 102, 241, 0.08) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transform: 'translateZ(0px)',
          }}
        >
          {/* Glowing Center Hologram Sphere */}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(124, 58, 237, 0.65), 0 0 15px rgba(99, 102, 241, 0.8)',
              transform: 'translateZ(30px)',
              animation: 'floatOrb 4s ease-in-out infinite',
            }}
          >
            <Shield size={34} color="white" />
          </div>

          <div style={{ textAlign: 'center', transform: 'translateZ(25px)' }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#f8fafc' }}>
              PAIMANA<span style={{ color: '#0097d8' }}>-EWS</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#a78bfa', letterSpacing: '0.08em', marginTop: 2 }}>
              PREDICTIVE AI ENGINE
            </div>
          </div>
        </div>

        {/* Floating 3D Pill Badge #1 (Top Left) */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-15px',
            left: '-25px',
            padding: '8px 14px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            backdropFilter: 'blur(12px)',
            color: '#a78bfa',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.25)',
            transform: 'translateZ(45px)',
          }}
        >
          <Layers size={14} /> 1,775 Projects
        </motion.div>

        {/* Floating 3D Pill Badge #2 (Top Right) */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-30px',
            padding: '8px 14px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            backdropFilter: 'blur(12px)',
            color: '#34d399',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)',
            transform: 'translateZ(55px)',
          }}
        >
          <BarChart3 size={14} /> ₹37.11L Cr
        </motion.div>

        {/* Floating 3D Pill Badge #3 (Bottom Right) */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-15px',
            right: '-20px',
            padding: '8px 14px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            backdropFilter: 'blur(12px)',
            color: '#fbbf24',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.2)',
            transform: 'translateZ(50px)',
          }}
        >
          <Brain size={14} /> 92.4% AI Accuracy
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Main PAIMANA-EWS Sovereign Auth Page ─────────────────────
export default function AuthPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('admin');
  const [form, setForm] = useState({ email: 'admin@mospi.gov.in', password: 'admin123' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await login(form.email, form.password, activeTab);
    if (!res.ok) {
      setError(res.error || 'Authentication failed.');
    }
    setLoading(false);
  };

  const fillDemo = (email, password, roleTab = 'admin') => {
    setActiveTab(roleTab);
    setForm(f => ({ ...f, email, password }));
    setError('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .paimana-auth-container {
          display: flex;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          background: #060a16;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f8fafc;
          position: relative;
        }

        .hero-left-paimana {
          flex: 1.25;
          padding: 3rem 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                      linear-gradient(135deg, #040814 0%, #0a1128 50%, #120e28 100%);
          overflow: hidden;
        }

        .hero-right-paimana {
          flex: 1;
          padding: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          background: linear-gradient(180deg, rgba(8, 14, 30, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%),
                      url("https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=1200") center/cover no-repeat;
        }

        .paimana-glass-card {
          width: 100%;
          max-width: 440px;
          background: rgba(11, 18, 38, 0.78);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-radius: 28px;
          border: 1px solid rgba(139, 92, 246, 0.25);
          padding: 2.25rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.12);
          position: relative;
          overflow: hidden;
        }

        .custom-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          color: #f1f5f9;
          outline: none;
          background: rgba(6, 12, 28, 0.7);
          box-sizing: border-box;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.3);
          background: rgba(8, 16, 36, 0.85);
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateZ(30px) translateY(0px); }
          50% { transform: translateZ(30px) translateY(-8px); }
        }

        @media (max-width: 960px) {
          .paimana-auth-container {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
          }
          .hero-left-paimana {
            padding: 3rem 1.5rem;
            flex: none;
          }
          .hero-right-paimana {
            padding: 2rem 1.5rem;
            min-height: 500px;
            flex: none;
          }
        }
      `}</style>

      <div className="paimana-auth-container">
        <ParticleBackground />

        {/* ── LEFT HERO: Title, Description & 3D Interactive Design ── */}
        <div className="hero-left-paimana">
          <div style={S.orbTop} />
          <div style={S.orbBottom} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={S.heroInner}
          >
            {/* Top Ministry Badge */}
            <div style={S.topBadge}>
              <span>🇮🇳 MoSPI IPMD</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>SIH 2026</span>
            </div>

            {/* Clean Title */}
            <h1 style={S.headline}>
              PAIMANA<span style={{ color: '#0097d8' }}>-EWS</span>
            </h1>
            <div style={S.subHeadline}>
              AI Infrastructure Monitoring & Early Warning Platform
            </div>

            {/* Concise 2-Line Description */}
            <p style={S.conciseDescription}>
              An intelligent monitoring system built for MoSPI to track central infrastructure projects, predict cost overruns, and detect project delays in real time.
            </p>

            {/* Interactive 3D Graphic */}
            <Interactive3DGraphic />

            {/* Quick 3 Feature Pills */}
            <div style={S.featurePillRow}>
              <div style={S.pillItem}>
                <Brain size={14} color="#a78bfa" />
                <span>AI Delay Regressor</span>
              </div>
              <div style={S.pillItem}>
                <Activity size={14} color="#34d399" />
                <span>Red/Amber Risk Triage</span>
              </div>
              <div style={S.pillItem}>
                <BarChart3 size={14} color="#fbbf24" />
                <span>MoSPI Flash Reports</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT HERO: Executive & Analyst Login Portal ── */}
        <div className="hero-right-paimana">
          <div className="paimana-glass-card">
            {/* Top Card Icon & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.3rem' }}>
              <div style={S.cardHeaderIcon}>
                <Building2 size={20} color="#a78bfa" />
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc' }}>
                  MoSPI IPMD Portal Sign In
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                  PAIMANA-EWS Sovereign Intelligence Platform
                </div>
              </div>
            </div>

            {/* Security Access Badge */}
            <div style={S.securityBadge}>
              <Lock size={13} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Authorized personnel & registered infrastructure analysts only.</span>
            </div>

            {/* Role Tab Selector */}
            <div style={S.tabContainer}>
              <button
                onClick={() => { setActiveTab('admin'); setError(''); }}
                style={{ ...S.tabBtn, ...(activeTab === 'admin' ? S.tabBtnActive : {}) }}
              >
                🏛 MoSPI Admin
              </button>
              <button
                onClick={() => { setActiveTab('user'); setError(''); }}
                style={{ ...S.tabBtn, ...(activeTab === 'user' ? S.tabBtnActive : {}) }}
              >
                👤 Field Analyst
              </button>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={S.fieldLabel}>Official Email Address</label>
              <input
                className="custom-input"
                type="email"
                placeholder={activeTab === 'admin' ? 'admin@mospi.gov.in' : 'ananya@civicsense.in'}
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={S.fieldLabel}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="custom-input"
                  style={{ paddingRight: 42 }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setField('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={S.eyeToggle}
                >
                  {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={S.errorAlert}>
                <span>{error}</span>
              </div>
            )}

            {/* Sign In Button */}
            <GlowButton
              variant="primary"
              size="lg"
              loading={loading}
              onClick={handleLogin}
              icon={<LogIn size={18} />}
              style={{ width: '100%', marginBottom: '1.25rem' }}
            >
              Sign In to PAIMANA-EWS
            </GlowButton>

            {/* 1-Click Demo Accounts */}
            <div style={S.dividerLine}>
              <span style={S.dividerText}>1-Click Demo Accounts</span>
            </div>

            <div style={S.demoGrid}>
              {[
                { name: 'Rajesh Patil', email: 'admin@mospi.gov.in', pass: 'admin123', role: 'MoSPI Admin', tab: 'admin', color: '#a78bfa' },
                { name: 'Dr. Priya Deshmukh', email: 'director@ipmd.gov.in', pass: 'director123', role: 'IPMD Director', tab: 'admin', color: '#34d399' },
                { name: 'Ananya Kumar', email: 'ananya@civicsense.in', pass: 'citizen123', role: 'Field Analyst', tab: 'user', color: '#fbbf24' },
              ].map(d => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => fillDemo(d.email, d.pass, d.tab)}
                  style={{
                    ...S.demoCardBtn,
                    borderColor: `${d.color}25`,
                    background: 'rgba(6, 14, 30, 0.65)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#f1f5f9' }}>{d.name}</span>
                    <span style={{ fontSize: '0.58rem', color: d.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      {d.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#94a3b8' }}>{d.email}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748b' }}>{d.pass}</span>
                  </div>
                </button>
              ))}
            </div>

            <div style={S.cardFooter}>
              <span>MoSPI IPMD · Developed for SIH 2026</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Inline Style Definitions ────────────────────────────────
const S = {
  heroInner: { maxWidth: 540, width: '100%', position: 'relative', zIndex: 5 },
  orbTop: {
    position: 'absolute', width: 450, height: 450, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
    top: -120, right: -120, zIndex: 1, filter: 'blur(60px)',
  },
  orbBottom: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    bottom: -100, left: -100, zIndex: 1, filter: 'blur(60px)',
  },
  topBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(124, 58, 237, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '30px', padding: '6px 14px', marginBottom: '1rem',
    color: '#a78bfa', fontSize: '0.72rem', fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
  },
  headline: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
    fontSize: '3rem', color: '#f8fafc', lineHeight: 1.05,
    marginBottom: '0.4rem', letterSpacing: '-0.02em',
  },
  subHeadline: {
    fontFamily: "'Outfit', sans-serif", fontWeight: 700,
    fontSize: '1.15rem', color: '#a78bfa', marginBottom: '0.8rem',
  },
  conciseDescription: {
    color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.55,
    marginBottom: '0.5rem', fontWeight: 400,
  },
  featurePillRow: {
    display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem',
  },
  pillItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(15, 23, 42, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '6px 12px', borderRadius: '20px',
    fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600,
  },
  cardHeaderIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'rgba(124, 58, 237, 0.12)',
    border: '1.5px solid rgba(139, 92, 246, 0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  securityBadge: {
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.18)',
    borderRadius: 10, padding: '8px 12px', fontSize: '0.73rem', color: '#fbbf24',
    marginBottom: '1.1rem', display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.35,
  },
  tabContainer: {
    display: 'flex', background: 'rgba(6, 12, 28, 0.7)',
    borderRadius: 12, padding: 3, marginBottom: '1.1rem',
    border: '1px solid rgba(139, 92, 246, 0.18)',
  },
  tabBtn: {
    flex: 1, padding: '9px 6px', borderRadius: 9, border: 'none',
    background: 'none', color: '#94a3b8', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.78rem',
    transition: 'all 0.25s ease', textAlign: 'center',
  },
  tabBtnActive: {
    background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa',
    boxShadow: '0 0 16px rgba(124, 58, 237, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
  },
  fieldLabel: {
    display: 'block', fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.63rem', color: '#94a3b8', marginBottom: 5,
    textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
  },
  eyeToggle: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
    alignItems: 'center', padding: 4,
  },
  errorAlert: {
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.25)',
    borderRadius: 10, padding: '9px 12px', fontSize: '0.78rem', color: '#fb7185',
    marginBottom: '1rem', lineHeight: 1.35,
  },
  dividerLine: {
    textAlign: 'center', borderTop: '1px solid rgba(139, 92, 246, 0.15)',
    marginBottom: '1rem', marginTop: '0.4rem', position: 'relative',
  },
  dividerText: {
    background: '#0b1226', padding: '0 10px', position: 'relative', top: -9,
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#64748b',
    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  demoGrid: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' },
  demoCardBtn: {
    padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
    display: 'flex', flexDirection: 'column', textAlign: 'left',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    border: '1px solid rgba(139, 92, 246, 0.15)', transition: 'all 0.25s ease',
  },
  cardFooter: {
    textAlign: 'center', color: '#64748b', fontSize: '0.68rem',
    fontFamily: "'JetBrains Mono', monospace", marginTop: '0.4rem',
  },
};
