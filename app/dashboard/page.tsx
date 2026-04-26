import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SpendingBarChart from "@/components/dashboard/SpendingBarChart";
import ExpenseDonutChart from "@/components/dashboard/ExpenseDonutChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { mockCategoryBreakdown, mockMonthlyData } from "@/lib/mock-data";
import clientPromise from "@/lib/mongodb";
import { Transaction } from "@/lib/types";

async function getDashboardData(): Promise<{
  recent: Transaction[];
  totalIncome: number;
  totalExpenses: number;
}> {
  try {
    const client = await clientPromise;
    const db = client.db("expense-tracker");

    const [txDocs, incomeDocs] = await Promise.all([
      db.collection("transactions").find().sort({ date: -1 }).toArray(),
      db.collection("income").find().toArray(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txIncome = txDocs.filter((d: any) => d.type === "income").reduce((s, d) => s + d.amount, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txExpenses = txDocs.filter((d: any) => d.type === "expense").reduce((s, d) => s + d.amount, 0);
    const incomeTotal = incomeDocs.reduce((s, d) => s + d.amount, 0);

    // Merge both into one list for recent feed, sorted by date descending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allRecent: Transaction[] = [
      ...txDocs.map((d: any) => ({
        id: String(d._id),
        title: d.title,
        amount: d.amount,
        type: d.type as "income" | "expense",
        category: d.category,
        date: d.date,
        notes: d.notes,
      })),
      ...incomeDocs.map((d: any) => ({
        id: String(d._id),
        title: d.title,
        amount: d.amount,
        type: "income" as const,
        category: d.category,
        date: d.date,
        notes: d.notes,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);

    return {
      recent: allRecent,
      totalIncome: txIncome + incomeTotal,
      totalExpenses: txExpenses,
    };
  } catch {
    return { recent: [], totalIncome: 0, totalExpenses: 0 };
  }
}

export default async function DashboardPage() {
  const { recent, totalIncome, totalExpenses } = await getDashboardData();

  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={`$${balance.toLocaleString()}`}
          sub="Income minus expenses"
          icon={Wallet}
          trend="up"
        />
        <StatCard
          title="Income"
          value={`$${totalIncome.toLocaleString()}`}
          sub="Transactions + income records"
          icon={TrendingUp}
          trend="neutral"
          iconClass="bg-emerald-500"
        />
        <StatCard
          title="Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          sub="All time"
          icon={TrendingDown}
          trend="down"
          iconClass="bg-red-400"
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub="Of total income"
          icon={PiggyBank}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SpendingBarChart data={mockMonthlyData} />
        </div>
        <ExpenseDonutChart data={mockCategoryBreakdown} />
      </div>

      <RecentTransactions transactions={recent} />
    </div>
  );
}
