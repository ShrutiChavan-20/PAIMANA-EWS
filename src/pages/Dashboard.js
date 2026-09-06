// ============================================================
//  Dashboard — PAIMANA Sovereign Infrastructure Command Center
//  Styled with official PAIMANA color scheme (Pastel KPIs, Clean Filters, 4 Core Modules)
// ============================================================
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { trendData, statusColor, paimanaSummary, ministryAnalytics, sectorAnalytics, stateAnalytics, physicalProgressAnalytics } from '../data/paimanaData';
import { useProjects } from '../ProjectContext';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import StatusBadge from '../components/StatusBadge';
import { FloatingCard, CountUp, StaggerContainer, StaggerItem, ScrollReveal, TiltCard } from '../components/AnimatedPage';
import { InfraMetricCard, InfraCard, InfraChip, InfraTelemetry } from '../components/InfraCard';
import GlowButton from '../components/GlowButton';
import { 
  ArrowRight, TrendingUp, AlertTriangle, Activity, BarChart3, 
  Map, FileText, Zap, Radio, Cpu, Layers, ShieldAlert, 
  IndianRupee, Table, BookOpen, Brain, ExternalLink, Sparkles,
  FileSpreadsheet, Filter, ChevronDown, Search, ArrowUpRight, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Tooltip, Legend);

// Official PAIMANA Sector Palette from screenshots
const SECTOR_COLORS = [
  '#1e293b', // Roads & Highways (Navy)
  '#16a34a', // Railways (Green)
  '#eab308', // Coal (Yellow)
  '#f97316', // Oil & Gas (Orange)
  '#3b82f6', // Transmission & Distribution (Blue)
  '#8b5cf6', // Healthcare (Purple)
  '#ec4899', // Electricity Generation (Pink)
  '#f43f5e', // Education (Rose)
  '#fb7185', // Telecommunication (Salmon)
  '#38bdf8', // Water Resources (Sky Blue)
  '#22d3ee', // Others (Cyan)
];

const tooltipStyle = {
  backgroundColor: '#0f172a',
  titleColor: '#f8fafc',
  bodyColor: '#cbd5e1',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  titleFont: { family: "'Plus Jakarta Sans',sans-serif", weight: '700' },
  bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
};

const axisStyle = {
  grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
  ticks: { color: '#64748b', font: { family: "'JetBrains Mono',monospace", size: 10 } },
  border: { display: false },
};

export default function Dashboard() {
  const issues = [];
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const { projects } = useProjects();

  // Filter States (matching official top filter bar)
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMinistry, setSelectedMinistry] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCost, setSelectedCost] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('2026-07');

  // View switchers for the 4 official sections ([Charts] vs [Data])
  const [sectorView, setSectorView] = useState('chart');
  const [costView, setCostView] = useState('chart');
  const [progressView, setProgressView] = useState('chart');
  const [stateView, setStateView] = useState('chart');

  // Filtered dataset for dashboard
  const filteredProjectsCount = useMemo(() => {
    let count = paimanaSummary.totalProjects;
    if (selectedSector !== 'All') {
      const s = sectorAnalytics.find(x => x.sector === selectedSector);
      if (s) count = s.count;
    } else if (selectedMinistry !== 'All') {
      const m = ministryAnalytics.find(x => x.ministry.includes(selectedMinistry));
      if (m) count = m.count;
    } else if (selectedState !== 'All') {
      const st = (stateAnalytics || []).find(x => x.state === selectedState);
      if (st) count = st.count;
    }
    return count;
  }, [selectedSector, selectedMinistry, selectedState]);

  // Sector-wise Nested Doughnut Chart Data (Inner: Cost, Outer: Count)
  const topSectors = sectorAnalytics.slice(0, 10);
  const sectorDoughnutData = {
    labels: topSectors.map(s => s.sector),
    datasets: [
      {
        label: 'Projects Count',
        data: topSectors.map(s => s.count),
        backgroundColor: SECTOR_COLORS,
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        weight: 1.2,
      },
      {
        label: 'Revised Cost (₹ Cr)',
        data: topSectors.map(s => Math.round(s.revisedCostCr / 100)),
        backgroundColor: SECTOR_COLORS.map(c => `${c}B3`),
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        weight: 0.8,
      }
    ]
  };

  // Physical Progress Bar Chart Data
  const progressBarsData = {
    labels: (physicalProgressAnalytics || []).map(p => p.range),
    datasets: [{
      label: 'Projects Count',
      data: (physicalProgressAnalytics || []).map(p => p.count),
      backgroundColor: '#2f5233', // Deep Green matching official screenshot
      hoverBackgroundColor: '#16a34a',
      borderRadius: 4,
      barThickness: 38,
    }]
  };

  // State-wise Sunburst / Doughnut Arc Data
  const topStates = (stateAnalytics || []).slice(0, 12);
  const stateArcData = {
    labels: topStates.map(s => s.state),
    datasets: [{
      label: 'Projects',
      data: topStates.map(s => s.count),
      backgroundColor: [
        '#1e293b', '#2563eb', '#38bdf8', '#06b6d4', '#10b981', '#84cc16',
        '#eab308', '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#64748b'
      ],
      borderWidth: 2,
      borderColor: isDark ? '#0f172a' : '#ffffff',
    }]
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ background: isDark ? '#070d1e' : '#f4f6f9', minHeight: '100vh', paddingBottom: '3rem' }}>

      {/* ── 1. Top Institutional Branding Header (Official Government Style) ── */}
      <div style={{ background: isDark ? '#0b1329' : '#ffffff', borderBottom: `1px solid ${theme.border}`, padding: '10px 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        
        {/* Left: Emblem & Ministry Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: '1.3rem' }}>🏛️</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.86rem', color: theme.textPrimary, letterSpacing: '-0.01em' }}>
              Ministry of Statistics and Programme Implementation
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: theme.textMuted }}>
              Government of India · Infrastructure & Project Monitoring Division (IPMD)
            </div>
          </div>
        </div>

        {/* Center: Action Pills */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/report" style={{ textDecoration: 'none' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
              background: 'linear-gradient(135deg, #f58220, #ea580c)', color: '#ffffff',
              border: 'none', borderRadius: 20, padding: '7px 18px',
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.72rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(234,88,12,0.3)',
            }}>
              <span>+</span> ADD PROJECT / CUF UPDATE
            </motion.button>
          </Link>
          <Link to="/publications" style={{ textDecoration: 'none' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
              background: isDark ? '#1e3a8a' : '#1e3a8a', color: '#ffffff',
              border: 'none', borderRadius: 20, padding: '7px 18px',
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.72rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(30,58,138,0.25)',
            }}>
              <BookOpen size={12} /> REPORTS ARCHIVE
            </motion.button>
          </Link>
          <Link to="/predict" style={{ textDecoration: 'none' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
              background: isDark ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'linear-gradient(135deg, #0284c7, #0284c7)', color: '#ffffff',
              border: 'none', borderRadius: 20, padding: '7px 16px',
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.72rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(2,132,199,0.25)',
            }}>
              <Brain size={12} /> AI PREDICTIVE SUITE
            </motion.button>
          </Link>
        </div>

        {/* Right: PAIMANA Logo Motif */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.35rem', letterSpacing: '0.08em', color: '#0097d8' }}>
            P<span style={{ color: '#f58220' }}>A</span>IM<span style={{ color: '#0097d8' }}>A</span>N<span style={{ color: '#f58220' }}>A</span><span style={{ fontSize: '0.85rem', color: '#1e3a8a', background: '#e0f2fe', padding: '2px 6px', borderRadius: 4, marginLeft: 4, verticalAlign: 'middle' }}>EWS</span>
          </span>
          <span style={{ fontSize: '1rem' }}>🏗️</span>
        </div>
      </div>

      {/* ── 2. Cyan-Blue Sub-Navbar Ribbon ── */}
      <div style={{ background: '#0097d8', padding: '6px 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '2px solid #ffffff', paddingBottom: 2 }}>Home</Link>
          <Link to="/publications" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Publications ▾</Link>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Dashboard ▾</Link>
          <Link to="/predict" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Predictive Models</Link>
          <Link to="/trust" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Agency Benchmarks</Link>
          <Link to="/report" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Field Audit & CUF</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', opacity: 0.95 }}>
          <span>● MoSPI Flash Report · July 2026</span>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '1.2rem 1.5rem' }}>

        {/* ── 3. Public Dashboard Header & Dropdown Filter Bar ── */}
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '0.85rem' }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: theme.textPrimary, margin: 0 }}>
              Public Dashboard
            </h1>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: theme.textMuted, fontStyle: 'italic' }}>
              (as of July 2026)
            </span>
          </div>

          {/* Filter Bar Row */}
          <div style={{
            background: isDark ? '#0b1329' : '#ffffff',
            border: `1px solid ${theme.border}`,
            borderRadius: 10,
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr) auto',
            gap: 12,
            alignItems: 'end',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {/* Sector */}
            <div>
              <label style={filterLabelStyle}>Sector</label>
              <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} style={filterSelectStyle(isDark)}>
                <option value="All">All</option>
                {sectorAnalytics.map(s => <option key={s.sector} value={s.sector}>{s.sector}</option>)}
              </select>
            </div>

            {/* Ministry */}
            <div>
              <label style={filterLabelStyle}>Ministry/ Department</label>
              <select value={selectedMinistry} onChange={e => setSelectedMinistry(e.target.value)} style={filterSelectStyle(isDark)}>
                <option value="All">All</option>
                {ministryAnalytics.map(m => <option key={m.ministry} value={m.ministry}>{m.ministry}</option>)}
              </select>
            </div>

            {/* States / UTs */}
            <div>
              <label style={filterLabelStyle}>States/ UTs</label>
              <select value={selectedState} onChange={e => setSelectedState(e.target.value)} style={filterSelectStyle(isDark)}>
                <option value="All">All</option>
                {(stateAnalytics || []).map(st => <option key={st.state} value={st.state}>{st.state}</option>)}
              </select>
            </div>

            {/* Project Cost */}
            <div>
              <label style={filterLabelStyle}>Project Cost (in cr)</label>
              <select value={selectedCost} onChange={e => setSelectedCost(e.target.value)} style={filterSelectStyle(isDark)}>
                <option value="All">All</option>
                <option value="150-1000">₹150 Cr - ₹1,000 Cr</option>
                <option value="1000-5000">₹1,000 Cr - ₹5,000 Cr</option>
                <option value="5000+">&gt; ₹5,000 Cr (Mega)</option>
              </select>
            </div>

            {/* Month & Year */}
            <div>
              <label style={filterLabelStyle}>Month & Year</label>
              <input type="text" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={filterSelectStyle(isDark)} />
            </div>

            {/* Show Data Button */}
            <div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                background: '#475569', color: '#ffffff',
                border: 'none', borderRadius: 8, padding: '9px 20px',
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.75rem',
                cursor: 'pointer', height: 36, whiteSpace: 'nowrap',
              }}>
                Show Data
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── 4. The 4 Canonical Pastel KPI Cards (Matches Official Site Colors) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.4rem' }}>
          
          {/* Card 1: Project Count (Mint Pastel) */}
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} style={{
            background: isDark ? 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(13,148,136,0.08))' : '#dff9f6',
            border: `1.5px solid ${isDark ? 'rgba(45,212,191,0.3)' : '#99f6e4'}`,
            borderRadius: 14, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              📋
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#334155', fontWeight: 600 }}>
                Project Count <span style={{ fontStyle: 'italic', fontSize: '0.65rem' }}>(in no.)</span>
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.85rem', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                <CountUp target={filteredProjectsCount} duration={1.2} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: '#0d9488', fontWeight: 600, marginTop: 3 }}>
                ≥ ₹150 Cr threshold
              </div>
            </div>
          </motion.div>

          {/* Card 2: Original Approved Cost (Cream / Yellow Pastel) */}
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} style={{
            background: isDark ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))' : '#fff5d6',
            border: `1.5px solid ${isDark ? 'rgba(251,191,36,0.3)' : '#fde68a'}`,
            borderRadius: 14, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              ⬆️
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#334155', fontWeight: 600 }}>
                Original Approved Cost <span style={{ fontStyle: 'italic', fontSize: '0.65rem' }}>(in cr.)</span>
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.85rem', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ₹ 33,70,138
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: '#b45309', fontWeight: 600, marginTop: 3 }}>
                Sanctioned baseline
              </div>
            </div>
          </motion.div>

          {/* Card 3: Latest Revised Cost (Peach / Pink Pastel) */}
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} style={{
            background: isDark ? 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(225,29,72,0.08))' : '#ffe6e6',
            border: `1.5px solid ${isDark ? 'rgba(251,113,133,0.3)' : '#fecaca'}`,
            borderRadius: 14, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              💸
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#334155', fontWeight: 600 }}>
                Latest Revised Cost <span style={{ fontStyle: 'italic', fontSize: '0.65rem' }}>(in cr.)</span>
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.85rem', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ₹ 37,10,642
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: '#e11d48', fontWeight: 600, marginTop: 3 }}>
                +₹3.40 Lakh Cr escalation
              </div>
            </div>
          </motion.div>

          {/* Card 4: Cumulative Expenditure (Light Sage / Green Pastel) */}
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} style={{
            background: isDark ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.08))' : '#f0fdf4',
            border: `1.5px solid ${isDark ? 'rgba(74,222,128,0.3)' : '#bbf7d0'}`,
            borderRadius: 14, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              📈
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#334155', fontWeight: 600 }}>
                Cumulative Expenditure <span style={{ fontStyle: 'italic', fontSize: '0.65rem' }}>(in cr.)</span>
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.85rem', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ₹ 19,26,100
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: '#16a34a', fontWeight: 600, marginTop: 3 }}>
                51.91% disbursed
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── 5. The 4 Main PAIMANA Dashboard Modules (2x2 Grid) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
          
          {/* ── Card 1: Sector-wise Distribution ── */}
          <div style={cardBoxStyle(isDark)}>
            <div style={cardHeaderStyle(isDark)}>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: theme.textPrimary, margin: 0 }}>
                  Sector-wise Distribution
                </h3>
                {/* Export Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={exportBadgeStyle('#dc2626', isDark)}>📄 CSV</span>
                  <span style={exportBadgeStyle('#16a34a', isDark)}>📊 XLS</span>
                  <span style={{ fontSize: '0.62rem', color: theme.textMuted, fontStyle: 'italic' }}>
                    [ Outer Ring : Count :: Inner Ring : Cost ]
                  </span>
                </div>
              </div>
              {/* Charts / Data Switcher */}
              <div style={toggleContainerStyle(isDark)}>
                <button onClick={() => setSectorView('chart')} style={toggleBtnStyle(sectorView === 'chart', isDark)}>Charts</button>
                <button onClick={() => setSectorView('data')} style={toggleBtnStyle(sectorView === 'data', isDark)}>Data</button>
              </div>
            </div>

            <div style={{ padding: '1rem' }}>
              {sectorView === 'chart' ? (
                <div>
                  <div style={{ height: 220, position: 'relative' }}>
                    <Doughnut data={sectorDoughnutData} options={{
                      responsive: true, maintainAspectRatio: false, cutout: '55%',
                      plugins: { legend: { display: false }, tooltip: tooltipStyle },
                    }} />
                  </div>
                  {/* Legend Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', marginTop: 10, justifyContent: 'center' }}>
                    {topSectors.map((s, i) => (
                      <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.62rem', color: theme.textMuted }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                        <span>{s.sector}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: 260, overflowY: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={thRowStyle(isDark)}>
                        <th style={thStyle}>Sector</th>
                        <th style={thStyle}>Count</th>
                        <th style={thStyle}>Original (₹ Cr)</th>
                        <th style={thStyle}>Revised (₹ Cr)</th>
                        <th style={thStyle}>Escalation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectorAnalytics.map((s, idx) => (
                        <tr key={s.sector} style={trStyle(idx, isDark)}>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{s.sector}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#0ea5e9' }}>{s.count}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace" }}>{s.originalCostCr.toLocaleString()}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace" }}>{s.revisedCostCr.toLocaleString()}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: s.escalationCr > 0 ? '#e11d48' : '#16a34a' }}>
                            {s.escalationCr > 0 ? `+${s.escalationCr.toLocaleString()}` : s.escalationCr.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Card 2: Cost Overview ── */}
          <div style={cardBoxStyle(isDark)}>
            <div style={cardHeaderStyle(isDark)}>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: theme.textPrimary, margin: 0 }}>
                  Cost Overview
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={exportBadgeStyle('#dc2626', isDark)}>📄 CSV</span>
                  <span style={exportBadgeStyle('#16a34a', isDark)}>📊 XLS</span>
                  <span style={{ fontSize: '0.62rem', color: theme.textMuted, fontStyle: 'italic' }}>
                    Financial reconciliation of ₹37.11 Lakh Cr portfolio
                  </span>
                </div>
              </div>
              <div style={toggleContainerStyle(isDark)}>
                <button onClick={() => setCostView('chart')} style={toggleBtnStyle(costView === 'chart', isDark)}>Charts</button>
                <button onClick={() => setCostView('data')} style={toggleBtnStyle(costView === 'data', isDark)}>Data</button>
              </div>
            </div>

            <div style={{ padding: '1.2rem' }}>
              {costView === 'chart' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', paddingTop: 10 }}>
                  
                  {/* Tier 1: Original Cost Block */}
                  <motion.div whileHover={{ scale: 1.02 }} style={{
                    width: '92%', background: '#0f172a', color: '#ffffff',
                    borderRadius: 8, padding: '14px 20px', textAlign: 'center',
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.3)', border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    Original Cost: ₹ 33,70,138 cr
                  </motion.div>

                  {/* Tier 2: Revised Cost Block */}
                  <motion.div whileHover={{ scale: 1.02 }} style={{
                    width: '84%', background: '#1e3a8a', color: '#ffffff',
                    borderRadius: 8, padding: '14px 20px', textAlign: 'center',
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(30,58,138,0.3)', border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    Revised Cost: ₹ 37,10,642 cr
                  </motion.div>

                  {/* Tier 3: Expenditure Block */}
                  <motion.div whileHover={{ scale: 1.02 }} style={{
                    width: '76%', background: '#1d4ed8', color: '#ffffff',
                    borderRadius: 8, padding: '14px 20px', textAlign: 'center',
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(29,78,216,0.3)', border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    Expenditure: ₹ 19,26,100 cr
                  </motion.div>

                  {/* Metrics summary strip */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.7rem', color: theme.textMuted }}>
                    <span>📈 Cost Escalation: <strong style={{ color: '#e11d48' }}>+₹3,40,503 Cr</strong></span>
                    <span>💰 Unspent Budget: <strong style={{ color: '#16a34a' }}>₹17,84,542 Cr</strong></span>
                  </div>
                </div>
              ) : (
                <div style={{ height: 260, overflowY: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={thRowStyle(isDark)}>
                        <th style={thStyle}>Metric</th>
                        <th style={thStyle}>Amount (₹ Cr)</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={trStyle(0, isDark)}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>Original Sanctioned Cost</td>
                        <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#0ea5e9' }}>₹33,70,138.22 Cr</td>
                        <td style={{ ...tdStyle, color: '#16a34a' }}>Baseline (100%)</td>
                      </tr>
                      <tr style={trStyle(1, isDark)}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>Latest Revised Cost</td>
                        <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#8b5cf6' }}>₹37,10,641.55 Cr</td>
                        <td style={{ ...tdStyle, color: '#e11d48' }}>+10.10% Escalation</td>
                      </tr>
                      <tr style={trStyle(2, isDark)}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>Cumulative Expenditure</td>
                        <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#16a34a' }}>₹19,26,099.57 Cr</td>
                        <td style={{ ...tdStyle, color: '#16a34a' }}>51.91% Disbursed</td>
                      </tr>
                      <tr style={trStyle(3, isDark)}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>Total Portfolio Overrun</td>
                        <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#e11d48' }}>₹3,40,503.33 Cr</td>
                        <td style={{ ...tdStyle, color: '#e11d48' }}>635 Red Projects</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Card 3: Physical Progress [Project Count] ── */}
          <div style={cardBoxStyle(isDark)}>
            <div style={cardHeaderStyle(isDark)}>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: theme.textPrimary, margin: 0 }}>
                  Physical Progress <span style={{ fontSize: '0.72rem', fontStyle: 'italic' }}>[Project Count]</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={exportBadgeStyle('#dc2626', isDark)}>📄 CSV</span>
                  <span style={exportBadgeStyle('#16a34a', isDark)}>📊 XLS</span>
                  <span style={{ fontSize: '0.62rem', color: theme.textMuted, fontStyle: 'italic' }}>
                    Milestone completion bands across 1,775 projects
                  </span>
                </div>
              </div>
              <div style={toggleContainerStyle(isDark)}>
                <button onClick={() => setProgressView('chart')} style={toggleBtnStyle(progressView === 'chart', isDark)}>Charts</button>
                <button onClick={() => setProgressView('data')} style={toggleBtnStyle(progressView === 'data', isDark)}>Data</button>
              </div>
            </div>

            <div style={{ padding: '1rem' }}>
              {progressView === 'chart' ? (
                <div style={{ height: 250 }}>
                  <Bar data={progressBarsData} options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: tooltipStyle,
                    },
                    scales: { 
                      x: axisStyle, 
                      y: { ...axisStyle, beginAtZero: true } 
                    },
                  }} />
                </div>
              ) : (
                <div style={{ height: 260, overflowY: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={thRowStyle(isDark)}>
                        <th style={thStyle}>Progress Range</th>
                        <th style={thStyle}>Count</th>
                        <th style={thStyle}>% Share</th>
                        <th style={thStyle}>Stage Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(physicalProgressAnalytics || []).map((p, idx) => (
                        <tr key={p.range} style={trStyle(idx, isDark)}>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{p.range}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#0ea5e9' }}>{p.count}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace" }}>{p.pct}%</td>
                          <td style={{ ...tdStyle, color: idx < 2 ? '#e11d48' : idx < 4 ? '#f59e0b' : '#16a34a' }}>
                            {idx < 2 ? 'Initial / High Risk' : idx < 4 ? 'Mid Execution' : 'Near Completion'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Card 4: State-wise Distribution [Project Count] ── */}
          <div style={cardBoxStyle(isDark)}>
            <div style={cardHeaderStyle(isDark)}>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: theme.textPrimary, margin: 0 }}>
                  State-wise Distribution <span style={{ fontSize: '0.72rem', fontStyle: 'italic' }}>[Project Count]</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={exportBadgeStyle('#dc2626', isDark)}>📄 CSV</span>
                  <span style={exportBadgeStyle('#16a34a', isDark)}>📊 XLS</span>
                  <span style={{ fontSize: '0.62rem', color: theme.textMuted, fontStyle: 'italic' }}>
                    Geographic dispersion across States & UTs
                  </span>
                </div>
              </div>
              <div style={toggleContainerStyle(isDark)}>
                <button onClick={() => setStateView('chart')} style={toggleBtnStyle(stateView === 'chart', isDark)}>Charts</button>
                <button onClick={() => setStateView('data')} style={toggleBtnStyle(stateView === 'data', isDark)}>Data</button>
              </div>
            </div>

            <div style={{ padding: '1rem' }}>
              {stateView === 'chart' ? (
                <div>
                  <div style={{ height: 210, position: 'relative' }}>
                    <Doughnut data={stateArcData} options={{
                      responsive: true, maintainAspectRatio: false, cutout: '65%',
                      plugins: { legend: { display: false }, tooltip: tooltipStyle },
                    }} />
                  </div>
                  {/* Top States Callout Percentages */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginTop: 10, justifyContent: 'center' }}>
                    {[
                      { state: 'Multi-State', pct: '8.7%' },
                      { state: 'Maharashtra', pct: '3.7%' },
                      { state: 'Uttar Pradesh', pct: '3.6%' },
                      { state: 'Rajasthan', pct: '3.5%' },
                      { state: 'Tamil Nadu', pct: '3.1%' },
                      { state: 'Gujarat', pct: '2.9%' },
                      { state: 'Madhya Pradesh', pct: '2.7%' },
                      { state: 'Karnataka', pct: '2.5%' },
                    ].map(st => (
                      <span key={st.state} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: theme.textMuted, background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                        {st.state}: <strong style={{ color: theme.textPrimary }}>{st.pct}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: 260, overflowY: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={thRowStyle(isDark)}>
                        <th style={thStyle}>State</th>
                        <th style={thStyle}>Count</th>
                        <th style={thStyle}>Delayed</th>
                        <th style={thStyle}>Portfolio (₹ Cr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stateAnalytics || []).map((st, idx) => (
                        <tr key={st.state} style={trStyle(idx, isDark)}>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{st.state}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#0ea5e9' }}>{st.count}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace", color: '#e11d48' }}>{st.delayedCount}</td>
                          <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono',monospace" }}>₹{st.costCr.toLocaleString()} Cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── 6. AI Predictive Intelligence Banner ── */}
        <div style={{
          background: isDark ? '#0b1329' : '#ffffff',
          border: `1px solid ${theme.border}`,
          borderRadius: 14, padding: '1.2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <InfraChip label="AI PREDICTIVE SUITE READY" color="#0ea5e9" dot />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: theme.textMuted }}>SIH 2026 Innovation Layer</span>
            </div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: theme.textPrimary, margin: '6px 0 2px' }}>
              Proactive Decision Support & Early Warning System
            </h3>
            <p style={{ color: theme.textMuted, fontSize: '0.78rem', margin: 0 }}>
              Forecast cost overruns, calculate schedule delays, triage project risk scores, and simulate CUF intervention scenarios.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/predict" style={{ textDecoration: 'none' }}>
              <GlowButton variant="primary" size="sm" icon={<Brain size={13} />}>Open AI Predictor</GlowButton>
            </Link>
            <Link to="/ai-chat" style={{ textDecoration: 'none' }}>
              <GlowButton variant="glass" size="sm" icon={<Sparkles size={13} />}>Ask PAIMANA Copilot</GlowButton>
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// ── Styles ──
const filterLabelStyle = {
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  fontSize: '0.68rem',
  fontWeight: 600,
  color: '#64748b',
  marginBottom: 4,
  display: 'block',
};

const filterSelectStyle = (isDark) => ({
  width: '100%',
  height: 36,
  borderRadius: 8,
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
  background: isDark ? '#070d1e' : '#ffffff',
  color: isDark ? '#f8fafc' : '#0f172a',
  fontFamily: "'Inter',sans-serif",
  fontSize: '0.75rem',
  padding: '0 8px',
  outline: 'none',
});

const cardBoxStyle = (isDark) => ({
  background: isDark ? '#0b1329' : '#ffffff',
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
  borderRadius: 14,
  overflow: 'hidden',
  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.03)',
});

const cardHeaderStyle = (isDark) => ({
  padding: '12px 16px',
  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const exportBadgeStyle = (color, isDark) => ({
  fontSize: '0.55rem',
  fontFamily: "'JetBrains Mono',monospace",
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: 4,
  background: `${color}15`,
  color: color,
  border: `1px solid ${color}30`,
  cursor: 'pointer',
});

const toggleContainerStyle = (isDark) => ({
  display: 'flex',
  background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
  borderRadius: 8,
  padding: 2,
});

const toggleBtnStyle = (active, isDark) => ({
  padding: '4px 12px',
  borderRadius: 6,
  border: 'none',
  background: active ? '#475569' : 'transparent',
  color: active ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
  fontSize: '0.68rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.72rem',
};

const thRowStyle = (isDark) => ({
  background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
  position: 'sticky',
  top: 0,
  zIndex: 1,
});

const thStyle = {
  padding: '7px 10px',
  textAlign: 'left',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.6rem',
  textTransform: 'uppercase',
  color: '#64748b',
  letterSpacing: '0.04em',
};

const trStyle = (idx, isDark) => ({
  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'}`,
  background: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : '#fafafa'),
});

const tdStyle = {
  padding: '7px 10px',
  color: 'inherit',
};


