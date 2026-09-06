import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { statusColor } from '../data/mockData';
import { useProjects } from '../ProjectContext';
import StatusBadge from '../components/StatusBadge';
import { AnimatedPage, FloatingCard, CountUp, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import GlowButton from '../components/GlowButton';
import { 
  Lock, CheckCircle, Eye, RefreshCw, X, ShieldAlert, Send, FileSpreadsheet, 
  UploadCloud, AlertTriangle, Scale, Cpu, FileCheck, Zap, ArrowUpRight, DollarSign,
  Building, Check, Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const fundItems = [
  {name:'NH-48 Road Widening',budget:42,used:28.5,progress:68},
  {name:'Shivajinagar Metro',budget:215,used:140,progress:19},
  {name:'Hadapsar Flyover',budget:63,used:34,progress:55},
  {name:'Kothrud STP',budget:29,used:23,progress:82},
  {name:'Katraj Road',budget:8,used:5.2,progress:22},
];

export default function AdminPage() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const { projects, setProjects, updateProject } = useProjects();
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [viewProject, setViewProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editSpent, setEditSpent] = useState('');
  
  // SIH Features State
  const [noticeModal, setNoticeModal] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [dispatchSuccess, setDispatchSuccess] = useState({});
  const [escrowHoldState, setEscrowHoldState] = useState({});

  const [contractorScores, setContractorScores] = useState(() => {
    const saved = localStorage.getItem('civicsense_contractor_scores');
    if (saved) return JSON.parse(saved);
    const defaultScores = {};
    ['NHAI Division 3','PCMC Water Dept','Pune Metro Rail Corp','PMC Infrastructure','PMC Env Division','PMC Roads Dept','PMC Traffic Cell','PCMC Civil Dept'].forEach((c, i) => {
      defaultScores[c] = { score: [84, 51, 28, 79, 91, 44, 76, 39][i], notes: '' };
    });
    return defaultScores;
  });
  const [editingContractor, setEditingContractor] = useState(null);
  const [editContractorScore, setEditContractorScore] = useState(0);
  const [editContractorNotes, setEditContractorNotes] = useState('');

  const saveContractorScore = () => {
    const updated = { ...contractorScores, [editingContractor]: { score: Number(editContractorScore), notes: editContractorNotes } };
    setContractorScores(updated);
    localStorage.setItem('civicsense_contractor_scores', JSON.stringify(updated));
    showToast(`✓ Trust score for ${editingContractor} updated to ${editContractorScore}`);
    setEditingContractor(null);
  };

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''),3500); };
  const isAdmin = user?.role === 'gov-admin';

  const openUpdate = (p) => { setEditProject(p); setEditStatus(p.status); setEditProgress(p.progress); setEditSpent(p.spent || ''); };
  const saveUpdate = () => {
    const updates = { status: editStatus, progress: Number(editProgress) };
    if (editSpent.trim()) updates.spent = editSpent.trim();
    updateProject(editProject.id, updates);
    showToast(`✓ "${editProject.title}" updated to ${editStatus} · ${editProgress}% · Spent: ${editSpent || 'unchanged'}`);
    setEditProject(null);
  };

  // Top Divergence / Anomaly Projects for AI Triage
  const highRiskTriage = useMemo(() => {
    return projects
      .filter(p => (p.costOverrunCr > 500 || (p.delayMonths || 0) >= 12 || p.status === 'critical'))
      .sort((a, b) => (b.costOverrunCr || 0) - (a.costOverrunCr || 0))
      .slice(0, 4);
  }, [projects]);

  // Handle Official Show Cause Notice Generation (SIH Feature)
  const generateShowCausePDF = (project) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('GOVERNMENT OF INDIA · MoSPI / IPMD CENTRAL SURVEILLANCE', 14, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('FORMAL SHOW-CAUSE NOTICE & AUDIT DIRECTIVE', 14, 24);

    doc.setTextColor(203, 213, 225);
    doc.setFontSize(8.5);
    doc.text(`Ref: MoSPI/EWS/SCN-${project.projectCode || project.id}/${new Date().getFullYear()}`, 14, 32);

    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(1.5);
    doc.line(0, 40, pageWidth, 40);

    let y = 52;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`TO: EXECUTING AGENCY / CONTRACTOR: ${project.agency || project.contractor || 'Concerned Agency'}`, 14, y);
    y += 7;
    doc.text(`PROJECT CODE: ${project.projectCode || project.id} — ${project.title}`, 14, y);

    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text('1. REASON FOR IMMEDIATE EXPLANATION & ESCALATION AUDIT:', 14, y);
    y += 6;

    const issuesList = [
      `• Recorded Cumulative Cost Escalation: +Rs. ${Math.round(project.costOverrunCr || 0).toLocaleString('en-IN')} Crore`,
      `• Critical Schedule Slippage: ${project.delayMonths || 0} Months beyond Approved Target Date`,
      `• Current AI Integrity & Trust Score: ${project.trustScore || 20}/100 [Red Category]`,
      `• Physical vs Financial Divergence Gap: ${project.divergenceGap || -4.5}%`,
    ];

    issuesList.forEach(item => {
      doc.text(item, 18, y);
      y += 6;
    });

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('2. STATUTORY MANDATE & TIMELINE:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    const text = `Under PAIMANA Rule 14.B and Public Procurement Directives, you are required to file a formal Milestone Rectification Charter within 7 working days of receipt of this notice. Failure to respond will trigger an immediate freeze on tranche disbursements and invoke liquidated damages.`;
    const split = doc.splitTextToSize(text, pageWidth - 28);
    doc.text(split, 14, y);

    y += 24;
    doc.setFillColor(254, 242, 242);
    doc.rect(14, y, pageWidth - 28, 20, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTOMATED AUDIT SEAL — PAIMANA EARLY WARNING SYSTEM', 18, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Digital Verification Timestamp: ${new Date().toISOString()}`, 18, y + 14);

    const filename = `MoSPI_ShowCause_${project.projectCode || project.id}.pdf`;
    doc.save(filename);
    showToast(`✓ Generated & Downloaded Show-Cause Notice for ${project.title}`);
  };

  // Mock File Upload Handler for MoSPI CUF / Excel
  const handleDatasetUpload = (file) => {
    if (!file) return;
    showToast(`⚡ Ingesting "${file.name}"... Parsing CUF records.`);
    setTimeout(() => {
      showToast(`✓ Dataset verified! 1,775 projects synchronized with active telemetry.`);
    }, 1200);
  };

  if (!isAdmin) return (
    <AnimatedPage style={S.locked}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ width: 80, height: 80, background: isDark ? 'rgba(15,22,41,0.6)' : 'rgba(99,102,241,0.07)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${isDark ? 'rgba(99,140,255,0.1)' : 'rgba(99,102,241,0.15)'}` }}>
        <Lock size={36} color={theme.textMuted}/>
      </motion.div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: theme.textPrimary }}>Government Admin Only</h2>
      <p style={{ color: theme.textMuted, fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6 }}>
        This portal is restricted to verified government officials.<br/>Please log in with a government admin account.
      </p>
    </AnimatedPage>
  );

  return (
    <AnimatedPage style={S.page}>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={S.toast}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={S.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={S.h1}>Government Portal</h1>
            <span style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.05em', fontFamily: "'JetBrains Mono',monospace" }}>
              SIH WINNING EWS
            </span>
          </div>
          <p style={S.sub}>National Project Surveillance, AI Triage Intervention & CUF Ingestion Engine</p>
        </div>
        <div style={S.adminBadge}>🏛 MoSPI / IPMD National Admin Suite</div>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: isDark ? 'rgba(15,22,41,0.4)' : '#f2f3f7', padding: 4, borderRadius: 12, border: `1px solid ${theme.border}` }}>
        {[['overview','Overview & AI Triage'],['funds','Fund Tracking'],['projects','Manage Projects'],['contractors','Contractor Integrity & Scores']].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{ padding: '8px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: activeTab===id ? 700 : 500, fontSize: '0.82rem', position: 'relative', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
              background: activeTab===id ? isDark ? 'rgba(59,130,246,0.15)' : 'white' : 'transparent',
              color: activeTab===id ? isDark ? '#60a5fa' : '#6366f1' : theme.textMuted,
              boxShadow: activeTab===id ? isDark ? '0 0 15px rgba(59,130,246,0.08)' : '0 1px 8px rgba(0,0,0,0.08)' : 'none',
            }}>
            {label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          {activeTab==='overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Row 1: KPI Top Cards */}
              <div style={S.kpiGrid}>
                {[
                  ['Total Monitored Projects', projects.length, '#3b82f6'],
                  ['On Track (Green)', projects.filter(p => p.status === 'on-track').length, '#10b981'],
                  ['Watchlist (Amber)', projects.filter(p => p.status === 'delayed').length, '#f59e0b'],
                  ['Critical Risk (Red)', projects.filter(p => p.status === 'critical').length, '#f43f5e']
                ].map(([l,v,c],idx)=>(
                  <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.08 }}>
                    <FloatingCard style={{...S.kpiCard,borderTop:`2px solid ${c}`}} glowColor={`${c}20`}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:'#64748b'}}>{l}</span>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:'2rem',color:c,textShadow:`0 0 20px ${c}30`}}>
                        <CountUp target={v} duration={1} />
                      </span>
                    </FloatingCard>
                  </motion.div>
                ))}
              </div>

              {/* Row 2: SIH Feature 1 - AI Early-Warning Triage & Intervention Dispatcher */}
              <FloatingCard style={{ ...S.card, border: '1px solid rgba(244,63,94,0.25)', background: isDark ? 'linear-gradient(180deg, rgba(244,63,94,0.04) 0%, rgba(15,22,41,0.7) 100%)' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldAlert size={18} color="#f43f5e" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1rem', color: theme.textPrimary, margin: 0 }}>
                        🚨 AI Early-Warning Triage & Rapid Intervention Dispatcher
                      </h3>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', color: '#94a3b8' }}>
                        Autonomous detection of critical timeline divergence & severe budget overruns
                      </span>
                    </div>
                  </div>
                  <span style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', padding: '3px 10px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
                    4 ACTION REQUIRED
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {highRiskTriage.map((p) => {
                    const isDispatched = dispatchSuccess[p.projectCode || p.id];
                    return (
                      <div key={p.projectCode || p.id} style={{ padding: '12px 14px', borderRadius: 12, background: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(241,245,249,0.7)', border: '1px solid rgba(99,140,255,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: '#f43f5e', fontWeight: 700 }}>
                              {p.projectCode || `PAI-${p.id}`}
                            </span>
                            <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono',monospace", color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                              Delay: {p.delayMonths || 0} mo
                            </span>
                          </div>
                          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, margin: '0 0 4px', lineHeight: 1.3 }}>
                            {p.title.length > 50 ? p.title.slice(0, 48) + '...' : p.title}
                          </h4>
                          <span style={{ fontSize: '0.7rem', color: theme.textMuted, display: 'block', marginBottom: 8 }}>
                            🏢 {p.agency || p.contractor}
                          </span>

                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)', borderRadius: 6, marginBottom: 10, fontSize: '0.68rem', fontFamily: "'JetBrains Mono',monospace" }}>
                            <span style={{ color: '#94a3b8' }}>Overrun:</span>
                            <span style={{ color: '#f43f5e', fontWeight: 700 }}>+₹{Math.round(p.costOverrunCr || 0).toLocaleString('en-IN')} Cr</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => generateShowCausePDF(p)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace" }}
                          >
                            <Download size={12} /> Notice PDF
                          </button>
                          <button
                            onClick={() => {
                              setDispatchSuccess(prev => ({ ...prev, [p.projectCode || p.id]: true }));
                              showToast(`⚡ Show-Cause Notice Dispatched to ${p.agency || 'Agency'}`);
                            }}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 10px', borderRadius: 7, border: 'none', background: isDispatched ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace" }}
                          >
                            {isDispatched ? <><Check size={12} /> Sent</> : <><Send size={12} /> Dispatch</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </FloatingCard>

              {/* Row 3: SIH Feature 2 & 3 - Live Dataset Ingestion + Penalty Clawback Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Module A: MoSPI CUF Ingestion Engine */}
                <FloatingCard style={S.card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.8rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileSpreadsheet size={18} color="#3b82f6" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.92rem', color: theme.textPrimary, margin: 0 }}>
                        MoSPI CUF / Excel Ingestion Engine
                      </h3>
                      <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                        Instant parsing of Common Upload Form datasets
                      </span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.xlsx,.json"
                    style={{ display: 'none' }}
                    onChange={(e) => handleDatasetUpload(e.target.files[0])}
                  />

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleDatasetUpload(e.dataTransfer.files[0]); }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? '#3b82f6' : isDark ? 'rgba(99,140,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
                      background: dragOver ? 'rgba(59,130,246,0.08)' : isDark ? 'rgba(15,22,41,0.5)' : '#f8fafc',
                      borderRadius: 12,
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginBottom: '1rem'
                    }}
                  >
                    <UploadCloud size={32} color="#3b82f6" style={{ margin: '0 auto 8px', display: 'block' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, display: 'block' }}>
                      Drop MoSPI Flash Report (CSV / Excel)
                    </span>
                    <span style={{ fontSize: '0.68rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                      or click to browse local files (Automatic EWS Sync)
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.72rem', fontFamily: "'JetBrains Mono',monospace" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textMuted }}>
                      <span>Active Engine:</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>PAIMANA Neural Model v3.1</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textMuted }}>
                      <span>CUF Validation Status:</span>
                      <span style={{ color: '#60a5fa' }}>100% Schema Compliant</span>
                    </div>
                  </div>
                </FloatingCard>

                {/* Module B: Contractor Penalty & Escrow Clawback Protocol */}
                <FloatingCard style={S.card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.8rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Scale size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.92rem', color: theme.textPrimary, margin: 0 }}>
                        Liquidated Damages & Escrow Hold Matrix
                      </h3>
                      <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                        Smart contract clawback recommendations for lagging tranches
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { agency: 'DFCCIL Corridor Unit', penalty: '₹142.5 Cr', reason: '45 mo delay & 142% budget escalation', id: 'c1' },
                      { agency: 'NHSRCL High Speed Rail', penalty: '₹68.0 Cr', reason: '28 mo delay on civil subcontracts', id: 'c2' },
                      { agency: 'Water Resources-AP (Polavaram)', penalty: '₹95.2 Cr', reason: '47 mo timeline slippage', id: 'c3' },
                    ].map(item => {
                      const isHeld = escrowHoldState[item.id];
                      return (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 8, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', border: '1px solid rgba(99,140,255,0.08)' }}>
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.textPrimary }}>{item.agency}</div>
                            <div style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{item.reason}</div>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f43f5e', fontFamily: "'JetBrains Mono',monospace" }}>
                              {item.penalty}
                            </span>
                            <button
                              onClick={() => {
                                setEscrowHoldState(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                showToast(isHeld ? `Unfroze Escrow for ${item.agency}` : `🛡️ Tranche Escrow Freeze Initiated for ${item.agency}`);
                              }}
                              style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: isHeld ? '#10b981' : 'rgba(244,63,94,0.15)', color: isHeld ? '#fff' : '#f43f5e', fontSize: '0.62rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace" }}
                            >
                              {isHeld ? '✓ Frozen' : 'Freeze Tranche'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </FloatingCard>
              </div>
            </div>
          )}

          {activeTab==='funds' && (
            <div>
              <h2 style={{...S.sectionTitle,marginBottom:'1rem'}}>Fund Utilization Tracker</h2>
              <StaggerContainer style={S.fundList}>
                {fundItems.map((f,i)=>{
                  const pct = Math.round(f.used/f.budget*100);
                  const efficient = pct <= f.progress + 10;
                  return (
                    <StaggerItem key={i}>
                      <FloatingCard style={S.fundCard}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:'0.9rem',color:'#e2e8f0'}}>{f.name}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.68rem',color:efficient?'#34d399':'#fb7185',background:efficient?'rgba(16,185,129,0.1)':'rgba(244,63,94,0.1)',padding:'2px 8px',borderRadius:5,border:`1px solid ${efficient?'rgba(16,185,129,0.2)':'rgba(244,63,94,0.2)'}`}}>
                            {efficient?'✓ On Budget':'⚠ Over Budget'}
                          </span>
                        </div>
                        <div style={{display:'flex',gap:'2rem',marginBottom:10}}>
                          <div><div style={{fontSize:'0.62rem',color:'#64748b',fontFamily:"'JetBrains Mono',monospace"}}>BUDGET</div><div style={{fontWeight:700,fontSize:'0.9rem',color:'#e2e8f0'}}>₹{f.budget} Cr</div></div>
                          <div><div style={{fontSize:'0.62rem',color:'#64748b',fontFamily:"'JetBrains Mono',monospace"}}>SPENT</div><div style={{fontWeight:700,fontSize:'0.9rem',color:'#60a5fa'}}>₹{f.used} Cr</div></div>
                          <div><div style={{fontSize:'0.62rem',color:'#64748b',fontFamily:"'JetBrains Mono',monospace"}}>COMPLETION</div><div style={{fontWeight:700,fontSize:'0.9rem',color:'#94a3b8'}}><CountUp target={f.progress} suffix="%" /></div></div>
                          <div><div style={{fontSize:'0.62rem',color:'#64748b',fontFamily:"'JetBrains Mono',monospace"}}>UTILIZED</div><div style={{fontWeight:700,fontSize:'0.9rem',color:efficient?'#34d399':'#fb7185'}}><CountUp target={pct} suffix="%" /></div></div>
                        </div>
                        <div style={{height:8,background:'rgba(99,140,255,0.08)',borderRadius:4,overflow:'hidden',position:'relative'}}>
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} style={{height:'100%',background:efficient?'#3b82f6':'#f43f5e',borderRadius:4,boxShadow:`0 0 8px ${efficient?'rgba(59,130,246,0.4)':'rgba(244,63,94,0.4)'}`}}/>
                          <motion.div initial={{ left: 0 }} whileInView={{ left: `${f.progress}%` }} viewport={{ once: true }} transition={{ duration: 1 }} style={{position:'absolute',top:0,height:'100%',width:2,background:'#34d399',boxShadow:'0 0 4px rgba(52,211,153,0.5)'}}/>
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between',marginTop:3}}>
                          <span style={{fontSize:'0.62rem',color:'#64748b',fontFamily:"'JetBrains Mono',monospace"}}>Fund: {pct}%</span>
                          <span style={{fontSize:'0.62rem',color:'#34d399',fontFamily:"'JetBrains Mono',monospace"}}>Work: {f.progress}%</span>
                        </div>
                      </FloatingCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          )}

          {activeTab==='projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: theme.textPrimary, margin: 0 }}>
                  🏗️ Manage Projects
                </h2>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: theme.textMuted }}>
                  Click any card to view full details
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
                {projects.map(p => {
                  const tc = p.trustScore >= 75 ? '#34d399' : p.trustScore >= 50 ? '#fbbf24' : '#fb7185';
                  const sc = statusColor[p.status];
                  const budgetNum = parseFloat((p.budget || '0').replace(/[^\d.]/g,''));
                  const spentNum = parseFloat((p.spent || '0').replace(/[^\d.]/g,''));
                  const spentPct = budgetNum > 0 ? Math.round((spentNum / budgetNum) * 100) : 0;
                  return (
                    <motion.div key={p.id}
                      whileHover={{ y: -3, boxShadow: isDark ? `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${tc}15` : `0 8px 30px rgba(0,0,0,0.12)` }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      style={{ background: isDark ? 'rgba(15,22,41,0.8)' : '#fff', borderRadius: 16, border: `1px solid ${isDark ? 'rgba(99,140,255,0.12)' : 'rgba(0,0,0,0.07)'}`, overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => setViewProject(p)}
                    >
                      {/* Top accent bar */}
                      <div style={{ height: 3, background: `linear-gradient(90deg, ${sc}, ${tc})` }} />
                      <div style={{ padding: '1.1rem' }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.56rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{p.category}</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.95rem', color: theme.textPrimary, lineHeight: 1.3 }}>{p.title}</div>
                            <div style={{ fontSize: '0.72rem', color: theme.textMuted, marginTop: 3 }}>👷 {p.contractor}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.5rem', color: tc, lineHeight: 1 }}>{p.trustScore}</div>
                            <div style={{ fontSize: '0.54rem', color: tc, fontFamily: "'JetBrains Mono',monospace" }}>TRUST</div>
                          </div>
                        </div>

                        {/* Clickable stat chips */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                          {[
                            { label: 'Budget', value: p.budget || '—', color: '#6366f1', icon: '💰' },
                            { label: 'Spent', value: p.spent || '—', color: '#3b82f6', icon: '💸' },
                            { label: 'Progress', value: `${p.progress}%`, color: sc, icon: '📊' },
                          ].map(({ label, value, color, icon }) => (
                            <div key={label}
                              onClick={e => { e.stopPropagation(); setViewProject(p); }}
                              style={{ padding: '7px 8px', borderRadius: 9, background: isDark ? `${color}12` : `${color}0a`, border: `1px solid ${color}22`, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                              onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.borderColor = `${color}44`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = isDark ? `${color}12` : `${color}0a`; e.currentTarget.style.borderColor = `${color}22`; }}
                            >
                              <div style={{ fontSize: '0.62rem', fontFamily: "'JetBrains Mono',monospace", color: theme.textMuted, marginBottom: 2 }}>{icon} {label}</div>
                              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.85rem', color: theme.textPrimary }}>{value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>COMPLETION</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: sc, fontFamily: "'JetBrains Mono',monospace" }}>{p.progress}%</span>
                          </div>
                          <div style={{ height: 7, background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                              style={{ height: '100%', background: `linear-gradient(90deg, ${sc}, ${tc})`, borderRadius: 4, boxShadow: `0 0 8px ${sc}40` }} />
                          </div>
                        </div>

                        {/* Budget utilization bar */}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: '0.65rem', color: theme.textMuted, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>BUDGET UTILIZED</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: spentPct > p.progress + 10 ? '#fb7185' : '#34d399', fontFamily: "'JetBrains Mono',monospace" }}>
                              {spentPct}% {spentPct > p.progress + 10 ? '⚠' : '✓'}
                            </span>
                          </div>
                          <div style={{ height: 5, background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(spentPct, 100)}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                              style={{ height: '100%', background: spentPct > p.progress + 10 ? '#f43f5e' : '#3b82f6', borderRadius: 3 }} />
                          </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <StatusBadge status={p.status} />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={e => { e.stopPropagation(); openUpdate(p); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', fontWeight: 600 }}>
                              <RefreshCw size={11} /> Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab==='contractors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={S.sectionTitle}>👷 Contractor Trust Score Management</h2>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: theme.textMuted, background: isDark ? 'rgba(99,140,255,0.07)' : 'rgba(0,0,0,0.04)', padding: '4px 10px', borderRadius: 6, border: `1px solid ${theme.border}` }}>
                  Admin-controlled · Scores update platform-wide
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {projects.map((p) => {
                  const cData = contractorScores[p.contractor] || { score: p.trustScore, notes: '' };
                  const scoreColor = cData.score >= 75 ? '#34d399' : cData.score >= 50 ? '#fbbf24' : '#fb7185';
                  const isEditing = editingContractor === p.contractor;
                  return (
                    <FloatingCard key={p.id} style={{ padding: '1.1rem' }} glowColor={`${scoreColor}12`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.56rem', color: theme.textMuted, marginBottom: 2, textTransform: 'uppercase' }}>{p.category}</div>
                          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: theme.textPrimary }}>{p.contractor}</div>
                          <div style={{ fontSize: '0.7rem', color: theme.textMuted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: scoreColor, lineHeight: 1 }}>{cData.score}</div>
                          <div style={{ fontSize: '0.56rem', color: scoreColor, fontFamily: "'JetBrains Mono',monospace" }}>{cData.score >= 75 ? 'TRUSTED' : cData.score >= 50 ? 'AT RISK' : 'CRITICAL'}</div>
                        </div>
                      </div>
                      <div style={{ height: 5, background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{ height: '100%', width: `${cData.score}%`, background: scoreColor, borderRadius: 3, transition: 'width 0.4s' }} />
                      </div>
                      {cData.notes && (
                        <div style={{ fontSize: '0.7rem', color: theme.textMuted, fontStyle: 'italic', marginBottom: 8, padding: '5px 8px', background: isDark ? 'rgba(99,140,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 6, borderLeft: `2px solid ${scoreColor}` }}>
                          "{cData.notes}"
                        </div>
                      )}
                      {isEditing ? (
                        <div style={{ marginTop: 8, padding: '10px', background: isDark ? 'rgba(99,140,255,0.07)' : 'rgba(99,102,241,0.05)', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(99,140,255,0.15)' : 'rgba(99,102,241,0.12)'}` }}>
                          <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: theme.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>
                            Trust Score: {editContractorScore}
                          </label>
                          <input type="range" min={0} max={100} value={editContractorScore}
                            onChange={e => setEditContractorScore(e.target.value)}
                            style={{ width: '100%', accentColor: editContractorScore >= 75 ? '#34d399' : editContractorScore >= 50 ? '#fbbf24' : '#fb7185', cursor: 'pointer', marginBottom: 6 }} />
                          <div style={{ height: 4, background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                            <div style={{ height: '100%', width: `${editContractorScore}%`, background: editContractorScore >= 75 ? '#34d399' : editContractorScore >= 50 ? '#fbbf24' : '#fb7185', borderRadius: 2, transition: 'width 0.2s' }} />
                          </div>
                          <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: theme.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>Admin Notes</label>
                          <input type="text" value={editContractorNotes} onChange={e => setEditContractorNotes(e.target.value)}
                            placeholder="Reason for score adjustment..."
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${isDark ? 'rgba(99,140,255,0.15)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(15,22,41,0.8)' : '#f8f9fb', color: theme.textPrimary, fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans',sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setEditingContractor(null)}
                              style={{ flex: 1, padding: '7px', borderRadius: 7, border: `1px solid ${theme.border}`, background: 'transparent', color: theme.textMuted, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: '0.75rem' }}>
                              Cancel
                            </button>
                            <button onClick={saveContractorScore}
                              style={{ flex: 2, padding: '7px', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                              ✓ Save Score
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingContractor(p.contractor); setEditContractorScore(cData.score); setEditContractorNotes(cData.notes || ''); }}
                          style={{ width: '100%', padding: '7px', borderRadius: 8, border: `1px solid ${isDark ? 'rgba(99,140,255,0.15)' : 'rgba(99,102,241,0.15)'}`, background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)', color: '#6366f1', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 600, transition: 'all 0.2s' }}>
                          ✏️ Edit Trust Score
                        </button>
                      )}
                    </FloatingCard>
                  );
                })}
              </div>
            </div>
          )}


          <AnimatePresence>
            {viewProject && (() => {
              const vp = viewProject;
              const tc = vp.trustScore >= 75 ? '#34d399' : vp.trustScore >= 50 ? '#fbbf24' : '#fb7185';
              const sc = statusColor[vp.status];
              const budgetNum = parseFloat((vp.budget || '0').replace(/[^\d.]/g,''));
              const spentNum = parseFloat((vp.spent || '0').replace(/[^\d.]/g,''));
              const spentPct = budgetNum > 0 ? Math.round((spentNum / budgetNum) * 100) : 0;
              const remaining = budgetNum > spentNum ? (budgetNum - spentNum).toFixed(1) : '0';
              const isResolved = vp.status === 'resolved';
              return (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  onClick={() => setViewProject(null)}
                  style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',overflowY:'auto'}}>
                  <motion.div initial={{scale:0.93,y:24}} animate={{scale:1,y:0}} exit={{scale:0.93,y:24}}
                    onClick={e => e.stopPropagation()}
                    style={{width:'100%',maxWidth:560,background: isDark ? 'rgba(10,16,36,0.99)' : '#fff',border:`1px solid ${isDark ? 'rgba(99,140,255,0.15)' : 'rgba(0,0,0,0.1)'}`,borderRadius:20,overflow:'hidden',boxShadow:'0 32px 80px rgba(0,0,0,0.45)'}}>

                    {/* Gradient top bar */}
                    <div style={{height:4,background:`linear-gradient(90deg,${sc},${tc})`}} />

                    <div style={{padding:'1.4rem',overflowY:'auto',maxHeight:'88vh'}}>
                      {/* Header */}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.2rem'}}>
                        <div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.58rem',color:'#6366f1',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.1em'}}>{vp.category}</div>
                          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:'1.15rem',color:theme.textPrimary,margin:0,lineHeight:1.3}}>{vp.title}</h2>
                          <div style={{fontSize:'0.75rem',color:theme.textMuted,marginTop:4}}>📍 {vp.location}</div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:'2rem',color:tc,lineHeight:1}}>{vp.trustScore}</div>
                            <div style={{fontSize:'0.55rem',color:tc,fontFamily:"'JetBrains Mono',monospace"}}>TRUST SCORE</div>
                          </div>
                          <button onClick={() => setViewProject(null)} style={{background:'none',border:'none',cursor:'pointer',color:theme.textMuted,padding:4}}><X size={18}/></button>
                        </div>
                      </div>

                      <p style={{fontSize:'0.8rem',color:theme.textMuted,lineHeight:1.65,marginBottom:'1.2rem',padding:'10px 12px',background: isDark ? 'rgba(99,140,255,0.04)' : 'rgba(0,0,0,0.03)',borderRadius:10,borderLeft:`3px solid ${sc}`}}>{vp.description}</p>

                      {/* ── Budget Breakdown ── */}
                      <div style={{background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.05)',borderRadius:14,padding:'1rem',marginBottom:'1rem',border:`1px solid ${isDark ? 'rgba(99,140,255,0.12)' : 'rgba(99,102,241,0.1)'}`}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#6366f1',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>💰 Budget Breakdown</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12}}>
                          {[
                            {label:'Total Budget',value:`₹${vp.budget}`,color:'#6366f1',sub:'Sanctioned'},
                            {label:'Amount Spent',value:`₹${vp.spent || '—'}`,color:'#3b82f6',sub:`${spentPct}% utilized`},
                            {label:'Remaining',value:`₹${remaining} Cr`,color: remaining === '0' ? '#fb7185' : '#34d399',sub: remaining === '0' ? 'Overrun' : 'Available'},
                          ].map(({label,value,color,sub}) => (
                            <div key={label} style={{padding:'10px 10px',borderRadius:10,background: isDark ? `${color}12` : `${color}08`,border:`1px solid ${color}25`,textAlign:'center'}}>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.54rem',color:theme.textMuted,marginBottom:4,textTransform:'uppercase'}}>{label}</div>
                              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:'0.95rem',color:theme.textPrimary}}>{value}</div>
                              <div style={{fontSize:'0.56rem',color,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{sub}</div>
                            </div>
                          ))}
                        </div>
                        {/* Spend vs Work bars */}
                        <div style={{marginBottom:8}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontSize:'0.62rem',color:theme.textMuted,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>WORK COMPLETION</span>
                            <span style={{fontSize:'0.62rem',fontWeight:800,color:sc}}>{vp.progress}%</span>
                          </div>
                          <div style={{height:8,background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)',borderRadius:4,overflow:'hidden',marginBottom:6}}>
                            <motion.div initial={{width:0}} animate={{width:`${vp.progress}%`}} transition={{duration:0.8}}
                              style={{height:'100%',background:`linear-gradient(90deg,${sc},${tc})`,borderRadius:4}} />
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontSize:'0.62rem',color:theme.textMuted,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>BUDGET UTILIZED</span>
                            <span style={{fontSize:'0.62rem',fontWeight:800,color: spentPct > vp.progress + 10 ? '#fb7185' : '#34d399'}}>{spentPct}% {spentPct > vp.progress + 10 ? '⚠ Over' : '✓ OK'}</span>
                          </div>
                          <div style={{height:6,background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)',borderRadius:3,overflow:'hidden'}}>
                            <motion.div initial={{width:0}} animate={{width:`${Math.min(spentPct,100)}%`}} transition={{duration:1}}
                              style={{height:'100%',background: spentPct > vp.progress + 10 ? '#f43f5e' : '#3b82f6',borderRadius:3}} />
                          </div>
                        </div>
                      </div>

                      {/* ── Timeline ── */}
                      <div style={{background: isDark ? 'rgba(52,211,153,0.05)' : 'rgba(16,185,129,0.04)',borderRadius:14,padding:'1rem',marginBottom:'1rem',border:`1px solid ${isDark ? 'rgba(52,211,153,0.1)' : 'rgba(16,185,129,0.1)'}`}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#34d399',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>📅 Timeline</div>
                        <div style={{display:'flex',alignItems:'center',gap:0}}>
                          <div style={{textAlign:'center',flex:1}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.58rem',color:theme.textMuted}}>START DATE</div>
                            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'0.85rem',color:theme.textPrimary,marginTop:2}}>{vp.startDate || 'Jan 2024'}</div>
                          </div>
                          <div style={{flex:2,padding:'0 8px'}}>
                            <div style={{position:'relative',height:20,display:'flex',alignItems:'center'}}>
                              <div style={{height:3,background: isDark ? 'rgba(99,140,255,0.15)' : 'rgba(0,0,0,0.1)',borderRadius:2,flex:1}} />
                              <div style={{position:'absolute',left:0,height:3,width:`${vp.progress}%`,background:`linear-gradient(90deg,#34d399,${tc})`,borderRadius:2,maxWidth:'100%'}} />
                              <div style={{position:'absolute',left:`${vp.progress}%`,top:'50%',transform:'translate(-50%,-50%)',width:14,height:14,borderRadius:'50%',background:tc,boxShadow:`0 0 8px ${tc}60`,border:'2px solid white'}} />
                            </div>
                            <div style={{textAlign:'center',marginTop:4,fontFamily:"'JetBrains Mono',monospace",fontSize:'0.56rem',color:sc,fontWeight:700}}>{vp.progress}% COMPLETE</div>
                          </div>
                          <div style={{textAlign:'center',flex:1}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.58rem',color:theme.textMuted}}>END DATE</div>
                            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'0.85rem',color:theme.textPrimary,marginTop:2}}>{vp.endDate || 'Dec 2025'}</div>
                          </div>
                        </div>
                      </div>

                      {/* ── Contractor Details ── */}
                      <div style={{background: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.04)',borderRadius:14,padding:'1rem',marginBottom:'1rem',border:`1px solid ${isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.1)'}`}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#3b82f6',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>👷 Contractor Details</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                          {[['Name',vp.contractor],['Category',vp.category],['Location',vp.location||'Pune'],['Status',vp.status?.replace('-',' ').toUpperCase()]].map(([l,v])=>(
                            <div key={l} style={{padding:'8px 10px',borderRadius:8,background: isDark ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.05)',border:'1px solid rgba(59,130,246,0.1)'}}>
                              <div style={{fontSize:'0.58rem',color:theme.textMuted,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{l}</div>
                              <div style={{fontSize:'0.82rem',fontWeight:700,color:theme.textPrimary}}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── Progress History ── */}
                      <div style={{background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',borderRadius:14,padding:'1rem',marginBottom:'1rem',border:`1px solid ${isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.1)'}`}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#8b5cf6',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>📊 Progress History</div>
                        <div style={{display:'flex',gap:4,alignItems:'flex-end',height:48}}>
                          {[10,22,35,45,52,60,vp.progress].map((val,i)=>(
                            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                              <motion.div initial={{height:0}} animate={{height:`${(val/100)*44}px`}} transition={{duration:0.6,delay:i*0.07}}
                                style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===6 ? tc : isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)'}} />
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.5rem',color:theme.textMuted}}>M{i+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                        <StatusBadge status={vp.status}/>
                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                          <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>Score: {vp.trustScore}%</span>
                          <button onClick={() => { setViewProject(null); openUpdate(vp); }}
                            style={{display:'flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',color:'white',cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'0.75rem',boxShadow:'0 4px 14px rgba(99,102,241,0.3)'}}>
                            <RefreshCw size={12}/> Update Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>


          {/* ── Project Update Modal ── */}
          <AnimatePresence>
            {editProject && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={()=>setEditProject(null)}
                style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(6px)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
                <motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}} exit={{scale:0.93,y:20}}
                  onClick={e=>e.stopPropagation()}
                  style={{width:'100%',maxWidth:420,background: isDark ? 'rgba(10,16,36,0.98)' : '#fff',border:`1px solid ${theme.border}`,borderRadius:18,padding:'1.5rem',boxShadow:'0 24px 64px rgba(0,0,0,0.35)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}>
                    <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:'1rem',color:theme.textPrimary,margin:0}}>Update Project</h2>
                    <button onClick={()=>setEditProject(null)} style={{background:'none',border:'none',cursor:'pointer',color:theme.textMuted,padding:4}}><X size={18}/></button>
                  </div>
                  <p style={{fontSize:'0.8rem',color:'#6366f1',fontFamily:"'JetBrains Mono',monospace",marginBottom:'1.2rem'}}>{editProject.title}</p>

                  <div style={{marginBottom:'1rem'}}>
                    <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:theme.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Status</label>
                    <div style={{display:'flex',gap:6}}>
                      {['on-track','delayed','critical'].map(s=>(
                        <button key={s} onClick={()=>setEditStatus(s)}
                          style={{flex:1,padding:'8px 4px',borderRadius:8,border:`1.5px solid ${editStatus===s ? statusColor[s] : theme.border}`,background: editStatus===s ? `${statusColor[s]}15` : 'transparent',
                            color: editStatus===s ? statusColor[s] : theme.textMuted,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:'0.72rem',transition:'all 0.2s'}}>
                          {s==='on-track'?'On Track':s.charAt(0).toUpperCase()+s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{marginBottom:'1.2rem'}}>
                    <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:theme.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Progress: {editProgress}%</label>
                    <input type="range" min={0} max={100} value={editProgress} onChange={e=>setEditProgress(e.target.value)}
                      style={{width:'100%',accentColor:'#6366f1',cursor:'pointer'}}/>
                    <div style={{height:6,background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)',borderRadius:3,overflow:'hidden',marginTop:8}}>
                      <div style={{height:'100%',width:`${editProgress}%`,background:statusColor[editStatus]||'#6366f1',borderRadius:3,transition:'width 0.2s'}}/>
                    </div>
                  </div>

                  <div style={{marginBottom:'1.5rem'}}>
                    <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:theme.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Amount Spent</label>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <input
                        type="text"
                        value={editSpent}
                        onChange={e=>setEditSpent(e.target.value)}
                        placeholder="e.g. ₹28.5 Cr"
                        style={{flex:1,padding:'10px 13px',borderRadius:9,border:`1.5px solid ${isDark ? 'rgba(99,140,255,0.12)' : 'rgba(0,0,0,0.08)'}`,background: isDark ? 'rgba(15,22,41,0.6)' : '#f2f3f7',color:theme.textPrimary,fontSize:'0.85rem',fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',transition:'all 0.3s'}}
                      />
                      <div style={{padding:'8px 12px',borderRadius:8,background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(99,102,241,0.06)',border:`1px solid ${isDark ? 'rgba(59,130,246,0.15)' : 'rgba(99,102,241,0.12)'}`,fontSize:'0.7rem',fontFamily:"'JetBrains Mono',monospace",color:theme.textMuted,whiteSpace:'nowrap'}}>
                        Budget: {editProject?.budget || '—'}
                      </div>
                    </div>
                    {editProject?.budget && editSpent && (() => {
                      const budgetNum = parseFloat(editProject.budget.replace(/[^\d.]/g, ''));
                      const spentNum = parseFloat(editSpent.replace(/[^\d.]/g, ''));
                      if (!isNaN(budgetNum) && !isNaN(spentNum) && budgetNum > 0) {
                        const pct = Math.round((spentNum / budgetNum) * 100);
                        const over = pct > Number(editProgress) + 10;
                        return (
                          <div style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
                            <div style={{flex:1,height:5,background: isDark ? 'rgba(99,140,255,0.08)' : 'rgba(0,0,0,0.06)',borderRadius:3,overflow:'hidden'}}>
                              <div style={{height:'100%',width:`${Math.min(pct,100)}%`,background:over?'#f43f5e':'#3b82f6',borderRadius:3,transition:'width 0.3s'}}/>
                            </div>
                            <span style={{fontSize:'0.65rem',fontFamily:"'JetBrains Mono',monospace",color:over?'#fb7185':'#34d399',fontWeight:600}}>
                              {pct}% utilized {over ? '⚠ Over' : '✓ OK'}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>setEditProject(null)}
                      style={{flex:1,padding:'10px',borderRadius:10,border:`1px solid ${theme.border}`,background:'transparent',color:theme.textMuted,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:'0.82rem'}}>Cancel</button>
                    <button onClick={saveUpdate}
                      style={{flex:2,padding:'10px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'0.82rem',boxShadow:'0 4px 16px rgba(99,102,241,0.3)'}}>Save Changes</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </AnimatedPage>
  );
}

const S = {
  page:{padding:'1.5rem',maxWidth:1300,margin:'0 auto'},
  locked:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'60vh',gap:'1rem'},
  header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  h1:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:'1.75rem',margin:0},
  sub:{color:'#64748b',fontSize:'0.85rem',marginTop:4},
  adminBadge:{padding:'6px 14px',borderRadius:8,background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',color:'#6366f1',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.7rem',fontWeight:600},
  sectionTitle:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'1rem',margin:'0 0 1rem'},
  kpiGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'},
  kpiCard:{padding:'1.2rem',display:'flex',flexDirection:'column'},
  activityList:{borderRadius:14,overflow:'hidden',border:'1px solid rgba(99,140,255,0.06)'},
  activityItem:{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:'1px solid rgba(99,140,255,0.05)',transition:'background 0.2s'},
  actDot:{width:10,height:10,borderRadius:'50%',flexShrink:0},
  issueGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'1rem'},
  issueCard:{padding:'1rem'},
  issueCardTop:{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'},
  sevBadge:{padding:'3px 8px',borderRadius:6,fontSize:'0.62rem',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"},
  issueDesc:{fontSize:'0.78rem',color:'var(--muted,#6b7280)',lineHeight:1.5,marginBottom:8},
  issueMeta:{display:'flex',flexDirection:'column',gap:3,fontSize:'0.7rem',color:'var(--muted,#6b7280)'},
  fundList:{display:'flex',flexDirection:'column',gap:'1rem'},
  fundCard:{padding:'1.2rem'},
  th:{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#64748b',padding:'8px 16px',textAlign:'left',borderBottom:'1px solid rgba(99,140,255,0.08)',textTransform:'uppercase',letterSpacing:'0.06em'},
  td:{padding:'12px 16px',borderBottom:'1px solid rgba(99,140,255,0.05)'},
  actionBtn:{display:'flex',alignItems:'center',gap:4,padding:'5px 10px',borderRadius:7,background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.15)',color:'#6366f1',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',transition:'background 0.2s'},
  toast:{position:'fixed',top:24,right:24,background:'rgba(15,23,42,0.9)',backdropFilter:'blur(20px)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:12,padding:'12px 20px',boxShadow:'0 8px 32px rgba(0,0,0,0.3)',zIndex:9999,color:'#34d399',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:'0.85rem'},
};
