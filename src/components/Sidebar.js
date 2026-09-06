// ============================================================
//  Sidebar v3 — Updated with AI Chat, Profile, Settings links
//  Theme-aware (Dark / Light), animated active indicator
// ============================================================
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import {
  LayoutDashboard, Map, FolderOpen, BarChart3, FileText,
  AlertTriangle, Shield, Settings, LogOut,
  Zap, Sun, Moon, Bot, User, BookOpen, Brain
} from 'lucide-react';

const NAV = [
  {
    section: 'OVERVIEW', items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#6366f1', darkColor: '#3b82f6' },
      { path: '/projects', icon: FolderOpen, label: 'Projects (1,775)', color: '#8b5cf6', darkColor: '#8b5cf6' },
      { path: '/analytics', icon: BarChart3, label: 'Analytics & Trends', color: '#d946ef', darkColor: '#d946ef' },
      { path: '/publications', icon: BookOpen, label: 'Publications & Reports', color: '#f59e0b', darkColor: '#f59e0b' },
      { path: '/admin', icon: Settings, label: 'Admin Panel', color: '#10b981', darkColor: '#34d399' },
    ]
  },
  {
    section: 'AI PREDICTIVE MODELS', items: [
      { path: '/predict', icon: Brain, label: 'Predictive Models', color: '#ef4444', darkColor: '#f43f5e' },
      { path: '/settings', icon: Settings, label: 'System Settings', color: '#6366f1', darkColor: '#818cf8' },
    ]
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const S = buildStyles(theme, isDark);

  return (
    <motion.div
      initial={{ x: -8, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={S.sidebar}
    >
      {isDark ? <div style={S.darkOrb} /> : <div style={S.lightGradient} />}

      {/* ── Logo ── */}
      <div style={S.logoArea}>
        <motion.div style={S.logoIcon} whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Shield size={18} color="white" />
          <span style={S.logoPulse} />
        </motion.div>
        <div>
          <div style={S.logoTitle}>PAIMANA<span style={{ color: '#0097d8' }}>-EWS</span></div>
          <div style={S.logoSub}>MoSPI · IPMD Admin Suite</div>
        </div>
      </div>

      <div style={S.topDivider} />

      {/* ── Navigation ── */}
      <nav style={S.nav}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 4 }}>
            <div style={S.sectionLabel}>{section}</div>
            {items.map(({ path, icon: Icon, label, color, darkColor }) => {
              const c = isDark ? darkColor : color;
              const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
              return (
                <NavLink key={path} to={path} style={{ textDecoration: 'none' }}>
                  <motion.div
                    style={{ ...S.navItem, background: active ? (isDark ? `${c}12` : `${c}10`) : 'transparent' }}
                    whileHover={{ x: 2, background: isDark ? `${c}0a` : `${c}08` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <AnimatePresence>
                      {active && (
                        <motion.div layoutId="navIndicator"
                          style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: `linear-gradient(180deg, ${c}, ${c}70)`, boxShadow: isDark ? `0 0 10px ${c}60` : `0 0 8px ${c}40` }}
                          initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    {active && !isDark && <span style={{ position: 'absolute', inset: 0, borderRadius: 10, background: `${c}08`, border: `1px solid ${c}18`, pointerEvents: 'none' }} />}
                    <div style={{ ...S.navIcon, color: active ? c : theme.textMuted, background: active ? (isDark ? `${c}15` : `${c}12`) : 'transparent', boxShadow: active && isDark ? `0 0 12px ${c}25` : 'none', transition: 'all 0.25s' }}>
                      <Icon size={15} />
                    </div>
                    <span style={{ ...S.navLabel, color: active ? theme.textPrimary : theme.textMuted, fontWeight: active ? 700 : 500, transition: 'all 0.2s' }}>
                      {label}
                    </span>
                    {active && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: c, boxShadow: isDark ? `0 0 6px ${c}` : `0 2px 4px ${c}50` }} />
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div style={S.footer}>
        <div style={S.footerTop}>
          <div style={S.statusBar}>
            <span style={S.statusDot} />
            <span style={S.statusText}>All Systems Online</span>
            <Zap size={9} color={theme.success} />
          </div>
          <motion.button onClick={toggle} style={S.themeToggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
            <motion.div key={isDark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              {isDark ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} color="#6366f1" />}
            </motion.div>
          </motion.button>
        </div>

        {/* User chip */}
        <div style={S.userChip}>
          <motion.div style={S.avatar} whileHover={{ scale: 1.08 }}>
            {(user?.name || 'A')[0].toUpperCase()}
          </motion.div>
          <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <div style={S.userName}>{user?.name || 'PMC Admin'}</div>
            <div style={S.userRole}>🏛 Government Admin</div>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <motion.button onClick={() => navigate('/settings')} style={S.iconAction} whileHover={{ scale: 1.15 }} title="Settings">
              <Settings size={12} />
            </motion.button>
            <motion.button onClick={logout} style={{ ...S.iconAction, color: theme.danger }} whileHover={{ scale: 1.15, color: theme.danger }} title="Logout">
              <LogOut size={12} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function buildStyles(t, isDark) {
  return {
    sidebar: { width: 248, minWidth: 248, height: '100vh', background: isDark ? 'linear-gradient(180deg, #0b1326 0%, #0f1a30 60%, #0b1326 100%)' : 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(20px)', borderRight: `1px solid ${t.sidebarBorder}`, display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 100, overflow: 'hidden', position: 'relative', transition: 'background 0.4s ease, border-color 0.4s ease', boxShadow: isDark ? 'none' : '4px 0 24px rgba(59, 130, 246, 0.04)' },
    darkOrb: { position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', top: -60, right: -60, pointerEvents: 'none', filter: 'blur(40px)', animation: 'floatOrb 18s ease-in-out infinite' },
    lightGradient: { position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(59,130,246,0.04) 0%, rgba(99,102,241,0.02) 50%, transparent 100%)' },
    logoArea: { padding: '1.2rem 1.1rem', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${t.border}`, position: 'relative' },
    logoIcon: { width: 40, height: 40, borderRadius: 13, flexShrink: 0, background: isDark ? 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(6,182,212,0.2))' : 'linear-gradient(135deg, #1d4ed8, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDark ? '0 0 20px rgba(14,165,233,0.3)' : '0 8px 20px -4px rgba(37,99,235,0.4)', position: 'relative', border: isDark ? '1px solid rgba(14,165,233,0.25)' : '1px solid rgba(255,255,255,0.3)' },
    logoPulse: { position: 'absolute', inset: -3, borderRadius: 16, border: isDark ? '1.5px solid rgba(14,165,233,0.2)' : '1.5px solid rgba(59,130,246,0.25)', animation: 'ctaGlow 3s ease infinite', pointerEvents: 'none' },
    logoTitle: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: t.textPrimary, transition: 'color 0.3s' },
    logoSub: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: t.textFaint },
    topDivider: { height: 1, background: isDark ? 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), rgba(6,182,212,0.15), transparent)' : 'linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent)' },
    nav: { flex: 1, padding: '0.5rem 0.65rem', overflowY: 'auto' },
    sectionLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: t.textFaint, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '12px 10px 4px' },
    navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 14, cursor: 'pointer', position: 'relative', marginBottom: 3, overflow: 'hidden', transition: 'background 0.25s' },
    navIcon: { width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    navLabel: { fontFamily: t.fontBody, fontSize: '0.84rem', flex: 1 },
    footer: { padding: '0.75rem', borderTop: `1px solid ${t.border}`, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' },
    footerTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    statusBar: { display: 'flex', alignItems: 'center', gap: 4, padding: '3px 7px', background: isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.06)', border: `1px solid ${isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.14)'}`, borderRadius: 6, flex: 1, marginRight: 6 },
    statusDot: { width: 6, height: 6, borderRadius: '50%', background: t.success || '#10b981', boxShadow: `0 0 5px ${t.success || '#10b981'}80`, flexShrink: 0, animation: 'pulse 2.5s ease infinite' },
    statusText: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.48rem', color: t.success || '#10b981', flex: 1 },
    themeToggle: { width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: isDark ? 'rgba(245,158,11,0.08)' : 'rgba(99,102,241,0.08)', border: `1px solid ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s', padding: 0 },
    userChip: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 12, marginBottom: 4, background: isDark ? 'rgba(23,31,51,0.8)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.border}`, transition: 'background 0.3s, border-color 0.3s' },
    avatar: { width: 30, height: 30, borderRadius: 9, background: isDark ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '0.78rem', color: 'white', boxShadow: isDark ? '0 0 14px rgba(14,165,233,0.3)' : '0 0 12px rgba(99,102,241,0.25)', flexShrink: 0, cursor: 'pointer' },
    userName: { fontFamily: t.fontHeading, fontWeight: 700, fontSize: '0.76rem', color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.3s' },
    userRole: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: t.textMuted },
    iconAction: { background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', padding: 4, transition: 'color 0.2s', flexShrink: 0 },
    quickLink: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 7, border: `1px solid ${t.border}`, transition: 'all 0.2s', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.52rem', fontWeight: 600 },
  };
}
