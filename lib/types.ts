export type TransactionType = "income" | "expense";

export type Priority = "low" | "medium" | "high";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  link?: string;
  image?: string;
  priority: Priority;
  purchased: boolean;
}
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}
