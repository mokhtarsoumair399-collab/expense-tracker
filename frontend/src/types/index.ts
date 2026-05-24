export type TransactionType = "income" | "expense";

export interface Category {
  name: string;
  type: TransactionType;
  budget: number;
  icon: string;
  custom: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  categories: Category[];
}

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  category: string;
  icon: string;
  date: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export interface DashboardData {
  cards: {
    balance: number;
    income: number;
    expenses: number;
  };
  monthly: {
    income: number;
    expenses: number;
    net: number;
  };
  expenseCategories: Array<{ name: string; value: number }>;
  trend: Array<{ month: string; expenses: number }>;
  recent: Transaction[];
}

export interface TransactionFilters {
  type?: TransactionType | "";
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
