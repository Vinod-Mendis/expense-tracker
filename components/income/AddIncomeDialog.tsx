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
import { Plus, Pencil, Loader2 } from "lucide-react";
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
    type: "image";
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      setUploadError(null);
    }
    setOpen(v);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;

    setSubmitting(true);
    setUploadError(null);

    let receiptData = income?.receipt;

    if (receipt?.file) {
      const formData = new FormData();
      formData.append("file", receipt.file);
      formData.append("folder", "income");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        setUploadError("Failed to upload receipt. Please try again.");
        setSubmitting(false);
        return;
      }
      const { url, name } = await res.json();
      receiptData = { url, name, type: "image" };
    }

    const data: Income = {
      id: income?.id ?? Date.now().toString(),
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      notes: form.notes || undefined,
      receipt: receiptData,
    };

    if (isEdit) {
      onEdit(data);
    } else {
      onAdd(data);
      setForm({ title: "", amount: "", category: "", date: "", notes: "" });
    }
    setReceipt(null);
    setSubmitting(false);
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
            {isEdit && income.receipt && !receipt && (
              <p className="text-xs text-muted-foreground">
                Current: {income.receipt.name} — upload a new image to replace
              </p>
            )}
            <ReceiptUpload value={receipt} onChange={setReceipt} />
          </div>
          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {receipt ? "Uploading..." : "Saving..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Income"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
