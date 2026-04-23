"use client";

import { useState } from "react";
import { Income } from "@/lib/types";
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
import { Plus, Pencil } from "lucide-react";
import ReceiptUpload from "./ReceiptUpload";

interface AddProps {
  onAdd: (income: Income) => void;
  income?: never;
  onEdit?: never;
}

interface EditProps {
  income: Income;
  onEdit: (income: Income) => void;
  onAdd?: never;
}

type Props = AddProps | EditProps;

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other",
];

export default function AddIncomeDialog({ onAdd, income, onEdit }: Props) {
  const isEdit = !!income;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });
  const [receipt, setReceipt] = useState<{
    file: File;
    preview?: string;
    type: "image" | "pdf";
  } | null>(null);

  const handleOpenChange = (v: boolean) => {
    if (v && isEdit) {
      setForm({
        title: income.title,
        amount: income.amount.toString(),
        category: income.category,
        date: income.date,
        notes: income.notes ?? "",
      });
    }
    if (!v) {
      if (!isEdit) setForm({ title: "", amount: "", category: "", date: "", notes: "" });
      setReceipt(null);
    }
    setOpen(v);
  };

  const handleSubmit = () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;
    const data: Income = {
      id: income?.id ?? Date.now().toString(),
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      notes: form.notes || undefined,
      receipt: receipt
        ? {
            url: receipt.preview ?? URL.createObjectURL(receipt.file),
            name: receipt.file.name,
            type: receipt.type,
          }
        : income?.receipt,
    };
    if (isEdit) {
      onEdit(data);
    } else {
      onAdd(data);
      setForm({ title: "", amount: "", category: "", date: "", notes: "" });
    }
    setReceipt(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-blue-500"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Income
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Income" : "Add Income"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Monthly Salary"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Amount ($)</Label>
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
                  {INCOME_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
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
          <div className="col-span-2 space-y-1.5">
            <Label>
              Receipt{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <ReceiptUpload value={receipt} onChange={setReceipt} />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isEdit ? "Save Changes" : "Add Income"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
