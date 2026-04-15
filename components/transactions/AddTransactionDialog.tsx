"use client";

import { useState } from "react";
import { Transaction, Category } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onAdd: (t: Transaction) => void;
  categories: Category[];
}

export default function AddTransactionDialog({ onAdd, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;
    onAdd({
      id: Date.now().toString(),
      title: form.title,
      amount: parseFloat(form.amount),
      type,
      category: form.category,
      date: form.date,
      notes: form.notes,
    });
    setForm({ title: "", amount: "", category: "", date: "", notes: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Type Toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium transition-colors capitalize",
                  type === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white"
                      : "bg-red-400 text-white"
                    : "text-muted-foreground hover:bg-gray-50",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Grocery shopping"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>
                Notes{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="Any extra details..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Add Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
