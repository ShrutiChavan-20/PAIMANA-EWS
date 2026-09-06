import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { statusColor } from '../data/mockData';
import { useProjects } from '../ProjectContext';
import { useTheme } from '../ThemeContext';
import StatusBadge from '../components/StatusBadge';
import { FloatingCard, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import GlowButton from '../components/GlowButton';
import { MapPin, Calendar, Plus, X, Search, Filter, AlertTriangle, TrendingUp, IndianRupee, Layers } from 'lucide-react';

const SECTORS = ['All Sectors', 'Aviation & Aviation Infrastructure', 'Railways', 'Roads & Highways', 'Power', 'Coal', 'Oil & Gas'];
const CATEGORIES = ['Roads & Highways', 'Railways', 'Aviation & Aviation Infrastructure', 'Power', 'Coal', 'Oil & Gas', 'Urban Infrastructure'];
const STATUSES = ['All Statuses', 'critical', 'delayed', 'on-track'];
const MINISTRIES = ['All Ministries', 'Ministry of Civil Aviation', 'Ministry of Railways', 'Ministry of Road Transport & Highways', 'Ministry of Power', 'Ministry of Petroleum & Natural Gas', 'Ministry of Coal'];
const FORM_MINISTRIES = ['Ministry of Road Transport & Highways', 'Ministry of Railways', 'Ministry of Civil Aviation', 'Ministry of Power', 'Ministry of Petroleum & Natural Gas', 'Ministry of Coal'];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const { projects, addProject } = useProjects();
  const [showNew, setShowNew] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedMinistry, setSelectedMinistry] = useState('All Ministries');

  const [form, setForm] = useState({
    projectCode: `PAI-${Math.floor(100000 + Math.random() * 900000)}`,
    title: '',
    ministry: 'Ministry of Road Transport and Highways',
    category: 'Roads & Highways',
    state: 'Maharashtra',
    location: '',
    agency: 'NHAI',
    contractor: '',
    originalCostCr: '',
    revisedCostCr: '',
    spentCr: '',
    physicalProgress: 0,
    financialProgress: 0,
    status: 'on-track',
    targetDoC: new Date().toISOString().split('T')[0],
    revisedDoC: new Date().toISOString().split('T')[0],
    description: '',
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = searchTerm === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.agency && p.agency.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.projectCode && p.projectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.state && p.state.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSector = selectedSector === 'All Sectors' || p.category === selectedSector;
      const matchStatus = selectedStatus === 'All Statuses' || p.status === selectedStatus;
      const matchMinistry = selectedMinistry === 'All Ministries' || p.ministry === selectedMinistry;

      return matchSearch && matchSector && matchStatus && matchMinistry;
    });
  }, [projects, searchTerm, selectedSector, selectedStatus, selectedMinistry]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleCreate = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    const origCost = Number(form.originalCostCr) || 0;
    const revCost = Number(form.revisedCostCr) || origCost;
    const spent = Number(form.spentCr) || 0;
    const costOverrunCr = Math.max(0, revCost - origCost);
    const costOverrunPct = origCost > 0 ? Math.round((costOverrunCr / origCost) * 100) : 0;
    const physProg = Number(form.physicalProgress) || 0;
    const finProg = Number(form.financialProgress) || physProg;
    const divergenceGap = finProg - physProg;
    const trustScore = Math.max(30, Math.min(98, Math.round(100 - (costOverrunPct * 0.45 + Math.max(0, divergenceGap) * 0.5))));
    const riskScore = 100 - trustScore;

    const newProject = {
      ...form,
      projectCode: form.projectCode || `PAI-${Math.floor(100000 + Math.random() * 900000)}`,
      originalCostCr: origCost,
      revisedCostCr: revCost,
      spentCr: spent,
      budget: `₹${revCost || origCost} Cr`,
      spent: `₹${spent} Cr`,
      progress: physProg,
      physicalProgress: physProg,
      financialProgress: finProg,
      costOverrunCr,
      costOverrunPct,
      divergenceGap,
      trustScore,
      riskScore,
      delayMonths: form.status === 'critical' ? 28 : form.status === 'delayed' ? 14 : 0,
    };

    const created = addProject(newProject);
    setShowNew(false);
    setForm({
      projectCode: `PAI-${Math.floor(100000 + Math.random() * 900000)}`,
      title: '', ministry: 'Ministry of Road Transport and Highways', category: 'Roads & Highways',
      state: 'Maharashtra', location: '', agency: 'NHAI', contractor: '', originalCostCr: '',
      revisedCostCr: '', spentCr: '', physicalProgress: 0, financialProgress: 0, status: 'on-track',
      targetDoC: new Date().toISOString().split('T')[0], revisedDoC: new Date().toISOString().split('T')[0], description: ''
    });
    setSuccessMsg(`✓ CUF Entry "${created.title}" (${created.projectCode}) created successfully`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const isValid = form.title.trim() && form.location.trim();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} style={S.page}>
      {/* Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 24, right: 24, background: 'rgba(16,185,129,0.95)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '12px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 9999, color: 'white', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: '0.85rem', border: '1px solid rgba(52,211,153,0.4)' }}>
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={S.header}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: theme.textPrimary }}>
            National Projects Explorer
          </h1>
          <p style={{ color: theme.textMuted, fontSize: '0.85rem', marginTop: 4 }}>
            MoSPI PAIMANA National Infrastructure Portfolio (1,775 Projects · ₹37.11 Lakh Cr Monitored)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <GlowButton variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowNew(true)}>Add CUF Entry</GlowButton>
        </div>
      </motion.div>

      {/* ── Search and Filters ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 240 }}>
          <Search size={15} color={theme.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by project name, code (e.g. 612786), agency, state..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 12,
              background: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff',
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary,
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans',sans-serif"
            }}
          />
        </div>

        {/* Sector Filter */}
        <select
          value={selectedSector}
          onChange={e => setSelectedSector(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff',
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Ministry Filter */}
        <select
          value={selectedMinistry}
          onChange={e => setSelectedMinistry(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff',
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {MINISTRIES.map(m => <option key={m} value={m}>{m.replace('Ministry of ', '')}</option>)}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff',
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="All Statuses">All Risk Tiers</option>
          <option value="critical">Critical (Red Risk)</option>
          <option value="delayed">Watchlist (Amber Delay)</option>
          <option value="on-track">On Track (Green)</option>
        </select>

        <div style={{ fontSize: '0.78rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
          Showing {filteredProjects.length} projects
        </div>
      </div>

      {/* Project Grid */}
      <StaggerContainer style={S.grid}>
        {filteredProjects.map((p) => {
          const hasOverrun = p.costOverrunCr && p.costOverrunCr > 0;
          const hasDelay = p.delayMonths && p.delayMonths > 0;

          return (
            <StaggerItem key={p.id}>
              <FloatingCard style={S.card} glowColor={`${statusColor[p.status]}20`} onClick={() => navigate(`/projects/${p.id}`)}>
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ height: 3, background: statusColor[p.status], borderRadius: 2, marginBottom: '0.8rem', boxShadow: `0 0 12px ${statusColor[p.status]}40` }} />

                  {/* Top Bar: Code, Agency & Risk */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', background: 'rgba(99,102,241,0.12)', color: '#6366f1', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>
                        {p.projectCode || `PAI-${p.id}`}
                      </span>
                      <div style={S.catTag}>{p.category}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>Score: {p.trustScore}%</span>
                  </div>

                  {/* Project Title */}
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: theme.textPrimary, marginBottom: 8, lineHeight: 1.35, minHeight: '2.7rem' }}>
                    {p.title}
                  </h3>

                  {/* Agency and State */}
                  <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600, marginBottom: 6 }}>
                    🏛 {p.agency || p.contractor}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: 10 }}>
                    <div style={S.metaItem}><MapPin size={11} color="#5a6d8a" />{p.state || p.location}</div>
                    <div style={S.metaItem}><Calendar size={11} color="#5a6d8a" />DoC: {p.revisedDoC || p.endDate}</div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={S.progressLabel}>Physical Progress</span>
                      <span style={{ ...S.progressLabel, color: statusColor[p.status], fontWeight: 700 }}>{p.progress || p.physicalProgress}%</span>
                    </div>
                    <div style={S.progressTrack}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, p.progress || p.physicalProgress)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        style={{ ...S.progressFill, background: statusColor[p.status], boxShadow: `0 0 10px ${statusColor[p.status]}50` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Badges: Delay & Escalation */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    {hasDelay ? (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '3px 7px', borderRadius: 6, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
                        ⏱ +{p.delayMonths} mo delay
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '3px 7px', borderRadius: 6, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>
                        ⏱ On Schedule
                      </span>
                    )}

                    {hasOverrun && (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '3px 7px', borderRadius: 6, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
                        📈 +₹{Math.round(p.costOverrunCr).toLocaleString()} Cr ({p.costOverrunPct}%)
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <StatusBadge status={p.status} />
                    <span style={{ fontSize: '0.68rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                      Risk: <strong style={{ color: statusColor[p.status] }}>{p.riskScore || (100 - p.trustScore)}/100</strong>
                    </span>
                  </div>

                  <div style={S.budgetRow}>
                    <span style={{ fontSize: '0.65rem', color: theme.textMuted }}>Cost: <span style={{ color: theme.textPrimary, fontWeight: 600 }}>{p.budget}</span></span>
                    <span style={{ fontSize: '0.65rem', color: theme.textMuted }}>Spent: <span style={{ color: '#6366f1', fontWeight: 600 }}>{p.spent}</span></span>
                  </div>
                </div>
              </FloatingCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── New Project Modal ── */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowNew(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', background: isDark ? 'rgba(10,16,36,0.99)' : '#fff', border: `1px solid ${theme.border}`, borderRadius: 20, padding: '1.75rem', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>

              {/* Modal header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#6366f1', marginBottom: 4 }}>MoSPI IPMD CUF DATA ENTRY</div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: theme.textPrimary, margin: 0 }}>Add CUF Project Entry</h2>
                </div>
                <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted, padding: 4, borderRadius: 8, display: 'flex' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

                {/* Code + Title */}
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Project Code</label>
                    <input value={form.projectCode} readOnly
                      style={{ ...S.input(isDark, theme), fontFamily: "'JetBrains Mono',monospace", color: '#6366f1', fontWeight: 700, background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)' }} />
                  </div>
                  <div>
                    <label style={S.label}>Project Title *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Pune Metro Line 3 Extension"
                      style={{ ...S.input(isDark, theme), borderColor: form.title ? '#6366f1' : theme.border }} />
                  </div>
                </div>

                {/* Ministry + Sector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Ministry</label>
                    <select value={form.ministry} onChange={e => set('ministry', e.target.value)} style={S.input(isDark, theme)}>
                      {FORM_MINISTRIES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Sector / Category</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)} style={S.input(isDark, theme)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* State + Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>State</label>
                    <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Maharashtra"
                      style={S.input(isDark, theme)} />
                  </div>
                  <div>
                    <label style={S.label}>Location / Corridor *</label>
                    <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Hinjewadi to Shivajinagar, Pune"
                      style={{ ...S.input(isDark, theme), borderColor: form.location ? '#6366f1' : theme.border }} />
                  </div>
                </div>

                {/* Agency + Contractor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Implementing Agency</label>
                    <input value={form.agency} onChange={e => set('agency', e.target.value)} placeholder="e.g. PMRDA / MHA"
                      style={S.input(isDark, theme)} />
                  </div>
                  <div>
                    <label style={S.label}>Executing Contractor</label>
                    <input value={form.contractor} onChange={e => set('contractor', e.target.value)} placeholder="e.g. Tata Infra Ltd"
                      style={S.input(isDark, theme)} />
                  </div>
                </div>

                {/* Costs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={S.label}>Sanctioned Cost (₹ Cr)</label>
                    <input type="number" value={form.originalCostCr} onChange={e => set('originalCostCr', e.target.value)} placeholder="1200"
                      style={S.input(isDark, theme)} />
                  </div>
                  <div>
                    <label style={S.label}>Revised Cost (₹ Cr)</label>
                    <input type="number" value={form.revisedCostCr} onChange={e => set('revisedCostCr', e.target.value)} placeholder="1450"
                      style={S.input(isDark, theme)} />
                  </div>
                  <div>
                    <label style={S.label}>Spent to Date (₹ Cr)</label>
                    <input type="number" value={form.spentCr} onChange={e => set('spentCr', e.target.value)} placeholder="820"
                      style={S.input(isDark, theme)} />
                  </div>
                </div>

                {/* Physical vs Financial Progress */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Physical Progress: {form.physicalProgress}%</label>
                    <input type="range" min={0} max={100} value={form.physicalProgress} onChange={e => set('physicalProgress', e.target.value)}
                      style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={S.label}>Financial Progress: {form.financialProgress}%</label>
                    <input type="range" min={0} max={100} value={form.financialProgress} onChange={e => set('financialProgress', e.target.value)}
                      style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Status + Target DoC */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Project Status</label>
                    <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                      {STATUSES.map(s => (
                        <button key={s} onClick={() => set('status', s)}
                          style={{ flex: 1, padding: '7px 4px', borderRadius: 8, border: `1.5px solid ${form.status === s ? statusColor[s] : theme.border}`, background: form.status === s ? `${statusColor[s]}15` : 'transparent', color: form.status === s ? statusColor[s] : theme.textMuted, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: '0.62rem', transition: 'all 0.2s' }}>
                          {s === 'on-track' ? 'On Track' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Target Completion Date (DoC)</label>
                    <input type="date" value={form.targetDoC} onChange={e => set('targetDoC', e.target.value)}
                      style={S.input(isDark, theme)} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={S.label}>Scope & Key Milestones</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="Brief description of the CUF project scope, land acquisition, and key bottlenecks..." rows={2}
                    style={{ ...S.input(isDark, theme), resize: 'vertical', fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button onClick={() => setShowNew(false)}
                    style={{ flex: 1, padding: '10px', borderRadius: 11, border: `1px solid ${theme.border}`, background: 'transparent', color: theme.textMuted, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: '0.85rem' }}>
                    Cancel
                  </button>
                  <button onClick={handleCreate} disabled={!isValid}
                    style={{ flex: 2, padding: '10px', borderRadius: 11, border: 'none', background: isValid ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : (isDark ? 'rgba(99,140,255,0.1)' : 'rgba(99,102,241,0.08)'), color: isValid ? 'white' : theme.textMuted, cursor: isValid ? 'pointer' : 'not-allowed', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.85rem', boxShadow: isValid ? '0 4px 20px rgba(99,102,241,0.35)' : 'none' }}>
                    + Save CUF Entry
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const S = {
  page: { padding: '1.5rem', maxWidth: 1400, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  card: { cursor: 'pointer', overflow: 'hidden' },
  catTag: { fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 5, padding: '2px 7px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: '#5a6d8a', fontFamily: "'JetBrains Mono',monospace" },
  progressLabel: { fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#5a6d8a' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressTrack: { height: 5, background: 'rgba(99,140,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  budgetRow: { display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(99,140,255,0.04)' },
  label: { display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5a6d8a', marginBottom: 5 },
  input: (isDark, theme) => ({
    width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: '0.83rem',
    fontFamily: "'Inter',sans-serif", outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
    background: isDark ? 'rgba(15,22,41,0.6)' : 'rgba(248,249,253,0.9)',
    border: `1.5px solid ${theme.border}`,
    color: theme.textPrimary,
  }),
};
