import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SpendingBarChart from "@/components/dashboard/SpendingBarChart";
import ExpenseDonutChart from "@/components/dashboard/ExpenseDonutChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { COLOR_OPTIONS } from "@/lib/category-icons";
import clientPromise from "@/lib/mongodb";
import { Transaction, CategoryBreakdown, MonthlyData } from "@/lib/types";

function buildWeeklyData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  txDocs: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incomeDocs: any[],
): MonthlyData[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const result: MonthlyData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = days[d.getDay()];
    const dateStr = d.toISOString().slice(0, 10);
    const income =
      txDocs
        .filter((t) => t.type === "income" && t.date?.slice(0, 10) === dateStr)
        .reduce((s: number, t) => s + t.amount, 0) +
      incomeDocs
        .filter((t) => t.date?.slice(0, 10) === dateStr)
        .reduce((s: number, t) => s + t.amount, 0);
    const expenses = txDocs
      .filter((t) => t.type === "expense" && t.date?.slice(0, 10) === dateStr)
      .reduce((s: number, t) => s + t.amount, 0);
    result.push({ month: label, income, expenses });
  }
  return result;
}

function buildSixMonthData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  txDocs: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incomeDocs: any[],
): MonthlyData[] {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const result: MonthlyData[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const prefix = `${y}-${String(m + 1).padStart(2, "0")}`;
    const income =
      txDocs
        .filter((t) => t.type === "income" && t.date?.slice(0, 7) === prefix)
        .reduce((s: number, t) => s + t.amount, 0) +
      incomeDocs
        .filter((t) => t.date?.slice(0, 7) === prefix)
        .reduce((s: number, t) => s + t.amount, 0);
    const expenses = txDocs
      .filter((t) => t.type === "expense" && t.date?.slice(0, 7) === prefix)
      .reduce((s: number, t) => s + t.amount, 0);
    result.push({ month: monthNames[m], income, expenses });
  }
  return result;
}

async function getDashboardData(): Promise<{
  recent: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  weeklyData: MonthlyData[];
  sixMonthData: MonthlyData[];
}> {
  try {
    const client = await clientPromise;
    const db = client.db("expense-tracker");

    const [txDocs, incomeDocs] = await Promise.all([
      db.collection("transactions").find().sort({ date: -1 }).toArray(),
      db.collection("income").find().toArray(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txIncome = txDocs
      .filter((d: any) => d.type === "income")
      .reduce((s, d) => s + d.amount, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txExpenses = txDocs
      .filter((d: any) => d.type === "expense")
      .reduce((s, d) => s + d.amount, 0);
    const incomeTotal = incomeDocs.reduce((s, d) => s + d.amount, 0);

    // Build category breakdown from expense transactions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryMap = new Map<string, number>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    txDocs
      .filter((d: any) => d.type === "expense")
      .forEach((d: any) => {
        const cat = d.category || "Other";
        categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + d.amount);
      });
    const categoryBreakdown: CategoryBreakdown[] = Array.from(
      categoryMap.entries(),
    )
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount], i) => ({
        category,
        amount,
        color: COLOR_OPTIONS[i % COLOR_OPTIONS.length],
      }));

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
      categoryBreakdown,
      weeklyData: buildWeeklyData(txDocs, incomeDocs),
      sixMonthData: buildSixMonthData(txDocs, incomeDocs),
    };
  } catch {
    return {
      recent: [],
      totalIncome: 0,
      totalExpenses: 0,
      categoryBreakdown: [],
      weeklyData: [],
      sixMonthData: [],
    };
  }
}

export default async function DashboardPage() {
  const { recent, totalIncome, totalExpenses, categoryBreakdown, weeklyData, sixMonthData } =
    await getDashboardData();

  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6 mx-auto">
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
          <SpendingBarChart weeklyData={weeklyData} sixMonthData={sixMonthData} />
        </div>
        <ExpenseDonutChart data={categoryBreakdown} />
      </div>

      <RecentTransactions transactions={recent} />
    </div>
  );
}
