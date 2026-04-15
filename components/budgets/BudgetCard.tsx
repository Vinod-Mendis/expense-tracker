"use client";

import { Budget } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  budget: Budget;
  onDelete: (id: string) => void;
}

export default function BudgetCard({ budget, onDelete }: Props) {
  const pct = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
  const remaining = budget.limit - budget.spent;
  const isOver = budget.spent > budget.limit;
  const isWarning = pct >= 80 && !isOver;

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-sm">{budget.category}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              ${budget.spent.toLocaleString()} of $
              {budget.limit.toLocaleString()} spent
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-red-400 -mt-1"
            onClick={() => onDelete(budget.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <Progress
            value={pct}
            className="h-2"
            style={{
              // @ts-ignore
              "--progress-color": isOver
                ? "#f87171"
                : isWarning
                  ? "#fbbf24"
                  : "#10b981",
            }}
          />
          <div className="flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-medium",
                isOver
                  ? "text-red-400"
                  : isWarning
                    ? "text-amber-500"
                    : "text-emerald-600",
              )}
            >
              {pct}% used
            </span>
            <span
              className={cn(
                "text-muted-foreground",
                isOver && "text-red-400 font-medium",
              )}
            >
              {isOver
                ? `$${(budget.spent - budget.limit).toLocaleString()} over`
                : `$${remaining.toLocaleString()} left`}
            </span>
          </div>
        </div>

        {/* Status badge */}
        {isOver && (
          <p className="text-xs text-red-400 font-medium bg-red-50 rounded-lg px-3 py-1.5">
            ⚠ Over budget this month
          </p>
        )}
        {isWarning && (
          <p className="text-xs text-amber-600 font-medium bg-amber-50 rounded-lg px-3 py-1.5">
            ⚡ Nearing your limit
          </p>
        )}
      </CardContent>
    </Card>
  );
}
