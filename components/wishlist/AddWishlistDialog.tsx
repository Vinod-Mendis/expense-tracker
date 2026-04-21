"use client";

import { useState } from "react";
import { WishlistItem, Priority, WishlistStatus, Category } from "@/lib/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (item: WishlistItem) => void;
  categories: Category[];
}

export default function AddWishlistDialog({ onAdd, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    totalPrice: "",
    advancePaid: "",
    progress: "",
    monthlySaving: "",
    priority: "medium" as Priority,
    deadline: "",
    status: "not_started" as WishlistStatus,
    image: "",
    link: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.totalPrice || !form.category) return;
    onAdd({
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      description: form.description || undefined,
      totalPrice: parseFloat(form.totalPrice),
      advancePaid: parseFloat(form.advancePaid) || 0,
      progress: parseFloat(form.progress) || 0,
      monthlySaving: parseFloat(form.monthlySaving) || 0,
      priority: form.priority,
      deadline: form.deadline || undefined,
      status: form.status,
      image: form.image || undefined,
      link: form.link || undefined,
    });
    setForm({
      name: "",
      category: "",
      description: "",
      totalPrice: "",
      advancePaid: "",
      progress: "",
      monthlySaving: "",
      priority: "medium",
      deadline: "",
      status: "not_started",
      image: "",
      link: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Wishlist Item</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-4 pt-2">
            {/* Name + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Name</Label>
                <Input
                  placeholder="e.g. Sony Headphones"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v)}
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
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="Why do you want this?"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            {/* Price + Advance */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Total Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.totalPrice}
                  onChange={(e) => set("totalPrice", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Advance Paid ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.advancePaid}
                  onChange={(e) => set("advancePaid", e.target.value)}
                />
              </div>
            </div>

            {/* Progress + Monthly */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Saved So Far ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.progress}
                  onChange={(e) => set("progress", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Monthly Saving ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.monthlySaving}
                  onChange={(e) => set("monthlySaving", e.target.value)}
                />
              </div>
            </div>

            {/* Priority + Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => set("priority", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>
                  Deadline{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="saving">Saving</SelectItem>
                  <SelectItem value="ready">Ready to Buy</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image + Link */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Image URL{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  Link{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  placeholder="https://..."
                  value={form.link}
                  onChange={(e) => set("link", e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add to Wishlist
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
