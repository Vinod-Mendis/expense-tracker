"use client";

import { useState } from "react";
import { WishlistItem, Priority, WishlistStatus, Category } from "@/lib/types";
import { mockWishlist, mockCategories } from "@/lib/mock-data";
import WishlistCard from "@/components/wishlist/WishlistCard";
import WishlistListView from "@/components/wishlist/WishlistListView";
import AddWishlistDialog from "@/components/wishlist/AddWishlistDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Gift, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

// mock current balance — will come from real data later
const CURRENT_BALANCE = 5025;

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlist);
  const [categories] = useState<Category[]>(mockCategories);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | WishlistStatus>(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleAdd = (item: WishlistItem) => setItems((prev) => [item, ...prev]);
  const handleDelete = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const handleUpdateProgress = (id: string, progress: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, progress } : i)));

  const filtered = items
    .filter((i) => statusFilter === "all" || i.status === statusFilter)
    .filter((i) => priorityFilter === "all" || i.priority === priorityFilter)
    .filter((i) => categoryFilter === "all" || i.category === categoryFilter);

  const totalValue = items
    .filter((i) => i.status !== "purchased")
    .reduce((s, i) => s + i.totalPrice, 0);
  const totalSaved = items.reduce((s, i) => s + i.advancePaid + i.progress, 0);
  const canBuyCount = items.filter((i) => {
    const remaining = Math.max(i.totalPrice - i.advancePaid - i.progress, 0);
    return CURRENT_BALANCE >= remaining && i.status !== "purchased";
  }).length;

  return (
    <div className="p-6 space-y-5 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} items
          </p>
        </div>
        <AddWishlistDialog onAdd={handleAdd} categories={categories} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Items</p>
          <p className="text-xl font-semibold mt-0.5">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-xl font-semibold mt-0.5">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="text-xl font-semibold text-emerald-600 mt-0.5">
            ${totalSaved.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Can Buy Now</p>
          <p className="text-xl font-semibold text-emerald-600 mt-0.5">
            {canBuyCount} items
          </p>
        </div>
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="w-36 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="saving">Saving</SelectItem>
              <SelectItem value="ready">Ready to Buy</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(v) => setPriorityFilter(v as any)}
          >
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

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center border rounded-lg overflow-hidden bg-white">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none h-8 px-3",
              view === "grid" && "bg-emerald-50 text-emerald-700",
            )}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none h-8 px-3",
              view === "list" && "bg-emerald-50 text-emerald-700",
            )}
            onClick={() => setView("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Gift className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No items found.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onUpdateProgress={handleUpdateProgress}
              currentBalance={CURRENT_BALANCE}
            />
          ))}
        </div>
      ) : (
        <WishlistListView
          items={filtered}
          onDelete={handleDelete}
          onUpdateProgress={handleUpdateProgress}
          currentBalance={CURRENT_BALANCE}
        />
      )}
    </div>
  );
}
