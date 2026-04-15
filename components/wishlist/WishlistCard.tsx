"use client";

import { WishlistItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  item: WishlistItem;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string) => void;
}

const priorityConfig = {
  high: { label: "High", class: "bg-red-50 text-red-600" },
  medium: { label: "Medium", class: "bg-amber-50 text-amber-600" },
  low: { label: "Low", class: "bg-gray-100 text-gray-500" },
};

export default function WishlistCard({
  item,
  onDelete,
  onTogglePurchased,
}: Props) {
  const priority = priorityConfig[item.priority];

  return (
    <Card
      className={cn(
        "border-0 shadow-sm overflow-hidden transition-opacity",
        item.purchased && "opacity-60",
      )}
    >
      {/* Image */}
      <div className="h-44 bg-gray-100 overflow-hidden relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        {item.purchased && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <div className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Check className="w-3 h-3" /> Purchased
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                "font-medium text-sm leading-tight",
                item.purchased && "line-through text-muted-foreground",
              )}
            >
              {item.name}
            </p>
            <p className="text-lg font-semibold text-emerald-600 mt-0.5">
              ${item.price.toLocaleString()}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn("text-xs shrink-0", priority.class)}
          >
            {priority.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 h-8 text-xs gap-1.5",
              item.purchased
                ? "border-gray-200 text-muted-foreground"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
            )}
            onClick={() => onTogglePurchased(item.id)}
          >
            <Check className="w-3 h-3" />
            {item.purchased ? "Undo" : "Mark Purchased"}
          </Button>

          {item.link && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => window.open(item.link, "_blank")}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-400"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
