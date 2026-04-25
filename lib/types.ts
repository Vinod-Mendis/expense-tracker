export type TransactionType = "income" | "expense";

export type WishlistStatus = "not_started" | "saving" | "ready" | "purchased";

export type Priority = "low" | "medium" | "high";

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  receipt?: {
    url: string;
    name: string;
    type: "image";
  };
}
export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  totalPrice: number;
  advancePaid: number;
  progress: number;
  monthlySaving: number;
  priority: Priority;
  deadline?: string;
  status: WishlistStatus;
  image?: string;
  link?: string;
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
