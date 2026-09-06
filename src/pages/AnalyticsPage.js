import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Filler, Tooltip, Legend, Title } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { trendData, paimanaSummary, sectorAnalytics, ministryAnalytics, stateAnalytics, physicalProgressAnalytics } from '../data/paimanaData';
import { useProjects } from '../ProjectContext';
import { useTheme } from '../ThemeContext';
import { FloatingCard, AnimatedPage, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { Search, MapPin, Filter, RotateCcw, Building2, TrendingUp, AlertTriangle, Layers, CheckCircle, Clock } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Filler, Tooltip, Legend, Title);

const BLUE = '#3b82f6';
const GREEN = '#10b981';
const YELLOW = '#f59e0b';
const RED = '#f43f5e';
const CYAN = '#06b6d4';
const SLATE = '#5a6d8a';

const tooltipStyle = {
  backgroundColor: '#0f1629',
  titleColor: '#e2e8f0',
  bodyColor: '#94a3b8',
  borderColor: 'rgba(99,140,255,0.15)',
  borderWidth: 1,
  padding: 14,
  cornerRadius: 10,
  titleFont: { family: "'Outfit',sans-serif", weight: '700' },
  bodyFont: { family: "'Plus Jakarta Sans',sans-serif" }
};

const axisStyle = {
  grid: { color: 'rgba(99,140,255,0.06)', drawBorder: false },
  ticks: { color: SLATE, font: { family: "'JetBrains Mono',monospace", size: 10 } }
};

const QUICK_CITIES = [
  { label: '🇮🇳 All India', value: 'All' },
  { label: '📍 Pune', value: 'Pune' },
  { label: '📍 Mumbai', value: 'Mumbai' },
  { label: '📍 Bengaluru', value: 'Bengaluru' },
  { label: '📍 Delhi NCR', value: 'Delhi' },
  { label: '📍 Hyderabad', value: 'Hyderabad' },
  { label: '📍 Ahmedabad', value: 'Ahmedabad' },
  { label: '📍 Nagpur', value: 'Nagpur' },
  { label: '📍 Chennai', value: 'Chennai' },
  { label: '📍 Kolkata', value: 'Kolkata' },
];

const STATES_LIST = [
  'All Locations',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Gujarat',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Telangana',
  'West Bengal',
  'Andhra Pradesh',
  'Rajasthan',
  'Madhya Pradesh',
  'Odisha',
  'Jharkhand',
  'Chhattisgarh',
  'Bihar',
  'Punjab',
  'Haryana',
  'Kerala',
  'Assam',
  'Multi-State'
];

export default function AnalyticsPage() {
  const { theme, isDark } = useTheme();
  const { projects } = useProjects();

  // Location / City Filters
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects by city / state / text query
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const loc = (p.location || '').toLowerCase();
      const st = (p.state || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const agency = (p.agency || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesLocation =
        selectedLocation === 'All' ||
        selectedLocation === 'All Locations' ||
        st.includes(selectedLocation.toLowerCase()) ||
        loc.includes(selectedLocation.toLowerCase()) ||
        title.includes(selectedLocation.toLowerCase());

      const matchesQuery =
        !query ||
        loc.includes(query) ||
        st.includes(query) ||
        title.includes(query) ||
        agency.includes(query);

      return matchesLocation && matchesQuery;
    });
  }, [projects, selectedLocation, searchQuery]);

  const isFiltered = (selectedLocation !== 'All' && selectedLocation !== 'All Locations') || searchQuery.trim() !== '';

  // Dynamic Portfolio KPIs
  const totalCount = isFiltered ? filteredProjects.length : paimanaSummary.totalProjects;
  const totalEscalationCr = isFiltered
    ? filteredProjects.reduce((sum, p) => sum + (p.costOverrunCr || Math.max(0, (p.revisedCostCr || 0) - (p.originalCostCr || 0))), 0)
    : paimanaSummary.totalEscalationCr;

  const criticalCount = isFiltered
    ? filteredProjects.filter(p => p.status === 'critical').length
    : paimanaSummary.criticalCount;

  const delayedCount = isFiltered
    ? filteredProjects.filter(p => p.status === 'delayed').length
    : paimanaSummary.delayedCount;

  const onTrackCount = isFiltered
    ? filteredProjects.filter(p => p.status === 'on-track').length
    : paimanaSummary.onTrackCount;

  const delayedTotalCount = criticalCount + delayedCount;
  const delayedPct = totalCount > 0 ? ((delayedTotalCount / totalCount) * 100).toFixed(1) : '0';

  const avgDelayMonths = isFiltered
    ? (totalCount > 0 ? (filteredProjects.reduce((sum, p) => sum + (p.delayMonths || 0), 0) / totalCount).toFixed(1) : '0')
    : paimanaSummary.avgDelayMonths;

  // Format Escalation Value Display
  const escalationDisplay = totalEscalationCr >= 100000
    ? `₹${(totalEscalationCr / 100000).toFixed(2)}L`
    : `₹${Math.round(totalEscalationCr).toLocaleString('en-IN')}`;

  const escalationUnit = totalEscalationCr >= 100000 ? ' Cr' : ' Cr';

  // Dynamic Sectoral Overruns calculation
  const sectorGroupMap = useMemo(() => {
    const map = {};
    const dataset = isFiltered ? filteredProjects : projects;

    dataset.forEach(p => {
      const sec = p.category || 'Other';
      if (!map[sec]) {
        map[sec] = { sector: sec, count: 0, escalationCr: 0, originalCostCr: 0, revisedCostCr: 0, totalDelay: 0 };
      }
      const over = p.costOverrunCr || Math.max(0, (p.revisedCostCr || 0) - (p.originalCostCr || 0));
      map[sec].count += 1;
      map[sec].escalationCr += over;
      map[sec].originalCostCr += (p.originalCostCr || 0);
      map[sec].revisedCostCr += (p.revisedCostCr || p.originalCostCr || 0);
      map[sec].totalDelay += (p.delayMonths || 0);
    });

    const sectorsArray = Object.values(map).sort((a, b) => b.escalationCr - a.escalationCr);
    return sectorsArray.length > 0 ? sectorsArray : sectorAnalytics;
  }, [isFiltered, filteredProjects, projects]);

  const topSectors = (isFiltered ? sectorGroupMap : sectorAnalytics).slice(0, 6);

  // 1. Sector Bar Data
  const sectorBarData = {
    labels: topSectors.map(s => s.sector.length > 18 ? s.sector.slice(0, 16) + '...' : s.sector),
    datasets: [{
      label: 'Escalation (₹ Cr)',
      data: topSectors.map(s => Math.round(s.escalationCr)),
      backgroundColor: [RED, YELLOW, BLUE, '#8b5cf6', CYAN, GREEN],
      borderRadius: 8
    }]
  };

  // 2. Trend Data Line
  const lineData = {
    labels: trendData.map(d => d.month),
    datasets: [
      {
        label: `${isFiltered ? (selectedLocation !== 'All' ? selectedLocation : searchQuery) + ' ' : 'National '}Cost Escalation (₹ Cr)`,
        data: isFiltered
          ? [
              Math.round(totalEscalationCr * 0.91),
              Math.round(totalEscalationCr * 0.935),
              Math.round(totalEscalationCr * 0.955),
              Math.round(totalEscalationCr * 0.974),
              Math.round(totalEscalationCr * 0.988),
              Math.round(totalEscalationCr * 0.995),
              Math.round(totalEscalationCr)
            ]
          : trendData.map(d => d.escalationCr),
        borderColor: RED,
        backgroundColor: `${RED}15`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: RED
      }
    ]
  };

  // 3. Status Triage Doughnut Data
  const onTrackPct = totalCount > 0 ? Math.round((onTrackCount / totalCount) * 100) : 0;
  const delayedOnlyPct = totalCount > 0 ? Math.round((delayedCount / totalCount) * 100) : 0;
  const criticalPct = totalCount > 0 ? (100 - onTrackPct - delayedOnlyPct) : 0;

  const doughnutData = {
    labels: ['On Track (Green)', 'Watchlist (Amber)', 'Critical (Red)'],
    datasets: [{
      data: [onTrackCount, delayedCount, criticalCount],
      backgroundColor: [GREEN, YELLOW, RED],
      borderColor: isDark ? '#0f1629' : '#ffffff',
      borderWidth: 4,
      hoverOffset: 8
    }]
  };

  // 4. Physical Progress Stage Analytics (Dynamic calculation from projects)
  const dynamicProgressStages = useMemo(() => {
    if (!isFiltered) return physicalProgressAnalytics;
    
    const bins = [
      { range: "0% to 25%", count: 0, color: RED },
      { range: "26% to 50%", count: 0, color: YELLOW },
      { range: "51% to 75%", count: 0, color: BLUE },
      { range: "76% to 99%", count: 0, color: CYAN },
      { range: "100% (Completed)", count: 0, color: GREEN }
    ];

    filteredProjects.forEach(p => {
      const prog = Number(p.progress || p.physicalProgress || 0);
      if (prog <= 25) bins[0].count++;
      else if (prog <= 50) bins[1].count++;
      else if (prog <= 75) bins[2].count++;
      else if (prog < 100) bins[3].count++;
      else bins[4].count++;
    });

    return bins;
  }, [isFiltered, filteredProjects]);

  const progressChartData = {
    labels: dynamicProgressStages.map(b => b.range),
    datasets: [{
      label: 'Projects Count',
      data: dynamicProgressStages.map(b => b.count),
      backgroundColor: [RED, YELLOW, BLUE, CYAN, GREEN],
      borderRadius: 6,
      barThickness: 28
    }]
  };

  // 5. Budget Allocation by top sectors
  const budgetData = {
    labels: topSectors.map(s => s.sector.length > 22 ? s.sector.slice(0, 20) + '…' : s.sector),
    datasets: [{
      label: 'Revised Cost (₹ Cr)',
      data: topSectors.map(s => Math.round(s.revisedCostCr)),
      backgroundColor: [
        `${RED}CC`, `${YELLOW}CC`, `${BLUE}CC`,
        '#8b5cf6CC', `${CYAN}CC`, `${GREEN}CC`
      ],
      borderRadius: 5
    }]
  };

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipStyle }
    }
  };

  const handleResetFilter = () => {
    setSelectedLocation('All');
    setSearchQuery('');
  };

  return (
    <AnimatedPage style={S.page}>
      {/* Header */}
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
            ['Portfolio', `${totalCount.toLocaleString()}`, BLUE, ''],
            ['Escalation', `${escalationDisplay}`, RED, escalationUnit],
            ['Delayed', `${delayedPct}%`, YELLOW, ''],
            ['Avg Delay', `${avgDelayMonths}`, SLATE, ' mo']
          ].map(([l, v, c, s], idx) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}>
              <FloatingCard style={{ ...S.statCard, borderTop: `2px solid ${c}` }} glowColor={`${c}15`}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.5rem', color: c, textShadow: `0 0 20px ${c}30` }}>
                  {v}{s}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: SLATE }}>{l}</span>
              </FloatingCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── City & State Location Filter Controls ── */}
      <FloatingCard style={{ ...S.filterBar, background: isDark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={16} color={BLUE} />
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: theme.textPrimary }}>
              Filter Analytics by City / Location:
            </span>
            {isFiltered && (
              <span style={{ background: 'rgba(59,130,246,0.15)', color: BLUE, padding: '3px 9px', borderRadius: 8, fontSize: '0.72rem', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: '1px solid rgba(59,130,246,0.25)' }}>
                Active: {selectedLocation !== 'All' ? selectedLocation : searchQuery} ({filteredProjects.length} Projects)
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilter}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.25)',
                color: RED,
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono',monospace",
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <RotateCcw size={12} /> Reset to National Trend
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* City / Keyword Search Input */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 220 }}>
            <Search size={14} color={theme.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search specific city (e.g. Pune, Mumbai, Bengaluru, Delhi)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (selectedLocation !== 'All') setSelectedLocation('All');
              }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 10,
                background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.90)',
                border: `1px solid ${isDark ? theme.border : 'rgba(255,255,255,0.60)'}`,
                color: isDark ? theme.textPrimary : '#0f2042',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: "'Plus Jakarta Sans',sans-serif"
              }}
            />
          </div>

          {/* State / Region Dropdown */}
          <div style={{ position: 'relative', minWidth: 180 }}>
            <select
              value={selectedLocation}
              onChange={e => {
                setSelectedLocation(e.target.value);
                setSearchQuery('');
              }}
              style={{
                width: '100%',
                padding: '8px 14px',
                borderRadius: 10,
                background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.90)',
                border: `1px solid ${isDark ? theme.border : 'rgba(255,255,255,0.60)'}`,
                color: isDark ? theme.textPrimary : '#0f2042',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans',sans-serif"
              }}
            >
              {STATES_LIST.map(st => (
                <option key={st} value={st === 'All Locations' ? 'All' : st}>
                  {st === 'All Locations' ? '🏛️ All Locations (National)' : `📍 ${st}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick City Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace", marginRight: 4 }}>
            Quick Filter:
          </span>
          {QUICK_CITIES.map(city => {
            const isSelected = selectedLocation === city.value || (searchQuery.toLowerCase() === city.value.toLowerCase());
            return (
              <button
                key={city.value}
                onClick={() => {
                  setSelectedLocation(city.value);
                  setSearchQuery('');
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  border: isSelected ? `1px solid ${BLUE}` : `1px solid ${theme.border}`,
                  background: isSelected ? 'rgba(59,130,246,0.2)' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                  color: isSelected ? '#60a5fa' : theme.textMuted,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      </FloatingCard>

      {/* ── Row 1: Main Two Overrun Graphs ── */}
      <StaggerContainer style={S.row2}>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}>
              <div>
                <h3 style={S.ct}>
                  Sectoral Cost Escalation (₹ Cr)
                </h3>
                <span style={{ fontSize: '0.68rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                  {isFiltered ? `Active in ${selectedLocation !== 'All' ? selectedLocation : searchQuery}` : 'National Sector Aggregates'}
                </span>
              </div>
              <div style={S.legend}><span style={{ ...S.lgDot, background: RED }} />Cost Overrun</div>
            </div>
            <div style={{ height: 220 }}>
              <Bar data={sectorBarData} options={{ ...commonOpts, scales: { x: axisStyle, y: { ...axisStyle, beginAtZero: true } } }} />
            </div>
          </FloatingCard>
        </StaggerItem>

        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}>
              <div>
                <h3 style={S.ct}>
                  {isFiltered ? `${selectedLocation !== 'All' ? selectedLocation : searchQuery} Escalation Timeline (₹ Cr)` : 'National Escalation Timeline (₹ Cr)'}
                </h3>
                <span style={{ fontSize: '0.68rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                  18-Month Overrun Trajectory (Feb 2025 – Jul 2026)
                </span>
              </div>
            </div>
            <div style={{ height: 220 }}>
              <Line data={lineData} options={{ ...commonOpts, scales: { x: axisStyle, y: { ...axisStyle, beginAtZero: false } } }} />
            </div>
          </FloatingCard>
        </StaggerItem>
      </StaggerContainer>

      {/* ── Row 2: Clean 2-Column Risk & Physical Progress (Radar Removed) ── */}
      <StaggerContainer style={S.row2}>
        {/* Card 1: Risk Triage Doughnut Chart */}
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}>
              <div>
                <h3 style={S.ct}>
                  Risk Triage ({totalCount} Projects)
                </h3>
                <span style={{ fontSize: '0.68rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                  AI Risk Classification & Triage Status
                </span>
              </div>
            </div>
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 180, height: 180 }}>
                <Doughnut
                  data={doughnutData}
                  options={{
                    ...commonOpts,
                    cutout: '68%',
                    plugins: {
                      ...commonOpts.plugins,
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            </div>

            {/* Custom Metric Badges with exact counts and distinct percentages */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12, borderTop: '1px solid rgba(99,140,255,0.08)', paddingTop: 10 }}>
              <div style={{ textAlign: 'center', padding: '6px 4px', background: 'rgba(16,185,129,0.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.15)' }}>
                <span style={{ fontSize: '0.65rem', color: GREEN, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", display: 'block' }}>
                  ON TRACK
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: theme.textPrimary, fontFamily: "'Outfit',sans-serif" }}>
                  {onTrackCount}
                </span>
                <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace", display: 'block' }}>
                  {onTrackPct}%
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '6px 4px', background: 'rgba(245,158,11,0.06)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)' }}>
                <span style={{ fontSize: '0.65rem', color: YELLOW, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", display: 'block' }}>
                  WATCHLIST
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: theme.textPrimary, fontFamily: "'Outfit',sans-serif" }}>
                  {delayedCount}
                </span>
                <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace", display: 'block' }}>
                  {delayedOnlyPct}%
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '6px 4px', background: 'rgba(244,63,94,0.06)', borderRadius: 8, border: '1px solid rgba(244,63,94,0.15)' }}>
                <span style={{ fontSize: '0.65rem', color: RED, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", display: 'block' }}>
                  CRITICAL
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: theme.textPrimary, fontFamily: "'Outfit',sans-serif" }}>
                  {criticalCount}
                </span>
                <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace", display: 'block' }}>
                  {criticalPct}%
                </span>
              </div>
            </div>
          </FloatingCard>
        </StaggerItem>

        {/* Card 2: Physical Progress Milestone Distribution */}
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}>
              <div>
                <h3 style={S.ct}>
                  Physical Progress Distribution
                </h3>
                <span style={{ fontSize: '0.68rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                  MoSPI Milestone Execution Stages (0% to 100%)
                </span>
              </div>
              <div style={S.legend}>
                <span style={{ ...S.lgDot, background: CYAN }} />Stage Volume
              </div>
            </div>
            <div style={{ height: 235 }}>
              <Bar
                data={progressChartData}
                options={{
                  ...commonOpts,
                  scales: {
                    x: { ...axisStyle, ticks: { ...axisStyle.ticks, font: { family: "'JetBrains Mono',monospace", size: 9 } } },
                    y: { ...axisStyle, beginAtZero: true }
                  }
                }}
              />
            </div>
          </FloatingCard>
        </StaggerItem>
      </StaggerContainer>

      {/* ── Row 3: Cost Overview & Budget Allocation ── */}
      <StaggerContainer style={S.row2}>
        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}>
              <h3 style={S.ct}>Cost Overview (₹ Crore)</h3>
              <div style={S.legend}>
                <span style={{ ...S.lgDot, background: BLUE }} />Original
                <span style={{ ...S.lgDot, background: RED, marginLeft: 8 }} />Revised
              </div>
            </div>
            <div style={{ height: 220 }}>
              <Bar
                data={{
                  labels: topSectors.map(s => s.sector.length > 14 ? s.sector.slice(0, 12) + '…' : s.sector),
                  datasets: [
                    { label: 'Original Cost', data: topSectors.map(s => Math.round(s.originalCostCr)), backgroundColor: `${BLUE}CC`, borderRadius: 4 },
                    { label: 'Revised Cost', data: topSectors.map(s => Math.round(s.revisedCostCr)), backgroundColor: `${RED}CC`, borderRadius: 4 },
                  ]
                }}
                options={{
                  ...commonOpts,
                  plugins: {
                    ...commonOpts.plugins,
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { color: '#94a3b8', font: { family: "'JetBrains Mono',monospace", size: 9 }, padding: 8, boxWidth: 8 }
                    }
                  },
                  scales: { x: axisStyle, y: { ...axisStyle, beginAtZero: true } }
                }}
              />
            </div>
          </FloatingCard>
        </StaggerItem>

        <StaggerItem>
          <FloatingCard style={S.card}>
            <div style={S.cardHead}>
              <h3 style={S.ct}>Budget Allocation by Sector (₹ Crore)</h3>
            </div>
            <div style={{ height: 220 }}>
              <Bar
                data={budgetData}
                options={{
                  ...commonOpts,
                  indexAxis: 'y',
                  scales: { x: { ...axisStyle, beginAtZero: true }, y: axisStyle }
                }}
              />
            </div>
          </FloatingCard>
        </StaggerItem>
      </StaggerContainer>

      {/* ── Filtered Projects Performance Matrix Table ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <FloatingCard style={{ ...S.card, marginTop: '1rem', padding: '1.2rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.2rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={S.ct}>
                {isFiltered ? `Filtered Projects in ${selectedLocation !== 'All' ? selectedLocation : searchQuery} (${filteredProjects.length})` : 'Top 20 Projects — Performance Matrix'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>
                Real-time CUF physical vs financial tracking
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', padding: '0 1.2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Project Code & Title', 'Location / State', 'Category', 'Progress', 'Budget (₹ Cr)', 'Overrun', 'Trust Score', 'Delay'].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.slice(0, 20).map(p => {
                  const overrun = p.costOverrunCr || Math.max(0, (p.revisedCostCr || 0) - (p.originalCostCr || 0));
                  const sc = p.status === 'on-track' ? GREEN : p.status === 'delayed' ? YELLOW : RED;
                  return (
                    <motion.tr key={p.id || p.projectCode} whileHover={{ backgroundColor: 'rgba(59,130,246,0.05)' }} transition={{ duration: 0.2 }}>
                      <td style={S.td}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.83rem', color: theme.textPrimary }}>{p.title}</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', color: theme.textMuted }}>
                            {p.projectCode || `PAI-${p.id}`} · {p.agency || 'MoSPI'}
                          </span>
                        </div>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={11} color={BLUE} />
                          <span style={{ fontSize: '0.75rem', color: theme.textPrimary }}>
                            {p.location ? (p.location.length > 25 ? p.location.slice(0, 23) + '…' : p.location) : (p.state || 'Pan India')}
                          </span>
                        </div>
                      </td>
                      <td style={S.td}>
                        <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 7px', borderRadius: 5, fontSize: '0.65rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", border: '1px solid rgba(59,130,246,0.15)' }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 60, height: 5, background: 'rgba(99,140,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress || p.physicalProgress || 0}%` }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ height: '100%', background: sc, borderRadius: 3, boxShadow: `0 0 6px ${sc}40` }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: SLATE, fontFamily: "'JetBrains Mono',monospace" }}>{p.progress || p.physicalProgress || 0}%</span>
                        </div>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary }}>{p.budget}</span>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '0.75rem', color: overrun > 0 ? RED : GREEN }}>
                          {overrun > 0 ? `+₹${Math.round(overrun).toLocaleString('en-IN')} Cr` : '₹0 (On Budget)'}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: (p.trustScore || 70) >= 70 ? GREEN : (p.trustScore || 70) >= 50 ? YELLOW : RED }}>
                          {p.trustScore || 70}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', fontWeight: 700, color: (p.delayMonths || 0) > 0 ? YELLOW : GREEN }}>
                          {(p.delayMonths || 0) > 0 ? `${p.delayMonths} mo` : '0 mo'}
                        </span>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' },
  statsRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  statCard: { padding: '0.8rem 1.1rem', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 90 },
  filterBar: { padding: '1rem 1.2rem', marginBottom: '1.2rem', borderRadius: 16, border: '1px solid rgba(99,140,255,0.15)' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  card: { padding: '1.2rem' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  ct: { fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: 'var(--text, #1a1b25)' },
  legend: { display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#5a6d8a', gap: 4 },
  lgDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  th: { fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#5a6d8a', padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(99,140,255,0.08)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  td: { padding: '10px 12px', borderBottom: '1px solid rgba(99,140,255,0.04)', fontSize: '0.82rem', color: 'var(--text, #1a1b25)' },
};
