"use client";

import { useState } from "react";
import { MonthlyData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props {
  weeklyData: MonthlyData[];
  sixMonthData: MonthlyData[];
}

type Period = "week" | "6months";

export default function SpendingBarChart({ weeklyData, sixMonthData }: Props) {
  const [period, setPeriod] = useState<Period>("week");
  const data = period === "week" ? weeklyData : sixMonthData;

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: data.map((d) => d.income),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.08)",
        pointBackgroundColor: "#10b981",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: data.map((d) => d.expenses),
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.08)",
        pointBackgroundColor: "#f87171",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
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
        min: 0,
        grid: { color: "#f3f4f6" },
        border: { display: false },
        ticks: {
          callback: (v: any) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`,
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
          <div className="flex items-center gap-3">
            <div className="flex rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden text-xs">
              <button
                onClick={() => setPeriod("week")}
                className={`px-3 py-1 transition-colors ${
                  period === "week"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setPeriod("6months")}
                className={`px-3 py-1 transition-colors ${
                  period === "6months"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                6 Months
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                Expenses
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-56">
        <Line data={chartData} options={options as any} />
      </CardContent>
    </Card>
  );
}
