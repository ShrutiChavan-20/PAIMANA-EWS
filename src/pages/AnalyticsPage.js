import React from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Filler, Tooltip, Legend, Title } from 'chart.js';
import { Bar, Line, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { trendData, paimanaSummary, sectorAnalytics, ministryAnalytics, stateAnalytics } from '../data/paimanaData';
import { useProjects } from '../ProjectContext';
import { useIssues } from '../IssueContext';
import { useTheme } from '../ThemeContext';
import { FloatingCard, AnimatedPage, CountUp, StaggerContainer, StaggerItem } from '../components/AnimatedPage';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Filler, Tooltip, Legend, Title);

const BLUE = '#3b82f6'; const BLUE2 = '#60a5fa'; const BLUE3 = '#93c5fd';
const GREEN = '#10b981'; const YELLOW = '#f59e0b'; const RED = '#f43f5e'; const SLATE = '#5a6d8a';

const tooltipStyle = { backgroundColor: '#0f1629', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(99,140,255,0.15)', borderWidth: 1, padding: 14, cornerRadius: 10, titleFont: { family: "'Outfit',sans-serif", weight: '700' }, bodyFont: { family: "'Plus Jakarta Sans',sans-serif" } };
const axisStyle = { grid: { color: 'rgba(99,140,255,0.06)', drawBorder: false }, ticks: { color: SLATE, font: { family: "'JetBrains Mono',monospace", size: 10 } } };

export default function AnalyticsPage() {
  const { issues } = useIssues();
  const { theme, isDark } = useTheme();
  const { projects } = useProjects();

  // Sectoral Overruns
  const topSectors = sectorAnalytics.slice(0, 6);
  const sectorBarData = {
    labels: topSectors.map(s => s.sector.length > 18 ? s.sector.slice(0, 16) + '...' : s.sector),
    datasets: [{
      label: 'Escalation (₹ Cr)',
      data: topSectors.map(s => s.escalationCr),
      backgroundColor: [RED, YELLOW, BLUE, '#8b5cf6', '#06b6d4', '#10b981'],
      borderRadius: 8
    }]
  };

  // Trend Data Line
  const lineData = {
    labels: trendData.map(d => d.month),
    datasets: [
      {
        label: 'Cost Escalation (₹ Cr)',
        data: trendData.map(d => d.escalationCr),
        borderColor: RED,
        backgroundColor: `${RED}15`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: RED
      }
    ]
  };

  // Status Triage Doughnut
  const doughnutData = {
    labels: ['On Track', 'Watchlist (Amber)', 'Critical (Red)'],
    datasets: [{
      data: [paimanaSummary.onTrackCount, paimanaSummary.delayedCount, paimanaSummary.criticalCount],
      backgroundColor: [GREEN, YELLOW, RED],
      borderColor: isDark ? '#0f1629' : '#ffffff',
      borderWidth: 4,
      hoverOffset: 8
    }]
  };

  // Cost Escalation Driver Analysis (SHAP / Root Cause attribution from MoSPI CUF)
  const driverRadarData = {
    labels: ['Land Acquisition', 'Forest & Env Clearance', 'Contractor Liquidity', 'Forex & Inflation', 'Scope Revision', 'Utility Shifting'],
    datasets: [
      {
        label: 'Delay Weight %',
        data: [34, 26, 18, 12, 16, 11],
        backgroundColor: `${RED}25`,
        borderColor: RED,
        borderWidth: 2,
        pointBackgroundColor: RED,
        pointRadius: 4
      },
      {
        label: 'Cost Impact %',
        data: [28, 14, 22, 25, 20, 9],
        backgroundColor: `${BLUE}20`,
        borderColor: BLUE,
        borderWidth: 2,
        pointBackgroundColor: BLUE,
        pointRadius: 4
      }
    ]
  };

  // Sector Average Delays
  const delayBarData = {
    labels: topSectors.map(s => s.sector.length > 18 ? s.sector.slice(0, 16) + '...' : s.sector),
    datasets: [{
      label: 'Avg Delay (Months)',
      data: topSectors.map(s => s.avgDelayMonths),
      backgroundColor: topSectors.map(s => s.avgDelayMonths > 30 ? `${RED}CC` : s.avgDelayMonths > 15 ? `${YELLOW}CC` : `${GREEN}CC`),
      borderRadius: 6
    }]
  };

  // Issues by Severity — PolarArea
  const severityGroups = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});
  const polarData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [severityGroups.high || 0, severityGroups.medium || 0, severityGroups.low || 0],
      backgroundColor: [`${RED}BB`, `${YELLOW}BB`, `${GREEN}BB`],
      borderColor: [`${RED}`, `${YELLOW}`, `${GREEN}`],
      borderWidth: 1.5
    }]
  };

  // Budget Allocation by top sectors
  const budgetData = {
    labels: sectorAnalytics.slice(0, 7).map(s => s.sector.length > 22 ? s.sector.slice(0, 20) + '…' : s.sector),
    datasets: [{
      label: 'Revised Cost (₹ Cr)',
      data: sectorAnalytics.slice(0, 7).map(s => Math.round(s.revisedCostCr)),
      backgroundColor: [
        `${RED}CC`, `${YELLOW}CC`, `${BLUE}CC`,
        '#8b5cf6CC', '#06b6d4CC', '#10b981CC', '#f97316CC'
      ],
      borderRadius: 5
    }]
  };

  const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...tooltipStyle } } };

  return (
    <AnimatedPage style={S.page}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={S.header}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: theme.textPrimary }}>
            PAIMANA Predictive Analytics & Benchmarking
          </h1>
          <p style={{ color: theme.textMuted, fontSize: '0.85rem', marginTop: 4 }}>
            MoSPI Central Sector Infrastructure Analytics — Open-Source Predictive Suite (July 2026)
          </p>
        </div>
        <div style={S.statsRow}>
          {[
            ['Portfolio', '1,775', BLUE, ''],
            ['Escalation', '₹3.40L', RED, ' Cr'],
            ['Delayed', `${paimanaSummary.delayedProjectsPct}%`, YELLOW, ''],
            ['Avg Delay', `${paimanaSummary.avgDelayMonths}`, SLATE, ' mo']
          ].map(([l, v, c, s], idx) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}>
              <FloatingCard style={{ ...S.statCard, borderTop: `2px solid ${c}` }} glowColor={`${c}15`}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: c, textShadow: `0 0 20px ${c}30` }}>
                  {v}{s}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: SLATE }}>{l}</span>
              </FloatingCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <StaggerContainer style={S.row2}>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>Sectoral Cost Escalation (₹ Cr)</h3>
              <div style={S.legend}><span style={{ ...S.lgDot, background: RED }} />Cost Overrun</div>
            </div>
            <div style={{ height: 220 }}><Bar data={sectorBarData} options={{ ...commonOpts, scales: { x: axisStyle, y: { ...axisStyle, beginAtZero: true } } }} /></div>
          </FloatingCard>
        </StaggerItem>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>National Escalation Timeline (₹ Cr)</h3></div>
            <div style={{ height: 220 }}><Line data={lineData} options={{ ...commonOpts, scales: { x: axisStyle, y: { ...axisStyle, beginAtZero: false } } }} /></div>
          </FloatingCard>
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer style={S.row3}>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>Risk Triage (1,775 Projects)</h3></div>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 200, height: 200 }}>
                <Doughnut data={doughnutData} options={{ ...commonOpts, cutout: '65%', plugins: { ...commonOpts.plugins, legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono',monospace", size: 10 }, padding: 12 } } } }} />
              </div>
            </div>
          </FloatingCard>
        </StaggerItem>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>Cost & Delay Driver Analysis (SHAP Weights)</h3></div>
            <div style={{ height: 220 }}>
              <Radar data={driverRadarData} options={{ ...commonOpts, scales: { r: { grid: { color: 'rgba(99,140,255,0.08)' }, ticks: { display: false }, pointLabels: { font: { family: "'JetBrains Mono',monospace", size: 8 }, color: SLATE }, min: 0, max: 40 } }, plugins: { ...commonOpts.plugins, legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono',monospace", size: 10 }, padding: 8 } } } }} />
            </div>
          </FloatingCard>
        </StaggerItem>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>Issues by Severity</h3></div>
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 200, height: 200 }}>
                <PolarArea data={polarData} options={{ ...commonOpts, plugins: { ...commonOpts.plugins, legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono',monospace", size: 10 }, padding: 10 } } } }} />
              </div>
            </div>
          </FloatingCard>
        </StaggerItem>
      </StaggerContainer>

      {/* ── Official PAIMANA Dashboard Sections ── */}
      <StaggerContainer style={S.row2}>
        {/* Cost Overview — matches official dashboard */}
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>Cost Overview (₹ Crore)</h3>
              <div style={S.legend}><span style={{ ...S.lgDot, background: BLUE }} />Original <span style={{ ...S.lgDot, background: RED }} />Revised <span style={{ ...S.lgDot, background: GREEN }} />Spent</div>
            </div>
            <div style={{ height: 220 }}>
              <Bar data={{
                labels: sectorAnalytics.slice(0, 6).map(s => s.sector.length > 14 ? s.sector.slice(0, 12) + '…' : s.sector),
                datasets: [
                  { label: 'Original Cost', data: sectorAnalytics.slice(0, 6).map(s => Math.round(s.originalCostCr)), backgroundColor: `${BLUE}CC`, borderRadius: 4 },
                  { label: 'Revised Cost', data: sectorAnalytics.slice(0, 6).map(s => Math.round(s.revisedCostCr)), backgroundColor: `${RED}CC`, borderRadius: 4 },
                ]
              }} options={{ ...commonOpts, plugins: { ...commonOpts.plugins, legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono',monospace", size: 9 }, padding: 8, boxWidth: 8 } } }, scales: { x: axisStyle, y: { ...axisStyle, beginAtZero: true } } }} />
            </div>
          </FloatingCard>
        </StaggerItem>

        {/* State-wise Distribution — matches official dashboard */}
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}><h3 style={S.ct}>State-wise Distribution [Project Count]</h3></div>
            <div style={{ height: 220 }}>
              <Bar data={{
                labels: stateAnalytics.slice(0, 12).map(s => s.state),
                datasets: [{
                  label: 'Projects',
                  data: stateAnalytics.slice(0, 12).map(s => s.count),
                  backgroundColor: stateAnalytics.slice(0, 12).map((s, i) => [
                    `${BLUE}CC`, `${RED}CC`, `${YELLOW}CC`, '#8b5cf6CC', `${GREEN}CC`, '#06b6d4CC',
                    '#f97316CC', '#ec4899CC', '#14b8a6CC', '#a855f7CC', '#6366f1CC', '#84cc16CC'
                  ][i]),
                  borderRadius: 5
                }]
              }} options={{ ...commonOpts, indexAxis: 'y', scales: { x: { ...axisStyle, beginAtZero: true }, y: { ...axisStyle, ticks: { ...axisStyle.ticks, font: { family: "'JetBrains Mono',monospace", size: 9 } } } } }} />
            </div>
          </FloatingCard>
        </StaggerItem>
      </StaggerContainer>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <FloatingCard style={S.card}>
          <div style={S.cardHead}><h3 style={S.ct}>Budget Allocation by Sector (₹ Crore)</h3></div>
          <div style={{ height: 180 }}><Bar data={budgetData} options={{ ...commonOpts, indexAxis: 'y', scales: { x: { ...axisStyle, beginAtZero: true }, y: axisStyle } }} /></div>
        </FloatingCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <FloatingCard style={{ ...S.card, marginTop: '1rem', padding: '1.2rem 0' }}>
          <h3 style={{ ...S.ct, marginBottom: '1rem', padding: '0 1.2rem' }}>Top 20 Projects — Performance Matrix</h3>
          <div style={{ overflowX: 'auto', padding: '0 1.2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Project', 'Category', 'Progress', 'Budget', 'Trust Score', 'Issues', 'Efficiency'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}</tr></thead>
              <tbody>
                {projects.slice(0, 20).map(p => {
                  const projIssues = issues.filter(i => i.projectId === p.id).length;
                  const eff = Math.round((p.progress / 100) * (p.trustScore / 100) * 100);
                  const sc = p.status === 'on-track' ? GREEN : p.status === 'delayed' ? YELLOW : RED;
                  return (
                    <motion.tr key={p.id} whileHover={{ backgroundColor: 'rgba(59,130,246,0.05)' }} transition={{ duration: 0.2 }}>
                      <td style={S.td}><span style={{ fontWeight: 600, fontSize: '0.83rem', color: theme.textPrimary }}>{p.title}</span></td>
                      <td style={S.td}><span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 7px', borderRadius: 5, fontSize: '0.65rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", border: '1px solid rgba(59,130,246,0.15)' }}>{p.category}</span></td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 60, height: 5, background: 'rgba(99,140,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress}%` }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ height: '100%', background: sc, borderRadius: 3, boxShadow: `0 0 6px ${sc}40` }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: SLATE, fontFamily: "'JetBrains Mono',monospace" }}>{p.progress}%</span>
                        </div>
                      </td>
                      <td style={S.td}><span style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary }}>{p.budget}</span></td>
                      <td style={S.td}><span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: p.trustScore >= 70 ? GREEN : p.trustScore >= 50 ? YELLOW : RED }}>{p.trustScore}</span></td>
                      <td style={S.td}><span style={{ color: projIssues > 0 ? RED : GREEN, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', fontWeight: 700 }}>{projIssues}</span></td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 50, height: 5, background: 'rgba(99,140,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${eff}%` }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ height: '100%', background: eff >= 60 ? GREEN : RED, borderRadius: 3, boxShadow: `0 0 6px ${eff >= 60 ? GREEN : RED}40` }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: eff >= 60 ? GREEN : RED, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{eff}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FloatingCard>
      </motion.div>
    </AnimatedPage>
  );
}

const S = {
  page: { padding: '1.5rem', maxWidth: 1400, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  statsRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  statCard: { padding: '0.8rem 1.1rem', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 90 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  row3: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1rem' },
  card: { padding: '1.2rem' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  ct: { fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: 'var(--text, #1a1b25)' },
  legend: { display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#5a6d8a', gap: 4 },
  lgDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  th: { fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#5a6d8a', padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(99,140,255,0.08)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  td: { padding: '10px 12px', borderBottom: '1px solid rgba(99,140,255,0.04)', fontSize: '0.82rem', color: 'var(--text, #1a1b25)' },
};
