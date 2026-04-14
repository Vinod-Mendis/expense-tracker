"use client";

import { MonthlyData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ResponsiveContainer,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface Props {
  data: MonthlyData[];
}

export default function SpendingBarChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: data.map((d) => d.income),
        backgroundColor: "#10b981",
        borderRadius: 6,
        barPercentage: 0.5,
      },
      {
        label: "Expenses",
        data: data.map((d) => d.expenses),
        backgroundColor: "#e5e7eb",
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        grid: { color: "#f3f4f6" },
        border: { display: false },
        ticks: {
          callback: (v: any) => `$${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Income vs Expenses
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />{" "}
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />{" "}
              Expenses
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-56">
        <Bar data={chartData} options={options as any} />
      </CardContent>
    </Card>
  );
}
