import {
  Transaction,
  CategoryBreakdown,
  MonthlyData,
  Budget,
  Category,
} from "./types";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Freelance Payment",
    amount: 2500,
    type: "income",
    category: "Work",
    date: "2025-04-10",
  },
  {
    id: "2",
    title: "Rent",
    amount: 1200,
    type: "expense",
    category: "Housing",
    date: "2025-04-08",
  },
  {
    id: "3",
    title: "Groceries",
    amount: 180,
    type: "expense",
    category: "Food",
    date: "2025-04-07",
  },
  {
    id: "4",
    title: "Netflix",
    amount: 18,
    type: "expense",
    category: "Entertainment",
    date: "2025-04-06",
  },
  {
    id: "5",
    title: "Salary",
    amount: 4000,
    type: "income",
    category: "Work",
    date: "2025-04-01",
  },
  {
    id: "6",
    title: "Gym",
    amount: 45,
    type: "expense",
    category: "Health",
    date: "2025-04-03",
  },
  {
    id: "7",
    title: "Uber",
    amount: 32,
    type: "expense",
    category: "Transport",
    date: "2025-04-05",
  },
  {
    id: "8",
    title: "Electric Bill",
    amount: 95,
    type: "expense",
    category: "Housing",
    date: "2025-04-02",
  },
  {
    id: "9",
    title: "Coffee Shop",
    amount: 12,
    type: "expense",
    category: "Food",
    date: "2025-04-09",
  },
  {
    id: "10",
    title: "Freelance Project",
    amount: 1500,
    type: "income",
    category: "Work",
    date: "2025-03-28",
  },
  {
    id: "11",
    title: "Spotify",
    amount: 10,
    type: "expense",
    category: "Entertainment",
    date: "2025-03-25",
  },
  {
    id: "12",
    title: "Doctor Visit",
    amount: 60,
    type: "expense",
    category: "Health",
    date: "2025-03-20",
  },
];

export const mockCategoryBreakdown: CategoryBreakdown[] = [
  { category: "Housing", amount: 1200, color: "#10b981" },
  { category: "Food", amount: 380, color: "#34d399" },
  { category: "Transport", amount: 120, color: "#6ee7b7" },
  { category: "Entertainment", amount: 80, color: "#a7f3d0" },
  { category: "Health", amount: 90, color: "#059669" },
];

export const mockMonthlyData: MonthlyData[] = [
  { month: "Nov", income: 5800, expenses: 3200 },
  { month: "Dec", income: 6200, expenses: 4100 },
  { month: "Jan", income: 5500, expenses: 3800 },
  { month: "Feb", income: 6000, expenses: 3500 },
  { month: "Mar", income: 6500, expenses: 4000 },
  { month: "Apr", income: 6500, expenses: 1870 },
];



export const mockBudgets: Budget[] = [
  { id: "1", category: "Housing", limit: 1500, spent: 1200 },
  { id: "2", category: "Food", limit: 400, spent: 380 },
  { id: "3", category: "Transport", limit: 150, spent: 32 },
  { id: "4", category: "Entertainment", limit: 100, spent: 98 },
  { id: "5", category: "Health", limit: 200, spent: 60 },
];

