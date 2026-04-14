import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SpendingBarChart from "@/components/dashboard/SpendingBarChart";
import ExpenseDonutChart from "@/components/dashboard/ExpenseDonutChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import {
  mockTransactions,
  mockCategoryBreakdown,
  mockMonthlyData,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const totalIncome = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = Math.round(
    ((totalIncome - totalExpenses) / totalIncome) * 100,
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={`$${balance.toLocaleString()}`}
          sub="↑ 8% from last month"
          icon={Wallet}
          trend="up"
        />
        <StatCard
          title="Income"
          value={`$${totalIncome.toLocaleString()}`}
          sub="This month"
          icon={TrendingUp}
          trend="neutral"
          iconClass="bg-emerald-500"
        />
        <StatCard
          title="Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          sub="↓ 4% from last month"
          icon={TrendingDown}
          trend="down"
          iconClass="bg-red-400"
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub="On track"
          icon={PiggyBank}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SpendingBarChart data={mockMonthlyData} />
        </div>
        <ExpenseDonutChart data={mockCategoryBreakdown} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={mockTransactions} />
    </div>
  );
}
