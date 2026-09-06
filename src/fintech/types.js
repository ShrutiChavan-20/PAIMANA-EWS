// ============================================================
//  Fintech Banking Dashboard — Types & Interfaces
// ============================================================

export interface BankAccount {
  id: string;
  accountNumber: string;
  maskedNumber: string;
  accountType: 'Checking' | 'Savings' | 'Investment' | 'Corporate';
  balance: number;
  currency: string;
  currencySymbol: string;
  changePct: number;
  changeType: 'increase' | 'decrease';
  availableBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  iban?: string;
  swift?: string;
}

export interface VirtualCard {
  id: string;
  cardNumber: string;
  maskedNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cardType: 'Visa' | 'Mastercard';
  cardTier: 'Platinum' | 'Gold' | 'Black' | 'Virtual';
  gradientType: 'blue-indigo' | 'royal-purple' | 'cyan-blue' | 'deep-navy';
  balance: number;
  spendingLimit: number;
  isLocked: boolean;
  isVirtual: boolean;
  contactless: boolean;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: 'Shopping' | 'Entertainment' | 'Income' | 'Transport' | 'Utilities' | 'Food' | 'Transfer' | 'Healthcare' | 'Travel';
  description: string;
  date: string;
  time: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'Completed' | 'Pending' | 'Failed';
  account: string;
  cardId?: string;
  recipient?: string;
  avatarIcon?: string;
}

export interface SpendingDataPoint {
  day: string;
  date: string;
  Shopping: number;
  Entertainment: number;
  Transport: number;
  Food: number;
  Utilities: number;
  total: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  iconName: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}

export interface TransferRequest {
  recipientName: string;
  recipientAccount: string;
  recipientEmail?: string;
  sourceAccount: string;
  amount: number;
  note?: string;
  category: string;
}
