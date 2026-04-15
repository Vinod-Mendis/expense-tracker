"use client";

import { useState } from "react";
import { Budget } from "@/lib/types";
import { mockBudgets } from "@/lib/mock-data";
import BudgetCard from "@/components/budgets/BudgetCard";
import AddBudgetDialog from "@/components/budgets/AddBudgetDialog";
import { Wallet } from "lucide-react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const handleAdd = (b: Budget) => setBudgets((prev) => [...prev, b]);
  const handleDelete = (id: string) =>
    setBudgets((prev) => prev.filter((b) => b.id !== id));

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overBudget = budgets.filter((b) => b.spent > b.limit).length;

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {budgets.length} budgets this month
          </p>
        </div>
        <AddBudgetDialog onAdd={handleAdd} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Budget</p>
          <p className="text-xl font-semibold mt-0.5">
            ${totalLimit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="text-xl font-semibold text-red-400 mt-0.5">
            ${totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Over Budget</p>
          <p
            className={`text-xl font-semibold mt-0.5 ${overBudget > 0 ? "text-red-400" : "text-emerald-600"}`}
          >
            {overBudget} {overBudget === 1 ? "category" : "categories"}
          </p>
        </div>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Wallet className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No budgets yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard key={b.id} budget={b} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
