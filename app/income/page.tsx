"use client";

import { useState } from "react";
import { Income } from "@/lib/types";
import { mockIncome } from "@/lib/mock-data";
import IncomeTable from "@/components/income/IncomeTable";
import AddIncomeDialog from "@/components/income/AddIncomeDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other",
];

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>(mockIncome);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleAdd = (i: Income) => setIncome((prev) => [i, ...prev]);
  const handleDelete = (id: string) =>
    setIncome((prev) => prev.filter((i) => i.id !== id));

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = income
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => category === "all" || i.category === category)
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "date")
        return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return dir * (a.amount - b.amount);
    });

  const total = filtered.reduce((s, i) => s + i.amount, 0);
  const thisMonth = filtered.filter(
    (i) => new Date(i.date).getMonth() === new Date().getMonth(),
  );
  const thisMonthTotal = thisMonth.reduce((s, i) => s + i.amount, 0);
  const avgIncome =
    filtered.length > 0 ? Math.round(total / filtered.length) : 0;

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Income</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} records
          </p>
        </div>
        <AddIncomeDialog onAdd={handleAdd} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="text-xl font-semibold text-emerald-600 mt-0.5">
            +${thisMonthTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total (filtered)</p>
          <p className="text-xl font-semibold mt-0.5">
            +${total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Avg per Entry</p>
          <p className="text-xl font-semibold mt-0.5">
            ${avgIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search income..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40 bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {INCOME_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <IncomeTable
        income={filtered}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortDir={sortDir}
      />
    </div>
  );
}
