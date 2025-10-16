import type { TransactionWithMinimal } from '@/types/transactions';

export type CashflowChartData = {
  monthly: {
    chartData: {
      month: string;
      income: number;
      expenses: number;
    }[];
    description: string;
  };
  yearly: {
    chartData: {
      year: number;
      income: number;
      expenses: number;
    }[];
    description: string;
  };
};

export type BalanceChartData = {
  weekly: {
    chartData: {
      date: string;
      balance: number;
    }[];
    description: string;
  };
  monthly: {
    chartData: {
      date: string;
      balance: number;
    }[];
    description: string;
  };
};

export type RecentTransactionsData = {
  recentTransactions: TransactionWithMinimal[];
  recentIncomes: TransactionWithMinimal[];
  recentExpenses: TransactionWithMinimal[];
};

export type CategoryAmountChartData = {
  year: {
    chartData: {
      category: string;
      percentage: number;
      amount: number;
      count: number;
    }[];
    description: string;
  };
  decade: {
    chartData: {
      category: string;
      percentage: number;
      amount: number;
      count: number;
    }[];
    description: string;
  };
};

export type CardData = {
  value: number;
  percentage?: number;
};
