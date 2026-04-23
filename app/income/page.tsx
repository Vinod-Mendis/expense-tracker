"use client";

import { useState, useEffect, useCallback } from "react";
import { Income } from "@/lib/types";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDoc(doc: any): Income {
  return {
    id: String(doc._id),
    title: doc.title,
    amount: doc.amount,
    category: doc.category,
    date: doc.date,
    notes: doc.notes,
    receipt: doc.receiptUrl
      ? { url: doc.receiptUrl, name: doc.receiptName ?? "", type: "image" }
      : undefined,
  };
}

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/income")
      .then((r) => r.json())
      .then((data) => setIncome(Array.isArray(data) ? data.map(mapDoc) : []))
      .catch(() => setIncome([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(async (i: Income) => {
    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: i.title,
        amount: i.amount,
        category: i.category,
        date: i.date,
        notes: i.notes,
        receiptUrl: i.receipt?.url,
        receiptName: i.receipt?.name,
      }),
    });
    const doc = await res.json();
    if (res.ok) setIncome((prev) => [mapDoc(doc), ...prev]);
  }, []);

  const handleEdit = useCallback(async (i: Income) => {
    const res = await fetch(`/api/income/${i.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: i.title,
        amount: i.amount,
        category: i.category,
        date: i.date,
        notes: i.notes,
        receiptUrl: i.receipt?.url,
        receiptName: i.receipt?.name,
      }),
    });
    const doc = await res.json();
    if (res.ok)
      setIncome((prev) => prev.map((x) => (x.id === i.id ? mapDoc(doc) : x)));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/income/${id}`, { method: "DELETE" });
    if (res.ok) setIncome((prev) => prev.filter((i) => i.id !== id));
  }, []);

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
  const thisMonthTotal = filtered
    .filter((i) => new Date(i.date).getMonth() === new Date().getMonth())
    .reduce((s, i) => s + i.amount, 0);
  const avgIncome =
    filtered.length > 0 ? Math.round(total / filtered.length) : 0;

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Income</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} records
          </p>
        </div>
        <AddIncomeDialog onAdd={handleAdd} />
      </div>

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

      <IncomeTable
        income={filtered}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSort={handleSort}
        sortField={sortField}
        sortDir={sortDir}
      />
    </div>
  );
}
