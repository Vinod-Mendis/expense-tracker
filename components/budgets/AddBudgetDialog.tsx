"use client";

import { useState } from "react";
import { Budget } from "@/lib/types";
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

interface Props {
  onAdd: (b: Budget) => void;
}

const CATEGORIES = [
  "Work",
  "Housing",
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Other",
];

export default function AddBudgetDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const handleSubmit = () => {
    if (!category || !limit) return;
    onAdd({
      id: Date.now().toString(),
      category,
      limit: parseFloat(limit),
      spent: 0,
    });
    setCategory("");
    setLimit("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Monthly Limit ($)</Label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Add Budget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
