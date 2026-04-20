"use client";

import { WishlistItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  item: WishlistItem;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  currentBalance: number;
}

const priorityConfig = {
  high: { label: "High", class: "bg-red-50 text-red-600" },
  medium: { label: "Medium", class: "bg-amber-50 text-amber-600" },
  low: { label: "Low", class: "bg-gray-100 text-gray-500" },
};

const statusConfig = {
  not_started: { label: "Not Started", class: "bg-gray-100 text-gray-500" },
  saving: { label: "Saving", class: "bg-blue-50 text-blue-600" },
  ready: { label: "Ready to Buy", class: "bg-emerald-50 text-emerald-600" },
  purchased: { label: "Purchased", class: "bg-purple-50 text-purple-600" },
};

export default function WishlistCard({
  item,
  onDelete,
  onUpdateProgress,
  currentBalance,
}: Props) {
  const remaining = Math.max(
    item.totalPrice - item.advancePaid - item.progress,
    0,
  );
  const totalSaved = item.advancePaid + item.progress;
  const pct = Math.min(Math.round((totalSaved / item.totalPrice) * 100), 100);
  const canBuy = currentBalance >= remaining;
  const monthsToGoal =
    item.monthlySaving > 0 ? Math.ceil(remaining / item.monthlySaving) : null;
  const priority = priorityConfig[item.priority];
  const status = statusConfig[item.status];
  const isPurchased = item.status === "purchased";

  const daysLeft = item.deadline
    ? Math.ceil(
        (new Date(item.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <Card
      className={cn(
        "border-0 shadow-sm overflow-hidden",
        isPurchased && "opacity-60",
      )}
    >
      {/* Image */}
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
        {isPurchased && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Purchased
            </div>
          </div>
        )}
        {canBuy && !isPurchased && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            ✓ Can Buy
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-medium text-sm truncate",
                isPurchased && "line-through text-muted-foreground",
              )}
            >
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
          <Badge
            variant="secondary"
            className={cn("text-xs shrink-0", priority.class)}
          >
            {priority.label}
          </Badge>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground text-xs">Total Price</span>
          <span className="font-semibold">
            ${item.totalPrice.toLocaleString()}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Saved ${totalSaved.toLocaleString()}</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Remaining</span>
            <span
              className={cn(
                "font-medium",
                remaining === 0 ? "text-emerald-600" : "text-foreground",
              )}
            >
              ${remaining.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {item.advancePaid > 0 && (
            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <p className="text-muted-foreground">Advance</p>
              <p className="font-medium">
                ${item.advancePaid.toLocaleString()}
              </p>
            </div>
          )}
          {monthsToGoal !== null && remaining > 0 && (
            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
              <p className="text-muted-foreground">Months left</p>
              <p className="font-medium">
                {monthsToGoal}mo @ ${item.monthlySaving}/mo
              </p>
            </div>
          )}
          {daysLeft !== null && (
            <div
              className={cn(
                "rounded-lg px-2.5 py-1.5",
                daysLeft < 30 ? "bg-red-50" : "bg-gray-50",
              )}
            >
              <p className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Deadline
              </p>
              <p className={cn("font-medium", daysLeft < 30 && "text-red-500")}>
                {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
              </p>
            </div>
          )}
          {item.monthlySaving > 0 && (
            <div className="bg-emerald-50 rounded-lg px-2.5 py-1.5">
              <p className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Monthly
              </p>
              <p className="font-medium text-emerald-700">
                ${item.monthlySaving.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        <Badge
          variant="secondary"
          className={cn("text-xs w-full justify-center py-1", status.class)}
        >
          {status.label}
        </Badge>

        {/* Update progress input */}
        {!isPurchased && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Add to savings..."
              className="flex-1 text-xs border rounded-lg px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-emerald-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = parseFloat((e.target as HTMLInputElement).value);
                  if (!isNaN(val) && val > 0) {
                    onUpdateProgress(item.id, item.progress + val);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <span className="text-xs text-muted-foreground self-center">↵</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {item.link && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs gap-1"
              onClick={() => window.open(item.link, "_blank")}
            >
              <ExternalLink className="w-3 h-3" /> View Item
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-red-400 ml-auto"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
