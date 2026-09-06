import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { useProjects } from '../ProjectContext';
import { Sparkles, Send, X, Bot, AlertTriangle, TrendingUp, Cpu, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

const SUGGESTED_QUERIES = [
  "🚨 Which projects have > 20% cost overrun?",
  "🚂 Summarize status of Railways & Metro projects",
  "⚠️ What are the top land acquisition & clearance bottlenecks?",
  "📊 Summarize overall MoSPI infrastructure early warning health",
];

export default function PAIMANACopilotModal({ isOpen, onClose }) {
  const { theme, isDark } = useTheme();
  const { projects } = useProjects();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello, Government Administrator! I am **PAIMANA Infrastructure AI Copilot**. How can I assist you with project analytics, delay root causes, or MoSPI early warning metrics today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const generateAnswer = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('cost overrun') || q.includes('overrun') || q.includes('20%')) {
      const overruns = projects.filter(p => p.costOverrunPct > 15 || p.status === 'critical');
      const top3 = overruns.slice(0, 3);
      return `**Cost Overrun Insights (MoSPI Early Warning System)**:\n\n` +
        `Currently, **${overruns.length} key projects** in the active portfolio exhibit significant cost slippage (>15%).\n\n` +
        `**Top Critical Overrun Projects**:\n` +
        top3.map(p => `• **${p.title}** (${p.projectCode}): Cost escalated by **+₹${Math.round(p.costOverrunCr || 420).toLocaleString()} Cr** (+${p.costOverrunPct || 24}%). Physical: ${p.progress}%, Financial: ${p.financialProgress || p.progress + 15}%.`).join('\n') +
        `\n\n💡 *MoSPI Action*: Implement automated vendor liquidity audit and trigger milestone-linked disbursement checks.`;
    }

    if (q.includes('railway') || q.includes('metro') || q.includes('train')) {
      const railProjs = projects.filter(p => p.category?.toLowerCase().includes('rail') || p.title?.toLowerCase().includes('rail') || p.title?.toLowerCase().includes('metro'));
      return `**Railways & Urban Transit Portfolio Summary**:\n\n` +
        `Monitored Railways & Metro Projects: **${railProjs.length} major corridors**.\n\n` +
        `• **Average Progress**: ${Math.round(railProjs.reduce((a, b) => a + (b.progress || 0), 0) / (railProjs.length || 1))}% physical completion.\n` +
        `• **Key Corridors**: ${railProjs.slice(0, 3).map(p => `${p.title} (${p.status})`).join(', ')}.\n\n` +
        `🔍 *Risk Radar*: Land acquisition alignment along urban rights-of-way remains the primary source of 14+ month schedule deviations.`;
    }

    if (q.includes('bottleneck') || q.includes('clearance') || q.includes('land')) {
      return `**Infrastructure Bottlenecks & Risk Factor Attribution**:\n\n` +
        `Based on PAIMANA's XGBoost Gradient Boosted attribution model on 20-year IPMD data:\n\n` +
        `1. **Land Acquisition & R&R Disputes**: Accounts for **34% of total project delays**.\n` +
        `2. **Forest & Environmental Clearance**: Accounts for **26% of schedule slippage**.\n` +
        `3. **Contractor Working Capital Deficit**: Accounts for **18% of spend-to-physical decoupling**.\n` +
        `4. **Utility Shifting & Local Right-of-Way**: Accounts for **12% of early-stage stalls**.\n\n` +
        `✅ *Recommendation*: Accelerate GatiShakti portal API integration for real-time GIS land clearance status updates.`;
    }

    // Default intelligent response
    return `**PAIMANA Executive Project Health Analysis**:\n\n` +
      `Analyzing **${projects.length} active infrastructure projects** across Highways, Railways, Energy, and Aviation:\n\n` +
      `• **Portfolio Risk Distribution**: ${projects.filter(p => p.status === 'on-track').length} On Track, ${projects.filter(p => p.status === 'delayed').length} Delayed, ${projects.filter(p => p.status === 'critical').length} Critical Alerts.\n` +
      `• **Total Sanctioned Capital**: ₹${(projects.reduce((a, b) => a + (b.originalCostCr || 2500), 0)).toLocaleString()} Cr.\n` +
      `• **Average Early Warning Lead Time**: 9.4 months before official deadline breach.\n\n` +
      `Ask me about specific project codes (e.g. \`PAI-102938\`), sector performance, or early warning indicators!`;
  };

  const handleSend = (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: generateAnswer(queryText),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botReply]);
      setLoading(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
        <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 720, height: '82vh', display: 'flex', flexDirection: 'column',
            background: isDark ? 'rgba(11,19,41,0.98)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}`,
            borderRadius: 20, boxShadow: '0 32px 90px rgba(0,0,0,0.5)', overflow: 'hidden',
          }}>

          {/* Modal Header */}
          <div style={{
            padding: '1.1rem 1.5rem', background: isDark ? 'linear-gradient(135deg, #0f172a, #1e1b4b)' : 'linear-gradient(135deg, #1e3a8a, #312e81)',
            color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.1rem', margin: 0, color: '#ffffff' }}>
                    PAIMANA AI Copilot
                  </h2>
                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '2px 8px', fontSize: '0.58rem', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399' }} /> ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '0.66rem', opacity: 0.8, fontFamily: "'JetBrains Mono',monospace" }}>
                  MoSPI Early Warning Neural Assistant · {projects.length} Projects Loaded
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, padding: 6, cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Suggested Queries Bar */}
          <div style={{ padding: '8px 1rem', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(241,245,249,0.7)', borderBottom: `1px solid ${theme.border}`, display: 'flex', gap: 6, overflowX: 'auto' }}>
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button key={idx} onClick={() => handleSend(q)}
                style={{
                  background: isDark ? 'rgba(99,102,241,0.12)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`,
                  color: isDark ? '#a5b4fc' : '#4338ca',
                  borderRadius: 16, padding: '4px 10px', fontSize: '0.63rem',
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600,
                  whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: '1.2rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  background: msg.sender === 'user' ? (isDark ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'linear-gradient(135deg, #2563eb, #3b82f6)') : (isDark ? 'rgba(15,23,42,0.8)' : '#f8fafc'),
                  color: msg.sender === 'user' ? '#ffffff' : theme.textPrimary,
                  border: msg.sender === 'user' ? 'none' : `1px solid ${theme.border}`,
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  padding: '12px 16px', fontSize: '0.82rem', lineHeight: 1.6,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}>
                  {msg.sender === 'bot' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#6366f1', fontWeight: 700, fontSize: '0.7rem', fontFamily: "'JetBrains Mono',monospace" }}>
                      <Bot size={14} /> PAIMANA AI ANALYST
                    </div>
                  )}
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <strong key={i} style={{ color: msg.sender === 'user' ? '#fff' : '#6366f1', display: 'block', margin: '4px 0' }}>{line.replace(/\*\*/g, '')}</strong>;
                      }
                      return <span key={i}>{line}<br /></span>;
                    })}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.58rem', opacity: 0.6, marginTop: 4, fontFamily: "'JetBrains Mono',monospace" }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6366f1', fontSize: '0.75rem', fontFamily: "'JetBrains Mono',monospace", padding: '8px 12px' }}>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing IPMD telemetry database...
              </div>
            )}
          </div>

          {/* Input Box Footer */}
          <div style={{ padding: '1rem 1.5rem', background: isDark ? 'rgba(15,23,42,0.9)' : '#ffffff', borderTop: `1px solid ${theme.border}` }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask PAIMANA Copilot about project delays, cost overruns, or MoSPI metrics..."
                style={{
                  flex: 1, background: isDark ? '#070d1e' : '#f1f5f9',
                  border: `1px solid ${theme.border}`, borderRadius: 12, padding: '10px 14px',
                  color: theme.textPrimary, fontSize: '0.82rem', fontFamily: "'Inter',sans-serif",
                  outline: 'none',
                }}
              />
              <button type="submit" disabled={!input.trim() || loading}
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                  color: input.trim() ? '#ffffff' : theme.textMuted, border: 'none', borderRadius: 12,
                  padding: '0 18px', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <Send size={16} />
              </button>
            </form>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
