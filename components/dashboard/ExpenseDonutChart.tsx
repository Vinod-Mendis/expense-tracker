"use client";

import { CategoryBreakdown } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface Props {
  data: CategoryBreakdown[];
}

export default function ExpenseDonutChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` $${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Spending Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative w-36 h-36 shrink-0">
          <Doughnut data={chartData} options={options as any} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-base font-semibold">${total.toLocaleString()}</p>
          </div>
        </div>
        <ul className="space-y-2 w-full">
          {data.map((d) => (
            <li
              key={d.category}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-muted-foreground">{d.category}</span>
              </span>
              <span className="font-medium">${d.amount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
