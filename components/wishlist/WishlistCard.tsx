"use client";

import { useState } from "react";
import { WishlistItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Calendar,
  Eye,
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
  const [detailOpen, setDetailOpen] = useState(false);

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
    <>
      <Card
        className={cn(
          "border-0 shadow-sm overflow-hidden",
          isPurchased && "opacity-60",
        )}
      >
        {/* Image */}
        <div className="h-36 bg-gray-100 relative overflow-hidden">
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
          <Badge
            variant="secondary"
            className={cn("absolute top-2 right-2 text-xs", priority.class)}
          >
            {priority.label}
          </Badge>
        </div>

        <CardContent className="p-3 space-y-2.5">
          {/* Name + category */}
          <div>
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

          {/* Price + Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${totalSaved.toLocaleString()} saved</span>
              <span className="font-medium text-foreground">
                ${item.totalPrice.toLocaleString()}
              </span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>

          {/* Status + Actions */}
          <div className="flex items-center gap-2 pt-0.5">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs flex-1 justify-center py-0.5",
                status.class,
              )}
            >
              {status.label}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setDetailOpen(true)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-400"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">{item.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image */}
            {item.image && (
              <div className="h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
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
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-600"
              >
                {item.category}
              </Badge>
              {canBuy && !isPurchased && (
                <Badge className="text-xs bg-emerald-500 text-white">
                  ✓ Can Buy Now
                </Badge>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            )}

            {/* Price breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Price</span>
                <span className="font-semibold">
                  ${item.totalPrice.toLocaleString()}
                </span>
              </div>
              {item.advancePaid > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Advance Paid</span>
                  <span>${item.advancePaid.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saved So Far</span>
                <span className="text-emerald-600 font-medium">
                  ${totalSaved.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span
                  className={cn(
                    "font-semibold",
                    remaining === 0 ? "text-emerald-600" : "",
                  )}
                >
                  ${remaining.toLocaleString()}
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{pct}% saved</span>
                  <span>
                    ${totalSaved.toLocaleString()} / $
                    {item.totalPrice.toLocaleString()}
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            </div>

            {/* Extra stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {item.monthlySaving > 0 && (
                <div className="bg-emerald-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                    <Clock className="w-3 h-3" /> Monthly Saving
                  </p>
                  <p className="font-medium text-emerald-700">
                    ${item.monthlySaving.toLocaleString()}/mo
                  </p>
                </div>
              )}
              {monthsToGoal !== null && remaining > 0 && (
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Months to Goal
                  </p>
                  <p className="font-medium">{monthsToGoal} months</p>
                </div>
              )}
              {daysLeft !== null && (
                <div
                  className={cn(
                    "rounded-lg px-3 py-2.5",
                    daysLeft < 30 ? "bg-red-50" : "bg-gray-50",
                  )}
                >
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                    <Calendar className="w-3 h-3" /> Deadline
                  </p>
                  <p
                    className={cn(
                      "font-medium",
                      daysLeft < 30 && "text-red-500",
                    )}
                  >
                    {daysLeft < 0 ? "Overdue" : `${daysLeft} days left`}
                  </p>
                </div>
              )}
            </div>

            {/* Add savings input */}
            {!isPurchased && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Add to savings
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount..."
                    className="flex-1 text-sm border rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-emerald-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseFloat(
                          (e.target as HTMLInputElement).value,
                        );
                        if (!isNaN(val) && val > 0) {
                          onUpdateProgress(item.id, item.progress + val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <span className="text-xs text-muted-foreground self-center">
                    ↵ Enter
                  </span>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center gap-2 pt-1">
              {item.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Item
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-400 gap-1.5 text-xs ml-auto"
                onClick={() => {
                  onDelete(item.id);
                  setDetailOpen(false);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
