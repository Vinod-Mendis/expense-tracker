"use client";

import { useState } from "react";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionTable from "@/components/transactions/TransactionTable";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";
import { Transaction, Category } from "@/lib/types";
import { mockTransactions, mockCategories } from "@/lib/mock-data";
import ManageCategoriesDialog from "@/components/categories/ManageCategoriesDialog";

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const handleAddCategory = (c: Category) =>
    setCategories((prev) => [...prev, c]);
  const handleDeleteCategory = (id: string) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  const handleAdd = (t: Transaction) => setTransactions((prev) => [t, ...prev]);
  const handleDelete = (id: string) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = transactions
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => type === "all" || t.type === type)
    .filter((t) => category === "all" || t.category === category)
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "date")
        return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return dir * (a.amount - b.amount);
    });

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ManageCategoriesDialog
            categories={categories}
            onAdd={handleAddCategory}
            onDelete={handleDeleteCategory}
          />
          <AddTransactionDialog onAdd={handleAdd} categories={categories} />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Filtered Income</p>
          <p className="text-xl font-semibold text-emerald-600 mt-0.5">
            +${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Filtered Expenses</p>
          <p className="text-xl font-semibold text-red-400 mt-0.5">
            -${totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Net</p>
          <p
            className={`text-xl font-semibold mt-0.5 ${totalIncome - totalExpenses >= 0 ? "text-emerald-600" : "text-red-400"}`}
          >
            ${(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        search={search}
        type={type}
        category={category}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onCategoryChange={setCategory}
        categories={categories}
      />

      {/* Table */}
      <TransactionTable
        transactions={filtered}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortDir={sortDir}
      />
    </div>
  );
}
