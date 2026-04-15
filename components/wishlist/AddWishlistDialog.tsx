"use client";

import { useState } from "react";
import { WishlistItem, Priority } from "@/lib/types";
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
  onAdd: (item: WishlistItem) => void;
}

export default function AddWishlistDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    link: "",
    image: "",
    priority: "medium" as Priority,
  });

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    onAdd({
      id: Date.now().toString(),
      name: form.name,
      price: parseFloat(form.price),
      link: form.link || undefined,
      image: form.image || undefined,
      priority: form.priority,
      purchased: false,
    });
    setForm({ name: "", price: "", link: "", image: "", priority: "medium" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Wishlist Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Item Name</Label>
              <Input
                placeholder="e.g. Sony Headphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  setForm({ ...form, priority: v as Priority })
                }
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
            <div className="col-span-2 space-y-1.5">
              <Label>
                Link{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="https://..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>
                Image URL{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
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
      </DialogContent>
    </Dialog>
  );
}
