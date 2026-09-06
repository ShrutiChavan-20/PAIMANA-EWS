// ============================================================
//  Fintech Banking Dashboard — State & Context Provider
//  Manages live accounts, dynamic transfers, card locking/controls,
//  filtering, search, and notification state with persistent cache
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockAccount,
  mockCards,
  mockTransactions,
  mockSpendingWeekly,
  mockSpendingMonthly,
  mockCategories,
  mockRecentRecipients,
  mockUserProfile
} from './mockData';

const FintechContext = createContext(null);

export function FintechProvider({ children }) {
  const [account, setAccount] = useState(() => {
    const saved = localStorage.getItem('fintech_account_v1');
    return saved ? JSON.parse(saved) : mockAccount;
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('fintech_cards_v1');
    return saved ? JSON.parse(saved) : mockCards;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fintech_transactions_v1');
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [activeCardId, setActiveCardId] = useState(cards[0]?.id || 'card-01');
  const [spendingTimeframe, setSpendingTimeframe] = useState('7d'); // '7d' | '30d'
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Salary Deposit Processed', desc: '+$3,200.00 from Apex Technologies Inc', time: '1h ago', unread: true, type: 'success' },
    { id: 'notif-2', title: 'Virtual Card Authorized', desc: 'Amazon Marketplace ($124.50)', time: '3h ago', unread: true, type: 'info' },
    { id: 'notif-3', title: 'Monthly Statement Ready', desc: 'August 2026 statement is available for download', time: '1d ago', unread: false, type: 'system' }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'accounts' | 'cards' | 'transfers' | 'transactions' | 'analytics' | 'settings'

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fintech_account_v1', JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem('fintech_cards_v1', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('fintech_transactions_v1', JSON.stringify(transactions));
  }, [transactions]);

  // Execute a live transfer
  const executeTransfer = (transferData) => {
    const amountNum = parseFloat(transferData.amount);
    if (isNaN(amountNum) || amountNum <= 0) return { ok: false, error: 'Please enter a valid transfer amount.' };
    if (amountNum > account.balance) return { ok: false, error: 'Insufficient funds in current balance.' };

    const newTx = {
      id: `tx-${Date.now()}`,
      merchant: transferData.recipientName || 'External Transfer',
      category: transferData.category || 'Transfer',
      description: transferData.note || `Transfer to ${transferData.recipientAccount || 'bank account'}`,
      date: 'Just now',
      rawDate: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: amountNum,
      type: 'debit',
      status: 'Completed',
      account: transferData.sourceAccount || 'Checking ••9184',
      avatarIcon: 'ArrowUpRight',
      recipient: transferData.recipientName
    };

    // Update transactions
    setTransactions(prev => [newTx, ...prev]);

    // Update account balance
    setAccount(prev => ({
      ...prev,
      balance: Math.max(0, +(prev.balance - amountNum).toFixed(2)),
      availableBalance: Math.max(0, +(prev.availableBalance - amountNum).toFixed(2)),
      monthlyExpenses: +(prev.monthlyExpenses + amountNum).toFixed(2)
    }));

    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Transfer Sent Successfully',
      desc: `Sent $${amountNum.toFixed(2)} to ${transferData.recipientName}`,
      time: 'Just now',
      unread: true,
      type: 'success'
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);

    return { ok: true, transaction: newTx };
  };

  // Add Money / Deposit
  const addMoney = (amount, source = 'Linked Bank') => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      merchant: `Top-Up (${source})`,
      category: 'Income',
      description: `Fund deposit from ${source}`,
      date: 'Just now',
      rawDate: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: amountNum,
      type: 'credit',
      status: 'Completed',
      account: 'Checking ••9184',
      avatarIcon: 'PlusCircle',
      recipient: 'Self Top-Up'
    };

    setTransactions(prev => [newTx, ...prev]);
    setAccount(prev => ({
      ...prev,
      balance: +(prev.balance + amountNum).toFixed(2),
      availableBalance: +(prev.availableBalance + amountNum).toFixed(2),
      monthlyIncome: +(prev.monthlyIncome + amountNum).toFixed(2)
    }));
  };

  // Toggle card lock
  const toggleCardLock = (cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isLocked: !c.isLocked } : c));
  };

  // Mark all notifications read
  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  // Reset to default mock data
  const resetFintechData = () => {
    setAccount(mockAccount);
    setCards(mockCards);
    setTransactions(mockTransactions);
    localStorage.removeItem('fintech_account_v1');
    localStorage.removeItem('fintech_cards_v1');
    localStorage.removeItem('fintech_transactions_v1');
  };

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  return (
    <FintechContext.Provider value={{
      account,
      cards,
      activeCard,
      activeCardId,
      setActiveCardId,
      transactions,
      spendingWeekly: mockSpendingWeekly,
      spendingMonthly: mockSpendingMonthly,
      categories: mockCategories,
      recentRecipients: mockRecentRecipients,
      userProfile: mockUserProfile,
      spendingTimeframe,
      setSpendingTimeframe,
      notifications,
      unreadCount,
      activeTab,
      setActiveTab,
      executeTransfer,
      addMoney,
      toggleCardLock,
      markNotificationsRead,
      resetFintechData
    }}>
      {children}
    </FintechContext.Provider>
  );
}

export const useFintech = () => {
  const ctx = useContext(FintechContext);
  if (!ctx) throw new Error('useFintech must be used within a FintechProvider');
  return ctx;
};
