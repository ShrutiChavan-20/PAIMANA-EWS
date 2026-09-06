// ============================================================
//  PublicationsPage — Mirrors official paimana-proj.mospi.gov.in/ReportPage
//  Two sections: Project Monitoring (Flash Reports) + Performance Monitoring (Review Reports)
// ============================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { InfraCard, InfraChip } from '../components/InfraCard';
import GlowButton from '../components/GlowButton';
import { FileText, Download, Archive, ChevronRight, BookOpen, TrendingUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Helper function to generate and download real PDF report documents
const downloadReportPDF = (reportTitle, month, focusText = '', toastCallback = null) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // #0f172a Deep Slate
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(56, 189, 248); // #38bdf8 Light Blue
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA · MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION', 14, 12);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('PAIMANA-EWS OFFICIAL MONITORING REPORT', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // #cbd5e1
  doc.text('Infrastructure & Project Monitoring Division (IPMD) · OCMS Portal', 14, 30);
  doc.text(`Classification: OFFICIAL RELEASE · ${month.toUpperCase()}`, 14, 36);

  // Accent Bar
  doc.setFillColor(14, 165, 233); // #0ea5e9
  doc.rect(0, 42, pageWidth, 2, 'F');

  let y = 52;

  // 2. Report Overview Box
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${reportTitle} — ${month}`, 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Release Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, 18, y + 15);
  doc.text(`Archive Reference: PAIMANA-EWS-REP-${month.replace(/\s+/g, '-').toUpperCase()}`, 18, y + 21);

  y += 34;

  // 3. Executive Portfolio Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE PORTFOLIO SUMMARY', 14, y);
  doc.setLineWidth(0.5);
  doc.setDrawColor(14, 165, 233);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;

  const stats = [
    ['Total Monitored Projects (>= Rs. 150 Cr)', '1,775 Central Sector Projects'],
    ['Total Sanctioned Portfolio Cost', 'Rs. 37,11,480 Crore'],
    ['Total Cumulative Cost Escalation', 'Rs. 3,40,290 Crore (+9.17%)'],
    ['Schedule Delay Rate', '62.0% (1,102 delayed projects)'],
    ['Critical Risk Category (Red Alert)', '635 projects requiring triage'],
  ];

  doc.setFontSize(9);
  stats.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${label}:`, 18, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 110, y);
    y += 6;
  });

  y += 4;

  // 4. Sector-Wise Performance Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SECTOR-WISE PERFORMANCE BREAKDOWN', 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Sector Name', 18, y + 5);
  doc.text('Total Projects', 80, y + 5);
  doc.text('On-Track', 115, y + 5);
  doc.text('Delayed', 145, y + 5);
  doc.text('Avg Delay', 175, y + 5);

  y += 7;

  const rows = [
    ['Roads & Highways', '993', '373', '620', '20.8 Months'],
    ['Railways', '192', '52', '140', '42.4 Months'],
    ['Power & Energy', '98', '40', '58', '13.6 Months'],
    ['Petroleum & Gas', '103', '31', '72', '15.4 Months'],
    ['Coal', '115', '70', '45', '8.2 Months'],
    ['Urban Transport', '63', '25', '38', '28.5 Months'],
  ];

  rows.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 241 : 255, idx % 2 === 0 ? 245 : 255, idx % 2 === 0 ? 249 : 255);
    doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(row[0], 18, y + 4.5);
    doc.text(row[1], 80, y + 4.5);
    doc.setTextColor(16, 185, 129); // Green
    doc.text(row[2], 115, y + 4.5);
    doc.setTextColor(239, 68, 68); // Red
    doc.text(row[3], 145, y + 4.5);
    doc.setTextColor(71, 85, 105);
    doc.text(row[4], 175, y + 4.5);
    y += 6.5;
  });

  y += 8;

  // 5. Key Highlights
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`3. MONTHLY KEY HIGHLIGHTS & FINDINGS (${month.toUpperCase()})`, 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;

  doc.setFillColor(254, 243, 199); // Light amber
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

  const highlightText = focusText || 'Land acquisition bottlenecks affect 34% of delayed projects. Decoupling gap between financial expenditure and physical progress identified across priority corridors.';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  const splitText = doc.splitTextToSize(highlightText, pageWidth - 36);
  doc.text(splitText, 18, y + 6);

  y += 22;

  // 6. Recommended Interventions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. RECOMMENDED INTERVENTIONS & EWS ALERTS', 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;

  const recommendations = [
    '1. Convene Sectoral Project Review Committees (SPRC) for 635 Critical Red projects.',
    '2. Fast-track Stage-II Forest Clearances for Power and Railway expansion corridors.',
    '3. Perform mandatory Contractor Trust Score audits before disbursing Q3 milestone funds.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  recommendations.forEach(rec => {
    doc.text(rec, 18, y);
    y += 5.5;
  });

  // Footer
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 282, pageWidth, 15, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('PAIMANA-EWS · Ministry of Statistics & Programme Implementation · Government of India', 14, 289);
  doc.text('Page 1 of 1', pageWidth - 25, 289);

  // Save PDF
  const filename = `PAIMANA_EWS_${reportTitle.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);

  if (toastCallback) {
    toastCallback(`✓ Downloaded ${reportTitle} (${month})`);
  }
};

// ── Flash Report archive (Project Monitoring) ──────────────────────────────
const FLASH_REPORTS = [
  { month: 'July 2026', label: 'New', size: '6.1 MB', projects: 1775, highlight: 'Cost escalation touches ₹3.40 Lakh Cr. 635 projects in Red category.' },
  { month: 'June 2026', size: '5.8 MB', projects: 1769, highlight: '1,102 projects delayed. Railways avg delay at 42.4 months.' },
  { month: 'May 2026', size: '5.7 MB', projects: 1762, highlight: 'MoRTH completes NH-48 phase widening. Petroleum sector on track.' },
  { month: 'April 2026', size: '5.6 MB', projects: 1754, highlight: 'DFCCIL Western DFC at 96% physical completion.' },
  { month: 'March 2026', label: 'Published', size: '5.5 MB', projects: 1748, highlight: 'Mumbai-Ahmedabad HSRC reports 62% physical, 84% financial progress.' },
  { month: 'February 2026', size: '5.4 MB', projects: 1741, highlight: 'Power sector hydro projects cleared Stage-II forest diversion.' },
  { month: 'January 2026', size: '5.3 MB', projects: 1737, highlight: 'Land acquisition bottleneck affects 34% of delayed projects.' },
  { month: 'December 2025', size: '5.2 MB', projects: 1729, highlight: 'Contractor liquidity crunch impacts 18% of active projects.' },
  { month: 'November 2025', size: '5.1 MB', projects: 1721, highlight: 'Coal sector shows negative escalation (-₹2,026 Cr) — scope optimization.' },
  { month: 'October 2025', size: '5.0 MB', projects: 1715, highlight: 'Defence infra projects: 27 critical. Avg delay 54.2 months.' },
  { month: 'September 2025', size: '4.9 MB', projects: 1708, highlight: 'Port connectivity projects report 78% physical progress in Western zone.' },
  { month: 'August 2025', size: '4.8 MB', projects: 1702, highlight: 'Monsoon season impact: 142 highway projects report schedule slippage.' },
];

// ── Review Report archive (Performance Monitoring) ─────────────────────────
const REVIEW_REPORTS = [
  { month: 'July 2026', label: 'New', size: '6.4 MB', focus: 'Sector-wise Physical Progress vs Financial Expenditure Decoupling Analysis' },
  { month: 'June 2026', size: '6.2 MB', focus: 'Q1 FY2027 Infrastructure Budget Allocation & Disbursement Efficiency Audit' },
  { month: 'May 2026', size: '6.0 MB', focus: 'Contractor Trust Index Scorecard — Top 50 Infrastructure Executing Agencies' },
  { month: 'April 2026', size: '5.8 MB', focus: 'State-Level Land Acquisition & Utility Shifting Speed Index (Q4 FY2026)' },
  { month: 'March 2026', size: '5.7 MB', focus: 'Annual Infrastructure Completion Rate & Cost Efficiency Review FY2025-26' },
  { month: 'February 2026', size: '5.5 MB', focus: 'Railway Electrification & Dedicated Freight Corridor Performance Audit' },
  { month: 'January 2026', label: 'Published', size: '5.9 MB', focus: 'Ministry Rankings — Escalation & Delay Benchmarking Report (Q3 FY2026)' },
  { month: 'December 2025', size: '5.6 MB', focus: 'Annual Infrastructure Completion Rate & Cost Efficiency Review FY2025' },
  { month: 'November 2025', size: '5.4 MB', focus: 'Thermal & Renewable Energy Generation Expansion Milestone Assessment' },
  { month: 'October 2025', size: '5.3 MB', focus: 'National Waterways & Port Infrastructure Acceleration Evaluation' },
  { month: 'September 2025', size: '5.4 MB', focus: 'Mid-Year Performance Monitoring — Physical vs Financial Convergence' },
  { month: 'August 2025', size: '5.1 MB', focus: 'Q2 Monsoon Resiliency & Critical Project Risk Mitigation Brief' },
];

const SECTOR_STATS = [
  { sector: 'Roads & Highways', count: 993, delayed: 620, onTrack: 373, color: '#ef4444' },
  { sector: 'Railways', count: 192, delayed: 140, onTrack: 52, color: '#f59e0b' },
  { sector: 'Power & Energy', count: 98, delayed: 58, onTrack: 40, color: '#6366f1' },
  { sector: 'Petroleum & Gas', count: 103, delayed: 72, onTrack: 31, color: '#06b6d4' },
  { sector: 'Coal', count: 115, delayed: 45, onTrack: 70, color: '#10b981' },
  { sector: 'Urban Transport', count: 63, delayed: 38, onTrack: 25, color: '#8b5cf6' },
];

export default function PublicationsPage() {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('project'); // 'project' | 'performance'
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 3500); };

  const tabStyle = (t) => ({
    padding: '8px 20px',
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 700,
    fontSize: '0.82rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    background: activeTab === t
      ? (isDark ? 'linear-gradient(135deg,#0ea5e9,#06b6d4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)')
      : 'transparent',
    color: activeTab === t ? '#fff' : theme.textMuted,
    boxShadow: activeTab === t ? (isDark ? '0 0 16px rgba(14,165,233,0.35)' : '0 0 14px rgba(99,102,241,0.25)') : 'none',
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

      {/* Toast alert */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 20, right: 20, background: '#10b981', color: '#fff', padding: '10px 18px', borderRadius: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', fontWeight: 700, zIndex: 1000, boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <BookOpen size={18} color={isDark ? '#0ea5e9' : '#6366f1'} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: isDark ? '#0ea5e9' : '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PAIMANA-EWS Publications — IPMD · MoSPI</span>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.7rem', color: theme.textPrimary, marginBottom: 4 }}>
          Infrastructure Monitoring Reports
        </h1>
        <p style={{ color: theme.textMuted, fontSize: '0.82rem' }}>
          Central Sector Projects ≥ ₹150 Crore · OCMS / PAIMANA Flash Reports & Review Reports — Official Archive
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', background: isDark ? 'rgba(14,165,233,0.05)' : 'rgba(99,102,241,0.05)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.12)' : 'rgba(99,102,241,0.1)'}`, borderRadius: 14, padding: 6, width: 'fit-content' }}>
        <button style={tabStyle('project')} onClick={() => setActiveTab('project')}>
          📊 Project Monitoring
        </button>
        <button style={tabStyle('performance')} onClick={() => setActiveTab('performance')}>
          📈 Performance Monitoring
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'project' ? (
          <motion.div key="project" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}>

            {/* What's New Banner */}
            <InfraCard accentColor="#0ea5e9" style={{ padding: '1rem 1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: '#0ea5e9', color: '#fff', borderRadius: 6, padding: '2px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', fontWeight: 700 }}>WHAT'S NEW</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: theme.textPrimary }}>Monthly Flash Report — July 2026</span>
                  <InfraChip label="NEW" color="#34d399" dot />
                </div>
                <GlowButton variant="primary" size="sm" icon={<Download size={12} />} onClick={() => downloadReportPDF('Monthly Flash Report', 'July 2026', 'Cost escalation touches ₹3.40 Lakh Cr. 635 projects in Red category.', showToast)}>
                  Download PDF
                </GlowButton>
              </div>
              <p style={{ color: theme.textMuted, fontSize: '0.78rem', marginTop: 6, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                1,775 projects · ₹37.11 Lakh Cr portfolio · 635 in Critical (Red) · ₹3.40 Lakh Cr total cost escalation
              </p>
            </InfraCard>

            {/* Sector Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.2rem' }}>
              {SECTOR_STATS.map((s, i) => (
                <motion.div key={s.sector} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <InfraCard accentColor={s.color} style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: theme.textPrimary }}>{s.sector}</span>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.count}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${(s.onTrack / s.count) * 100}%`, height: '100%', background: '#10b981', borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.5rem', color: '#10b981' }}>✓ {s.onTrack} on-track</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.5rem', color: '#f59e0b' }}>⚠ {s.delayed} delayed</span>
                    </div>
                  </InfraCard>
                </motion.div>
              ))}
            </div>

            {/* Flash Report Archive */}
            <InfraCard accentColor="#6366f1" style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Archive size={15} color={isDark ? '#0ea5e9' : '#6366f1'} />
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: theme.textPrimary }}>
                    Archive Report — Project Monitoring
                  </h3>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: theme.textMuted }}>Monthly Flash Reports</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {FLASH_REPORTS.map((r, i) => (
                  <motion.div
                    key={r.month}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setExpandedMonth(expandedMonth === r.month ? null : r.month)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: `1px solid ${expandedMonth === r.month ? (isDark ? 'rgba(14,165,233,0.3)' : 'rgba(99,102,241,0.25)') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}`,
                      background: expandedMonth === r.month ? (isDark ? 'rgba(14,165,233,0.06)' : 'rgba(99,102,241,0.04)') : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FileText size={14} color={isDark ? '#0ea5e9' : '#6366f1'} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.83rem', color: theme.textPrimary }}>
                            Monthly Flash Report — {r.month}
                          </span>
                          {r.label && <span style={{ background: r.label === 'New' ? '#34d399' : '#6366f1', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: '0.5rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{r.label}</span>}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: theme.textMuted, marginTop: 2 }}>
                          Project Monitoring · {r.projects?.toLocaleString()} projects · {r.size}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <GlowButton variant="glass" size="sm" icon={<Download size={11} />} onClick={(e) => { e.stopPropagation(); downloadReportPDF('Monthly Flash Report', r.month, r.highlight, showToast); }}>PDF</GlowButton>
                        <ChevronRight size={13} color={theme.textMuted} style={{ transform: expandedMonth === r.month ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </div>
                    {expandedMonth === r.month && r.highlight && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${isDark ? 'rgba(14,165,233,0.12)' : 'rgba(99,102,241,0.1)'}` }}>
                        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.76rem', color: theme.textMuted, margin: 0 }}>
                          📌 {r.highlight}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </InfraCard>
          </motion.div>
        ) : (
          <motion.div key="performance" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>

            {/* What's New Banner */}
            <InfraCard accentColor="#8b5cf6" style={{ padding: '1rem 1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: '#8b5cf6', color: '#fff', borderRadius: 6, padding: '2px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', fontWeight: 700 }}>WHAT'S NEW</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: theme.textPrimary }}>Monthly Review Report — July 2026</span>
                  <InfraChip label="NEW" color="#34d399" dot />
                </div>
                <GlowButton variant="primary" size="sm" icon={<Download size={12} />} onClick={() => downloadReportPDF('Monthly Review Report', 'July 2026', 'Sector-wise Physical Progress vs Financial Expenditure Decoupling Analysis — 17 Ministries benchmarked', showToast)}>
                  Download PDF
                </GlowButton>
              </div>
              <p style={{ color: theme.textMuted, fontSize: '0.78rem', marginTop: 6 }}>
                Sector-wise Physical Progress vs Financial Expenditure Decoupling Analysis — 17 Ministries benchmarked
              </p>
            </InfraCard>

            {/* Ministry Performance Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '1.2rem' }}>
              {[
                { name: 'Ministry of Road Transport & Highways', projects: 993, onTime: 38, avgDelay: 20.8, icon: '🛣', color: '#ef4444' },
                { name: 'Ministry of Railways', projects: 192, onTime: 30, avgDelay: 42.4, icon: '🚆', color: '#f59e0b' },
                { name: 'Ministry of Power', projects: 98, onTime: 45, avgDelay: 13.6, icon: '⚡', color: '#6366f1' },
                { name: 'Ministry of Petroleum & Natural Gas', projects: 103, onTime: 40, avgDelay: 15.4, icon: '⛽', color: '#06b6d4' },
              ].map((m, i) => (
                <motion.div key={m.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <InfraCard accentColor={m.color} style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: theme.textPrimary, marginBottom: 6 }}>{m.name}</div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: m.color }}>{m.projects}</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.5rem', color: theme.textMuted }}>projects</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#f59e0b' }}>{m.avgDelay}mo</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.5rem', color: theme.textMuted }}>avg delay</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>{m.onTime}%</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.5rem', color: theme.textMuted }}>on-time rate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </InfraCard>
                </motion.div>
              ))}
            </div>

            {/* Review Report Archive */}
            <InfraCard accentColor="#8b5cf6" style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1rem' }}>
                <Archive size={15} color="#8b5cf6" />
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: theme.textPrimary }}>
                  Archive Reports — Performance Monitoring
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {REVIEW_REPORTS.map((r, i) => (
                  <motion.div key={r.month} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, transition: 'all 0.2s' }}>
                    <TrendingUp size={14} color="#8b5cf6" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.83rem', color: theme.textPrimary }}>Monthly Review Report — {r.month}</span>
                        {r.label && <span style={{ background: r.label === 'New' ? '#34d399' : '#8b5cf6', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: '0.5rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{r.label}</span>}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: theme.textMuted, marginTop: 1 }}>Performance Monitoring · {r.size}</div>
                      {r.focus && <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.68rem', color: theme.textMuted, marginTop: 2 }}>📌 {r.focus}</div>}
                    </div>
                    <GlowButton variant="glass" size="sm" icon={<Download size={11} />} onClick={() => downloadReportPDF('Monthly Review Report', r.month, r.focus, showToast)}>PDF</GlowButton>
                  </motion.div>
                ))}
              </div>
            </InfraCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

