"use client";

import { WishlistItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  items: WishlistItem[];
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  currentBalance: number;
}

const statusConfig = {
  not_started: { label: "Not Started", class: "bg-gray-100 text-gray-500" },
  saving: { label: "Saving", class: "bg-blue-50 text-blue-600" },
  ready: { label: "Ready to Buy", class: "bg-emerald-50 text-emerald-600" },
  purchased: { label: "Purchased", class: "bg-purple-50 text-purple-600" },
};

const priorityConfig = {
  high: { label: "High", class: "bg-red-50 text-red-600" },
  medium: { label: "Medium", class: "bg-amber-50 text-amber-600" },
  low: { label: "Low", class: "bg-gray-100 text-gray-500" },
};

export default function WishlistListView({
  items,
  onDelete,
  onUpdateProgress,
  currentBalance,
}: Props) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border bg-white overflow-hidden divide-y">
      {items.map((item) => {
        const totalSaved = item.advancePaid + item.progress;
        const remaining = Math.max(item.totalPrice - totalSaved, 0);
        const pct = Math.min(
          Math.round((totalSaved / item.totalPrice) * 100),
          100,
        );
        const canBuy = currentBalance >= remaining;
        const status = statusConfig[item.status];
        const priority = priorityConfig[item.priority];

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 p-4 hover:bg-gray-50/50",
              item.status === "purchased" && "opacity-60",
            )}
          >
            {/* Image */}
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  ?
                </div>
              )}
            </div>

            {/* Name + category */}
            <div className="w-40 shrink-0">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  item.status === "purchased" &&
                    "line-through text-muted-foreground",
                )}
              >
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>

            {/* Progress */}
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${totalSaved.toLocaleString()} saved</span>
                <span>${item.totalPrice.toLocaleString()} total</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>

            {/* Remaining */}
            <div className="text-right w-24 shrink-0">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-sm font-semibold">
                ${remaining.toLocaleString()}
              </p>
            </div>

            {/* Can buy */}
            {canBuy && item.status !== "purchased" && (
              <Badge className="bg-emerald-500 text-white text-xs shrink-0">
                Can Buy
              </Badge>
            )}

            {/* Status + Priority */}
            <div className="flex flex-col gap-1 shrink-0">
              <Badge
                variant="secondary"
                className={cn("text-xs", status.class)}
              >
                {status.label}
              </Badge>
              <Badge
                variant="secondary"
                className={cn("text-xs", priority.class)}
              >
                {priority.label}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {item.link && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-red-400"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
