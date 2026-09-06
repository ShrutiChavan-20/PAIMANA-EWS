// ============================================================
//  Fintech Banking Dashboard — Card 1: Balance & Account Overview
//  Gradient royal blue hero card + small satellite metrics
// ============================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { useFintech } from './FintechContext';

export default function BalanceCard({ onOpenDetails, onQuickAddMoney }) {
  const { account } = useFintech();
  const [showMasked, setShowMasked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyIban = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(account.iban || account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Main Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[24px] p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
          boxShadow: '0 12px 36px -6px rgba(59, 130, 246, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
        }}
      >
        {/* Soft background glow orbs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
        
        {/* Decorative glass wave overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)'
          }}
        />

        {/* Top bar inside card */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md shadow-sm border border-white/20">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100/90 font-mono">
                {account.accountType} Vault Account
              </span>
              <div className="flex items-center gap-1.5 text-xs text-blue-200">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowMasked(!showMasked)}
              title={showMasked ? "Hide balance" : "Show balance"}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/90 transition-all hover:bg-white/20 active:scale-95"
            >
              {showMasked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={handleCopyIban}
              title="Copy IBAN"
              className="flex h-8 items-center gap-1 rounded-lg bg-white/10 px-2.5 text-xs font-medium text-white/90 transition-all hover:bg-white/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  <span className="text-emerald-300 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-mono">IBAN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Balance Main Display */}
        <div className="relative z-10 my-5">
          <div className="text-xs font-medium text-blue-100/80">Total Balance</div>
          <div className="mt-1 flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-outfit">
              {showMasked ? "••••••••" : `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 backdrop-blur-md border border-emerald-400/30 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{account.changePct}%
            </span>
          </div>
          <p className="mt-1 text-xs text-blue-100/70 font-mono">
            {account.maskedNumber} · FDIC Insured up to $250,000
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-3.5">
          <div className="flex items-center gap-2 text-xs text-blue-100/90">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>Encrypted Quantum Security</span>
          </div>

          <div className="flex items-center gap-2">
            {onQuickAddMoney && (
              <button
                onClick={onQuickAddMoney}
                className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
              >
                + Add Money
              </button>
            )}
            <button
              onClick={onOpenDetails}
              className="group flex items-center gap-1 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 active:scale-95"
            >
              <span>View Details</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Sub Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Available Balance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-[20px] bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-lg border border-white/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Available Funds</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-slate-800 dark:text-white font-outfit">
            ${account.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Ready for spending & transfers</div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-[20px] bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-lg border border-white/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Income</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400 font-outfit">
            +${account.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Sep 2026 inflow (+8.2%)</div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-[20px] bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-lg border border-white/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Expenses</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-slate-800 dark:text-white font-outfit">
            ${account.monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">41% of total monthly cap</div>
        </motion.div>
      </div>
    </div>
  );
}
