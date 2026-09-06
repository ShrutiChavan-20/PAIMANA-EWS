// ============================================================
//  Fintech Banking Dashboard — Mock Database & Data Store
// ============================================================

export const mockAccount = {
  id: 'acc-primary-01',
  accountNumber: 'GB82 VIRT 0092 8472 9184 23',
  maskedNumber: '•••• •••• •••• 9184',
  accountType: 'Checking',
  balance: 6989.23,
  currency: 'USD',
  currencySymbol: '$',
  changePct: 12.4,
  changeType: 'increase',
  availableBalance: 6540.80,
  monthlyIncome: 8450.00,
  monthlyExpenses: 3460.77,
  iban: 'GB82VIRT00928472918423',
  swift: 'VIRTBANKXXX',
};

export const mockCards = [
  {
    id: 'card-01',
    cardNumber: '4532 8920 1849 3425',
    maskedNumber: '•••• •••• •••• 3425',
    cardHolder: 'ELENA ROSTOVA',
    expiryDate: '09/28',
    cvv: '849',
    cardType: 'Visa',
    cardTier: 'Platinum',
    gradientType: 'blue-indigo',
    balance: 4250.80,
    spendingLimit: 10000,
    isLocked: false,
    isVirtual: true,
    contactless: true,
  },
  {
    id: 'card-02',
    cardNumber: '5412 7530 9284 5689',
    maskedNumber: '•••• •••• •••• 5689',
    cardHolder: 'ELENA ROSTOVA',
    expiryDate: '12/29',
    cvv: '392',
    cardType: 'Mastercard',
    cardTier: 'Black Edition',
    gradientType: 'royal-purple',
    balance: 2738.43,
    spendingLimit: 15000,
    isLocked: false,
    isVirtual: false,
    contactless: true,
  },
  {
    id: 'card-03',
    cardNumber: '4916 2309 8812 7741',
    maskedNumber: '•••• •••• •••• 7741',
    cardHolder: 'ELENA ROSTOVA',
    expiryDate: '04/27',
    cvv: '517',
    cardType: 'Visa',
    cardTier: 'Gold Travel',
    gradientType: 'cyan-blue',
    balance: 1480.00,
    spendingLimit: 5000,
    isLocked: false,
    isVirtual: true,
    contactless: true,
  }
];

export const mockTransactions = [
  {
    id: 'tx-001',
    merchant: 'Amazon Marketplace',
    category: 'Shopping',
    description: 'Electronics & Studio Lighting',
    date: 'Today, 2:45 PM',
    rawDate: '2026-09-06',
    time: '14:45',
    amount: 124.50,
    type: 'debit',
    status: 'Completed',
    account: 'Virtual Card ••3425',
    avatarIcon: 'ShoppingBag',
    recipient: 'Amazon EU S.a.r.l'
  },
  {
    id: 'tx-002',
    merchant: 'Spotify Premium Family',
    category: 'Entertainment',
    description: 'Monthly Subscription',
    date: 'Yesterday, 8:12 PM',
    rawDate: '2026-09-05',
    time: '20:12',
    amount: 10.99,
    type: 'debit',
    status: 'Completed',
    account: 'Checking ••9184',
    avatarIcon: 'Music',
    recipient: 'Spotify AB'
  },
  {
    id: 'tx-003',
    merchant: 'Apex Technologies Inc',
    category: 'Income',
    description: 'Direct Deposit / Salary Cycle',
    date: 'Sep 01, 2026',
    rawDate: '2026-09-01',
    time: '09:00',
    amount: 3200.00,
    type: 'credit',
    status: 'Completed',
    account: 'Main Account ••9184',
    avatarIcon: 'ArrowDownLeft',
    recipient: 'Payroll Dispatch'
  },
  {
    id: 'tx-004',
    merchant: 'Uber Premium Ride',
    category: 'Transport',
    description: 'Downtown to City Airport',
    date: 'Aug 30, 2026',
    rawDate: '2026-08-30',
    time: '18:30',
    amount: 24.60,
    type: 'debit',
    status: 'Completed',
    account: 'Virtual Card ••3425',
    avatarIcon: 'Car',
    recipient: 'Uber BV'
  },
  {
    id: 'tx-005',
    merchant: 'National Grid Utilities',
    category: 'Utilities',
    description: 'Electricity & Gas Bill',
    date: 'Aug 28, 2026',
    rawDate: '2026-08-28',
    time: '11:15',
    amount: 86.40,
    type: 'debit',
    status: 'Completed',
    account: 'Checking ••9184',
    avatarIcon: 'Zap',
    recipient: 'National Grid Power'
  },
  {
    id: 'tx-006',
    merchant: 'Starbucks Reserve',
    category: 'Food',
    description: 'Artisan Coffee & Breakfast',
    date: 'Aug 27, 2026',
    rawDate: '2026-08-27',
    time: '08:45',
    amount: 16.80,
    type: 'debit',
    status: 'Completed',
    account: 'Card ••5689',
    avatarIcon: 'Coffee',
    recipient: 'Starbucks Coffee'
  },
  {
    id: 'tx-007',
    merchant: 'Sarah Jenkins',
    category: 'Transfer',
    description: 'Dinner Splitting & Wine',
    date: 'Aug 25, 2026',
    rawDate: '2026-08-25',
    time: '21:10',
    amount: 65.00,
    type: 'credit',
    status: 'Completed',
    account: 'Checking ••9184',
    avatarIcon: 'UserCheck',
    recipient: 'Sarah Jenkins'
  },
  {
    id: 'tx-008',
    merchant: 'Apple Services Store',
    category: 'Entertainment',
    description: 'iCloud 2TB & Apple One',
    date: 'Aug 24, 2026',
    rawDate: '2026-08-24',
    time: '12:00',
    amount: 29.95,
    type: 'debit',
    status: 'Completed',
    account: 'Card ••3425',
    avatarIcon: 'Tv',
    recipient: 'Apple Distribution'
  },
  {
    id: 'tx-009',
    merchant: 'Freelance Design Client',
    category: 'Income',
    description: 'UI/UX Design Milestone #2',
    date: 'Aug 20, 2026',
    rawDate: '2026-08-20',
    time: '16:20',
    amount: 1450.00,
    type: 'credit',
    status: 'Completed',
    account: 'Checking ••9184',
    avatarIcon: 'Briefcase',
    recipient: 'Luminary Studio'
  },
  {
    id: 'tx-010',
    merchant: 'Whole Foods Market',
    category: 'Food',
    description: 'Organic Groceries & Produce',
    date: 'Aug 19, 2026',
    rawDate: '2026-08-19',
    time: '17:40',
    amount: 142.30,
    type: 'debit',
    status: 'Completed',
    account: 'Card ••5689',
    avatarIcon: 'ShoppingBag',
    recipient: 'Whole Foods Co'
  }
];

export const mockSpendingWeekly = [
  { day: 'Mon', date: 'Aug 31', Shopping: 65, Entertainment: 15, Transport: 24, Food: 45, Utilities: 0, total: 149 },
  { day: 'Tue', date: 'Sep 01', Shopping: 120, Entertainment: 0, Transport: 18, Food: 32, Utilities: 86, total: 256 },
  { day: 'Wed', date: 'Sep 02', Shopping: 40, Entertainment: 11, Transport: 12, Food: 55, Utilities: 0, total: 118 },
  { day: 'Thu', date: 'Sep 03', Shopping: 185, Entertainment: 25, Transport: 35, Food: 60, Utilities: 0, total: 305 },
  { day: 'Fri', date: 'Sep 04', Shopping: 90, Entertainment: 45, Transport: 40, Food: 110, Utilities: 0, total: 285 },
  { day: 'Sat', date: 'Sep 05', Shopping: 210, Entertainment: 60, Transport: 20, Food: 85, Utilities: 0, total: 375 },
  { day: 'Sun', date: 'Sep 06', Shopping: 124, Entertainment: 10, Transport: 25, Food: 48, Utilities: 0, total: 207 }
];

export const mockSpendingMonthly = [
  { day: 'May', date: 'May 2026', Shopping: 940, Entertainment: 220, Transport: 310, Food: 780, Utilities: 240, total: 2490 },
  { day: 'Jun', date: 'Jun 2026', Shopping: 1120, Entertainment: 290, Transport: 380, Food: 850, Utilities: 260, total: 2900 },
  { day: 'Jul', date: 'Jul 2026', Shopping: 860, Entertainment: 340, Transport: 410, Food: 920, Utilities: 250, total: 2780 },
  { day: 'Aug', date: 'Aug 2026', Shopping: 1350, Entertainment: 310, Transport: 360, Food: 980, Utilities: 290, total: 3290 },
  { day: 'Sep', date: 'Sep 2026', Shopping: 1420, Entertainment: 280, Transport: 390, Food: 1040, Utilities: 330, total: 3460 }
];

export const mockCategories = [
  { category: 'Shopping', amount: 1420.50, percentage: 41, color: '#3b82f6', bgGlow: 'rgba(59,130,246,0.15)', iconName: 'ShoppingBag' },
  { category: 'Food & Dining', amount: 1040.20, percentage: 30, color: '#8b5cf6', bgGlow: 'rgba(139,92,246,0.15)', iconName: 'Coffee' },
  { category: 'Transport', amount: 390.60, percentage: 11, color: '#06b6d4', bgGlow: 'rgba(6,182,212,0.15)', iconName: 'Car' },
  { category: 'Utilities', amount: 330.40, percentage: 10, color: '#f59e0b', bgGlow: 'rgba(245,158,11,0.15)', iconName: 'Zap' },
  { category: 'Entertainment', amount: 279.07, percentage: 8, color: '#ec4899', bgGlow: 'rgba(236,72,153,0.15)', iconName: 'Tv' },
];

export const mockRecentRecipients = [
  { id: 'rec-1', name: 'Sarah Jenkins', avatar: '👩‍💼', account: '•••• 8192', bank: 'Chase Bank' },
  { id: 'rec-2', name: 'Marcus Sterling', avatar: '👨‍💻', account: '•••• 4102', bank: 'Barclays' },
  { id: 'rec-3', name: 'Aaliyah Chen', avatar: '👩‍🎨', account: '•••• 9381', bank: 'Revolut' },
  { id: 'rec-4', name: 'David Miller', avatar: '👨‍🔬', account: '•••• 6620', bank: 'Citibank' },
  { id: 'rec-5', name: 'Emma Watson', avatar: '👩‍⚕️', account: '•••• 1194', bank: 'HSBC Bank' }
];

export const mockUserProfile = {
  name: 'Elena Rostova',
  role: 'Premium Client',
  tier: 'Diamond Tier',
  email: 'elena.rostova@vaultfin.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  creditScore: 814,
  kycStatus: 'Verified',
  joinDate: 'March 2024'
};
