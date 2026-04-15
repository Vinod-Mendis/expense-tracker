"use client";

import { useState } from "react";
import { WishlistItem, Priority } from "@/lib/types";
import { mockWishlist } from "@/lib/mock-data";
import WishlistCard from "@/components/wishlist/WishlistCard";
import AddWishlistDialog from "@/components/wishlist/AddWishlistDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift } from "lucide-react";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlist);
  const [filter, setFilter] = useState<"all" | "pending" | "purchased">("all");
  const [priority, setPriority] = useState<"all" | Priority>("all");

  const handleAdd = (item: WishlistItem) => setItems((prev) => [item, ...prev]);
  const handleDelete = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const handleToggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)),
    );

  const filtered = items
    .filter(
      (i) =>
        filter === "all" ||
        (filter === "purchased" ? i.purchased : !i.purchased),
    )
    .filter((i) => priority === "all" || i.priority === priority);

  const totalValue = items
    .filter((i) => !i.purchased)
    .reduce((s, i) => s + i.price, 0);
  const purchasedCount = items.filter((i) => i.purchased).length;

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} items
          </p>
        </div>
        <AddWishlistDialog onAdd={handleAdd} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Items</p>
          <p className="text-xl font-semibold mt-0.5">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Remaining Value</p>
          <p className="text-xl font-semibold text-emerald-600 mt-0.5">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Purchased</p>
          <p className="text-xl font-semibold mt-0.5">{purchasedCount} items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-36 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
          <SelectTrigger className="w-36 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Gift className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onTogglePurchased={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
