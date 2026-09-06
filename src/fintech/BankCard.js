// ============================================================
//  Fintech Banking Dashboard — Card 2: Virtual Bank Cards Carousel
//  Gradient bank cards with EMV Chip, NFC Contactless, CVV toggle,
//  and card lock switch
// ============================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Lock,
  Unlock,
  Plus,
  Wifi,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useFintech } from './FintechContext';

export default function BankCard({ onAddNewCard }) {
  const { cards, activeCard, activeCardId, setActiveCardId, toggleCardLock } = useFintech();
  const [showCvv, setShowCvv] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);

  // Gradient styles corresponding to card types
  const getCardGradient = (gradientType) => {
    switch (gradientType) {
      case 'royal-purple':
        return 'linear-gradient(135deg, #311042 0%, #4c1d95 50%, #7c3aed 100%)';
      case 'cyan-blue':
        return 'linear-gradient(135deg, #083344 0%, #0369a1 50%, #06b6d4 100%)';
      case 'deep-navy':
        return 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e293b 100%)';
      case 'blue-indigo':
      default:
        return 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)';
    }
  };

  const nextCard = () => {
    const currentIndex = cards.findIndex(c => c.id === activeCardId);
    const nextIndex = (currentIndex + 1) % cards.length;
    setActiveCardId(cards[nextIndex].id);
  };

  const prevCard = () => {
    const currentIndex = cards.findIndex(c => c.id === activeCardId);
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    setActiveCardId(cards[prevIndex].id);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Header with Card Switcher Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-white font-plus">
            My Cards & Virtual Wallets
          </h3>
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-300">
            {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prevCard}
            aria-label="Previous card"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextCard}
            aria-label="Next card"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {onAddNewCard && (
            <button
              onClick={onAddNewCard}
              title="Issue new virtual card"
              className="ml-1 flex h-7 items-center gap-1 rounded-lg bg-blue-600 px-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">New</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Virtual Card Visual Component ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCard.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative min-h-[200px] sm:min-h-[215px] w-full overflow-hidden rounded-[22px] p-5 text-white shadow-lg transition-all"
          style={{
            background: getCardGradient(activeCard.gradientType),
            boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
          }}
        >
          {/* Glass reflection gradient highlight */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          {/* Locked Overlay */}
          {activeCard.isLocked && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 text-center">
              <Lock className="h-8 w-8 text-rose-400 mb-1" />
              <span className="text-sm font-bold text-white">Card Temporarily Frozen</span>
              <p className="text-[11px] text-slate-300 max-w-xs mt-0.5">Online transactions and ATM withdrawals are paused for security.</p>
              <button
                onClick={() => toggleCardLock(activeCard.id)}
                className="mt-2.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white hover:bg-white/30 backdrop-blur-md"
              >
                Unlock Card
              </button>
            </div>
          )}

          {/* Card Top Row: Bank name & Chip / Contactless */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider font-outfit text-sm text-white/90">
                VAULT<span className="text-blue-400">FIN</span>
              </span>
              <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-200">
                {activeCard.cardTier}
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/80">
              <Wifi className="h-4 w-4 rotate-90" />
              <span className="text-xs font-bold font-mono tracking-wider">
                {activeCard.isVirtual ? 'VIRTUAL' : 'PHYSICAL'}
              </span>
            </div>
          </div>

          {/* Card Middle: EMV Chip & Number */}
          <div className="relative z-10 my-4">
            <div className="flex items-center gap-3">
              {/* Gold metallic EMV chip graphic */}
              <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 p-0.5 shadow-sm border border-amber-500/30 flex flex-col justify-between">
                <div className="h-[1px] w-full bg-amber-600/30 mt-1" />
                <div className="h-[1px] w-full bg-amber-600/30 mb-1" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg sm:text-xl font-bold tracking-[0.18em] font-mono text-white/95">
                {showFullNumber ? activeCard.cardNumber : activeCard.maskedNumber}
              </span>
              <button
                onClick={() => setShowFullNumber(!showFullNumber)}
                className="text-white/60 hover:text-white transition p-1"
                title={showFullNumber ? "Hide card number" : "Show card number"}
              >
                {showFullNumber ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Card Bottom Row: Holder, Expiry, CVV & Visa/Mastercard */}
          <div className="relative z-10 flex items-end justify-between pt-1">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/60 font-mono">Card Holder</div>
              <div className="text-xs font-bold tracking-wide font-plus text-white uppercase">
                {activeCard.cardHolder}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-white/60 font-mono">Expires</div>
                <div className="text-xs font-semibold font-mono text-white">
                  {activeCard.expiryDate}
                </div>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider text-white/60 font-mono">CVV</div>
                <div 
                  onClick={() => setShowCvv(!showCvv)}
                  className="cursor-pointer text-xs font-semibold font-mono text-white hover:text-blue-200 transition"
                  title="Click to reveal CVV"
                >
                  {showCvv ? activeCard.cvv : '•••'}
                </div>
              </div>

              {/* Brand Logo */}
              <div className="flex items-center">
                {activeCard.cardType === 'Visa' ? (
                  <span className="text-lg font-black italic tracking-tighter text-white font-sans">
                    VISA
                  </span>
                ) : (
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-rose-500 opacity-90" />
                    <div className="h-6 w-6 rounded-full bg-amber-400 opacity-90" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Card Controls Bar */}
      <div className="flex items-center justify-between rounded-xl bg-white/70 dark:bg-slate-900/70 p-2.5 backdrop-blur-md border border-white/60 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCardLock(activeCard.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition ${
              activeCard.isLocked
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {activeCard.isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            <span>{activeCard.isLocked ? 'Unlock Card' : 'Freeze Card'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Limit:</span>
          <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">
            ${activeCard.balance.toLocaleString()} / ${activeCard.spendingLimit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
